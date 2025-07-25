﻿using Microsoft.Extensions.Options;
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

        /// <summary>
        /// Updates the fields of a <see cref="Project"/> document in the database with the values provided in the DTO.
        /// </summary>
        /// <param name="id">The unique identifier of the project to update.</param>
        /// <param name="dto">The data transfer object containing updated field values.</param>
        /// <returns>The updated <see cref="Project"/> document after applying changes.</returns>
        /// <exception cref="Exception">Thrown when the project with the specified ID is not found or an error occurs during the update.</exception>
        public async Task<Project> UpdateAsync(string id, ProjectDTO dto)
        {
            try
            {
                var update = Builders<Project>.Update
                    .Set(p => p.Title, dto.Title)
                    .Set(p => p.Description, dto.Description)
                    .Set(p => p.IsCompleted, dto.IsCompleted ?? false)
                    .Set(p => p.Deadline, dto.Deadline)
                    .Set(p => p.TeamLead, dto.TeamLead)
                    .Set(p => p.Assignees, dto.Assignees);

                var options = new FindOneAndUpdateOptions<Project>
                {
                    ReturnDocument = ReturnDocument.After
                };

                var updatedProject = await _projects.FindOneAndUpdateAsync(
                    x => x.Id == id,
                    update,
                    options
                );

                return updatedProject ?? throw new KeyNotFoundException($"Project with id {id} not found");
            }
            catch (KeyNotFoundException)
            {
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating project with id {ProjectId}", id);
                throw new Exception("Could not update project");
            }
        }
    }
}
