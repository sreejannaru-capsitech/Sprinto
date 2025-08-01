using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Sprinto.Server.Common;
using Sprinto.Server.DTOs;
using Sprinto.Server.Models;

namespace Sprinto.Server.Services
{
    public class ProjectService
    {
        private readonly IMongoCollection<Project> _projects;
        private readonly IMongoCollection<TaskItem> _tasks;
        private readonly ILogger<ProjectService> _logger;

        public ProjectService(IMongoClient mongoCLient,
            IOptions<DatabaseSettings> dbsettings,
            ILogger<ProjectService> logger)
        {
            var mongoDB = mongoCLient.GetDatabase(dbsettings.Value.DatabaseName);

            _projects = mongoDB.GetCollection<Project>(dbsettings.Value.ProjectsCollection);
            _tasks = mongoDB.GetCollection<TaskItem>(dbsettings.Value.TasksCollection);
            _logger = logger;
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
                var user = new Project(dto, userId, userName);
                await _projects.InsertOneAsync(user);

                return user;
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
        public async Task<List<TaskItem>> GetTaskItemsAsync(string id)
        {
            try
            {
                var project = GetAsync(id) ?? throw new KeyNotFoundException("Project not found");

                var tasks = await _tasks.Find(a => a.ProjectId == id).ToListAsync();
                return tasks;
            }
            catch (KeyNotFoundException)
            {
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving tasks for project with id {ProjectId}", id);
                throw new Exception("Could retrieve tasks for project");
            }
        }

        // Get all activities in a project
        public async Task<List<Activity>> GetActivitiesAsync(string id)
        {
            try
            {
                var tasks = await GetTaskItemsAsync(id);

                var activities = tasks
                    .SelectMany(task => task.Activities ?? [])
                    .OrderByDescending(a => a.CreatedBy.Time)
                    .ToList();

                return activities;
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
