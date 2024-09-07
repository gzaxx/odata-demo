using MongoDB.Bson;

namespace user_api.Users;

public sealed record AddressDocument
{
    public required ObjectId Id { get; init; }
    public required string AddressLine { get; init; }
    public required string City { get; init; }
    public required string ZipCode { get; init; }
}
