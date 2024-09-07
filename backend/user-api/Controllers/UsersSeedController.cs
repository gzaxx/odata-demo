using Bogus;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using user_api.Users;

namespace user_api.Controllers;

[ApiController]
[Route("users")]
public class UsersSeedController : ControllerBase
{
    [HttpPost(Name = "Seed")]
    public async Task<IActionResult> Post([FromServices] IMongoClient mongoClient)
    {
        var cities = new string[] { "Wroclaw", "Berlin", "Warsaw" };

        var address = new Faker<AddressDocument>()
            .RuleFor(x => x.Id, _ => ObjectId.GenerateNewId())
            .RuleFor(x => x.AddressLine, f => f.Address.StreetAddress())
            .RuleFor(x => x.City, f => f.PickRandom(cities))
            .RuleFor(x => x.ZipCode, f => f.Address.ZipCode());

        var user = new Faker<UserDocument>()
            .RuleFor(x => x.Id, _ => ObjectId.GenerateNewId())
            .RuleFor(x => x.FirstName, f => f.Name.FirstName())
            .RuleFor(x => x.LastName, f => f.Name.LastName())
            .RuleFor(x => x.Email, f => f.Internet.Email())
            .RuleFor(x => x.CreatedAt, f => DateTime.Now.AddDays(-f.Random.Int(0, 100)))
            .RuleFor(x => x.Addresses, f => address.GenerateBetween(1, 3).ToArray());

        var data = user.Generate(100);

        var database = mongoClient.GetDatabase("odatadb");
        var collection = database.GetCollection<UserDocument>("users");

        await collection.InsertManyAsync(data);
        return Ok();
    }
}
