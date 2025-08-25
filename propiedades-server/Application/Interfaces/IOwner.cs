using Application.DTOs;
using Domain.Models;

namespace Application.Interfaces
{
    public interface IOwner
    {
        Task<List<Owner>> GetAllAsync();
     
        Task<Owner?> GetOneByIdAsync(string generalId);

        Task<Owner?> GetOneByDNIAsync(string dni);

        Task<Owner> CreateAsync(OwnerDTO ownerDTO);
        
        Task UpdateAsync(OwnerDTO ownerDTO);
        
        Task RemoveAsync(string generalId);

    }
}

