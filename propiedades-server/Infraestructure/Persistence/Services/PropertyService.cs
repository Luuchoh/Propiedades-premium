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

        public PropertyService(
            IOptions<PropertyPremiumDatabaseSettings> PropertyPremiumDatabaseSettings)
        {
            var mongoClient = new MongoClient(
                PropertyPremiumDatabaseSettings.Value.ConnectionString);

            var mongoDatabase = mongoClient.GetDatabase(
                PropertyPremiumDatabaseSettings.Value.DatabaseName);

            _propertyCollection = mongoDatabase.GetCollection<Property>(
                PropertyPremiumDatabaseSettings.Value.PropertyCollectionName);
        }

        public async Task<List<Property>> GetAsync() =>
            await _propertyCollection.Find(_ => true).ToListAsync();

        public async Task<Property?> GetAsync(string id) =>
            await _propertyCollection.Find(x => x.IdProperty == id).FirstOrDefaultAsync();

        public async Task CreateAsync(PropertyDTO PropertyDTO)
        {
            var newProperty = new Property
            {
                PropertyName = PropertyDTO.PropertyName,
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
            };

            await _propertyCollection.InsertOneAsync(newProperty);
            //TODO logica para agregar la imagen a otra collection
        }

        public async Task UpdateAsync(string id, PropertyDTO PropertyDTO)
        {
            var updateProperty = Builders<Property>.Update
                .Set(p => p.PropertyName, PropertyDTO.PropertyName)
                .Set(p => p.Address, PropertyDTO.Address)
                .Set(p => p.Price, PropertyDTO.Price)
                .Set(p => p.Rooms, PropertyDTO.Rooms)
                .Set(p => p.Bathrooms, PropertyDTO.Bathrooms)
                .Set(p => p.Area, PropertyDTO.Area)
                .Set(p => p.YearConstruction, PropertyDTO.YearConstruction)
                .Set(p => p.AnnualTax, PropertyDTO.AnnualTax)
                .Set(p => p.MonthlyExpenses, PropertyDTO.MonthlyExpenses)
                .Set(p => p.Description, PropertyDTO.Description)
                .Set(p => p.Features, PropertyDTO.Features);

            await _propertyCollection.UpdateOneAsync(x => x.IdProperty == id, updateProperty);
            //TODO logica para agregar la imagen a otra collection
        }

        public async Task RemoveAsync(string id) =>
            await _propertyCollection.DeleteOneAsync(x => x.IdProperty == id);
    }
}
