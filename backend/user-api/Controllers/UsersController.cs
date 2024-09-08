using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using MongoDB.AspNetCore.OData;
using MongoDB.Driver;
using user_api.Users;

namespace user_api.Controllers;

public class UsersController : ODataController
{
    private const AllowedQueryOptions ODataAllowed = 
        AllowedQueryOptions.Filter | AllowedQueryOptions.OrderBy | AllowedQueryOptions.Count 
        | AllowedQueryOptions.Search | AllowedQueryOptions.Expand | AllowedQueryOptions.Top
        | AllowedQueryOptions.Skip;

    [HttpGet]
    [MongoEnableQuery(
        PageSize = 50,
        AllowedQueryOptions = ODataAllowed)]
    public ActionResult<IQueryable<User>> Get([FromServices] IMongoClient mongoClient)
    {
        var database = mongoClient.GetDatabase("odatadb");
        var collection = database.GetCollection<UserDocument>("users");

        return Ok(collection
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
            }));
    }
}
