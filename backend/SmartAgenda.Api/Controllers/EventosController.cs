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
public class EventosController : ControllerBase
{
    private readonly AppDbContext _context;

    public EventosController(AppDbContext context)
    {
        _context = context;
    }

    private int UsuarioId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<ActionResult<IEnumerable<EventoResponseDto>>> GetEventos()
    {
        var eventos = await _context.Eventos
            .AsNoTracking()
            .Where(e => e.UsuarioId == UsuarioId)
            .Select(e => ToResponseDto(e))
            .ToListAsync();

        return Ok(eventos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<EventoResponseDto>> GetEvento(int id)
    {
        var evento = await _context.Eventos.FirstOrDefaultAsync(e => e.Id == id && e.UsuarioId == UsuarioId);

        if (evento is null)
            return NotFound();

        return Ok(ToResponseDto(evento));
    }

    [HttpGet("horarios-livres")]
    public async Task<ActionResult<IEnumerable<object>>> GetHorariosLivres(
        [FromQuery] DateOnly data,
        [FromQuery] TimeOnly? inicioJanela = null,
        [FromQuery] TimeOnly? fimJanela = null,
        [FromQuery] int duracaoMinimaMinutos = 30)
    {
        var janelaInicio = data.ToDateTime(inicioJanela ?? new TimeOnly(8, 0));
        var janelaFim = data.ToDateTime(fimJanela ?? new TimeOnly(22, 0));

        var eventosDoDia = await _context.Eventos
            .Where(e => e.UsuarioId == UsuarioId)
            .Where(e => e.DataInicio < janelaFim && e.DataFim > janelaInicio)
            .OrderBy(e => e.DataInicio)
            .ToListAsync();

        var livres = new List<object>();
        var cursor = janelaInicio;

        foreach (var evento in eventosDoDia)
        {
            var inicioEvento = evento.DataInicio < janelaInicio ? janelaInicio : evento.DataInicio;

            if (inicioEvento > cursor)
            {
                var duracao = inicioEvento - cursor;
                if (duracao.TotalMinutes >= duracaoMinimaMinutos)
                {
                    livres.Add(new { inicio = cursor, fim = inicioEvento });
                }
            }

            if (evento.DataFim > cursor)
                cursor = evento.DataFim;
        }

        if (cursor < janelaFim)
        {
            var duracao = janelaFim - cursor;
            if (duracao.TotalMinutes >= duracaoMinimaMinutos)
            {
                livres.Add(new { inicio = cursor, fim = janelaFim });
            }
        }

        return Ok(livres);
    }

    [HttpPost]
    public async Task<ActionResult<EventoResponseDto>> CreateEvento(EventoRequestDto dto)
    {
        if (dto.RotinaId is not null)
        {
            var rotinaExiste = await _context.Rotinas.AnyAsync(r => r.Id == dto.RotinaId && r.UsuarioId == UsuarioId);
            if (!rotinaExiste)
                return BadRequest($"RotinaId {dto.RotinaId} não existe.");
        }

        var conflito = await ExisteConflito(dto.DataInicio, dto.DataFim, idEventoAtual: null);
        if (conflito is not null)
            return Conflict($"Conflito de horário com o evento \"{conflito.Titulo}\" ({conflito.DataInicio:HH:mm} - {conflito.DataFim:HH:mm}).");

        var evento = new Evento
        {
            Titulo = dto.Titulo,
            Descricao = dto.Descricao,
            Local = dto.Local,
            DataInicio = dto.DataInicio,
            DataFim = dto.DataFim,
            RotinaId = dto.RotinaId,
            UsuarioId = UsuarioId,
        };

        _context.Eventos.Add(evento);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetEvento), new { id = evento.Id }, ToResponseDto(evento));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateEvento(int id, EventoRequestDto dto)
    {
        var evento = await _context.Eventos.FirstOrDefaultAsync(e => e.Id == id && e.UsuarioId == UsuarioId);
        if (evento is null)
            return NotFound();

        if (dto.RotinaId is not null)
        {
            var rotinaExiste = await _context.Rotinas.AnyAsync(r => r.Id == dto.RotinaId && r.UsuarioId == UsuarioId);
            if (!rotinaExiste)
                return BadRequest($"RotinaId {dto.RotinaId} não existe.");
        }

        var conflito = await ExisteConflito(dto.DataInicio, dto.DataFim, idEventoAtual: id);
        if (conflito is not null)
            return Conflict($"Conflito de horário com o evento \"{conflito.Titulo}\" ({conflito.DataInicio:HH:mm} - {conflito.DataFim:HH:mm}).");

        evento.Titulo = dto.Titulo;
        evento.Descricao = dto.Descricao;
        evento.Local = dto.Local;
        evento.DataInicio = dto.DataInicio;
        evento.DataFim = dto.DataFim;
        evento.RotinaId = dto.RotinaId;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteEvento(int id)
    {
        var evento = await _context.Eventos.FirstOrDefaultAsync(e => e.Id == id && e.UsuarioId == UsuarioId);
        if (evento is null)
            return NotFound();

        _context.Eventos.Remove(evento);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private async Task<Evento?> ExisteConflito(DateTime inicio, DateTime fim, int? idEventoAtual)
    {
        return await _context.Eventos
            .Where(e => e.UsuarioId == UsuarioId)
            .Where(e => idEventoAtual == null || e.Id != idEventoAtual)
            .Where(e => inicio < e.DataFim && fim > e.DataInicio)
            .FirstOrDefaultAsync();
    }

    private static EventoResponseDto ToResponseDto(Evento e) => new()
    {
        Id = e.Id,
        Titulo = e.Titulo,
        Descricao = e.Descricao,
        Local = e.Local,
        DataInicio = e.DataInicio,
        DataFim = e.DataFim,
        RotinaId = e.RotinaId
    };
}