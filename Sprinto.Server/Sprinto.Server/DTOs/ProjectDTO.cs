using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Sprinto.Server.Validation;
using System.ComponentModel.DataAnnotations;

namespace Sprinto.Server.DTOs
{
    public class ProjectDTO
    {
        private string _title = null!;
        private string _description = null!;
        private string _alias = null!;

        [Required(ErrorMessage = "Title is required")]
        [MinLength(3, ErrorMessage = "Title should have at least 3 characters")]
        [StringLength(100, ErrorMessage = "Title must not exceed 100 characters")]
        [BsonElement("title")]
        public string Title
        {
            get => _title;
            set { _title = value?.Trim() ?? string.Empty; }
        }

        [Required(ErrorMessage = "Please provide project alias")]
        [MinLength(3, ErrorMessage = "Alias should have exactly 3 characters")]
        [StringLength(3, ErrorMessage = "Alias should have exactly 3 characters")]
        public string Alias
        {
            get => _alias;
            set { _alias = value?.Trim() ?? string.Empty; }
        }

        [Required(ErrorMessage = "Description is required")]
        [MinLength(3, ErrorMessage = "Description should have at least 3 characters")]
        [BsonElement("description")]
        public string Description
        {
            get => _description;
            set { _description = value?.Trim() ?? string.Empty; }
        }

        [BsonIgnoreIfDefault]
        [BsonElement("is_completed")]
        public bool? IsCompleted { get; set; }

        [BsonElement("deadline")]
        public DateTime? Deadline { get; set; }

        public DateTime? StartDate { get; set; }

        [Required(ErrorMessage = "Please provide project maintainer details")]
        [BsonElement("maintainer")]
        [ValidObjectId(ErrorMessage = "Provide valid Team Lead User Id")]
        public string TeamLead { get; set; } = null!;

        [BsonElement("assignees")]
        [ValidObjectIdList(ErrorMessage = "Provide valid list of assignee Ids")]
        public string[] Assignees { get; set; } = [];
    }
}
