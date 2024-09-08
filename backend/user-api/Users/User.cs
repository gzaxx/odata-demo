using MongoDB.Bson;

namespace user_api.Users;

public sealed record User
{
    public required string Id { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string Email { get; set; }
    public required DateTime CreatedAt { get; set; }

    public required IReadOnlyCollection<Address> Addresses { get; set; }
}
