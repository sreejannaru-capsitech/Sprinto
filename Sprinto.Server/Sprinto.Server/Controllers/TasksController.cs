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
    [Route("api/tasks")]
    [Authorize]
    //[ApiController]
    public class TasksController(TaskService taskService) : ControllerBase
    {
        private readonly TaskService _taskService = taskService;

        // create new task
        [HttpPost]
        public async Task<ApiResponse<TaskResponse>>
            Post([FromBody] TaskDTO taskDTO)
        {
            var response = new ApiResponse<TaskResponse>();

            var _result = ValidateModelState;
            if (_result != null) return response.HandleValidationError(_result);

            try
            {
                // Extract ID and Name of current admin
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var userName = User.FindFirstValue(ClaimTypes.Name);

                if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(userName))
                    throw new Exception(Constants.Messages.InvalidToken);

                var createdTask = await _taskService.CreateAsync(taskDTO, userId, userName);

                response.Message = Constants.Messages.Created;
                response.Result = createdTask.ToTaskResponse();
            }
            catch (Exception ex)
            {
                response.HandleException(ex);
            }
            return response;
        }

        // Update a task
        [HttpPost("{id}")]
        public async Task<ApiResponse<TaskResponse>>
            Update([FromRoute] string id, [FromBody] TaskDTO taskDTO)
        {
            var response = new ApiResponse<TaskResponse>();

            var _result = ValidateModelState;
            if (_result != null) return response.HandleValidationError(_result);

            try
            {
                if (!ObjectId.TryParse(id, out _))
                    throw new Exception("Please provide valid id");
                // Extract ID and Name of current admin
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var userName = User.FindFirstValue(ClaimTypes.Name);

                if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(userName))
                    throw new Exception(Constants.Messages.InvalidToken);

                var updatedTask = await _taskService.UpdateAsync(id, taskDTO, userId, userName);

                response.Message = Constants.Messages.Updated;
                response.Result = updatedTask.ToTaskResponse();
            }
            catch (Exception ex)
            {
                response.HandleException(ex);
            }
            return response;
        }


        [HttpGet("{id}/activities")]
        public async Task<ApiResponse<List<Activity>>>
            GetTaskActivities(string id)
        {
            var res = new ApiResponse<List<Activity>>();

            try
            {
                if (!ObjectId.TryParse(id, out _))
                    throw new Exception("Please provide valid id");

                var result = await _taskService.GetTaskActivities(id);
                res.Message = Constants.Messages.Success;
                res.Result = result;
            }
            catch (Exception ex)
            {
                res.HandleException(ex);
            }
            return res;
        }

        // Get today tasks
        [HttpGet("today")]
        public async Task<ApiResponse<TodayTasksResponse>>
            GetTodayTasks()
        {
            var response = new ApiResponse<TodayTasksResponse>();

            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    throw new Exception(Constants.Messages.InvalidToken);

                var tasks = await _taskService.GetTasksOfTodayAsync(userId);

                response.Message = Constants.Messages.Success;
                response.Result = tasks;
            }
            catch (Exception ex)
            {
                response.HandleException(ex);
            }
            return response;
        }


        // Get top due tasks
        [HttpGet("topdue")]
        [Authorize(Roles = Constants.Roles.Admin)]
        public async Task<ApiResponse<List<TaskResponse>>> GetTopDueTasks()
        {
            var res = new ApiResponse<List<TaskResponse>>();
            try
            {
                var tasks = await _taskService.GetTopDueTasksAsync();
                res.Message = Constants.Messages.Success;
                res.Result = [..tasks.Select(t => t.ToTaskResponse())];
            }
            catch (Exception ex)
            {
                res.HandleException(ex);
            }

            return res;
        }


        // Get all assigned tasks
        [HttpGet("inbox")]
        public async Task<ApiResponse<InboxTaskGroup>>
            GetInboxTasks()
        {
            var response = new ApiResponse<InboxTaskGroup>();

            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    throw new Exception(Constants.Messages.InvalidToken);

                var tasks = await _taskService.GetInboxTasks(userId);

                response.Message = Constants.Messages.Success;
                response.Result = tasks;
            }
            catch (Exception ex)
            {
                response.HandleException(ex);
            }
            return response;
        }

        // Search for tasks
        [HttpGet("search")]
        public async Task<ApiResponse<List<TaskResponse>>>
            SearchTasks([FromQuery] string query)
        {
            var response = new ApiResponse<List<TaskResponse>>();

            try
            {
                if (string.IsNullOrEmpty(query))
                {
                    query = string.Empty;
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var userRole = User.FindFirstValue(ClaimTypes.Role);

                if (string.IsNullOrEmpty(userRole) || string.IsNullOrEmpty(userId))
                    throw new Exception(Constants.Messages.InvalidToken);

                var tasks = await _taskService.SearchUserTasksAsync(userId, query, userRole == "admin");
                response.Message = Constants.Messages.Success;

                response.Result = [.. tasks.Select(a => a.ToTaskResponse())];
            }
            catch (Exception ex)
            {
                response.HandleException(ex);
            }
            return response;
        }


        // Get all upcoming tasks
        [HttpGet("upcoming")]
        public async Task<ApiResponse<List<ProjectTaskGroup>>>
            GetUpcomingGroupedTasks()
        {
            var response = new ApiResponse<List<ProjectTaskGroup>>();

            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    throw new Exception(Constants.Messages.InvalidToken);

                var tasks = await _taskService.GetGroupedUpcomingTasks(userId);

                response.Message = Constants.Messages.Success;
                response.Result = tasks;
            }
            catch (Exception ex)
            {
                response.HandleException(ex);
            }
            return response;
        }

        // Delete a task item
        [HttpPost("{id}/delete")]
        public async Task<ApiResponse<TaskResponse>> DeleteTask(string id)
        {
            var response = new ApiResponse<TaskResponse>();

            try
            {
                if (!ObjectId.TryParse(id, out _))
                    throw new Exception("Please provide valid id");

                // Extract ID and Name of current admin
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var userName = User.FindFirstValue(ClaimTypes.Name);

                if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(userName))
                    throw new Exception(Constants.Messages.InvalidToken);

                var task = await _taskService.DeleteAsync(id, userId, userName);

                response.Message = Constants.Messages.Deleted;
                response.Result = task.ToTaskResponse();
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
