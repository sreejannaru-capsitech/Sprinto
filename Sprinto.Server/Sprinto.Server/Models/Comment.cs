using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Sprinto.Server.DTOs;

namespace Sprinto.Server.Models
{
    public class Comment
    {
       

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        [BsonElement("_id")]
        public string? Id { get; set; }

        [BsonElement("content")]
        public string Content { get; set; } = null!;

        [BsonElement("is_edited")]
        [BsonIgnoreIfDefault]
        public bool? IsEdited { get; set; }

        [BsonElement("created_by")]
        public Creation CreatedBy { get; set; } = null!;

        // Custom Constructor
        public Comment(CommentDTO dto, string id, string name)
        {
            Content = dto.Content;
            IsEdited = dto.IsEdited;
            CreatedBy = new Creation
            {
                UserId = id,
                UserName = name
            };
        }

        public Comment() { }
    }
}
