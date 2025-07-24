using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sprinto.Server.Common;
using Sprinto.Server.DTOs;
using Sprinto.Server.Extensions;
using Sprinto.Server.Models;
using Sprinto.Server.Services;
using System.Security.Claims;

namespace Sprinto.Server.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UsersController(UserService userService, JwtService jwtService, IWebHostEnvironment env) : ControllerBase
    {
        private readonly UserService _userService = userService;
        private readonly JwtService _jwtService = jwtService;
        private readonly IWebHostEnvironment _env = env;


        // Create / Register new users ( Admin Only )
        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<ApiResponse<UserResponse>>
            Post([FromBody] UserDTO newUser)
        {
            var response = new ApiResponse<UserResponse>();

            var _result = ValidateModelState;
            if (_result != null) return response.HandleValidationError(_result);

            try
            {
                var createdEmployee = await _userService.CreateAsync(newUser);

                response.Message = Constants.Messages.Created;
                response.Result = createdEmployee.ToUserResponse();
            }
            catch (Exception ex)
            {
                response.HandleException(ex);
            }
            return response;
        }


        [HttpGet]
        public async Task<ApiResponse<PagedResult<UserResponse>>>
        GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var response = new ApiResponse<PagedResult<UserResponse>>();
            try
            {
                var students = await _userService.GetAsync(page, pageSize);

                response.Message = Constants.Messages.Success;
                response.Result = students;
            }
            catch (Exception ex)
            {
                response.HandleException(ex);
            }
            return response;
        }

        // Login Route which generates access and refresh token
        [HttpPost("/api/auth/login")]
        public async Task<ApiResponse<LoginResponse>> Login([FromBody] UserLoginRequest request)
        {
            var response = new ApiResponse<LoginResponse>();
            var _result = ValidateModelState;
            if (_result != null) return response.HandleValidationError(_result);

            try
            {
                var user = await _userService.CheckCredentials(request) 
                    ?? throw new Exception(Constants.Messages.InvalidCredentials);

                // Get the IP Address from HTTP Context
                var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
                var sessions = await _userService.CheckAndCreateSession(user, ipAddress);

                response.Message = Constants.Messages.Success;
                response.Result = new LoginResponse
                {
                    AccessToken = sessions.AccessToken
                };

                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = !_env.IsDevelopment(),
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTime.UtcNow.AddDays(15),
                    Path = "/api/auth/me"
                };

                Response.Cookies.Append(Constants.Config.COOKIE_NAME, sessions.RefreshToken, cookieOptions);
            }
            catch (Exception ex)
            {
                response.HandleException(ex);
            }
            return response;
        }


        // Access Token Refresh route and used to get profile information
        [HttpGet("/api/auth/me")]
        public async Task<ApiResponse<LoginResponse>> RefreshAccessToken()
        {
            var response = new ApiResponse<LoginResponse>();
            try
            {
                // Check if request contains the refresh token cookie
                if (!Request.Cookies.TryGetValue(Constants.Config.COOKIE_NAME, out var refreshToken))
                {
                    throw new UnauthorizedAccessException(Constants.Messages.Unauthorized);
                }

                // Verify the jwt token
                var principal = _jwtService.ValidateJwtToken(refreshToken, isRefresh: true)
                    ?? throw new UnauthorizedAccessException(Constants.Messages.InvalidToken);

                var userId = principal.FindFirstValue(ClaimTypes.NameIdentifier);
                // Check if the userId is null
                if (string.IsNullOrEmpty(userId))
                {
                    throw new UnauthorizedAccessException(Constants.Messages.InvalidToken);
                }

                var user = await _userService.GetAsync(userId) ?? throw new Exception(Constants.Messages.NotFound);

                // Get the IP Address from HTTP Context
                var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
                var sessions = await _userService.CheckAndCreateSession(user, ipAddress, refreshToken);

                response.Message = Constants.Messages.Success;
                // Include the accesstoken and user object in the response
                response.Result = new LoginResponse
                {
                    AccessToken = sessions.AccessToken,
                    User = user.ToUserResponse(),
                };

                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = !_env.IsDevelopment(),
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTime.UtcNow.AddDays(15),
                    Path = "/api/auth/me"
                };

                Response.Cookies.Append(Constants.Config.COOKIE_NAME, sessions.RefreshToken, cookieOptions);
            }
            catch (Exception ex)
            {
                response.HandleException(ex);
            }
            return response;
        }


        // When user wants to change password
        [HttpPost("/api/auth/change-password")]
        public async Task<ApiResponse<string>> ChangePassword([FromBody] UserPasswordChangeRequest request)
        {
            var response = new ApiResponse<string>();
            var _result = ValidateModelState;
            if (_result != null) return response.HandleValidationError(_result);

            try
            {
                var _req = new UserLoginRequest
                {
                    Email = request.Email,
                    Password = request.OldPassword
                };

                var user = await _userService.CheckCredentials(_req) ?? throw new Exception(Constants.Messages.InvalidCredentials);

                await _userService.ChangePassword(user, request.NewPassword);
                response.Message = Constants.Messages.Success;
                response.Result = "Password was updated";
            }
            catch (Exception ex)
            {
                response.HandleException(ex);
            }
            return response;
        }

        private object? ValidateModelState
        {
            get
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState
                        .Where(ms => ms.Value?.Errors.Count > 0)
                        .ToDictionary(
                            kvp => kvp.Key,
                            kvp => kvp.Value!.Errors.Select(e => e.ErrorMessage).ToArray()
                        );

                    return errors;
                }

                return null;
            }
        }
    }
}
