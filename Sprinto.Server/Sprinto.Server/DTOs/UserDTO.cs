using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Sprinto.Server.Models;
using System.ComponentModel.DataAnnotations;

namespace Sprinto.Server.DTOs
{
    public class UserDTO
    {
        private string _name = null!;
        private string _email = null!;
        private string _role = null!;

        [Required(ErrorMessage = "Name is required")]
        [MinLength(3, ErrorMessage = "Name should have at least 3 characters")]
        [StringLength(100, ErrorMessage = "Name must not exceed 100 characters")]
        [BsonElement("name")]
        public string Name
        {
            get { return _name; }
            set { _name = value?.Trim() ?? string.Empty; }
        }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        [BsonElement("email")]
        public string Email
        {
            get => _email;
            set => _email = value?.Trim() ?? string.Empty;
        }

        [Required(ErrorMessage = "Please provide a user role")]
        [RegularExpression("^(?i)(employee|admin|teamLead)$", ErrorMessage = "Role must be employee, teamLead, or admin")]
        [BsonElement("role")]
        public string Role
        {
            get => _role;
            set => _role = value?.Trim() ?? string.Empty;
        }
    }

    public class UserResponse
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        [BsonElement("_id")]
        public string? Id { get; set; }

        [BsonElement("name")]
        public string Name { get; set; } = null!;

        [EmailAddress]
        [BsonElement("email")]
        public string Email { get; set; } = null!;

        [BsonElement("role")]
        public string Role { get; set; }

        [BsonElement("created_by")]
        public Creation CreatedBy { get; set; } = null!;
    }

    public class UserLoginRequest
    {
        private string _email = null!;
        private string _password = null!;

        [Required(ErrorMessage = "Please provide an email address")]
        [EmailAddress(ErrorMessage = "Please provide a proper email address")]
        public string Email
        {
            get => _email;
            set => _email = value?.Trim() ?? string.Empty;
        }

        [Required(ErrorMessage = "Please provide password")]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters long")]
        public string Password
        {
            get => _password;
            set => _password = value?.Trim() ?? string.Empty;
        }
    }

    public class UserPasswordChangeRequest
    {
        private string _email = null!;
        private string _new_password = null!;
        private string _old_password = null!;

        [Required(ErrorMessage = "Please provide an email address")]
        [EmailAddress(ErrorMessage = "Please provide a proper email address")]
        public string Email
        {
            get => _email;
            set => _email = value?.Trim() ?? string.Empty;
        }

        [Required(ErrorMessage = "Please provide old password")]
        [MinLength(6, ErrorMessage = "Old Password must be at least 6 characters long")]
        public string OldPassword
        {
            get => _old_password;
            set => _old_password = value?.Trim() ?? string.Empty;
        }

        [Required(ErrorMessage = "Please provide new password")]
        [MinLength(6, ErrorMessage = "New Password must be at least 6 characters long")]
        public string NewPassword
        {
            get => _new_password;
            set => _new_password = value?.Trim() ?? string.Empty;
        }
    }

}
