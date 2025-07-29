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

        [BsonElement("deadline")]
        public DateTime Deadline { get; set; }

        [BsonElement("maintainer_id")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string TeamLead { get; set; } = null!;

        [BsonElement("assignees")]
        public List<AssigneeDTO> Assignees { get; set; } = [];

        [BsonElement("created_by")]
        public Creation CreatedBy { get; set; } = null!;

        public Project(ProjectDTO dto, string id, string name)
        {
            Title = dto.Title;
            Alias = GetInitialsFromName(dto.Title);
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

        // Generates alias for a project from it's title
        private static string GetInitialsFromName(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                return string.Empty;

            var words = name
                .Trim()
                .Split([' '], StringSplitOptions.RemoveEmptyEntries);

            if (words.Length == 1)
            {
                var word = words[0];
                return word.Length >= 3
                    ? $"{char.ToUpper(word[0])}{char.ToUpper(word[1])}{char.ToUpper(word[^1])}"
                    : word.ToUpper(); // fallback for short words
            }
            else if (words.Length == 2)
            {
                var first = words[0];
                var second = words[1];
                return $"{char.ToUpper(first[0])}{char.ToUpper(second[0])}{char.ToUpper(second[^1])}";
            }
            else
            {
                var first = words[0];
                var second = words[1];
                var last = words[^1];
                return $"{char.ToUpper(first[0])}{char.ToUpper(second[0])}{char.ToUpper(last[^1])}";
            }
        }
    }
}
