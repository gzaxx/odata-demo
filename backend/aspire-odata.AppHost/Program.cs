var builder = DistributedApplication.CreateBuilder(args);

builder.AddProject<Projects.user_api>("user-api");

builder.Build().Run();
