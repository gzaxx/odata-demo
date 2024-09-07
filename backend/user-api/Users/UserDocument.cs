using MongoDB.Bson;

namespace user_api.Users;

public sealed record UserDocument
{
    public required ObjectId Id { get; init; }
    public required string FirstName { get; init; }
    public required string LastName { get; init; }
    public required string Email { get; init; }
    public required DateTime CreatedAt { get; init; }

    public required IReadOnlyCollection<AddressDocument> Addresses { get; init; }
}
