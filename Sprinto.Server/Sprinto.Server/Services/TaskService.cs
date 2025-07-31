using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Sprinto.Server.DTOs;
using Sprinto.Server.Extensions;
using Sprinto.Server.Models;


namespace Sprinto.Server.Services
{
    public class TaskService
    {
        private readonly IMongoCollection<TaskItem> _tasks;
        private readonly ILogger<TaskService> _logger;

        public TaskService(IMongoClient mongoCLient,
            IOptions<DatabaseSettings> dbsettings,
            ILogger<TaskService> logger)
        {
            var mongoDB = mongoCLient.GetDatabase(dbsettings.Value.DatabaseName);

            _tasks = mongoDB.GetCollection<TaskItem>(dbsettings.Value.TasksCollection);
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
                long seq = await GetNextSequenceAsync();
                var task = new TaskItem(dto, userId, userName, seq);
                await _tasks.InsertOneAsync(task);

                return task;
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
                var today = DateOnly.FromDateTime(DateTime.Today);

                // Match user assignment
                var assigneeFilter = Builders<TaskItem>.Filter.ElemMatch(
                    t => t.Assignees,
                    a => a.Id == userId
                );

                // Exclude "Done" status
                var statusFilter = Builders<TaskItem>.Filter.Ne(
                    t => t.Status.Title,
                    "Done"
                );

                // Combine filters
                var userFilter = Builders<TaskItem>.Filter.And(
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
        public async Task<List<TaskResponse>> GetInboxTasks(string userId)
        {
            try
            {
                // Match user assignment
                var assigneeFilter = Builders<TaskItem>.Filter.ElemMatch(
                    t => t.Assignees,
                    a => a.Id == userId
                );

                // Exclude "Done" status
                var statusFilter = Builders<TaskItem>.Filter.Ne(
                    t => t.Status.Title,
                    "Done"
                );

                // Combine filters
                var userFilter = Builders<TaskItem>.Filter.And(
                    assigneeFilter,
                    statusFilter
                );

                // Exclude activities from the response
                var projection = Builders<TaskItem>.Projection.Exclude(t => t.Activities);

                var tasks = await _tasks.Find(userFilter)
                    .Project<TaskItem>(projection)
                    .ToListAsync();

                return tasks.Select(u => u.ToTaskResponse()).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving tasks for user {UserId}", userId);
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

                // Exclude "Done" status
                var statusFilter = Builders<TaskItem>.Filter.Ne(
                    t => t.Status.Title,
                    "Done"
                );

                var dateFilter = Builders<TaskItem>.Filter.Gt(
                    t => t.DueDate, DateOnly.FromDateTime(DateTime.Today));

                // Combine filters
                var userFilter = Builders<TaskItem>.Filter.And(
                    assigneeFilter,
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
                        { "due_date", new BsonDocument("$gt", DateTime.Today) }
                    }),
                    new("$lookup", new BsonDocument
                    {
                        { "from", "projects" },
                        { "localField", "project_id" },
                        { "foreignField", "_id" },
                        { "as", "project" }
                    }),
                    new("$unwind", "$project"),
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

        // Find and update a task
        public async Task<TaskItem> UpdateAsync(string id, TaskDTO dto, string userId, string userName)
        {
            try
            {
                var existingTask = await _tasks.Find(t => t.Id == id).FirstOrDefaultAsync()
                    ?? throw new KeyNotFoundException($"Task with id {id} not found");

                var activities = new List<object>(); // Will hold Activity<T> of any type

                void LogChange<T>(ActivityAction actionType, T? oldVal, T? newVal)
                {
                    if (!EqualityComparer<T>.Default.Equals(oldVal, newVal))
                    {
                        var activity = new Activity<T>
                        {
                            Action = actionType,
                            PrevValue = oldVal,
                            CurrValue = newVal,
                            CreatedBy = new Creation { UserId = userId, UserName = userName }
                        };
                        activities.Add(activity);
                    }
                }

                // Track field-by-field changes with type safety
                LogChange(ActivityAction.Updated, existingTask.Title, dto.Title);
                LogChange(ActivityAction.Updated, existingTask.Description, dto.Description);
                LogChange(ActivityAction.Updated, existingTask.DueDate, dto.DueDate);
                LogChange(ActivityAction.Updated, existingTask.Status, dto.Status);
                LogChange(ActivityAction.Updated, existingTask.Priority, dto.Priority);

                // Detect assignee changes (these are still strings)
                var prevAssignees = existingTask.Assignees.Select(a => a.Id).ToHashSet();
                var newAssignees = dto.Assignees.Select(a => a.Id).ToHashSet();

                var added = newAssignees.Except(prevAssignees);
                var removed = prevAssignees.Except(newAssignees);

                foreach (var user in added)
                {
                    LogChange(ActivityAction.Assigned, default, user);
                }

                foreach (var user in removed)
                {
                    LogChange(ActivityAction.Assigned, user, default);
                }

                var update = Builders<TaskItem>.Update
                    .Set(t => t.Title, dto.Title)
                    .Set(t => t.Description, dto.Description)
                    .Set(t => t.DueDate, dto.DueDate)
                    .Set(t => t.Status, dto.Status)
                    .Set(t => t.Priority, dto.Priority)
                    .Set(t => t.Assignees, dto.Assignees)
                    .PushEach("activities", activities); // Dynamic list of Activity<T>

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

    }
}
