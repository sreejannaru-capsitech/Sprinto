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

        [BsonElement("user_name")]
        public string UserName { get; set; } = null!;

        [BsonElement("time")]
        public DateTime Time { get; set; } = DateTime.UtcNow;
    }
}