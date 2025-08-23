using Application.DTOs;
using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IPropertyImage
    {
        Task<PropertyImage?> GetPropertyImageByIdAsync(string generalId);

        Task<PropertyImage> CreateAsync(PropertyImageDTO propertyImageDTO);

        Task UpdateAsync(PropertyImageDTO propertyImageDTO);
    }
}
