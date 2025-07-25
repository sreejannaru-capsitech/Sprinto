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

}
