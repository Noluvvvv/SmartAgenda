using Microsoft.EntityFrameworkCore;
using SmartAgenda.Api.Data;
using SmartAgenda.Api.Dtos;
using SmartAgenda.Api.Models;

namespace SmartAgenda.Api.Services;

public interface IEventoService
{
    Task<List<EventoResponseDto>> ListarAsync();
    Task<EventoResponseDto?> ObterPorIdAsync(int id);
    Task<EventoResponseDto> CriarAsync(EventoRequestDto dto);
    Task<bool> AtualizarAsync(int id, EventoRequestDto dto);
    Task<bool> ExcluirAsync(int id);
}

public class EventoService : IEventoService
{
    private readonly AppDbContext _context;

    public EventoService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<EventoResponseDto>> ListarAsync()
    {
        return await _context.Eventos
            .AsNoTracking()
            .OrderBy(e => e.DataInicio)
            .Select(e => ParaResponse(e))
            .ToListAsync();
    }

    public async Task<EventoResponseDto?> ObterPorIdAsync(int id)
    {
        var evento = await _context.Eventos.AsNoTracking().FirstOrDefaultAsync(e => e.Id == id);
        return evento is null ? null : ParaResponse(evento);
    }

    public async Task<EventoResponseDto> CriarAsync(EventoRequestDto dto)
    {
        var evento = new Evento();
        Aplicar(evento, dto);

        _context.Eventos.Add(evento);
        await _context.SaveChangesAsync();

        return ParaResponse(evento);
    }

    public async Task<bool> AtualizarAsync(int id, EventoRequestDto dto)
    {
        var evento = await _context.Eventos.FindAsync(id);
        if (evento is null) return false;

        Aplicar(evento, dto);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ExcluirAsync(int id)
    {
        var evento = await _context.Eventos.FindAsync(id);
        if (evento is null) return false;

        _context.Eventos.Remove(evento);
        await _context.SaveChangesAsync();
        return true;
    }

    private static void Aplicar(Evento evento, EventoRequestDto dto)
    {
        evento.Titulo = dto.Titulo;
        evento.Descricao = dto.Descricao;
        evento.Local = dto.Local;
        evento.DataInicio = dto.DataInicio.ToUniversalTime();
        evento.DataFim = dto.DataFim.ToUniversalTime();
        evento.RotinaId = dto.RotinaId;
    }

    private static EventoResponseDto ParaResponse(Evento e) => new()
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