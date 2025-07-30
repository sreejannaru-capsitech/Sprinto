using Sprinto.Server.DTOs;
using Sprinto.Server.Models;

namespace Sprinto.Server.Extensions
{
    public static class ModelExtension
    {
        public static UserResponse ToUserResponse(this User user)
        {
            return new UserResponse
            {
                Id = user.Id,
                Name = user.Name,
                CreatedBy = user.CreatedBy,
                Email = user.Email,
                Role = user.Role,
            };
        }

        public static TaskResponse ToTaskResponse(this TaskItem task) {
            return new TaskResponse
            {
                Id = task.Id,
                Title = task.Title,
                CreatedBy = task.CreatedBy,
                Description = task.Description,
                Sequence = task.Sequence,
                ProjectALias = task.ProjectALias,
                ProjectId = task.ProjectId,
                Priority = task.Priority,
                Assignees = task.Assignees,
                DueDate = task.DueDate,
                Status = task.Status,
                Comments = task.Comments,
            };
        }
    }
}
