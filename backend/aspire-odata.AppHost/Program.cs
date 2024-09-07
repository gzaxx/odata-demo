var builder = DistributedApplication.CreateBuilder(args);

var userapi = builder.AddProject<Projects.user_api>("user-api");
builder.AddNpmApp("ng-odata", "../../frontend/ng-odata")
    .WithReference(userapi);

builder.Build().Run();
