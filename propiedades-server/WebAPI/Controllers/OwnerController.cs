using Application.DTOs;
using Application.DTOs.Request;
using Application.Interfaces;
using Domain.Models;
using Infraestructure.Persistence.Services;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OwnerController : ControllerBase
{
    private readonly IOwner _ownerService;

    public OwnerController(IOwner ownerService) =>
        _ownerService = ownerService;

    [HttpGet("GetAllOwners")]
    public async Task<List<Owner>> Get() =>
        await _ownerService.GetAllAsync();

    [HttpPost("GetOneOwnerById")]
    public async Task<ActionResult<Owner>> Get([FromBody] GeneralIdDTO generalIdDTO)
    {
        var owner = await _ownerService.GetOneByIdAsync(generalIdDTO.MongoGeneralId);

        if (owner is null)
        {
            return NotFound();
        }

        return owner;
    }

    [HttpPost("GetOneOwnerByDNI")]
    public async Task<ActionResult<Owner>> GetByDNI([FromBody] GetByDNIRequest request)
    {
        var owner = await _ownerService.GetOneByDNIAsync(request.DNI);

        if (owner is null)
        {
            return NotFound();
        }

        return owner;
    }

    [HttpPost("CreateOwner")]
    public async Task<IActionResult> Create([FromBody] OwnerDTO ownerDTO)
    {
        Owner newOwner= await _ownerService.CreateAsync(ownerDTO);

        return CreatedAtAction(nameof(Get), ownerDTO);
    }

    [HttpPut("UpdateOwner")]
    public async Task<IActionResult> Update([FromBody] OwnerDTO ownerDTO)
    {
        var owner = await _ownerService.GetOneByIdAsync(ownerDTO.IdOwner!);

        if (owner is null)
        {
            return NotFound();
        }

        await _ownerService.UpdateAsync(ownerDTO);

        return NoContent();
    }

    [HttpDelete("DeleteOwner")]
    public async Task<IActionResult> Delete(GeneralIdDTO generalIdDTO)
    {
        var book = await _ownerService.GetOneByIdAsync(generalIdDTO.MongoGeneralId);

        if (book is null)
        {
            return NotFound();
        }

        await _ownerService.RemoveAsync(generalIdDTO.MongoGeneralId);

        return NoContent();
    }
}
