﻿using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Sprinto.Server.Validation;
using System.ComponentModel.DataAnnotations;

namespace Sprinto.Server.Models
{
    public class Creation
    {
        [Required(ErrorMessage = "Creator's user ID is required")]
        [BsonElement("user_id")]
        [ValidObjectId(ErrorMessage = "UserId must be a valid 24-character MongoDB ObjectId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string UserId { get; set; } = null!;

        [Required(ErrorMessage = "Creator's name is required")]
        [StringLength(100, ErrorMessage = "User name must be at most 100 characters")]
        [BsonElement("user_name")]
        public string UserName { get; set; } = null!;

        [Required(ErrorMessage = "CreatedAt timestamp is required")]
        [BsonElement("time")]
        public DateTime Time { get; set; } = DateTime.UtcNow;
    }
}