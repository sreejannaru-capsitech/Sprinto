using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Sprinto.Server.DTOs;
using System.ComponentModel.DataAnnotations;

namespace Sprinto.Server.Models
{
    public class Activity
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        [BsonElement("_id")]
        public string Id { get; set; } = ObjectId.GenerateNewId().ToString();

        [Required]
        [BsonElement("action")]
        public ActivityAction Action { get; set; }

        [BsonElement("created_by")]
        public Creation CreatedBy { get; set; } = null!;

        [BsonIgnoreIfNull]
        public ActivityLog<string>? Title { get; set; }

        [BsonIgnoreIfNull]
        public ActivityLog<string>? Description { get; set; }

        [BsonIgnoreIfNull]
        public ActivityLog<List<Assignee>>? Assignee { get; set; }

        [BsonIgnoreIfNull]
        public ActivityLog<StatusEntity>? Status { get; set; }

        [BsonIgnoreIfNull]
        public ActivityLog<TaskPriority>? Priority { get; set; }
    }

    public class ActivityLog<T>
    {
        public T? Previous { get; set; }
        public T? Current { get; set; }
    }

    public enum ActivityAction
    {
        TaskCreated,
        TitleUpdated,
        DescUpdated,
        ProjectUpdated,
        AssigneeAdded,
        AssigneeRemoved,
        DuedateUpdated,
        StatusUpdated,
        PriorityUpdated
    }
}
