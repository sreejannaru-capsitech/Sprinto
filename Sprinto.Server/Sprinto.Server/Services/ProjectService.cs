using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using Sprinto.Server.Common;
using Sprinto.Server.DTOs;
using Sprinto.Server.Extensions;
using Sprinto.Server.Models;
using System.Data;

namespace Sprinto.Server.Services
{
    public class ProjectService
    {
        private readonly IMongoCollection<Project> _projects;
        private readonly IMongoCollection<TaskItem> _tasks;
        private readonly IMongoCollection<User> _users;
        private readonly ILogger<ProjectService> _logger;

        public ProjectService(IMongoClient mongoCLient,
            IOptions<DatabaseSettings> dbsettings,
            ILogger<ProjectService> logger)
        {
            var mongoDB = mongoCLient.GetDatabase(dbsettings.Value.DatabaseName);

            _projects = mongoDB.GetCollection<Project>(dbsettings.Value.ProjectsCollection);
            _tasks = mongoDB.GetCollection<TaskItem>(dbsettings.Value.TasksCollection);
            _users = mongoDB.GetCollection<User>(dbsettings.Value.UsersCollection);
            _logger = logger;
        }

        /// <summary>
        /// Checks whether a given 3-letter alias is available (i.e., not already used by an existing project).
        /// </summary>
        /// <param name="alias">The alias string to validate and check for uniqueness.</param>
        /// <returns>
        /// A <see cref="Task{Boolean}"/> representing the asynchronous operation.
        /// Returns <c>true</c> if the alias is valid and not already in use; otherwise, <c>false</c>.
        /// </returns>
        /// <exception cref="InvalidDataException">
        /// Thrown when the alias is null, empty, or not exactly 3 characters long.
        /// </exception>
        /// <exception cref="Exception">
        /// Thrown when an unexpected error occurs during the alias check.
        /// </exception>
        public async Task<bool> CheckAliasAsync(string? alias)
        {
            try
            {
                var trimmed = alias?.Trim() ?? throw new InvalidDataException("Invalid Alias");

                if (trimmed.Length != 3)
                    throw new InvalidDataException("Invalid Alias");

                var existing = await _projects.Find(p => p.Alias == trimmed).FirstOrDefaultAsync();

                if (existing != null)
                {
                    return false;
                }
                return true;
            }
            catch (InvalidDataException)
            {
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to check alias existance");
                throw new Exception("Failed to check for alias");
            }
        }

        /// <summary>
        /// Asynchronously creates a new project using the provided data transfer object (DTO),
        /// along with the creator's user ID and username.
        /// </summary>
        /// <param name="dto">Contains the project details required for creation.</param>
        /// <param name="userId">The unique identifier of the user creating the project.</param>
        /// <param name="userName">The display name of the user creating the project.</param>
        /// <returns>The newly created <see cref="Project"/> entity.</returns>
        /// <exception cref="Exception">
        /// Thrown when an unexpected error occurs during project creation.
        /// </exception>
        public async Task<Project> CreateAsync(ProjectDTO dto, string userId, string userName)
        {
            try
            {
                // Check for alias existance
                var aliasxists = await CheckAliasAsync(dto.Alias);
                if (aliasxists)
                {
                    throw new DuplicateNameException("Duplicate project alias already exists");
                }

                // Check for title existance
                var existing = await _projects.Find(p => p.Title == dto.Title).FirstOrDefaultAsync();

                if (existing != null)
                {
                    throw new DuplicateNameException("Duplicate project title already exists");
                }

                var user = new Project(dto, userId, userName);
                await _projects.InsertOneAsync(user);

                return user;
            }
            catch (DuplicateNameException)
            {
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating new project");
                throw new Exception("Could not create project");
            }
        }

        /// <summary>
        /// Retrieves all projects from the database.
        /// </summary>
        /// <returns> A list of <see cref="Project"/> documents.</returns>
        /// <exception cref="Exception">Thrown when an error occurs during the retrieval of projects.</exception>
        public async Task<List<Project>> GetAsync()
        {
            try
            {
                var projects = await _projects.Find(_ => true).ToListAsync();
                return projects;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving projects");
                throw new Exception("Could not retrieve projects");
            }
        }

        // Get project By Id
        public async Task<Project?> GetAsync(string id)
        {
            try
            {
                var project = await _projects.Find(a => a.Id == id).FirstOrDefaultAsync();
                return project;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving project with id {id}", id);
                throw new Exception("Could not retrieve the project");
            }
        }

        /// <summary>
        /// Retrieves all projects assigned to or maintained by the specified user,
        /// excluding those marked as completed.
        /// </summary>
        /// <param name="userId">The unique identifier of the user.</param>
        /// <returns>A list of <see cref="Project"/> documents relevant to the specified user.</returns>
        /// <exception cref="Exception">Thrown when an error occurs during the retrieval of projects.</exception>
        public async Task<List<Project>> GetAssignedAsync(string userId)
        {
            try
            {
                var assigneeFilter = Builders<Project>.Filter.ElemMatch(
                    p => p.Assignees,
                    a => a.Id == userId
                );

                var maintainerFilter = Builders<Project>.Filter.Eq(
                    p => p.TeamLead.Id,
                    userId
                );

                var accessFilter = Builders<Project>.Filter.Or(
                    assigneeFilter,
                    maintainerFilter
                );

                var projects  = await _projects.Find(accessFilter).ToListAsync();

                var notCompleted = projects.Where(a => a.IsCompleted == false).ToList();

                return notCompleted;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving assigned or maintained projects");
                throw new Exception("Could not retrieve projects");
            }
        }

        /// <summary>
        /// Updates the fields of a <see cref="Project"/> document in the database with the values provided in the DTO.
        /// </summary>
        /// <param name="id">The unique identifier of the project to update.</param>
        /// <param name="dto">The data transfer object containing updated field values.</param>
        /// <returns>The updated <see cref="Project"/> document after applying changes.</returns>
        /// <exception cref="Exception">Thrown when the project with the specified ID is not found or an error occurs during the update.</exception>
        public async Task<Project> UpdateAsync(string id, ProjectDTO dto)
        {
            try
            {
                var update = Builders<Project>.Update
                    .Set(p => p.Title, dto.Title)
                    .Set(p => p.Description, dto.Description)
                    .Set(p => p.IsCompleted, dto.IsCompleted ?? false)
                    .Set(p => p.Deadline, dto.Deadline)
                    .Set(p => p.TeamLead, dto.TeamLead)
                    .Set(p => p.Assignees, dto.Assignees);

                var options = new FindOneAndUpdateOptions<Project>
                {
                    ReturnDocument = ReturnDocument.After
                };

                var updatedProject = await _projects.FindOneAndUpdateAsync(
                    x => x.Id == id,
                    update,
                    options
                );

                return updatedProject ?? throw new KeyNotFoundException($"Project with id {id} not found");
            }
            catch (KeyNotFoundException)
            {
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating project with id {ProjectId}", id);
                throw new Exception("Could not update project");
            }
        }

        // Get all tasks referenced to a project
        public async Task<List<TaskItem>> GetTaskItemsAsync(string id, bool isIncluded = false)
        {
            try
            {
                var project = await GetAsync(id)
                    ?? throw new KeyNotFoundException("Project not found");

                // Filter by project ID
                var projectFilter = Builders<TaskItem>.Filter.Eq(t => t.ProjectId, id);

                // Conditionally exclude deleted tasks
                var filter = isIncluded
                    ? projectFilter
                    : Builders<TaskItem>.Filter.And(
                        projectFilter,
                        Builders<TaskItem>.Filter.Ne(t => t.IsDeleted, true)
                      );

                var tasks = await _tasks.Find(filter).ToListAsync();
                return tasks;
            }
            catch (KeyNotFoundException)
            {
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving tasks for project with id {ProjectId}", id);
                throw new Exception("Could not retrieve tasks for project");
            }
        }


        // Get project overview stats
        public async Task<ProjectOverview> GetProjectOverviewAsync(string id)
        {
            var project = await GetAsync(id) 
                ?? throw new KeyNotFoundException(Constants.Messages.NotFound);

            var res = new ProjectOverview();

            try
            {
                var allTasks = await GetTaskItemsAsync(id);
                res.Totaltasks = allTasks.Count;

                // Completed tasks
                var doneItems = allTasks
                    .Where(t => t.Status.Title == "Done")
                    .ToList();
                res.PendingTasks = allTasks.Count - doneItems.Count;

                // Status groups
                res.StatusGroups = allTasks
                    .GroupBy(t => t.Status.Title)
                    .Select(g => new TaskGroup
                    {
                        Group = g.Key,
                        Count = g.LongCount()
                    })
                    .ToList();

                // Assignee groups (flattened from list)
                res.AssigneeGroups = allTasks
                    .SelectMany(t => t.Assignees)
                    .Where(a => !string.IsNullOrWhiteSpace(a.Name))
                    .GroupBy(a => a.Name)
                    .Select(g => new TaskGroup
                    {
                        Group = g.Key,
                        Count = g.LongCount()
                    })
                    .ToList();

                // Last completed tasks based on status change to "Done"
                res.LastCompleted = doneItems
                    .Select(t =>
                    {
                        var doneActivity = t.Activities?
                            .Where(a => a.Action == ActivityAction.StatusUpdated &&
                                        a.Status?.Current?.Title == "Done")
                            .OrderByDescending(a => ObjectId.Parse(a.Id).CreationTime)
                            .FirstOrDefault();

                        return new
                        {
                            Task = t,
                            CompletedAt = doneActivity != null
                                ? ObjectId.Parse(doneActivity.Id).CreationTime
                                : DateTime.MinValue
                        };
                    })
                    .OrderByDescending(x => x.CompletedAt)
                    .Take(5)
                    .Select(x => x.Task)
                    .ToList();

                var team = await GetProjectTeamAsync(id);
                EnsureOverviewDefaults(res, team);

                return res;
            }
            catch (KeyNotFoundException)
            {
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving overview for project with id {ProjectId}", id);
                throw new Exception("Could not retrieve overview for project");
            }
        }

        private static void EnsureOverviewDefaults(ProjectOverview overview, ProjectTeam team)
        {
            // Ensure status groups contain default statuses
            var defaultStatuses = new[] { "Todo", "In Progress", "Done" };
            var existingStatusSet = overview.StatusGroups.Select(s => s.Group).ToHashSet();

            var missingStatuses = defaultStatuses
                .Where(status => !existingStatusSet.Contains(status))
                .Select(status => new TaskGroup
                {
                    Group = status,
                    Count = 0
                });

            overview.StatusGroups.AddRange(missingStatuses);

            // Ensure assignee groups contain all team members including team lead
            var existingAssigneeSet = overview.AssigneeGroups.Select(a => a.Group).ToHashSet();

            var allTeamMembers = new List<UserResponse> { team.TeamLead };
            allTeamMembers.AddRange(team.Employees);

            var missingAssignees = allTeamMembers
                .Where(member => !existingAssigneeSet.Contains(member.Name))
                .Select(member => new TaskGroup
                {
                    Group = member.Name,
                    Count = 0
                });

            overview.AssigneeGroups.AddRange(missingAssignees);
        }

        // Get all activities in a project
        public async Task<List<TaskActivity>> GetActivitiesAsync(string id)
        {
            try
            {
                var tasks = await GetTaskItemsAsync(id, true);

                var taskActivities = tasks
                    .SelectMany(task =>
                        (task.Activities ?? []).Select(activity => new TaskActivity
                        {
                            Sequence = task.Sequence,
                            ProjectAlias = task.ProjectAlias,
                            TaskId = task.Id!,
                            ProjectId = task.ProjectId,
                            Activity = activity
                        })
                    )
                    .OrderByDescending(ta => ta.Activity.CreatedBy.Time)
                    .ToList();

                return taskActivities;
            }
            catch (KeyNotFoundException)
            {
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving activities for project {ProjectId}", id);
                throw new Exception("Could not retrieve project activities");
            }
        }

        // Get project team informations
        public async Task<ProjectTeam> GetProjectTeamAsync(string id)
        {
            try
            {
                var project = await GetAsync(id)
                    ?? throw new KeyNotFoundException(Constants.Messages.NotFound);

                var res = new ProjectTeam();

                var assigneeIds = project.Assignees.Select(a => a.Id).ToList();

                var filter = Builders<User>.Filter.In(u => u.Id, assigneeIds);
                var users = await _users.Find(filter).ToListAsync();
                var tl = await _users.Find(a => a.Id == project.TeamLead.Id).FirstOrDefaultAsync();

                res.TeamLead = tl.ToUserResponse();
                res.Employees = [.. users.Select(u => u.ToUserResponse())];

                return res;
            }
            catch (KeyNotFoundException)
            {
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving team for project with id {id}", id);
                throw new Exception("Could not retrieve the project team");
            }
        }

        // Add new assignees to project team
        public async Task AddAssignees(string Id, IEnumerable<string> UserIds)
        {
            try
            {
                var project = await GetAsync(Id)
                    ?? throw new KeyNotFoundException(Constants.Messages.NotFound);

                // Fetch user details from _users collection
                var userFilter = Builders<User>.Filter.In(u => u.Id, UserIds);
                var users = await _users.Find(userFilter).ToListAsync();

                if (users.Count == 0)
                {
                    throw new KeyNotFoundException("No valid users found for the provided IDs");
                }

                // Create Assignee objects
                var newAssignees = users.Select(u => new Assignee
                {
                    Id = u.Id,
                    Name = u.Name
                });

                // Avoid duplicates
                var existingIds = project.Assignees.Select(a => a.Id).ToHashSet();
                existingIds.Add(project.TeamLead.Id);
                var assigneesToAdd = newAssignees
                    .Where(a => !existingIds.Contains(a.Id))
                    .ToList();

                if (assigneesToAdd.Count == 0)
                {
                    throw new InvalidOperationException("Users already belong to the project");
                }

                // Update the project
                project.Assignees.AddRange(assigneesToAdd);

                var filter = Builders<Project>.Filter.Eq(p => p.Id, Id);
                var update = Builders<Project>.Update.Set(p => p.Assignees, project.Assignees);

                var result = await _projects.UpdateOneAsync(filter, update);

                if (result.ModifiedCount == 0)
                {
                    throw new Exception("Failed to update project assignees.");
                }
            }
            catch (InvalidOperationException)
            {
                throw;
            }
            catch (KeyNotFoundException)
            {
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding assignees to project with id {id}", Id);
                throw new Exception("Could not add assignees to project");
            }
        }

        // Remove an assignee from project
        public async Task RemoveAssignee(string Id, string UserId)
        {
            try
            {
                var project = await GetAsync(Id)
                    ?? throw new KeyNotFoundException(Constants.Messages.NotFound);

                // Remove the assignee from the list
                var originalCount = project.Assignees.Count;
                project.Assignees = [.. project.Assignees.Where(a => a.Id != UserId)];

                // If no change, throw to indicate user wasn't assigned
                if (project.Assignees.Count == originalCount)
                {
                    throw new InvalidOperationException("User is not an assignee of this project.");
                }

                // Update the project in the database
                var filter = Builders<Project>.Filter.Eq(p => p.Id, Id);
                var update = Builders<Project>.Update.Set(p => p.Assignees, project.Assignees);

                var result = await _projects.UpdateOneAsync(filter, update);

                if (result.ModifiedCount == 0)
                {
                    throw new Exception("Failed to update project assignees.");
                }
            }
            catch (InvalidOperationException)
            {
                throw;
            }
            catch (KeyNotFoundException)
            {
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing assignee from project with id {id}", Id);
                throw new Exception("Could not remove assignee from project");
            }
        }

        /// <summary>
        /// Deletes the project with the specified ID.
        /// </summary>
        /// <param name="id">The unique identifier of the project to delete.</param>
        /// <returns>The deleted <see cref="Project"/> entity.</returns>
        /// <exception cref="Exception">Thrown when an unexpected error occurs during project deletion.</exception>
        /// <exception cref="InvalidOperationException">Thrown when the project with the specified ID is not found.</exception>
        public async Task<Project> DeleteAsync(string id)
        {
            try
            {
                var project = await _projects.FindOneAndDeleteAsync(x => x.Id == id)
                ?? throw new InvalidOperationException(Constants.Messages.NotFound);

                return project;
            }
            catch (InvalidOperationException)
            {
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting project with ID {Id}", id);
                throw new Exception("Could not delete project");
            }
        }
    }
}
