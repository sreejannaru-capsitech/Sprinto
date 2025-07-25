using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using Sprinto.Server.Common;
using Sprinto.Server.DTOs;
using Sprinto.Server.Extensions;
using Sprinto.Server.Models;
using Sprinto.Server.Services;
using System.Security.Claims;

namespace Sprinto.Server.Controllers
{
    [Route("api/projects")]
    [ApiController]
    public class ProjectsController(ProjectService projectService) : ControllerBase
    {
        private readonly ProjectService _projectService = projectService;

        // Create / Register new project ( Admin Only )
        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<ApiResponse<Project>>
            Post([FromBody] ProjectDTO newProject)
        {
            var response = new ApiResponse<Project>();

            var _result = ValidateModelState;
            if (_result != null) return response.HandleValidationError(_result);

            try
            {
                // Extract ID and Name of current admin
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var userName = User.FindFirstValue(ClaimTypes.Name);

                if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(userName))
                    throw new Exception(Constants.Messages.InvalidToken);

                var createdProject = await _projectService.CreateAsync(newProject, userId, userName);

                response.Message = Constants.Messages.Created;
                response.Result = createdProject;
            }
            catch (Exception ex)
            {
                response.HandleException(ex);
            }
            return response;
        }

        // Update an existing project ( Admin Only )
        [HttpPost("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<ApiResponse<Project>>
            Put(string id, [FromBody] ProjectDTO newProject)
        {
            var response = new ApiResponse<Project>();

            var _result = ValidateModelState;
            if (_result != null) return response.HandleValidationError(_result);

            try
            {
                if (!ObjectId.TryParse(id, out _))
                    throw new Exception("Please provide valid id");

                var project = await _projectService.UpdateAsync(id, newProject);
                response.Message = Constants.Messages.Updated;
                response.Result = project;
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
