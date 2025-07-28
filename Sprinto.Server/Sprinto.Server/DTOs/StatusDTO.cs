using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Sprinto.Server.Validation;
using System.ComponentModel.DataAnnotations;

namespace Sprinto.Server.DTOs
{
    public class StatusDTO
    {
        private string _title = null!;

        [Required(ErrorMessage = "Please provide status title")]
        [BsonElement("title")]
        public string Title
        {
            get { return _title; }
            set { _title = value?.Trim() ?? string.Empty; }
        }
    }

    public class StatusReq
    {
        private string _title = null!;

        [BsonRepresentation(BsonType.ObjectId)]
        [Required(ErrorMessage = "Please provide status Id")]
        [ValidObjectId(ErrorMessage = "Status Id must be a valid MongoDB ObjectId")]
        [BsonElement("_id")]
        public string? Id { get; set; }


        [Required(ErrorMessage = "Please provide status title")]
        [BsonElement("title")]
        public string Title
        {
            get { return _title; }
            set { _title = value?.Trim() ?? string.Empty; }
        }
    }
}
