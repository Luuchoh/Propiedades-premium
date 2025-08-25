using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace Domain.Models
{
    public class Property
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? IdProperty { get; set; }
        
        [BsonRepresentation(BsonType.ObjectId)]
        public string? IdOwner { get; set; }

        [BsonElement("Name")]
        public string PropertyName { get; set; } = null!;

        [BsonElement("Type")]
        public string PropertyType { get; set; } = null!;

        public string Address { get; set; } = null!;

        public int Price { get; set; }

        public int Rooms { get; set; }

        public int Bathrooms { get; set; }

        public int Area { get; set; } 

        public int YearConstruction { get; set; }

        public int AnnualTax { get; set; }

        public int MonthlyExpenses{ get; set; }

        public string Description { get; set; } = null!;

        public List<String> Features { get; set; } = new();

        public string Status { get; set; } = null!;

        public DateTime? CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }

    }
}
