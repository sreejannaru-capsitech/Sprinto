using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Sprinto.Server.DTOs;
using Sprinto.Server.Models;
using static Sprinto.Server.Common.Constants;

namespace Sprinto.Server.Services
{
    public class CommentService
    {
        private readonly IMongoCollection<TaskItem> _tasks;
        private readonly ILogger<TaskService> _logger;

        public CommentService(IMongoClient mongoCLient,
            IOptions<DatabaseSettings> dbsettings,
            ILogger<TaskService> logger)
        {
            var mongoDB = mongoCLient.GetDatabase(dbsettings.Value.DatabaseName);

            _tasks = mongoDB.GetCollection<TaskItem>(dbsettings.Value.TasksCollection);
            _logger = logger;
        }

        public async Task<List<Comment>> GetCommentsAsync(string taskId)
        {
            try
            {
                var task = await _tasks.Find(t => t.Id == taskId).FirstOrDefaultAsync()
                    ?? throw new KeyNotFoundException(Messages.NotFound);

                return task.Comments;
            }
            catch (KeyNotFoundException)
            {
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Could not retrieve comments for task {id}", taskId);
                throw new Exception("Could not retrieve comments");
            }
        }

        public async Task AddCommentAsync(string taskId, CommentDTO dto, string userId, string userName)
        {
            try
            {
                var comment = new Comment(dto, userId, userName);

                var update = Builders<TaskItem>.Update.Push(t => t.Comments, comment);
                var result = await _tasks.UpdateOneAsync(t => t.Id == taskId, update);

                if (result.ModifiedCount == 0)
                    throw new Exception("Failed to add comment to task.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Could not add comment to task {id}", taskId);
                throw new Exception("Could not add comment");
            }
        }

        public async Task UpdateCommentAsync(string taskId, CommentDTO dto)
        {
            try
            {
                var filter = Builders<TaskItem>.Filter.And(
                    Builders<TaskItem>.Filter.Eq(t => t.Id, taskId),
                    Builders<TaskItem>.Filter.ElemMatch(t => t.Comments, c => c.Id == dto.Id)
                );

                var update = Builders<TaskItem>.Update
                    .Set("comments.$.content", dto.Content)
                    .Set("comments.$.is_edited", true)
                    .Set("comments.$.updated_at", DateTime.UtcNow);

                var result = await _tasks.UpdateOneAsync(filter, update);

                if (result.ModifiedCount == 0)
                    throw new Exception("Failed to update comment.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Could not update comment {commentId} in task {taskId}", dto.Id, taskId);
                throw new Exception("Could not update comment");
            }
        }

        public async Task DeleteCommentAsync(string taskId, string commentId)
        {
            try
            {
                var update = Builders<TaskItem>.Update.PullFilter(t => t.Comments,
                    Builders<Comment>.Filter.Eq(c => c.Id, commentId));

                var result = await _tasks.UpdateOneAsync(t => t.Id == taskId, update);

                if (result.ModifiedCount == 0)
                    throw new Exception("Failed to delete comment.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Could not delete comment {commentId} from task {taskId}", commentId, taskId);
                throw new Exception("Could not delete comment");
            }
        }
    }
}