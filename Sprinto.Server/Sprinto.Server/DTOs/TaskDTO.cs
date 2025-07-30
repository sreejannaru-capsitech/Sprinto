using MongoDB.Bson.Serialization.Attributes;
using Sprinto.Server.Validation;
using System.ComponentModel.DataAnnotations;

namespace Sprinto.Server.DTOs
{
    public class TaskDTO
    {
        private string _title = null!;
        private string _description = null!;
        private string _priority = null!;

        [Required(ErrorMessage = "Title is required")]
        [MinLength(3, ErrorMessage = "Title should have at least 3 characters")]
        [StringLength(100, ErrorMessage = "Title must not exceed 100 characters")]
        public string Title
        {
            get => _title;
            set { _title = value?.Trim() ?? string.Empty; }
        }

        public string Description
        {
            get => _description;
            set { _description = value?.Trim() ?? string.Empty; }
        }

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
        public string Priority
        {
            get => _priority;
            set { _priority = value?.Trim() ?? string.Empty; }
        }
    }
}
