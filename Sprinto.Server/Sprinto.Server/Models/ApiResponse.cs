﻿using Sprinto.Server.DTOs;

namespace Sprinto.Server.Models
{
    public class ApiResponse<T>
    {
        public bool Status { get; set; } = true;
        public T? Result { get; set; }
        public object? Errors { get; set; }
        public string Message { get; set; } = null!;
    }

    public class PagedResult<T>
    {
        public List<T> Items { get; set; } = [];
        public int TotalCount { get; set; }
        public int TotalPages { get; set; }
    }

    public class SessionTokens
    {
        public string AccessToken { get; set; } = null!;
        public string RefreshToken { get; set; } = null!;
    }

    public class LoginResponse
    {
        public string AccessToken { get; set; } = null!;
        public UserResponse? User { get; set; }
    }

    public class TokenResponse
    {
        public string Token { get; set; } = null!;
        public DateTime ExpiryTime { get; set; }
    }
}
