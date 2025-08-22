using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace Domain.Models
{
    public class Property
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? IdProperty { get; set; }

        [BsonElement("Name")]
        public string PropertyName { get; set; } = null!;

        public string Address { get; set; } = null!;

        public string Price { get; set; } = null!;

        public string Rooms { get; set; } = null!;

        public string Bathrooms { get; set; } = null!;

        public string Area { get; set; } = null!;

        public string YearConstruction { get; set; } = null!;

        public string AnnualTax { get; set; } = null!;

        public string MonthlyExpenses{ get; set; } = null!;

        public string Description { get; set; } = null!;

        public string Features { get; set; } = null!;

        public string Photo { get; set; } = null!;
    }
}
