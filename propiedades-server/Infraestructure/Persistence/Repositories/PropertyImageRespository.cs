using Application.DTOs;
using Application.Interfaces;
using Domain.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Infraestructure.Persistence.Services
{
    public class PropertyImageRespository : IPropertyImage
    {
        private readonly IMongoCollection<PropertyImage> _images;

        public PropertyImageRespository(
            IOptions<PropertyPremiumDatabaseSettings> PropertyPremiumDatabaseSettings)
        {
            var mongoClient = new MongoClient(
                PropertyPremiumDatabaseSettings.Value.ConnectionString);

            var mongoDatabase = mongoClient.GetDatabase(
                PropertyPremiumDatabaseSettings.Value.DatabaseName);
            _images = mongoDatabase.GetCollection<PropertyImage>(
                PropertyPremiumDatabaseSettings.Value.PropertyImageCollectionName);
        }

        public async Task<PropertyImage> GetPropertyImageByIdAsync(string generalId)
        {
            return await _images.Find(i => i.IdProperty == generalId).FirstOrDefaultAsync();
        }

        public async Task<PropertyImage> CreateAsync(PropertyImageDTO propertyImageDTO)
        {
            PropertyImage newImage = new ()
            {
                IdProperty = propertyImageDTO.IdProperty,
                File = propertyImageDTO?.File,
                Enable = true
            };
            await _images.InsertOneAsync(newImage);

            return newImage;
        }

        public async Task UpdateAsync(PropertyImageDTO propertyImageDTO)
        {
            var updatePropertyImage = Builders<PropertyImage>.Update
                .Set(p => p.IdProperty, propertyImageDTO.IdProperty)
                .Set(p => p.File, propertyImageDTO.File)
                .Set(p => p.Enable, propertyImageDTO.Enable);

            await _images.UpdateOneAsync(x => x.IdPropertyImage == propertyImageDTO.IdPropertyImage, updatePropertyImage);

        }

    }
}
