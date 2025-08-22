using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Domain.Models;

public class Owner
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("IdOwner")]
    public string? DNI { get; set; }

    [BsonElement("Name")]
    public string OwnerName { get; set; } = null!;

    public string Address { get; set; } = null!; 

    public string Photo { get; set; } = null!;

    public string Birthday { get; set; } = null!;
}