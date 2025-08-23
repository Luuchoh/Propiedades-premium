using Application.DTOs;
using Domain.Models;

namespace Application.Interfaces
{
    public interface IOwner
    {
        Task<List<Owner>> GetAllAsync();
     
        Task<Owner?> GetOneByIdAsync(string generalId);
        
        Task CreateAsync(OwnerDTO ownerDTO);
        
        Task UpdateAsync(OwnerDTO ownerDTO);
        
        Task RemoveAsync(string generalId);

    }
}

