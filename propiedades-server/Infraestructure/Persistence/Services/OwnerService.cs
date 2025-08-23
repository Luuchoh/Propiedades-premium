using Application.DTOs;
using Application.Interfaces;
using Domain.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Infraestructure.Persistence.Services
{
    public class OwnerService : IOwner
    {
        private readonly IMongoCollection<Owner> _ownerCollection;

        public OwnerService(
            IOptions<PropertyPremiumDatabaseSettings> PropertyPremiumDatabaseSettings)
        {
            var mongoClient = new MongoClient(
                PropertyPremiumDatabaseSettings.Value.ConnectionString);

            var mongoDatabase = mongoClient.GetDatabase(
                PropertyPremiumDatabaseSettings.Value.DatabaseName);

            _ownerCollection = mongoDatabase.GetCollection<Owner>(
                PropertyPremiumDatabaseSettings.Value.OwnerCollectionName);
        }

        public async Task<List<Owner>> GetAllAsync() =>
            await _ownerCollection.Find(_ => true).ToListAsync();

        public async Task<Owner?> GetOneByIdAsync(string generalId) =>
            await _ownerCollection.Find(x => x.IdOwner == generalId).FirstOrDefaultAsync();

        public async Task CreateAsync(OwnerDTO ownerDTO)
        {
            var newOwner = new Owner
            {
                OwnerName = ownerDTO.OwnerName,
                Phone = ownerDTO.Phone,
                Email = ownerDTO.Email,
                Address = ownerDTO.Address,
                Photo = ownerDTO.Photo,
                Birthday = ownerDTO.Birthday,
            };

            await _ownerCollection.InsertOneAsync(newOwner);
        }

        public async Task UpdateAsync(OwnerDTO ownerDTO)
        {
            var updateOwner = Builders<Owner>.Update
                .Set(p => p.OwnerName, ownerDTO.OwnerName)
                .Set(p => p.Phone, ownerDTO.Phone)
                .Set(p => p.Email, ownerDTO.Email)
                .Set(p => p.Address, ownerDTO.Address)
                .Set(p => p.Photo, ownerDTO.Photo)
                .Set(p => p.Birthday, ownerDTO.Birthday);

            await _ownerCollection.UpdateOneAsync(x => x.IdOwner == ownerDTO.IdOwner, updateOwner);
        }

        public async Task RemoveAsync(string generalId) =>
            await _ownerCollection.DeleteOneAsync(x => x.IdOwner == generalId);
    }
}
