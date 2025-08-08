using MongoDB.Bson;
using System.Collections;
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

    public class ValidObjectIdListAttribute : ValidationAttribute
    {
        public override bool IsValid(object? value)
        {
            if (value is not IEnumerable ids)
                return false;

            foreach (var item in ids)
            {
                if (item is not string id || !ObjectId.TryParse(id, out _))
                    return false;
            }

            return true;
        }
    }

    public class ValidBase64StringAttribute : ValidationAttribute
    {
        public override bool IsValid(object? value)
        {
            if (value is not string str || string.IsNullOrWhiteSpace(str))
                return false;

            Span<byte> buffer = new Span<byte>(new byte[str.Length]);
            return Convert.TryFromBase64String(str, buffer, out _);
        }
    }
}
