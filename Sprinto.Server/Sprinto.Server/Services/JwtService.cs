using Microsoft.IdentityModel.Tokens;
using Sprinto.Server.Common;
using Sprinto.Server.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Sprinto.Server.Services
{
    public class JwtService
    {
        private readonly IConfiguration _config;

        public JwtService(IConfiguration config) => _config = config;

        /// <summary>
        /// Generates a JWT access or refresh token for the specified user and returns it with the expiry timestamp.
        /// </summary>
        /// <param name="user">The user object containing identity and role information.</param>
        /// <param name="isRefresh">
        /// A boolean flag indicating whether to generate a refresh token (<c>true</c>) or an access token (<c>false</c>).
        /// </param>
        /// <returns>
        /// A <see cref="TokenResponse"/> object containing the serialized JWT and its expiration time.
        /// </returns>
        /// <exception cref="ArgumentNullException">
        /// Thrown if the corresponding JWT secret is not configured in application settings.
        /// </exception>
        public TokenResponse GenerateJwtToken(User user, bool isRefresh)
        {
            var secretByte = _config[isRefresh ?
                Constants.Config.RefreshSecret : Constants.Config.AccessSecret]
                ?? throw new ArgumentNullException(Constants.Messages.JwtNotConfigured);

            var key = Encoding.UTF8.GetBytes(secretByte);
            var tokenHandler = new JwtSecurityTokenHandler();

            var claims = new List<Claim>
            {
                new(ClaimTypes.Name, user.Name),
                new(ClaimTypes.NameIdentifier, user.Id!.ToString()),
                new(ClaimTypes.Email, user.Email),
                new(ClaimTypes.Authentication, isRefresh ?
                    Constants.Config.RefreshToken : Constants.Config.AccessToken),
                new(ClaimTypes.Role, user.Role.ToString())
            };

            var expiry = isRefresh ? DateTime.UtcNow.AddDays(15) : DateTime.UtcNow.AddHours(1);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = expiry,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Audience = _config[Constants.Config.Audience],
                Issuer = _config[Constants.Config.Authority]
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var jwt = tokenHandler.WriteToken(token);

            return new TokenResponse
            {
                Token = jwt,
                ExpiryTime = expiry
            };
        }

        public ClaimsPrincipal? ValidateJwtToken(string token, bool isRefresh)
        {
            var secretByte = _config[isRefresh ?
                Constants.Config.RefreshSecret : Constants.Config.AccessSecret]
                ?? throw new ArgumentNullException(Constants.Messages.JwtNotConfigured);
            var key = Encoding.UTF8.GetBytes(secretByte);
            var tokenHandler = new JwtSecurityTokenHandler();

            try
            {
                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),

                    ValidateIssuer = true,
                    ValidIssuer = _config[Constants.Config.Authority],

                    ValidateAudience = true,
                    ValidAudience = _config[Constants.Config.Audience],

                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero // No tolerance for expired tokens
                };

                // Validate the token
                var principal = tokenHandler.ValidateToken(token, validationParameters, out var validatedToken);

                // Make sure the token is a JWT token
                if (!(validatedToken is JwtSecurityToken jwtToken))
                {
                    return null;
                }

                // Check token type claim
                var tokenTypeClaim = principal.FindFirst(ClaimTypes.Authentication)?.Value;
                if (tokenTypeClaim == null)
                {
                    return null;
                }

                if (isRefresh && tokenTypeClaim != Constants.Config.RefreshToken)
                {
                    return null;
                }
                else if (!isRefresh && tokenTypeClaim != Constants.Config.AccessToken)
                {
                    return null;
                }

                return principal;
            }
            catch
            {
                // Token validation failed
                return null;
            }
        }
    }
}
