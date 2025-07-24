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
    }
}
