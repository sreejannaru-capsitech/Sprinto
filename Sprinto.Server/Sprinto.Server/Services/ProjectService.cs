using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Sprinto.Server.DTOs;
using Sprinto.Server.Models;

namespace Sprinto.Server.Services
{
    public class ProjectService
    {
        private readonly IMongoCollection<Project> _projects;
        private readonly ILogger<ProjectService> _logger;

        public ProjectService(IMongoClient mongoCLient,
            IOptions<DatabaseSettings> dbsettings,
            ILogger<ProjectService> logger)
        {
            var mongoDB = mongoCLient.GetDatabase(dbsettings.Value.DatabaseName);

            _projects = mongoDB.GetCollection<Project>(dbsettings.Value.ProjectsCollection);
            _logger = logger;
        }

        /// <summary>
        /// Asynchronously creates a new project using the provided data transfer object (DTO),
        /// along with the creator's user ID and username.
        /// </summary>
        /// <param name="dto">Contains the project details required for creation.</param>
        /// <param name="userId">The unique identifier of the user creating the project.</param>
        /// <param name="userName">The display name of the user creating the project.</param>
        /// <returns>The newly created <see cref="Project"/> entity.</returns>
        /// <exception cref="Exception">
        /// Thrown when an unexpected error occurs during project creation.
        /// </exception>
        /// <remarks>
        /// This method logs internal exceptions and wraps them before rethrowing.
        /// It's recommended to validate <paramref name="dto"/> before calling this method.
        /// Consider using a domain-specific exception type for better error context.
        /// </remarks>
        public async Task<Project> CreateAsync(ProjectDTO dto, string userId, string userName)
        {
            try
            {
                var user = new Project(dto, userId, userName);
                await _projects.InsertOneAsync(user);

                return user;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating new project");
                throw new Exception("Could not create project");
            }
        }
    }
}
