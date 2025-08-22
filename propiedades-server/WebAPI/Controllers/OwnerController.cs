using Application.DTOs;
using Domain.Models;
using Infraestructure.Persistence.Services;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OwnerController : ControllerBase
{
    private readonly OwnerService _ownerService;

    public OwnerController(OwnerService ownerService) =>
        _ownerService = ownerService;

    [HttpGet]
    public async Task<List<Owner>> Get() =>
        await _ownerService.GetAsync();

    [HttpGet("{id:length(24)}")]
    public async Task<ActionResult<Owner>> Get(string id)
    {
        var book = await _ownerService.GetAsync(id);

        if (book is null)
        {
            return NotFound();
        }

        return book;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] OwnerDTO ownerDTO)
    {
        await _ownerService.CreateAsync(ownerDTO);

        return CreatedAtAction(nameof(Get), ownerDTO);
    }

    [HttpPut("{id:length(24)}")]
    public async Task<IActionResult> Update(string id, [FromBody] OwnerDTO ownerDTO)
    {
        var owner = await _ownerService.GetAsync(id);

        if (owner is null)
        {
            return NotFound();
        }

        await _ownerService.UpdateAsync(id, ownerDTO);

        return NoContent();
    }

    [HttpDelete("{id:length(24)}")]
    public async Task<IActionResult> Delete(string id)
    {
        var book = await _ownerService.GetAsync(id);

        if (book is null)
        {
            return NotFound();
        }

        await _ownerService.RemoveAsync(id);

        return NoContent();
    }
}
