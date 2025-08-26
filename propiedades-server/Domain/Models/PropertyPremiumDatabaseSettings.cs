namespace Domain.Models
{
    public class PropertyPremiumDatabaseSettings
    {
        public string? ConnectionString { get; set; }

        public string? DatabaseName { get; set; }

        public string? OwnerCollectionName { get; set; }

        public string? PropertyCollectionName { get; set; }

        public string? PropertyImageCollectionName { get; set; }
    }
}
