using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Sprinto.Server.Validation;
using System.ComponentModel.DataAnnotations;

namespace Sprinto.Server.DTOs
{
    public class AssigneeDTO
    {
        private string _name = null!;

        [BsonRepresentation(BsonType.ObjectId)]
        [Required(ErrorMessage = "Please provide assignee Id")]
        [ValidObjectId(ErrorMessage = "Assignee Id must be a valid MongoDB ObjectId")]
        [BsonElement("_id")]
        public string? Id { get; set; }


        [Required(ErrorMessage = "Please provide assignee name")]
        [BsonElement("name")]
        public string Name
        {
            get { return _name; }
            set { _name = value?.Trim() ?? string.Empty; }
        }
    }
}
