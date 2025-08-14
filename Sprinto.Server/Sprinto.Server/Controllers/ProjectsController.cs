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


        // Check if alias exists
        [HttpGet("alias")]
        [Authorize(Roles = Constants.Roles.Admin)]
        public async Task<ApiResponse<bool>>
            CheckAlias([FromQuery] string? key)
        {
            var response = new ApiResponse<bool>();

            try
            {
                var res = await _projectService.CheckAliasAsync(key);
                response.Result = res;
                response.Message = Constants.Messages.Success;
            }
            catch (Exception ex)
            {
                response.HandleException(ex);
            }
            return response;
        }

        // Create / Register new project ( Admin Only )
        [HttpPost]
        [Authorize(Roles = Constants.Roles.Admin)]
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


        // Get all projects and status count ( admin only )
        [HttpGet("all")]
        [Authorize(Roles = Constants.Roles.Admin)]
        public async Task<ApiResponse<AllProjects>>
            GetAllProjects()
        {
            var response = new ApiResponse<AllProjects>();

            try
            {
                var res = await _projectService.GetAsync();
                response.Message = Constants.Messages.Success;
                response.Result = res;
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
                    response.Result = projects.Projects;
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
        [Authorize(Roles = Constants.Roles.Admin)]
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

        // Search Project by Name
        [HttpGet("search")]
        [Authorize(Roles = Constants.Roles.Admin)]
        public async Task<ApiResponse<List<Project>>>
            SearchProjects([FromQuery] string? query)
        {
            var response = new ApiResponse<List<Project>>();

            try
            {
                if (string.IsNullOrEmpty(query))
                {
                    var projects = await _projectService.GetAsync();
                    response.Result = projects.Projects;
                }
                else
                {
                    response.Result = await _projectService.SearchAsync(query);
                }

                response.Message = Constants.Messages.Success;
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

        // Get overview statistics of a project
        [HttpGet("{id}/overview")]
        [Authorize]
        public async Task<ApiResponse<ProjectOverview>>
            GetProjectOverview(string id)
        {
            var response = new ApiResponse<ProjectOverview>();
            try
            {
                if (!ObjectId.TryParse(id, out _))
                    throw new Exception("Please provide valid id");

                var tasks = await _projectService.GetProjectOverviewAsync(id);
                response.Message = Constants.Messages.Success;
                response.Result = tasks;
            }
            catch (Exception ex)
            {
                response.HandleException(ex);
            }
            return response;
        }

        // Get project team informations
        [HttpGet("{id}/team")]
        [Authorize]
        public async Task<ApiResponse<ProjectTeam>>
            GetProjectTeam(string id)
        {
            var response = new ApiResponse<ProjectTeam>();
            try
            {
                if (!ObjectId.TryParse(id, out _))
                    throw new Exception("Please provide valid id");

                var team = await _projectService.GetProjectTeamAsync(id);
                response.Message = Constants.Messages.Success;
                response.Result = team;
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
                if (!ObjectId.TryParse(id, out _))
                    throw new Exception("Please provide valid id");

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


        // Add new assignees to project team
        [HttpPost("{id}/team")]
        [Authorize(Roles = "admin,teamLead")]
        public async Task<ApiResponse<object>> 
            AddAssignee(string id, [FromBody] IEnumerable<string> UserIds)
        {
            var response = new ApiResponse<object>();

            var _result = ValidateModelState;
            if (_result != null) return response.HandleValidationError(_result);

            try
            {
                if (!ObjectId.TryParse(id, out _))
                    throw new Exception("Please provide valid id");

                await _projectService.AddAssignees(id, UserIds);
                response.Message = Constants.Messages.Success;
            }
            catch (Exception ex)
            {
                response.HandleException(ex);
            }
            return response;
        }

        // Remove an Assignee fro Project Team
        [HttpPost("{id}/team/remove")]
        [Authorize(Roles = "admin,teamLead")]
        public async Task<ApiResponse<object>>
            RemoveAssignee(string id, [FromBody] string UserId)
        {
            var response = new ApiResponse<object>();

            var _result = ValidateModelState;
            if (_result != null) return response.HandleValidationError(_result);

            try
            {
                if (!ObjectId.TryParse(id, out _))
                    throw new Exception("Please provide valid project id");

                if (!ObjectId.TryParse(UserId, out _))
                    throw new Exception("Please provide valid member id");

                await _projectService.RemoveAssignee(id, UserId);
                response.Message = Constants.Messages.Success;
            }
            catch (Exception ex)
            {
                response.HandleException(ex);
            }
            return response;
        }

        // Deletes the project with the specified ID. (Admin Only)
        [HttpPost("{id}/delete")]
        [Authorize(Roles = Constants.Roles.Admin)]
        public async Task<ApiResponse<Project>> DeleteAsync(string id)
        {
            var response = new ApiResponse<Project>();
            try
            {
                if (!ObjectId.TryParse(id, out _))
                    throw new Exception("Please provide valid id");

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


        // Mark a project as completed
        [HttpPost("{id}/complete")]
        [Authorize(Roles = Constants.Roles.Admin)]
        public async Task<ApiResponse<Project>> CompleteAsync(string id)
        {
            var response = new ApiResponse<Project>();
            try
            {
                if (!ObjectId.TryParse(id, out _))
                    throw new Exception("Please provide valid id");

                var project = await _projectService.MarkCompletedAsync(id);
                response.Message = Constants.Messages.Deleted;
                response.Result = project;
            }
            catch (Exception ex)
            {
                response.HandleException(ex);
            }
            return response;
        }

        // Get Top 10 Active Project List
        [HttpGet("top")]
        [Authorize(Roles = Constants.Roles.Admin)]
        public async Task<ApiResponse<List<TopProject>>>
            GetTopActiveProjects()
        {
            var response = new ApiResponse<List<TopProject>>();

            try
            {
                var result = await _projectService.GetTopActiveProjectsAsync();
                response.Message = Constants.Messages.Success;
                response.Result = result;
            }
            catch (Exception ex)
            {
                response.HandleException(ex);
            }
            return response;
        }

        // Get least Active Project List
        [HttpGet("least")]
        [Authorize(Roles = Constants.Roles.Admin)]
        public async Task<ApiResponse<List<TopProject>>>
            GetLeastActiveProjects()
        {
            var response = new ApiResponse<List<TopProject>>();

            try
            {
                var result = await _projectService.GetLeastActiveProjectsAsync();
                response.Message = Constants.Messages.Success;
                response.Result = result;
            }
            catch (Exception ex)
            {
                response.HandleException(ex);
            }
            return response;
        }

        // Get Project Assignee Count
        [HttpGet("assignee-count")]
        [Authorize(Roles = Constants.Roles.Admin)]
        public async Task<ApiResponse<List<ProjectAssigneeCount>>>
            GetProjectAssigneeCount()
        {
            var response = new ApiResponse<List<ProjectAssigneeCount>>();

            try
            {
                var counts = await _projectService.GetProjectAssigneeCountAsync();
                response.Message = Constants.Messages.Success;
                response.Result = counts;
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
