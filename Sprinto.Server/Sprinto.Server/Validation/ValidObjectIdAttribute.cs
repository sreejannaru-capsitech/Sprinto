using MongoDB.Bson;
using System.ComponentModel.DataAnnotations;

namespace Sprinto.Server.Validation
{
    public class ValidObjectIdAttribute : ValidationAttribute
    {
        public override bool IsValid(object? value)
        {
            return value is string id && ObjectId.TryParse(id, out _);
        }
    }
}
