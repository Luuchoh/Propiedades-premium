using Application.DTOs;
using Domain.Models;

namespace Application.Interfaces
{
    public interface IOwner
    {
        Task<List<Owner>> GetAsync();
     
        Task<Owner?> GetAsync(string id);
        
        Task CreateAsync(OwnerDTO ownerDTO);
        
        Task UpdateAsync(string id, OwnerDTO ownerDTO);
        
        Task RemoveAsync(string id);

    }
}

