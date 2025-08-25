using Application.DTOs;
using Application.Interfaces;
using Domain.Models;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PropertyController : ControllerBase
    {
        private readonly IProperty _propertyService;

        public PropertyController(IProperty propertyService) =>
            _propertyService = propertyService;

        [HttpGet("GetAllProperties")]
        public async Task<List<PropertyDTO>> Get() =>
            await _propertyService.GetAllAsync();

        [HttpGet("GetOnePropertyByID")]
        public async Task<ActionResult<PropertyDTO>> Get([FromBody] GeneralIdDTO generalIdDTO)
        {
            var property = await _propertyService.GetOneByIdAsync(generalIdDTO.MongoGeneralId);

            if (property is null)
            {
                return NotFound();
            }

            return property;
        }

        [HttpPost("CreateProperty")]
        public async Task<IActionResult> Create([FromBody] PropertyDTO propertyDTO)
        {
            PropertyDTO newProperty =  await _propertyService.CreateAsync(propertyDTO);

            return CreatedAtAction(nameof(Get), newProperty);
        }

        [HttpPut("UpdateProperty")]
        public async Task<IActionResult> Update([FromBody] PropertyDTO propertyDTO)
        {
            var property = await _propertyService.GetOneByIdAsync(propertyDTO.IdProperty!);

            if (property is null)
            {
                return NotFound();
            }

            await _propertyService.UpdateAsync(propertyDTO);

            return NoContent();
        }

        [HttpDelete("DeleteProperty")]
        public async Task<IActionResult> Delete([FromBody] GeneralIdDTO generalIdDTO)
        {
            var property = await _propertyService.GetOneByIdAsync(generalIdDTO.MongoGeneralId);

            if (property is null)
            {
                return NotFound();
            }

            await _propertyService.RemoveAsync(generalIdDTO.MongoGeneralId);

            return NoContent();
        }
    }

}
