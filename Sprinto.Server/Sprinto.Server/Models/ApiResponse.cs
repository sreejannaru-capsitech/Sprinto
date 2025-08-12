using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Sprinto.Server.DTOs;

namespace Sprinto.Server.Models
{
    public class ApiResponse<T>
    {
        public bool Status { get; set; } = true;
        public T? Result { get; set; }
        public object? Errors { get; set; }
        public string Message { get; set; } = null!;
    }

    public class PagedResult<T>
    {
        public List<T> Items { get; set; } = [];
        public int TotalCount { get; set; }
        public int TotalPages { get; set; }
    }

    public class SessionTokens
    {
        public string AccessToken { get; set; } = null!;
        public string RefreshToken { get; set; } = null!;
    }

    public class LoginResponse
    {
        public string AccessToken { get; set; } = null!;
        public UserResponse? User { get; set; }
    }

    public class TokenResponse
    {
        public string Token { get; set; } = null!;
        public DateTime ExpiryTime { get; set; }
    }

    public class TodayTasksResponse
    {
        public List<TaskResponse> Today { get; set; } = [];
        public List<TaskResponse> Overdue { get; set; } = [];
    }

    public class AllProjects
    {
        public long Total { get; set; }
        public long Active { get; set; }
        public long InActive { get; set; }
        public List<Project> Projects { get; set; } = [];
    }

    public class TopProject
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = null!;
        public string Title { get; set; } = null!;
        public string Alias { get; set; } = null!;
        [BsonIgnoreIfNull]
        public DateTime? StartDate { get; set; }
        [BsonIgnoreIfNull]
        public DateTime? Deadline { get; set; }
        public long ActivityCount { get; set; }
        public Assignee Maintainer { get; set; } = null!;
    }

    public class ProjectTaskGroup
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public string ProjectId { get; set; } = null!;
        public string ProjectTitle { get; set; } = null!;
        public List<TaskResponse> Tasks { get; set; } = [];
    }

    public class InboxTaskGroup
    {
        public List<TaskResponse> Low { get; set; } = [];
        public List<TaskResponse> Medium { get; set; } = [];
        public List<TaskResponse> High { get; set; } = [];
    }

    public class TaskActivity
    {
        public long Sequence { get; set; }
        public string ProjectAlias { get; set; } = null!;

        [BsonRepresentation(BsonType.ObjectId)]
        public string ProjectId { get; set; } = null!;

        [BsonRepresentation(BsonType.ObjectId)]
        public string TaskId { get; set; } = null!;
        public Activity Activity { get; set; } = null!;
    }

    public class TaskGroup
    {
        public string Group { get; set; } = null!;
        public long Count { get; set; }
    }


    public class ProjectOverview
    {
        public long Totaltasks { get; set; }

        // Tasks whose status is marked as done.
        public long PendingTasks { get; set; }

        // Task count grouped by status
        public List<TaskGroup> StatusGroups { get; set; } = [];

        // Task count grouped by assignee
        public List<TaskGroup> AssigneeGroups { get; set; } = [];

        // last completed tasks
        public List<TaskItem> LastCompleted { get; set; } = [];
    }

    public class ProjectTeam
    {
        public UserResponse TeamLead { get; set; } = null!;
        public List<UserResponse> Employees { get; set; } = [];
    }

    // Task Statistics Response Models

    public class DashboardInsights
    {
        public int TotalTasks { get; set; }
        public List<StatusGroup> StatusBreakdown { get; set; } = [];
        public List<ProjectGroup> ProjectInsight { get; set; } = [];
        public List<UserGroup> TopContributors { get; set; } = [];
    }

    public class StatusGroup
    {
        public string Name { get; set; } = null!;
        public int Value { get; set; }
    }

    public class ProjectGroup
    {
        public string Name { get; set; } = null!;
        public string ProjectId { get; set; } = null!;
        public int Value { get; set; }
    }

    public class UserGroup
    {
        public string Name { get; set; } = null!;
        public int Count { get; set; }
    }

    // Recent Activity Response
    public class RecentUserActivity
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = null!;
        public string Name { get; set; } = null!;
        public DateTime LastActive { get; set; }
        public long Count { get; set; }
    }

    // Project Assignee Count
    public class ProjectAssigneeCount
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public string UserId { get; set; } = null!;

        public string UserName { get; set; } = null!;
        public long ProjectsCount { get; set; }
    }

    // Role based user count
    public class RoleBasedUserCount
    {
        public long EmployeeCount { get; set; }
        public long TLCount { get; set; }
        public long AdminCount { get; set; }
        public long TotalCount { get; set; }
    }
}
