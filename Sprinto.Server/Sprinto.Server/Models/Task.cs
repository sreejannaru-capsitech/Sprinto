using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Sprinto.Server.DTOs;
using System.ComponentModel.DataAnnotations;

namespace Sprinto.Server.Models
{
    public class TaskItem
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        [BsonElement("_id")]
        public string? Id { get; set; }

        [Required]
        [BsonElement("title")]
        public string Title { get; set; } = null!;

        [Required]
        [BsonElement("seq")]
        public long Sequence { get; set; }

        [Required]
        [BsonElement("project_alias")]
        public string ProjectALias { get; set; } = null!;

        [BsonIgnoreIfNull]
        [BsonElement("description")]
        public string? Description { get; set; }

        [Required]
        [BsonRepresentation(BsonType.ObjectId)]
        [BsonElement("project_id")]
        public string ProjectId { get; set; } = null!;

        [BsonElement("assignees")]
        public List<AssigneeDTO> Assignees { get; set; } = [];

        [Required]
        [BsonElement("due_date")]
        public DateOnly DueDate { get; set; }

        [Required]
        [BsonElement("status")]
        public StatusReq Status { get; set; } = null!;

        [Required]
        [BsonElement("priority")]
        public TaskPriority Priority { get; set; }

        [BsonElement("comments")]
        public List<Comment> Comments { get; set; } = [];

        [BsonElement("activities")]
        public List<Activity<object>> Activities { get; set; } = [];

        [BsonElement("created_by")]
        public Creation CreatedBy { get; set; } = null!;


        // Custom Constructor
        public TaskItem
            (TaskDTO task, string id, string name, long seq, string alias)
        {
            Title = task.Title;
            ProjectALias = alias;
            Sequence = seq;
            Description = task.Description;
            ProjectId = task.ProjectId;
            Assignees = task.Assignees;
            DueDate = task.DueDate;
            Status = task.Status;
            Priority = task.Priority;
            Comments = [];
            Activities = [];
            CreatedBy = new Creation
            {
                UserId = id,
                UserName = name
            };
        }

        public TaskItem() { }
    }
}
