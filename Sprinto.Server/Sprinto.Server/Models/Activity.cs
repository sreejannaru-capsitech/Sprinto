using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace Sprinto.Server.Models
{
    public class Activity
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        [BsonElement("_id")]
        public string? Id { get; set; }

        [Required]
        [BsonElement("action")]
        public string Action { get; set; } = null!;

        [BsonIgnoreIfNull]
        [BsonElement("prev_value")]
        public string? PrevValue { get; set; }

        [BsonIgnoreIfNull]
        [BsonElement("curr_value")]
        public string? CurrValue { get; set; }

        [BsonElement("created_by")]
        public Creation CreatedBy { get; set; } = null!;
    }
}
