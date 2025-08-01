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
    public class ProjectsController
        (ProjectService projectService) : ControllerBase
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

        // Get projects based on user role
        // Admins get all project list
        // Other users get list of assigned projects
        [HttpGet]
        [Authorize]
        public async Task<ApiResponse<List<Project>>> GetProjectsAsync()
        {
            var response = new ApiResponse<List<Project>>();

            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var userRole = User.FindFirstValue(ClaimTypes.Role);

                if (string.IsNullOrEmpty(userRole))
                    throw new Exception("User role is missing");

                if (userRole == "admin")
                {
                    var projects = await _projectService.GetAsync();
                    response.Result = projects;
                }
                else
                {
                    if (string.IsNullOrEmpty(userId))
                        throw new Exception(Constants.Messages.InvalidToken);

                    var projects = await _projectService.GetAssignedAsync(userId);
                    response.Result = projects;
                }

                response.Message = Constants.Messages.Success;
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

        [HttpGet("{id}/tasks")]
        [Authorize]
        public async Task<ApiResponse<List<TaskResponse>>>
            GetTaskItems(string id)
        {
            var response = new ApiResponse<List<TaskResponse>>();

            try
            {
                var tasks = await _projectService.GetTaskItemsAsync(id);
                response.Message = Constants.Messages.Success;
                response.Result = [.. tasks.Select(u => u.ToTaskResponse())]; ;
            }
            catch (Exception ex)
            {
                response.HandleException(ex);
            }
            return response;
        }

        [HttpGet("{id}/activities")]
        [Authorize]
        public async Task<ApiResponse<List<TaskActivity>>>
            GetActivities(string id)
        {
            var response = new ApiResponse<List<TaskActivity>>();

            try
            {
                var activities = await _projectService.GetActivitiesAsync(id);
                response.Message = Constants.Messages.Success;
                response.Result = activities;
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
