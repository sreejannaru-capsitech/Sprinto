using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Sprinto.Server.DTOs;

namespace Sprinto.Server.Models
{
    public class Status
    {
        [BsonId]
        [BsonElement("_id")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("title")]
        public string Title { get; set; } = null!;

        [BsonElement("created_by")]
        public Creation CreatedBy { get; set; } = null!;


        // Custom Constructor
        public Status(StatusDTO dto, string id, string name)
        {
            Title = dto.Title;
            CreatedBy = new Creation(id, name);
        }

        public Status() { }
    }
}
