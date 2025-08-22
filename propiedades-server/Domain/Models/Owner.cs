using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Domain.Models;

public class Owner
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? IdOwner { get; set; }

    [BsonElement("Name")]
    public string OwnerName { get; set; } = null!;

    public string Phone { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Address { get; set; } = null!; 

    public string Photo { get; set; } = null!;

    public string Birthday { get; set; } = null!;
}