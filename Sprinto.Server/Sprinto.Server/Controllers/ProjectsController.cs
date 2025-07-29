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
    //[ApiController]
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

        // Get all projects from database (Admin Only)
        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<ApiResponse<List<Project>>> GetAsync()
        {
            var response = new ApiResponse<List<Project>>();

            try
            {
                var projects = await _projectService.GetAsync();
                response.Message = Constants.Messages.Success;
                response.Result = projects;
            }
            catch (Exception ex)
            {
                response.HandleException(ex);
            }
            return response;
        }

        // Get all projects assigned to the specified user.
        [HttpGet("assigned")]
        [Authorize(Roles = "employee,teamLead")]
        public async Task<ApiResponse<List<Project>>> GetAssignedAsync()
        {
            var response = new ApiResponse<List<Project>>();

            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    throw new Exception(Constants.Messages.InvalidToken);

                var projects = await _projectService.GetAssignedAsync(userId);
                response.Message = Constants.Messages.Success;
                response.Result = projects;
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

        // Deletes the project with the specified ID. (Admin Only)
        [HttpPost("{id}/delete")]
        [Authorize(Roles = "admin")]
        public async Task<ApiResponse<Project>> DeleteAsync(string id)
        {
            var response = new ApiResponse<Project>();
            try
            {
                var project = await _projectService.DeleteAsync(id);
                response.Message = Constants.Messages.Deleted;
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
                    var errorMessages = ModelState
                        .Where(ms => ms.Value?.Errors.Count > 0)
                        .SelectMany(kvp => kvp.Value!.Errors.Select(e => e.ErrorMessage))
                        .ToArray();

                    return errorMessages;
                }

                return null;
            }
        }
    }
}
