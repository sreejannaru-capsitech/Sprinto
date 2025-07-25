using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Sprinto.Server.DTOs;
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
        public DateTime Deadline { get; set; }

        [BsonElement("maintainer_id")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string TeamLead { get; set; } = null!;

        [BsonElement("assignees")]
        [BsonRepresentation(BsonType.ObjectId)]
        public List<string> Assignees { get; set; } = [];

        [BsonElement("created_by")]
        public Creation CreatedBy { get; set; } = null!;

        public Project(ProjectDTO dto, string id, string name)
        {
            Title = dto.Title;
            Description = dto.Description;
            IsCompleted = dto.IsCompleted ?? false;
            TeamLead = dto.TeamLead;
            Assignees = dto.Assignees;
            CreatedBy = new Creation
            {
                UserId = id,
                UserName = name
            };
        }

        public Project() { }
    }
}
