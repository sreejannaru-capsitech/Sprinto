using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Sprinto.Server.Validation;
using System.ComponentModel.DataAnnotations;

namespace Sprinto.Server.DTOs
{
    public class CreationDTO
    {
        private string _username = null!;

        [Required(ErrorMessage = "Creator's user ID is required")]
        [BsonElement("user_id")]
        [ValidObjectId(ErrorMessage = "UserId must be a valid 24-character MongoDB ObjectId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string UserId { get; set; } = null!;

        [Required(ErrorMessage = "Creator's name is required")]
        [MinLength(3, ErrorMessage = "Creator's name should have at least 3 characters")]
        [StringLength(100, ErrorMessage = "Creator's name must be at most 100 characters")]
        [BsonElement("user_name")]
        public string UserName
        {
            get => _username;
            set => _username = value?.Trim() ?? string.Empty;
        }
    }
}
