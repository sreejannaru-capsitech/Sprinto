namespace Sprinto.Server.Common
{
    public static class Constants
    {
        public static class Messages
        {
            public const string Success = "Success";
            public const string Created = "New Resource was created";
            public const string Updated = "Resource was updated";
            public const string Deleted = "Resource was deleted";
            public const string NotFound = "Resource not found";
            public const string LogOut = "Logged out from session successfully";
            public const string BadRequest = "Bad request payload";
            public const string Unauthorized = "You are not authorized";
            public const string InvalidToken = "Invalid or expired token";
            public const string InvalidCredentials = "Invalid Credentials";
            public const string InternalServerError = "An unexpected error occurred";
            public const string JwtNotConfigured = "JWT secret key is not configured";
        }


        public static class Roles
        {
            public const string Admin = "admin";
            public const string TeamLead = "teamLead";
            public const string Employee = "employee";
        }

        public static string[] userRoles = [Roles.Employee, Roles.Admin, Roles.TeamLead];

        public static class Config
        {
            public const string RefreshSecret = "Api:JWT_Refresh_Secret";
            public const string AccessSecret = "Api:JWT_Access_Secret";
            public const string Authority = "Api:Authority";
            public const string Audience = "Api:Audience";

            public const string AccessToken = "__AccessToken__";
            public const string RefreshToken = "__RefreshToken__";

            public const string COOKIE_NAME = "__sprinto_refresh__";
        }
    }
}
