using Application.DTOs;
using Application.Interfaces;
using Domain.Models;
using Infraestructure.Persistence.Services;
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

        [HttpGet]
        public async Task<List<Property>> Get() =>
            await _propertyService.GetAsync();

        [HttpGet("{id:length(24)}")]
        public async Task<ActionResult<Property>> Get(string id)
        {
            var book = await _propertyService.GetAsync(id);

            if (book is null)
            {
                return NotFound();
            }

            return book;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] PropertyDTO propertyDTO)
        {
            await _propertyService.CreateAsync(propertyDTO);

            return CreatedAtAction(nameof(Get), propertyDTO);
        }

        [HttpPut("{id:length(24)}")]
        public async Task<IActionResult> Update(string id, [FromBody] PropertyDTO propertyDTO)
        {
            var owner = await _propertyService.GetAsync(id);

            if (owner is null)
            {
                return NotFound();
            }

            await _propertyService.UpdateAsync(id, propertyDTO);

            return NoContent();
        }

        [HttpDelete("{id:length(24)}")]
        public async Task<IActionResult> Delete(string id)
        {
            var book = await _propertyService.GetAsync(id);

            if (book is null)
            {
                return NotFound();
            }

            await _propertyService.RemoveAsync(id);

            return NoContent();
        }
    }

}
