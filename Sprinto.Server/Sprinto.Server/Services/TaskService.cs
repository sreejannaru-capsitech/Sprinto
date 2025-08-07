using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using Sprinto.Server.Common;
using Sprinto.Server.DTOs;
using Sprinto.Server.Extensions;
using Sprinto.Server.Models;


namespace Sprinto.Server.Services
{
    public class TaskService
    {
        private readonly IMongoCollection<TaskItem> _tasks;
        private readonly IMongoCollection<Project> _projects;
        private readonly ILogger<TaskService> _logger;

        public TaskService(IMongoClient mongoCLient,
            IOptions<DatabaseSettings> dbsettings,
            ILogger<TaskService> logger)
        {
            var mongoDB = mongoCLient.GetDatabase(dbsettings.Value.DatabaseName);

            _tasks = mongoDB.GetCollection<TaskItem>(dbsettings.Value.TasksCollection);
            _projects = mongoDB.GetCollection<Project>(dbsettings.Value.ProjectsCollection);
            _logger = logger;
        }

        // Retrives the next available task sequence.
        public async Task<long> GetNextSequenceAsync()
        {
            try
            {
                var sort = Builders<TaskItem>.Sort.Descending(t => t.Sequence);

                var highestTask = await _tasks
                    .Find(FilterDefinition<TaskItem>.Empty)
                    .Sort(sort)
                    .Limit(1)
                    .FirstOrDefaultAsync();

                return highestTask?.Sequence + 1 ?? 1;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving next task sequence");
                throw new Exception("Could not determine next task sequence");
            }
        }

        // Creates and inserts a new task item in the database.
        public async Task<TaskItem> CreateAsync(TaskDTO dto, string userId, string userName)
        {
            try
            {
                var project = await _projects.Find(a => a.Id == dto.ProjectId).FirstOrDefaultAsync()
                    ?? throw new KeyNotFoundException("Invalid Project Id");


                long seq = await GetNextSequenceAsync();
                var task = new TaskItem(dto, userId, userName, seq, project.Alias);

                // Log the creation activity
                var creation = new Activity
                {
                    Action = ActivityAction.TaskCreated,
                    CreatedBy = new Creation
                    {
                        UserId = userId,
                        UserName = userName
                    }
                };

                task.Activities.Add(creation);

                await _tasks.InsertOneAsync(task);

                return task;
            }
            catch (KeyNotFoundException)
            {
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating new Task Item");
                throw new Exception("Could not create Task Item");
            }
        }

        /// <summary>
        /// Retrieves tasks assigned to a specific user that are due today or overdue,
        /// excluding tasks with a status of "Done".
        /// </summary>
        /// <param name="userId">The ID of the user whose tasks are to be retrieved.</param>
        /// <returns>
        /// A <see cref="TodayTasksResponse"/> containing today's and overdue tasks.
        /// </returns>
        /// <exception cref="Exception">Thrown when task retrieval fails.</exception>
        public async Task<TodayTasksResponse> GetTasksOfTodayAsync(string userId)
        {
            try
            {
                var today = DateTime.Today;

                // Match user assignment
                var assigneeFilter = Builders<TaskItem>.Filter.ElemMatch(
                    t => t.Assignees,
                    a => a.Id == userId
                );

                // Exclude deleted tasks
                var deleteFilter = Builders<TaskItem>.Filter.Ne(
                    t => t.IsDeleted,
                    true
                );

                // Exclude "Done" status
                var statusFilter = Builders<TaskItem>.Filter.Ne(
                    t => t.Status.Title,
                    "Done"
                );

                // Combine filters
                var userFilter = Builders<TaskItem>.Filter.And(
                    deleteFilter,
                    assigneeFilter,
                    statusFilter
                );

                // Exclude activities from the response
                var projection = Builders<TaskItem>.Projection.Exclude(t => t.Activities);

                var tasks = await _tasks.Find(userFilter)
                    .Project<TaskItem>(projection)
                    .ToListAsync();

                var todayTasks = tasks.Where(t => t.DueDate == today).ToList()
                    .Select(u => u.ToTaskResponse()).ToList();
                var overdueTasks = tasks.Where(t => t.DueDate < today).ToList()
                    .Select(u => u.ToTaskResponse()).ToList();

                // Separate today's and overdue tasks
                var response = new TodayTasksResponse
                {
                    Today = todayTasks,
                    Overdue = overdueTasks
                };

                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving tasks for user {UserId}", userId);
                throw new Exception("Could not retrieve tasks of today");
            }
        }

        // Find all user assigned tasks
        public async Task<InboxTaskGroup> GetInboxTasks(string userId)
        {
            try
            {
                // Match user assignment
                var assigneeFilter = Builders<TaskItem>.Filter.ElemMatch(
                    t => t.Assignees,
                    a => a.Id == userId
                );

                // Exclude deleted tasks
                var deleteFilter = Builders<TaskItem>.Filter.Ne(
                    t => t.IsDeleted,
                    true
                );

                // Exclude "Done" status
                var statusFilter = Builders<TaskItem>.Filter.Ne(
                    t => t.Status.Title,
                    "Done"
                );

                // Combine filters
                var userFilter = Builders<TaskItem>.Filter.And(
                    deleteFilter,
                    assigneeFilter,
                    statusFilter
                );

                // Exclude activities from the response
                var projection = Builders<TaskItem>.Projection.Exclude(t => t.Activities);

                var tasks = await _tasks.Find(userFilter)
                    .Project<TaskItem>(projection)
                    .ToListAsync();

                var responses = tasks.Select(t => t.ToTaskResponse());

                var grouped = new InboxTaskGroup
                {
                    Low = [.. responses
                        .Where(t => t.Priority == TaskPriority.low)
                        .OrderBy(t => t.DueDate)],

                    Medium = [.. responses
                        .Where(t => t.Priority == TaskPriority.medium)
                        .OrderBy(t => t.DueDate)],

                    High = [.. responses
                        .Where(t => t.Priority == TaskPriority.high)
                        .OrderBy(t => t.DueDate)]
                };

                return grouped;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving inbox tasks for user {UserId}", userId);
                throw new Exception("Could not retrieve inbox tasks");
            }
        }
        // Find all user assinged upcoming tasks
        public async Task<List<TaskResponse>> GetUpcomingTasks(string userId)
        {
            try
            {
                // Match user assignment
                var assigneeFilter = Builders<TaskItem>.Filter.ElemMatch(
                    t => t.Assignees,
                    a => a.Id == userId
                );

                // Exclude deleted tasks
                var deleteFilter = Builders<TaskItem>.Filter.Ne(
                    t => t.IsDeleted,
                    true
                );

                // Exclude "Done" status
                var statusFilter = Builders<TaskItem>.Filter.Ne(
                    t => t.Status.Title,
                    "Done"
                );

                var dateFilter = Builders<TaskItem>.Filter.Gt(t => t.DueDate, DateTime.Today);

                // Combine filters
                var userFilter = Builders<TaskItem>.Filter.And(
                    assigneeFilter,
                    deleteFilter,
                    statusFilter,
                    dateFilter
                );

                // Exclude activities from the response
                var projection = Builders<TaskItem>.Projection.Exclude(t => t.Activities);

                var tasks = await _tasks.Find(userFilter)
                    .Project<TaskItem>(projection)
                    .ToListAsync();

                return [.. tasks.Select(u => u.ToTaskResponse())];
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving tasks for user {UserId}", userId);
                throw new Exception("Could not retrieve upcoming tasks");
            }
        }

        public async Task<List<ProjectTaskGroup>> GetGroupedUpcomingTasks(string userId)
        {
            try
            {
                var pipeline = new List<BsonDocument>
                {
                    new("$match", new BsonDocument
                    {
                        { "assignees", new BsonDocument("$elemMatch", new BsonDocument("_id", new ObjectId(userId))) },
                        { "status.title", new BsonDocument("$ne", "Done") },
                        { "is_deleted", new BsonDocument("$ne", true) }, 
                        { "due_date", new BsonDocument("$gt",  DateTime.Today) } // FIXME: Fix the date check
                    }),
                    new("$lookup", new BsonDocument
                    {
                        { "from", "projects" },
                        { "localField", "project_id" },
                        { "foreignField", "_id" },
                        { "as", "project" }
                    }),
                    new("$unwind", "$project"),
                    new("$sort", new BsonDocument("due_date", 1)),
                    new("$group", new BsonDocument
                    {
                        { "_id", "$project_id" },
                        { "ProjectTitle", new BsonDocument("$first", "$project.title") },
                        { "Tasks", new BsonDocument("$push", new BsonDocument
                            {
                                { "_id", "$_id" },
                                { "Title", "$title" },
                                { "DueDate", "$due_date" },
                                { "Status", "$status" },
                                { "Assignees", "$assignees" },
                                { "ProjectId", "$project_id" },
                                { "Description", "$description" },
                                { "Priority", "$priority" },
                                { "Sequence", "$seq" },
                                { "ProjectAlias", "$project_alias" },
                                { "Comments", "$comments" },
                                { "CreatedBy", "$created_by" },
                            })
                        }
                    }),
                    new("$project", new BsonDocument
                    {
                        { "ProjectId", "$_id" },
                        { "ProjectTitle", 1 },
                        { "Tasks", 1 },
                        { "_id", 0 }
                    })
                };

                var result = await _tasks.Aggregate<ProjectTaskGroup>(pipeline).ToListAsync();
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error grouping tasks for user {UserId}", userId);
                throw new Exception("Could not group upcoming tasks");
            }
        }


        // Search for Tasks based on Regex on Task title and Description
        public async Task<List<TaskItem>> 
            SearchUserTasksAsync(string userId, string searchTerm, bool isAdmin = false)
        {
            try
            {
                var filters = new List<FilterDefinition<TaskItem>>();

                // Apply assignee filter only if not admin
                if (!isAdmin)
                {
                    var assigneeFilter = Builders<TaskItem>.Filter.ElemMatch(
                        t => t.Assignees,
                        a => a.Id == userId
                    );
                    filters.Add(assigneeFilter);
                }

                // Exclude deleted tasks
                var deleteFilter = Builders<TaskItem>.Filter.Ne(
                    t => t.IsDeleted,
                    true
                );
                filters.Add(deleteFilter);

                // Apply regex search only if searchTerm is not empty
                if (!string.IsNullOrWhiteSpace(searchTerm))
                {
                    var regexFilter = Builders<TaskItem>.Filter.Or(
                        Builders<TaskItem>.Filter.Regex(t => t.Title, new BsonRegularExpression(searchTerm, "i")),
                        Builders<TaskItem>.Filter.Regex(t => t.Description, new BsonRegularExpression(searchTerm, "i"))
                    );
                    filters.Add(regexFilter);
                }

                // Combine all filters
                var combinedFilter = filters.Count != 0
                    ? Builders<TaskItem>.Filter.And(filters)
                    : Builders<TaskItem>.Filter.Empty;

                var tasks = await _tasks.Find(combinedFilter).Limit(10).ToListAsync();
                return tasks;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching tasks for user {UserId}", userId);
                throw new Exception("Could not search tasks");
            }
        }

        /// <summary>
        /// Updates an existing task with new values from the provided <see cref="TaskDTO"/>.
        /// Tracks changes made to task properties and records corresponding activity logs.
        /// </summary>
        /// <param name="id">The unique identifier of the task to update.</param>
        /// <param name="dto">A data transfer object containing the updated task properties.</param>
        /// <param name="userId">The ID of the user performing the update.</param>
        /// <param name="userName">The name of the user performing the update.</param>
        /// <returns>
        /// The updated <see cref="TaskItem"/> after applying changes.
        /// </returns>
        /// <exception cref="KeyNotFoundException">Thrown when the task with the specified ID does not exist.</exception>
        /// <exception cref="Exception">Thrown when an unexpected error occurs during the update process.</exception>
        public async Task<TaskItem> UpdateAsync(string id, TaskDTO dto, string userId, string userName)
        {
            try
            {
                var existingTask = await _tasks.Find(t => t.Id == id).FirstOrDefaultAsync()
                    ?? throw new KeyNotFoundException($"Task with id {id} not found");

                var activities = new List<Activity>();

                var creator = new Creation { UserId = userId, UserName = userName };

                // Check Description
                if (existingTask.Description != dto.Description)
                {
                    activities.Add(new Activity
                    {
                        Action = ActivityAction.DescUpdated,
                        Description = new ActivityLog<string>
                        {
                            Current = dto.Description,
                            Previous = existingTask.Description
                        },
                        CreatedBy = creator
                    });
                }

                // Check Title
                if (existingTask.Title != dto.Title)
                {
                    activities.Add(new Activity
                    {
                        Action = ActivityAction.TitleUpdated,
                        Title = new ActivityLog<string>
                        {
                            Current = dto.Title,
                            Previous = existingTask.Title
                        },
                        CreatedBy = creator
                    });
                }

                // Check Status
                if (existingTask.Status.Id != dto.Status.Id)
                {
                    activities.Add(new Activity
                    {
                        Action = ActivityAction.StatusUpdated,
                        Status = new ActivityLog<StatusEntity>
                        {
                            Current = dto.Status,
                            Previous = existingTask.Status
                        },
                        CreatedBy = creator
                    });
                }

                // Check DueDate
                if (existingTask.DueDate != dto.DueDate)
                {
                    activities.Add(new Activity
                    {
                        Action = ActivityAction.DuedateUpdated,
                        DueDate = new ActivityLog<DateTime>
                        {
                            Current = dto.DueDate,
                            Previous = existingTask.DueDate
                        },
                        CreatedBy = creator
                    });
                }

                // Check Priority
                if (existingTask.Priority != dto.Priority)
                {
                    activities.Add(new Activity
                    {
                        Action = ActivityAction.PriorityUpdated,
                        Priority = new ActivityLog<TaskPriority>
                        {
                            Current = dto.Priority,
                            Previous = existingTask.Priority
                        },
                        CreatedBy = creator
                    });
                }

                // Detect assignee changes (these are still strings)
                var prevAssignees = existingTask.Assignees.Select(a => a.Id).ToHashSet();
                var newAssignees = dto.Assignees.Select(a => a.Id).ToHashSet();

                var added = newAssignees.Except(prevAssignees);
                var removed = prevAssignees.Except(newAssignees);

                // Assignee added
                if (added.Any())
                {
                    activities.Add(new Activity
                    {
                        Action = ActivityAction.AssigneeAdded,
                        Assignee = new ActivityLog<List<Assignee>>
                        {
                            Previous = null,
                            Current = [.. dto.Assignees.Where(a => added.Contains(a.Id))]
                        },
                        CreatedBy = creator
                    });
                }

                // Assignee removed
                if (removed.Any())
                {
                    activities.Add(new Activity
                    {
                        Action = ActivityAction.AssigneeRemoved,
                        Assignee = new ActivityLog<List<Assignee>>
                        {
                            Previous = [.. existingTask.Assignees.Where(a => removed.Contains(a.Id))],
                            Current = null
                        },
                        CreatedBy = creator
                    });
                }

                var update = Builders<TaskItem>.Update
                    .Set(t => t.Title, dto.Title)
                    .Set(t => t.Description, dto.Description)
                    .Set(t => t.DueDate, dto.DueDate)
                    .Set(t => t.Status, dto.Status)
                    .Set(t => t.Priority, dto.Priority)
                    .Set(t => t.Assignees, dto.Assignees)
                    .PushEach("activities", activities); // Add generated activities

                var options = new FindOneAndUpdateOptions<TaskItem>
                {
                    ReturnDocument = ReturnDocument.After
                };

                var updatedTask = await _tasks.FindOneAndUpdateAsync(
                    x => x.Id == id,
                    update,
                    options
                );

                return updatedTask ?? throw new KeyNotFoundException($"Task with id {id} not found");
            }
            catch (KeyNotFoundException)
            {
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating task {Id}", id);
                throw new Exception("Could not update task");
            }
        }

        // Get activities of a task
        public async Task<List<Activity>> GetTaskActivities(string id)
        {
            try
            {
                var task = await _tasks.Find(a => a.Id == id).FirstOrDefaultAsync()
                    ?? throw new KeyNotFoundException(Constants.Messages.NotFound);
                return [.. task.Activities.OrderByDescending(c => c.CreatedBy.Time)];
            }
            catch (KeyNotFoundException)
            {
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving activity for task {TaskId}", id);
                throw new Exception("Could not retrieve task activity");
            }
        }


        //Soft delete a Task Item
        public async Task<TaskItem> DeleteAsync(string id, string userId, string userName)
        {
            try
            {
                var options = new FindOneAndUpdateOptions<TaskItem>
                {
                    ReturnDocument = ReturnDocument.After
                };

                var deletion = new Activity
                {
                    Action = ActivityAction.TaskDeleted,
                    CreatedBy = new Creation
                    {
                        UserId = userId,
                        UserName = userName
                    }
                };

                var update = Builders<TaskItem>.Update.Combine(
                    Builders<TaskItem>.Update.Set(t => t.IsDeleted, true),
                    Builders<TaskItem>.Update.Push(t => t.Activities, deletion)
                );


                var updatedTask = await _tasks.FindOneAndUpdateAsync(
                    x => x.Id == id,
                    update,
                    options
                );

                return updatedTask ?? throw new KeyNotFoundException($"Task with id {id} not found");
            }
            catch (KeyNotFoundException)
            {
                throw;
            }
            catch (Exception ex)
            {
                {
                    _logger.LogError(ex, "Error retrieving activity for task {TaskId}", id);
                    throw new Exception("Could not retrieve task activity");
                }
            }
        }
    }
}
