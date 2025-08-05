using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace Sprinto.Server.DTOs
{
    public class CommentDTO
    {
        private string _content = null!;

        [Required (ErrorMessage = "Please provide comment content")]
        [BsonElement("content")]
        public string Content
        {
            get => _content;
            set { _content = value?.Trim() ?? string.Empty; }
        }

        [BsonElement("is_edited")]
        [BsonIgnoreIfDefault]
        public bool? IsEdited { get; set; }

        public DateTime? UpdatedAt { get; set; }
    }
}
