using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Sprinto.Server.Models;
using Sprinto.Server.Validation;
using System.ComponentModel.DataAnnotations;

namespace Sprinto.Server.DTOs
{
    public class TaskDTO
    {
        private string _title = null!;

        [Required(ErrorMessage = "Title is required")]
        [MinLength(3, ErrorMessage = "Title should have at least 3 characters")]
        [StringLength(100, ErrorMessage = "Title must not exceed 100 characters")]
        public string Title
        {
            get => _title;
            set { _title = value?.Trim() ?? string.Empty; }
        }

        public string? Description { get; set; }

        [Required(ErrorMessage = "Please provide project Id")]
        [ValidObjectId(ErrorMessage = "ProjectId must be a valid 24-character MongoDB ObjectId")]
        public string ProjectId { get; set; } = null!;

        public List<AssigneeDTO> Assignees { get; set; } = [];

        [Required (ErrorMessage = "Please provide task due date")]
        public DateOnly DueDate { get; set; }

        [Required(ErrorMessage = "Please provide task status")]
        public StatusReq Status { get; set; } = null!;

        [Required(ErrorMessage = "Please provide task priority")]
        [RegularExpression("^(?i)(low|medium|high)$", ErrorMessage = "Priority must be low, medium or high")]
        public TaskPriority Priority { get; set; }
    }

    public class TaskResponse
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string Title { get; set; } = null!;

        public long Sequence { get; set; }

        public string ProjectAlias { get; set; } = null!;

        public string? Description { get; set; }

        [BsonRepresentation(BsonType.ObjectId)]
        public string ProjectId { get; set; } = null!;

        public List<AssigneeDTO> Assignees { get; set; } = [];

        public DateOnly DueDate { get; set; }

        public StatusReq Status { get; set; } = null!;

        public TaskPriority Priority { get; set; }

        public List<Comment> Comments { get; set; } = [];

        public Creation CreatedBy { get; set; } = null!;
    }

    public enum TaskPriority 
    {
        low,
        medium,
        high
    }

}
