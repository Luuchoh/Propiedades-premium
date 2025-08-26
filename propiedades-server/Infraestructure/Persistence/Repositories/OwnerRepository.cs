using Application.DTOs;
using Application.Interfaces;
using Domain.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Infraestructure.Persistence.Services
{
    public class OwnerRepository : IOwner
    {
        private readonly IMongoCollection<Owner> _ownerCollection;

        public OwnerRepository(
            IOptions<PropertyPremiumDatabaseSettings> PropertyPremiumDatabaseSettings)
        {
            var mongoClient = new MongoClient(
                PropertyPremiumDatabaseSettings.Value.ConnectionString);

            var mongoDatabase = mongoClient.GetDatabase(
                PropertyPremiumDatabaseSettings.Value.DatabaseName);

            _ownerCollection = mongoDatabase.GetCollection<Owner>(
                PropertyPremiumDatabaseSettings.Value.OwnerCollectionName);
        }

        // Overload constructor to allow injecting a collection for unit testing
        public OwnerRepository(IMongoCollection<Owner> ownerCollection)
        {
            _ownerCollection = ownerCollection;
        }

        public async Task<List<Owner>> GetAllAsync() =>
            await _ownerCollection.Find(_ => true).ToListAsync();

        public async Task<Owner?> GetOneByIdAsync(string generalId) =>
            await _ownerCollection.Find(x => x.IdOwner == generalId).FirstOrDefaultAsync();

        public async Task<Owner?> GetOneByDNIAsync(string dni)
        {
            return await _ownerCollection.Find(x => x.DNI == dni).FirstOrDefaultAsync();
        }

        public async Task<Owner> CreateAsync(OwnerDTO ownerDTO)
        {
            var existingOwner = await GetOneByDNIAsync(ownerDTO.DNI);
            
            if (existingOwner != null)
            {
                throw new Exception("El DNI ya está registrado.");
            }

            var newOwner = new Owner
            {
                OwnerName = ownerDTO.OwnerName,
                DNI = ownerDTO.DNI,
                Phone = ownerDTO.Phone,
                Email = ownerDTO.Email,
                Address = ownerDTO.Address,
                Photo = ownerDTO.Photo,
                Birthday = ownerDTO.Birthday,
                CreatedAt = ownerDTO.CreatedAt ?? DateTime.Now,
            };

            await _ownerCollection.InsertOneAsync(newOwner);

            newOwner.IdOwner = newOwner.IdOwner;

            return newOwner;
        }

        public async Task UpdateAsync(OwnerDTO ownerDTO)
        {
            var updateOwner = Builders<Owner>.Update
                .Set(p => p.OwnerName, ownerDTO.OwnerName)
                .Set(p => p.DNI, ownerDTO.DNI)
                .Set(p => p.Phone, ownerDTO.Phone)
                .Set(p => p.Email, ownerDTO.Email)
                .Set(p => p.Address, ownerDTO.Address)
                .Set(p => p.Photo, ownerDTO.Photo)
                .Set(p => p.Birthday, ownerDTO.Birthday)
                .Set(p => p.CreatedAt, ownerDTO.CreatedAt)
                .Set(p => p.UpdatedAt, DateTime.Now);

            await _ownerCollection.UpdateOneAsync(x => x.IdOwner == ownerDTO.IdOwner, updateOwner);
        }

        public async Task RemoveAsync(string generalId) =>
            await _ownerCollection.DeleteOneAsync(x => x.IdOwner == generalId);
    }
}
