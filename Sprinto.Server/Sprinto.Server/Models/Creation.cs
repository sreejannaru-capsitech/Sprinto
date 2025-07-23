using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace Sprinto.Server.Models
{
    public class Creation
    {
        [Required]
        [BsonElement("user_id")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string UserId { get; set; } = null!;

        [Required]
        [BsonElement("user_name")]
        public string UserName { get; set; } = null!;

        [Required]
        [BsonElement("created_at")]
        public DateTime CreatedAt { get; set;}
    }
}
