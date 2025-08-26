using Application.DTOs;
using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PropertyController : ControllerBase
    {
        private readonly IProperty _porpertyRepository;

        public PropertyController(IProperty propertyService) =>
            _porpertyRepository = propertyService;

        [HttpGet("GetAllProperties")]
        public async Task<List<PropertyDTO>> Get() =>
            await _porpertyRepository.GetAllAsync();

        [HttpGet("GetOnePropertyByID")]
        public async Task<ActionResult<PropertyDTO>> Get([FromBody] GeneralIdDTO generalIdDTO)
        {
            var property = await _porpertyRepository.GetOneByIdAsync(generalIdDTO.MongoGeneralId);

            if (property is null)
            {
                return NotFound();
            }

            return property;
        }

        [HttpPost("CreateProperty")]
        public async Task<IActionResult> Create([FromBody] PropertyDTO propertyDTO)
        {
            PropertyDTO newProperty =  await _porpertyRepository.CreateAsync(propertyDTO);

            return CreatedAtAction(nameof(Get), newProperty);
        }

        [HttpPut("UpdateProperty")]
        public async Task<IActionResult> Update([FromBody] PropertyDTO propertyDTO)
        {
            var property = await _porpertyRepository.GetOneByIdAsync(propertyDTO.IdProperty!);

            if (property is null)
            {
                return NotFound();
            }

            var propertyUpdeted = await _porpertyRepository.UpdateAsync(propertyDTO);

            return Ok(propertyUpdeted);

        }

        [HttpDelete("DeleteProperty")]
        public async Task<IActionResult> Delete([FromBody] GeneralIdDTO generalIdDTO)
        {
            var property = await _porpertyRepository.GetOneByIdAsync(generalIdDTO.MongoGeneralId);

            if (property is null)
            {
                return NotFound();
            }

            await _porpertyRepository.RemoveAsync(generalIdDTO.MongoGeneralId);

            return NoContent();
        }
    }

}
