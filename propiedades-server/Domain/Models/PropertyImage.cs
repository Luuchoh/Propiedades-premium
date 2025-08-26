using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace Domain.Models
{
    public class PropertyImage
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? IdPropertyImage { get; set; }

        [BsonRepresentation(BsonType.ObjectId)]
        public string? IdProperty { get; set; }

        public string? File { get; set; }

        public bool Enable { get; set; }

    }
}
