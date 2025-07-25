using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Sprinto.Server.Models;
using Sprinto.Server.Validation;
using System.ComponentModel.DataAnnotations;

namespace Sprinto.Server.DTOs
{
    public class ProjectDTO
    {
        private string _title = null!;
        private string _description = null!;

        [Required(ErrorMessage = "Title is required")]
        [MinLength(3, ErrorMessage = "Title should have at least 3 characters")]
        [StringLength(100, ErrorMessage = "Title must not exceed 100 characters")]
        [BsonElement("title")]
        public string Title 
        { get => _title;  
            set { _title = value?.Trim() ?? string.Empty; } 
        }

        [Required(ErrorMessage = "Description is required")]
        [MinLength(3, ErrorMessage = "Description should have at least 3 characters")]
        [BsonElement("description")]
        public string Description
        {
            get => _description;
            set { _description = value?.Trim() ?? string.Empty; }
        }

        [Required(ErrorMessage = "Deadline is required")]
        [BsonElement("deadline")]
        public DateOnly Deadline { get; set; }

        [ValidObjectId(ErrorMessage = "maintainerId must be a valid MongoDB ObjectId")]
        [BsonElement("maintainer_id")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string TeamLead { get; set; } = null!;

        [BsonElement("assignees")]
        [ValidObjectIdList(ErrorMessage = "All Assignee IDs must be valid MongoDB ObjectIds")]
        [BsonRepresentation(BsonType.ObjectId)]
        public List<string> Assignees { get; set; } = [];
    }
}
