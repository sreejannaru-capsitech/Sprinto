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
    [Route("api/statuses")]
    [ApiController]
    public class StatusesController(StatusService statusService) : ControllerBase
    {
        private readonly StatusService _statusService = statusService;

        // Create new status ( admin only )
        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<ApiResponse<Status>>
            Post([FromBody] StatusDTO newStatus)
        {
            var response = new ApiResponse<Status>();

            var _result = ValidateModelState;
            if (_result != null) return response.HandleValidationError(_result);

            try
            {
                // Extract ID and Name of current admin
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var userName = User.FindFirstValue(ClaimTypes.Name);

                if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(userName))
                    throw new Exception(Constants.Messages.InvalidToken);

                var createdStatus = await _statusService.CreateAsync(newStatus, userId, userName);

                response.Message = Constants.Messages.Created;
                response.Result = createdStatus;
            }
            catch (Exception ex)
            {
                response.HandleException(ex);
            }
            return response;
        }

        // Get all statuses
        [HttpGet]
        [Authorize]
        public async Task<ApiResponse<List<Status>>> Get()
        {
            var response = new ApiResponse<List<Status>>();

            try
            {
                var statuses = await _statusService.GetAsync();

                response.Message = Constants.Messages.Success;
                response.Result = statuses;
            }
            catch (Exception ex)
            {
                response.HandleException(ex);
            }
            return response;
        }

        // Update status ( admin only )
        [HttpPost("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<ApiResponse<Status>> Put(string id, [FromBody] StatusDTO updateStatus)
        {
            var response = new ApiResponse<Status>();

            var _result = ValidateModelState;
            if (_result != null) return response.HandleValidationError(_result);

            try
            {
                if (!ObjectId.TryParse(id, out _))
                    throw new Exception("Please provide valid id");

                var status = await _statusService.UpdateAsync(id, updateStatus);

                response.Message = Constants.Messages.Updated;
                response.Result = status;
            }
            catch (Exception ex)
            {
                response.HandleException(ex);
            }
            return response;
        }

        // Delete status ( admin only )
        [HttpPost("{id}/delete")]
        [Authorize(Roles = "admin")]
        public async Task<ApiResponse<Status>> Delete(string id)
        {
            var response = new ApiResponse<Status>();

            try
            {
                if (!ObjectId.TryParse(id, out _))
                    throw new Exception("Please provide valid id");

                var status = await _statusService.DeleteAsync(id);

                response.Message = Constants.Messages.Deleted;
                response.Result = status;
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
