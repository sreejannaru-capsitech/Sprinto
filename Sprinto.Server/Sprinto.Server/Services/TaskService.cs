using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Sprinto.Server.DTOs;
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
    }
}
