using MongoDB.Bson;

namespace user_api.Users;

public sealed record User
{
    public required string Id { get; init; }
    public required string FirstName { get; init; }
    public required string LastName { get; init; }
    public required string Email { get; init; }
    public required DateTime CreatedAt { get; init; }

    public required IReadOnlyCollection<Address> Addresses { get; init; }
}
