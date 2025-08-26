using Application.DTOs;
using Application.Interfaces;
using Domain.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Infraestructure.Persistence.Services
{
    public class PropertyService: IProperty
    {
        private readonly IMongoCollection<Property> _propertyCollection;
        private readonly IPropertyImage _PropertyimageService;

        public PropertyService(
            IOptions<PropertyPremiumDatabaseSettings> PropertyPremiumDatabaseSettings, IPropertyImage propertyImage)
        {
            var mongoClient = new MongoClient(
                PropertyPremiumDatabaseSettings.Value.ConnectionString);

            var mongoDatabase = mongoClient.GetDatabase(
                PropertyPremiumDatabaseSettings.Value.DatabaseName);

            _propertyCollection = mongoDatabase.GetCollection<Property>(
                PropertyPremiumDatabaseSettings.Value.PropertyCollectionName);

            _PropertyimageService = propertyImage;

        }

        public async Task<List<PropertyDTO>> GetAllAsync()
        {
            List<Property> properties = await _propertyCollection.Find(_ => true).ToListAsync();
            List<PropertyDTO> result = [];

            foreach (Property property in properties)
            {
                PropertyImage propertyImage = await _PropertyimageService.GetPropertyImageByIdAsync(property.IdProperty);
                result.Add(MapToPropertyDTO(property, propertyImage));
            }

            return result;
        }

        public async Task<PropertyDTO> GetOneByIdAsync(string generalId)
        {
            Property property = await _propertyCollection.Find(x => x.IdProperty == generalId).FirstOrDefaultAsync();
            
            if (property == null) return null;

            PropertyImage propertyImage = await _PropertyimageService.GetPropertyImageByIdAsync(property.IdProperty);
            return MapToPropertyDTO(property, propertyImage);
        }

        private PropertyDTO MapToPropertyDTO(Property property, PropertyImage propertyImage) => new PropertyDTO
        {
            IdProperty = property.IdProperty,
            IdOwner = property.IdOwner,
            PropertyName = property.PropertyName,
            PropertyType = property.PropertyType,
            Address = property.Address,
            Price = property.Price,
            Rooms = property.Rooms,
            Bathrooms = property.Bathrooms,
            Area = property.Area,
            YearConstruction = property.YearConstruction,
            AnnualTax = property.AnnualTax,
            MonthlyExpenses = property.MonthlyExpenses,
            Description = property.Description,
            Features = property.Features,
            Image = new PropertyImageDTO
            {
                IdPropertyImage = propertyImage.IdPropertyImage,
                IdProperty = propertyImage.IdProperty,
                File = propertyImage.File,
                Enable = propertyImage.Enable
            },
            Status = property.Status,
            CreatedAt = property.CreatedAt,
            UpdatedAt = property.UpdatedAt,
        };

        public async Task<PropertyDTO> CreateAsync(PropertyDTO PropertyDTO)
        {
            Property newProperty = new ()
            {
                IdOwner = PropertyDTO.IdOwner,
                PropertyName = PropertyDTO.PropertyName,
                PropertyType = PropertyDTO.PropertyType,
                Address = PropertyDTO.Address,
                Price = PropertyDTO.Price,
                Rooms = PropertyDTO.Rooms,
                Bathrooms = PropertyDTO.Bathrooms,
                Area = PropertyDTO.Area,
                YearConstruction = PropertyDTO.YearConstruction,
                AnnualTax = PropertyDTO.AnnualTax,
                MonthlyExpenses = PropertyDTO.MonthlyExpenses,
                Description = PropertyDTO.Description,
                Features = PropertyDTO.Features,
                Status = PropertyDTO.Status,
                CreatedAt = DateTime.Now,
            };

            await _propertyCollection.InsertOneAsync(newProperty);

            PropertyImageDTO newPropertyImageDTO = new ()
            {
                IdProperty = newProperty.IdProperty,
                File = PropertyDTO?.Image?.File,
                Enable = PropertyDTO!.Image!.Enable || true,
            };

            PropertyImage newPropertyImage = await _PropertyimageService.CreateAsync(newPropertyImageDTO);

            return MapToPropertyDTO(newProperty, newPropertyImage);
        }

        public async Task<PropertyDTO> UpdateAsync(PropertyDTO PropertyDTO)
        {
            var updateProperty = Builders<Property>.Update
                .Set(p => p.IdOwner, PropertyDTO.IdOwner)
                .Set(p => p.PropertyName, PropertyDTO.PropertyName)
                .Set(p => p.PropertyType, PropertyDTO.PropertyType)
                .Set(p => p.Address, PropertyDTO.Address)
                .Set(p => p.Price, PropertyDTO.Price)
                .Set(p => p.Rooms, PropertyDTO.Rooms)
                .Set(p => p.Bathrooms, PropertyDTO.Bathrooms)
                .Set(p => p.Area, PropertyDTO.Area)
                .Set(p => p.YearConstruction, PropertyDTO.YearConstruction)
                .Set(p => p.AnnualTax, PropertyDTO.AnnualTax)
                .Set(p => p.MonthlyExpenses, PropertyDTO.MonthlyExpenses)
                .Set(p => p.Description, PropertyDTO.Description)
                .Set(p => p.Features, PropertyDTO.Features)
                .Set(p => p.Status, PropertyDTO.Status)
                .Set(p => p.CreatedAt, PropertyDTO.CreatedAt)
                .Set(p => p.UpdatedAt, DateTime.Now);

            await _propertyCollection.UpdateOneAsync(x => x.IdProperty == PropertyDTO.IdProperty, updateProperty);

            PropertyImageDTO updatePropertyImage = new ()
            {
                IdPropertyImage = PropertyDTO?.Image?.IdPropertyImage,
                IdProperty = PropertyDTO?.Image?.IdProperty,
                File = PropertyDTO?.Image?.File,
                Enable = PropertyDTO?.Image?.Enable ?? true
            };

            await _PropertyimageService.UpdateAsync(updatePropertyImage);

            return PropertyDTO;
        }

        public async Task RemoveAsync(string generalId) =>
            await _propertyCollection.DeleteOneAsync(x => x.IdProperty == generalId);
    }
}
