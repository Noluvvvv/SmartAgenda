using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartAgenda.Api.Data;
using SmartAgenda.Api.Dtos;
using SmartAgenda.Api.Models;
using System.Security.Claims;

namespace SmartAgenda.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class RotinasController : ControllerBase
{
    private readonly AppDbContext _context;

    public RotinasController(AppDbContext context)
    {
        _context = context;
    }

    private int UsuarioId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<ActionResult<IEnumerable<RotinaResponseDto>>> GetRotinas()
    {
        var rotinas = await _context.Rotinas
            .AsNoTracking()
            .Where(r => r.UsuarioId == UsuarioId)
            .Select(r => ToResponseDto(r))
            .ToListAsync();

        return Ok(rotinas);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<RotinaResponseDto>> GetRotina(int id)
    {
        var rotina = await _context.Rotinas.FirstOrDefaultAsync(r => r.Id == id && r.UsuarioId == UsuarioId);

        if (rotina is null)
            return NotFound();

        return Ok(ToResponseDto(rotina));
    }

    [HttpPost]
    public async Task<ActionResult<RotinaResponseDto>> CreateRotina(RotinaRequestDto dto)
    {
        var rotina = new Rotina
        {
            Titulo = dto.Titulo,
            Descricao = dto.Descricao,
            Recorrencia = dto.Recorrencia,
            HoraInicio = dto.HoraInicio,
            HoraFim = dto.HoraFim,
            Ativa = dto.Ativa,
            UsuarioId = UsuarioId,
        };

        _context.Rotinas.Add(rotina);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetRotina), new { id = rotina.Id }, ToResponseDto(rotina));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateRotina(int id, RotinaRequestDto dto)
    {
        var rotina = await _context.Rotinas.FirstOrDefaultAsync(r => r.Id == id && r.UsuarioId == UsuarioId);
        if (rotina is null)
            return NotFound();

        rotina.Titulo = dto.Titulo;
        rotina.Descricao = dto.Descricao;
        rotina.Recorrencia = dto.Recorrencia;
        rotina.HoraInicio = dto.HoraInicio;
        rotina.HoraFim = dto.HoraFim;
        rotina.Ativa = dto.Ativa;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRotina(int id)
    {
        var rotina = await _context.Rotinas.FirstOrDefaultAsync(r => r.Id == id && r.UsuarioId == UsuarioId);
        if (rotina is null)
            return NotFound();

        _context.Rotinas.Remove(rotina);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private static RotinaResponseDto ToResponseDto(Rotina r) => new()
    {
        Id = r.Id,
        Titulo = r.Titulo,
        Descricao = r.Descricao,
        Recorrencia = r.Recorrencia,
        HoraInicio = r.HoraInicio,
        HoraFim = r.HoraFim,
        Ativa = r.Ativa
    };
}