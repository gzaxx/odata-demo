var builder = DistributedApplication.CreateBuilder(args);

var mongo = builder.AddMongoDB("mongo", port: 27017);
var mongodb = mongo.AddDatabase("odatadb", "odatadb");

var userapi = builder.AddProject<Projects.user_api>("user-api")
    .WithReference(mongodb);

builder.AddNpmApp("frontend", "../../frontend/ng-odata")
    .WithReference(userapi);

builder.Build().Run();
