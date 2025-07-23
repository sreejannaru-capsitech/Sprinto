namespace Sprinto.Server.Models
{
    public class DatabaseSettings
    {
        public string ConnectionString { get; set; } = null!;
        public string DatabaseName { get; set; } = null!;
        public string UsersCollection {  get; set; } = null!;
        public string ProjectsCollection {  get; set; } = null!;
        public string TasksCollection { get; set; } = null!;
        public string StatusCollection { get; set; } = null!;
    }
}
