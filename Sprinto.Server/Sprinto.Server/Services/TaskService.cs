using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Sprinto.Server.DTOs;
using Sprinto.Server.Models;
using System.Threading.Tasks;

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

                var tasks = await _tasks.Find(userFilter).ToListAsync();

                // Separate today's and overdue tasks
                var response = new TodayTasksResponse
                {
                    Today = [.. tasks.Where(t => t.DueDate == today)],
                    Overdue = [.. tasks.Where(t => t.DueDate < today)]
                };

                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving tasks for user {UserId}", userId);
                throw new Exception("Could not retrieve tasks of today");
            }
        }
    }
}
