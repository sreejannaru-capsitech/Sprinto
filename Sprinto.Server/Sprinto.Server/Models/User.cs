using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Sprinto.Server.DTOs;
using Sprinto.Server.Validation;
using System.ComponentModel.DataAnnotations;

namespace Sprinto.Server.Models
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        [BsonElement("_id")]
        public string? Id { get; set; }

        [BsonElement("name")]
        public string Name { get; set; } = null!;

        [EmailAddress]
        [BsonElement("email")]
        public string Email { get; set; } = null!;

        [BsonElement("password_hash")]
        public string Password { get; set; } = null!;

        [BsonElement("display_picture")]
        [BsonIgnoreIfNull]
        public string? DisplayPic { get; set; }

        [BsonElement("role")]
        public string Role { get; set; } = null!;

        [BsonElement("created_by")]
        public Creation CreatedBy { get; set; } = null!;

        [BsonElement("sessions")]
        public List<Session> Sessions { get; set; } = [];

        public User(UserDTO dto, string id, string name)
        {
            Name = dto.Name;
            Email = dto.Email;
            // Auto set default password for new users as "welcome"
            Password = BCrypt.Net.BCrypt.EnhancedHashPassword("welcome", workFactor: 15);
            Role = dto.Role;
            CreatedBy = new Creation
            {
                UserId = id,
                UserName = name
            };
        }

        public User() { }
    }

    public class Assignee
    {
        private string _name = null!;

        [BsonRepresentation(BsonType.ObjectId)]
        [Required(ErrorMessage = "Please provide assignee Id")]
        [ValidObjectId(ErrorMessage = "Assignee Id must be a valid MongoDB ObjectId")]
        [BsonElement("_id")]
        public string? Id { get; set; }


        [Required(ErrorMessage = "Please provide assignee name")]
        [BsonElement("name")]
        public string Name
        {
            get { return _name; }
            set { _name = value?.Trim() ?? string.Empty; }
        }
    }
}
