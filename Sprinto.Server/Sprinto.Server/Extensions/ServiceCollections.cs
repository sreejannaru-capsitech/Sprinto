using Sprinto.Server.Services;

namespace Sprinto.Server.Extensions
{
    public static class ServiceCollections
    {
        public static IServiceCollection AddSprintoServices(this IServiceCollection services)
        {
            services.AddSingleton<UserService>();
            services.AddSingleton<ProjectService>();
            services.AddSingleton<TaskService>();
            services.AddSingleton<JwtService>();
            
            return services;
        }
    }
}
