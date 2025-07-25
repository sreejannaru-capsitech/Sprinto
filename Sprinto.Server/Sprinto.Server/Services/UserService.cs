using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Sprinto.Server.Common;
using Sprinto.Server.DTOs;
using Sprinto.Server.Extensions;
using Sprinto.Server.Models;

namespace Sprinto.Server.Services
{
    public class UserService
    {
        private readonly IMongoCollection<User> _users;
        private readonly ILogger<UserService> _logger;
        private readonly JwtService _jwtService;

        public UserService(IMongoClient mongoCLient,
            IOptions<DatabaseSettings> dbsettings,
            JwtService jwtService,
            ILogger<UserService> logger)
        {
            var mongoDB = mongoCLient.GetDatabase(dbsettings.Value.DatabaseName);

            _users = mongoDB.GetCollection<User>(dbsettings.Value.UsersCollection);
            _jwtService = jwtService;
            _logger = logger;
        }

        /// <summary>
        /// Asynchronously creates a new user record in the database using the provided user DTO,
        /// along with the creator's unique identifier and name.
        /// </summary>
        /// <param name="dto">The data transfer object containing details for user creation.</param>
        /// <param name="userId">The unique identifier of the user initiating the creation.</param>
        /// <param name="userName">The name of the user initiating the creation.</param>
        /// <returns>A <see cref="User"/> representing the newly created database record.</returns>
        /// <exception cref="Exception">
        /// Thrown when the creation process fails due to a database or unexpected internal error.
        /// </exception>
        /// <remarks>
        /// This method logs the original exception and wraps it in a generic exception for controlled propagation.
        /// Consider validating <paramref name="dto"/> before invoking this method. For better context,
        /// replacing the generic <c>Exception</c> with a domain-specific type is recommended.
        /// </remarks>
        public async Task<User> CreateAsync(UserDTO dto, string userId, string userName)
        {
            try
            {
                var user = new User(dto, userId, userName);
                await _users.InsertOneAsync(user);

                return user;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating new user");
                throw new Exception("Could not create user");
            }
        }

        /// <summary>
        /// Retrieves a paginated list of users from the database, excluding sensitive fields.
        /// </summary>
        /// <param name="pageNumber">The page index starting from 1.</param>
        /// <param name="pageSize">The number of records to return per page.</param>
        /// <returns>
        /// A <see cref="PagedResult{UserResponse}"/> containing the list of users, total count, and total pages.
        /// </returns>
        /// <exception cref="Exception">
        /// Thrown when user retrieval fails due to a database or internal error.
        /// </exception>
        public async Task<PagedResult<UserResponse>> GetAsync(int pageNumber, int pageSize)
        {
            try
            {
                var totalCount = await _users.CountDocumentsAsync(_ => true);
                var users = await _users
                    .Find(_ => true)
                    .Skip((pageNumber - 1) * pageSize)
                    .Limit(pageSize)
                    .ToListAsync();

                var userResponses = users.Select(u => u.ToUserResponse()).ToList();

                var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

                return new PagedResult<UserResponse>
                {
                    Items = userResponses,
                    TotalCount = (int)totalCount,
                    TotalPages = totalPages
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving users");
                throw new Exception("Could not retrieve users from database");
            }
        }

        public async Task<User> GetAsync(string id)
        {
            try
            {
                return await _users.Find(x => x.Id == id).FirstOrDefaultAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving user");
                throw new Exception("Could not retrieve the user from database");
            }
        }

        /// <summary>
        /// Validates the user's login credentials against the database records.
        /// </summary>
        /// <param name="request">An object containing the user's login details (email and password).</param>
        /// <returns>
        /// The matching <see cref="User"/> object if credentials are valid; otherwise, <c>null</c>.
        /// </returns>
        /// <exception cref="Exception">
        /// Thrown when an error occurs while attempting to verify credentials against the database.
        /// </exception>
        public async Task<User?> CheckCredentials(UserLoginRequest request)
        {
            try
            {
                var user = await _users.Find(x => x.Email == request.Email).FirstOrDefaultAsync();

                if (user == null) { return null; }

                bool isCorrect = BCrypt.Net.BCrypt.EnhancedVerify(request.Password, user.Password);

                if (!isCorrect)
                {
                    return null;
                }

                return user;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking credentials for {Email}", request.Email);
                throw new Exception("Could not verify user credentials");
            }
        }


        /// <summary>
        /// Updates the specified user's password by generating a new hashed value and storing it in the database.
        /// </summary>
        /// <param name="user">The user whose password is to be updated.</param>
        /// <param name="newPassword">The new plain-text password to be hashed and saved.</param>
        /// <returns>
        /// An asynchronous task that completes when the password update operation is finished.
        /// </returns>
        /// <exception cref="Exception">
        /// Thrown if an error occurs during hashing or database update.
        /// </exception>
        public async Task ChangePassword(User user, string newPassword)
        {
            try
            {
                string newHash = BCrypt.Net.BCrypt.EnhancedHashPassword(newPassword, workFactor: 15);

                var filter = Builders<User>.Filter.Eq(u => u.Id, user.Id);
                var update = Builders<User>.Update.Set(u => u.Password, newHash);

                await _users.UpdateOneAsync(filter, update);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error changing password for {Email}", user.Email);
                throw new Exception("Could not change user password");
            }
        }


        /// <summary>
        /// Manages the authentication session for a user. 
        /// If a refresh token is provided, validates its existence and expiration status:
        /// - If valid, replaces it with a new refresh token.
        /// - If expired, deletes the old session.
        /// If no token is provided, creates a new session.
        /// </summary>
        /// <param name="user">The user whose session is being managed.</param>
        /// <param name="ip">The IP address of the client initiating the session (optional).</param>
        /// <param name="refreshToken">An existing refresh token to validate and potentially replace (optional).</param>
        /// <returns>
        /// A <see cref="SessionTokens"/> object containing fresh access and refresh tokens.
        /// </returns>
        /// <exception cref="Exception">
        /// Thrown when the session is invalid, expired, or the database update cannot be completed.
        /// </exception>
        public async Task<SessionTokens> CheckAndCreateSession(User user, string? ip, string? refreshToken = null)
        {
            try
            {
                // If refresh token is provided, validate existence and expiration
                if (!string.IsNullOrEmpty(refreshToken))
                {
                    var existingSession = user.Sessions.Find(s => s.Token == refreshToken)
                        ?? throw new UnauthorizedAccessException(Constants.Messages.InvalidToken);

                    if (existingSession.ExpiresAt < DateTime.UtcNow)
                    {
                        // Delete expired session
                        var removeExpiredSession = Builders<User>.Update.PullFilter(u => u.Sessions,
                            Builders<Session>.Filter.Eq(s => s.Token, refreshToken));

                        await _users.UpdateOneAsync(
                            Builders<User>.Filter.Eq(u => u.Id, user.Id),
                            removeExpiredSession);

                        throw new UnauthorizedAccessException(Constants.Messages.InvalidToken);
                    }

                    // Valid session — remove old token before adding new one
                    var cleanupFilter = Builders<User>.Filter.Eq(u => u.Id, user.Id);
                    var cleanupUpdate = Builders<User>.Update.PullFilter(u => u.Sessions,
                        Builders<Session>.Filter.Eq(s => s.Token, refreshToken));

                    await _users.UpdateOneAsync(cleanupFilter, cleanupUpdate);
                }

                // Generate new tokens
                var accessToken = _jwtService.GenerateJwtToken(user, false);
                var newRefreshToken = _jwtService.GenerateJwtToken(user, true);

                var newSession = new Session
                {
                    ClientIP = ip,
                    ExpiresAt = newRefreshToken.ExpiryTime,
                    Token = newRefreshToken.Token
                };

                var sessionFilter = Builders<User>.Filter.Eq(u => u.Id, user.Id);
                var sessionUpdate = Builders<User>.Update.Push(u => u.Sessions, newSession);

                await _users.UpdateOneAsync(sessionFilter, sessionUpdate);

                return new SessionTokens
                {
                    AccessToken = accessToken.Token,
                    RefreshToken = newRefreshToken.Token
                };
            }
            catch (UnauthorizedAccessException)
            {
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error managing session for {Email}", user.Email);
                throw new Exception("Could not manage user session.");
            }
        }

    }
}
