using Sprinto.Server.Common;
using Sprinto.Server.Models;


namespace Sprinto.Server.Extensions
{
    public static class ResponseExtension
    {
        public static void HandleException<T>
            (this ApiResponse<T> response, Exception ex)
        {
            response.Message = ex.Message;
            response.Status = false;
            response.Errors = ex.InnerException;
        }

        public static ApiResponse<T> HandleValidationError<T>
            (this ApiResponse<T> response, object error)
        {
            response.Message = Constants.Messages.BadRequest;
            response.Status = false;
            response.Errors = error;

            return response;
        }
    }
}
