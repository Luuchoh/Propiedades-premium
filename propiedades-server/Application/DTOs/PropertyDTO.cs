namespace Application.DTOs
{
    public class PropertyDTO
    {
        public string? IdProperty { get; set; }

        public string? IdOwner { get; set; }

        public string PropertyName { get; set; } = null!;

        public string PropertyType { get; set; } = null!;

        public string Address { get; set; } = null!;

        public int Price { get; set; }

        public int Rooms { get; set; }

        public int Bathrooms { get; set; }

        public int Area { get; set; }

        public int YearConstruction { get; set; }

        public int AnnualTax { get; set; }

        public int MonthlyExpenses { get; set; }

        public string Description { get; set; } = null!;

        public List<String> Features { get; set; } = new();

        public PropertyImageDTO? Image { get; set; }

        public string Status { get; set; } = null!;

        public DateTime? CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }
}
}
