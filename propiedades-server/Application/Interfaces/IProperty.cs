using Application.DTOs;
using Domain.Models;

namespace Application.Interfaces
{
    public interface IProperty
    {
        Task<List<Property>> GetAsync();

        Task<Property?> GetAsync(string id);

        Task CreateAsync(PropertyDTO PropertyDTO);

        Task UpdateAsync(string id, PropertyDTO PropertyDTO);

        Task RemoveAsync(string id);
    }
}
