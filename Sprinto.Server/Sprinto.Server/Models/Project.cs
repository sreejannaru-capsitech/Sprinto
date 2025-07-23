using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;


namespace Sprinto.Server.Models
{
    public class Project
    {
        [BsonId]
        [BsonElement("_id")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("title")]
        public string Title { get; set; } = null!;

        [BsonIgnoreIfDefault]
        [BsonElement("description")]
        public string Description { get; set; } = null!;

        [BsonIgnoreIfDefault]
        [BsonElement("is_completed")]
        public bool IsCompleted { get; set; }

        [BsonElement("deadline")]
        public DateOnly Deadline { get; set; }

        [BsonElement("maintainer_id")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string TeamLead { get; set; } = null!;

        [BsonElement("assignees")]
        [BsonRepresentation(BsonType.ObjectId)]
        public List<string> Assignees { get; set; } = [];

        [BsonElement("created_by")]
        public Creation CreatedBy { get; set; } = null!;
    }
}
