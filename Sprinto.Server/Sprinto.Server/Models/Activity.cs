using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace Sprinto.Server.Models
{
    public class Activity<T>
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        [BsonElement("_id")]
        public string? Id { get; set; }

        [Required]
        [BsonElement("action")]
        public ActivityAction Action { get; set; }

        [BsonIgnoreIfNull]
        [BsonElement("prev_value")]
        public T? PrevValue { get; set; }

        [BsonIgnoreIfNull]
        [BsonElement("curr_value")]
        public T? CurrValue { get; set; }

        [BsonElement("created_by")]
        public Creation CreatedBy { get; set; } = null!;
    }

    public enum ActivityAction
    {
        Created,
        Updated,
        Assigned,
        Deleted
    }
}
