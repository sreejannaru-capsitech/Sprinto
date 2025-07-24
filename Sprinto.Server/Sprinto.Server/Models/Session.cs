using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace Sprinto.Server.Models
{
    public class Session
    {
        [Required]
        [BsonElement("token")]
        public string Token { get; set; } = null!;

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        [BsonElement("expiresAt")]
        public DateTime ExpiresAt { get; set; }

        [BsonIgnoreIfNull]
        [BsonElement("clientIP")]
        public string? ClientIP { get; set; }
    }
}
