using System.Data;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Sprinto.Server.DTOs;
using Sprinto.Server.Models;

namespace Sprinto.Server.Services
{
    public class StatusService
    {
        private readonly IMongoCollection<Status> _statuses;
        private readonly ILogger<StatusService> _logger;
        private readonly string[] fixedStatuses = ["Todo", "In Progress", "Done"];

        public StatusService(IMongoClient mongoCLient,
            IOptions<DatabaseSettings> dbsettings,
            ILogger<StatusService> logger)
        {
            var mongoDB = mongoCLient.GetDatabase(dbsettings.Value.DatabaseName);

            _statuses = mongoDB.GetCollection<Status>(dbsettings.Value.StatusCollection);
            _logger = logger;
        }

        // Creates and inserts a new task item in the database.
        public async Task<Status> CreateAsync(StatusDTO dto, string userId, string userName)
        {
            try
            {
                // Check if status already exists with the same title
                var existing = await _statuses.Find(s => s.Title == dto.Title).FirstOrDefaultAsync();
                if (existing != null)
                {
                    throw new DuplicateNameException("Status already exists with the title");
                }

                var status = new Status(dto, userId, userName);
                await _statuses.InsertOneAsync(status);
                return status;
            }
            catch (DuplicateNameException)
            {
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating new status");
                throw new Exception("Could not create status");
            }
        }


        // Get all statuses from database
        public async Task<List<Status>> GetAsync()
        {
            try
            {
                var statuses = await _statuses.Find(_ => true).ToListAsync();
                return statuses;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving statuses");
                throw new Exception("Could not retrieve statuses");
            }
        }

        // Updates the specified status by setting the title to the provided value.
        public async Task<Status> UpdateAsync(string id, StatusDTO dto)
        {
            try
            {
                var filter = Builders<Status>.Filter.And(
                    Builders<Status>.Filter.Eq(s => s.Id, id),
                    Builders<Status>.Filter.Nin(s => s.Title, fixedStatuses) // Exclude fixed statuses
                );

                var update = Builders<Status>.Update.Set(s => s.Title, dto.Title);
                var status = await _statuses.FindOneAndUpdateAsync(
                    filter,
                    update,
                    new FindOneAndUpdateOptions<Status>
                    {
                        ReturnDocument = ReturnDocument.After
                    }
                ) ?? throw new InvalidOperationException("Cannot update a permanent status");

                return status;
            }
            catch (InvalidOperationException)
            {
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating status {Title}", dto.Title);
                throw new Exception("Could not update status");
            }
        }

        // Deletes the status with the specified ID.
        public async Task<Status> DeleteAsync(string id)
        {
            try
            {
                var filter = Builders<Status>.Filter.And(
                    Builders<Status>.Filter.Eq(s => s.Id, id),
                    Builders<Status>.Filter.Nin(s => s.Title, fixedStatuses) // Exclude fixed statuses
                );

                var status = await _statuses.FindOneAndDeleteAsync(filter)
                ?? throw new InvalidOperationException("Cannot delete a permanent status");

                return status;
            }
            catch (InvalidOperationException)
            {
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting status with ID {Id}", id);
                throw new Exception("Could not delete status");
            }
        }
    }
}
