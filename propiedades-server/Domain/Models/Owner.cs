using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Domain.Models;

public class Owner
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    [BsonElement("_Id")]
    public string? IdOwner { get; set; }

    [BsonElement("Name")]
    public string? OwnerName { get; set; }

    public string? DNI { get; set; }

    public string? Phone { get; set; }

    public string? Email { get; set; }

    public string? Address { get; set; } 

    public string? Photo { get; set; }

    public string? Birthday { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}