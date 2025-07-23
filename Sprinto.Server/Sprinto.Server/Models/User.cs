using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
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

        [BsonElement("passwordHash")]
        public string Password { get; set; } = null!;

        [BsonElement("role")]
        public string Role { get; set; } = null!;

        [BsonElement("created_by")]
        public Creation CreatedBy { get; set; } = null!;
    }
}
