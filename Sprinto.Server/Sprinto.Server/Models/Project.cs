using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Sprinto.Server.DTOs;


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

        [BsonElement("alias")]
        public string Alias { get; set; } = null!;

        [BsonIgnoreIfDefault]
        [BsonElement("description")]
        public string Description { get; set; } = null!;

        [BsonIgnoreIfDefault]
        [BsonElement("is_completed")]
        public bool IsCompleted { get; set; }

        [BsonElement("start_date")]
        [BsonIgnoreIfNull]
        public DateOnly? StartDate { get; set; }

        [BsonElement("deadline")]
        [BsonIgnoreIfNull]
        public DateOnly? Deadline { get; set; }

        [BsonElement("maintainer")]
        public AssigneeDTO TeamLead { get; set; } = null!;

        [BsonElement("assignees")]
        public List<AssigneeDTO> Assignees { get; set; } = [];

        [BsonElement("created_by")]
        public Creation CreatedBy { get; set; } = null!;

        public Project(ProjectDTO dto, string id, string name)
        {
            Title = dto.Title;
            Alias = dto.Alias;
            Description = dto.Description;
            IsCompleted = dto.IsCompleted ?? false;
            StartDate = dto.StartDate;
            Deadline = dto.Deadline;
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
