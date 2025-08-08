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
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc, DateOnly = true)]
        public DateTime? StartDate { get; set; }

        [BsonElement("deadline")]
        [BsonIgnoreIfNull]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc, DateOnly = true)]
        public DateTime? Deadline { get; set; }

        [BsonElement("maintainer")]
        public Assignee TeamLead { get; set; } = null!;

        [BsonElement("assignees")]
        public List<Assignee> Assignees { get; set; } = [];

        [BsonElement("created_by")]
        public Creation CreatedBy { get; set; } = null!;

        public Project
            (ProjectDTO dto, Creation creator, Assignee tl, List<Assignee> emps)
        {
            Title = dto.Title;
            Alias = dto.Alias;
            Description = dto.Description;
            IsCompleted = dto.IsCompleted ?? false;
            StartDate = dto.StartDate;
            Deadline = dto.Deadline;
            TeamLead = tl;
            Assignees = emps;
            CreatedBy = creator;
        }

        public Project() { }
    }
}
