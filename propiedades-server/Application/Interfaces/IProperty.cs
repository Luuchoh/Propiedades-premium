using Application.DTOs;
using Domain.Models;

namespace Application.Interfaces
{
    public interface IProperty
    {
        Task<List<PropertyDTO>> GetAllAsync();

        Task<PropertyDTO> GetOneByIdAsync(string generalId);

        Task<PropertyDTO> CreateAsync(PropertyDTO PropertyDTO);

        Task UpdateAsync(PropertyDTO PropertyDTO);

        Task RemoveAsync(string generalId);
    }
}
