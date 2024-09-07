using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using MongoDB.AspNetCore.OData;
using MongoDB.Driver;
using user_api.Users;

namespace user_api.Controllers;

[Route("users")]
public sealed class UserController : ODataController
{
    [HttpGet]
    [MongoEnableQuery]
    public IQueryable<User> Get([FromServices] IMongoClient mongoClient)
    {
        var database = mongoClient.GetDatabase("odatadb");
        var collection = database.GetCollection<UserDocument>("users");

        return collection
            .AsQueryable()
            .Select(x => new User
            {
                Id = x.Id.ToString(),
                FirstName = x.FirstName,
                LastName = x.LastName,
                Email = x.Email,
                CreatedAt = x.CreatedAt,
                Addresses = x.Addresses.Select(a => new Address
                {
                    Id = a.Id.ToString(),
                    AddressLine = a.AddressLine,
                    City = a.City,
                    ZipCode = a.ZipCode,
                }).ToArray(),
            });
    }
}
