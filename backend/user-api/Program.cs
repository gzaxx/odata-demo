using Microsoft.AspNetCore.OData;
using Microsoft.AspNetCore.OData.Query.Expressions;
using Microsoft.OData.ModelBuilder;
using System.Text.Json;
using user_api;
using user_api.Users;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

// Add services to the container.

var modelBuilder = new ODataConventionModelBuilder();
var entity = modelBuilder.EntitySet<User>("Users").EntityType;
entity.HasKey(x => x.Id);

builder.AddMongoDBClient("odatadb");
builder.Services
    .AddControllers()
    .AddOData(
        options =>
        {
            options.RouteOptions.EnableActionNameCaseInsensitive = true;
            options.RouteOptions.EnablePropertyNameCaseInsensitive = true;

            options
            .EnableQueryFeatures(50)
            .AddRouteComponents("odata", modelBuilder.GetEdmModel(), services => services.AddSingleton<ISearchBinder, UserSerachBinder>());
        }
    );

builder.Services.AddCors(options =>
    options.AddDefaultPolicy(policy =>
        policy
            .WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod())
);

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.MapDefaultEndpoints();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseODataRouteDebug();
app.UseRouting();
app.UseCors();
app.UseAuthorization();
app.MapControllers();

app.Run();
