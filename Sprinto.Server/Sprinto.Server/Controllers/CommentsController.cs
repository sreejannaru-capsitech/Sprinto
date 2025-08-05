using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using Sprinto.Server.DTOs;
using Sprinto.Server.Extensions;
using Sprinto.Server.Models;
using Sprinto.Server.Services;
using System.Security.Claims;
using static Sprinto.Server.Common.Constants;

namespace Sprinto.Server.Controllers
{
    [Route("api/tasks/{taskId}/comments")]
    public class CommentsController(CommentService service) : ControllerBase
    {
        private readonly CommentService _service = service;

        [HttpGet]
        public async Task<ApiResponse<List<Comment>>> GetComments(string taskId)
        {
            var res = new ApiResponse<List<Comment>>();

            try
            {
                var comments = await _service.GetCommentsAsync(taskId);
                res.Result = comments;
                res.Message = Messages.Success;
            }
            catch (Exception ex)
            {
                res.HandleException(ex);
            }

            return res;
        }

        [HttpPost]
        public async Task<ApiResponse<string>> 
            AddComment(string taskId, [FromBody] CommentDTO dto)
        {
            var res = new ApiResponse<string>();

            var _result = ValidateModelState;
            if (_result != null) return res.HandleValidationError(_result);

            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var userName = User.FindFirstValue(ClaimTypes.Name);

                if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(userName))
                    throw new Exception(Messages.InvalidToken);

                await _service.AddCommentAsync(taskId, dto, userId, userName);
                res.Result = "Comment added";
                res.Message = Messages.Success;
            }
            catch (Exception ex)
            {
                res.HandleException(ex);
            }

            return res;
        }

        [HttpPost("{commentId}")]
        public async Task<ApiResponse<string>> 
            UpdateComment(string taskId, string commentId, [FromBody] CommentDTO dto)
        {
            var res = new ApiResponse<string>();

            var _result = ValidateModelState;
            if (_result != null) return res.HandleValidationError(_result);

            try
            {
                if (!ObjectId.TryParse(commentId, out _))
                    throw new Exception("Please provide valid id");

                dto.Id = commentId;
                await _service.UpdateCommentAsync(taskId, dto);
                res.Result = "Comment updated";
                res.Message = Messages.Success;
            }
            catch (Exception ex)
            {
                res.HandleException(ex);
            }

            return res;
        }

        [HttpPost("{commentId}/delete")]
        public async Task<ApiResponse<string>> DeleteComment(string taskId, string commentId)
        {
            var res = new ApiResponse<string>();

            try
            {
                if (!ObjectId.TryParse(commentId, out _))
                    throw new Exception("Please provide valid id");

                await _service.DeleteCommentAsync(taskId, commentId);
                res.Result = "Comment deleted";
                res.Message = Messages.Success;
            }
            catch (Exception ex)
            {
                res.HandleException(ex);
            }

            return res;
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