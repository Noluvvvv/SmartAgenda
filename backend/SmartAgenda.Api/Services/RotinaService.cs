using Microsoft.EntityFrameworkCore;
using SmartAgenda.Api.Data;
using SmartAgenda.Api.Dtos;
using SmartAgenda.Api.Models;

namespace SmartAgenda.Api.Services;

public interface IRotinaService
{
    Task<List<RotinaResponseDto>> ListarAsync();
    Task<RotinaResponseDto?> ObterPorIdAsync(int id);
    Task<RotinaResponseDto> CriarAsync(RotinaRequestDto dto);
    Task<bool> AtualizarAsync(int id, RotinaRequestDto dto);
    Task<bool> ExcluirAsync(int id);
}

public class RotinaService : IRotinaService
{
    private readonly AppDbContext _context;

    public RotinaService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<RotinaResponseDto>> ListarAsync()
    {
        return await _context.Rotinas
            .AsNoTracking()
            .OrderBy(r => r.HoraInicio)
            .Select(r => ParaResponse(r))
            .ToListAsync();
    }

    public async Task<RotinaResponseDto?> ObterPorIdAsync(int id)
    {
        var rotina = await _context.Rotinas.AsNoTracking().FirstOrDefaultAsync(r => r.Id == id);
        return rotina is null ? null : ParaResponse(rotina);
    }

    public async Task<RotinaResponseDto> CriarAsync(RotinaRequestDto dto)
    {
        var rotina = new Rotina();
        Aplicar(rotina, dto);

        _context.Rotinas.Add(rotina);
        await _context.SaveChangesAsync();

        return ParaResponse(rotina);
    }

    public async Task<bool> AtualizarAsync(int id, RotinaRequestDto dto)
    {
        var rotina = await _context.Rotinas.FindAsync(id);
        if (rotina is null) return false;

        Aplicar(rotina, dto);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ExcluirAsync(int id)
    {
        var rotina = await _context.Rotinas.FindAsync(id);
        if (rotina is null) return false;

        _context.Rotinas.Remove(rotina);
        await _context.SaveChangesAsync();
        return true;
    }

    private static void Aplicar(Rotina rotina, RotinaRequestDto dto)
    {
        rotina.Titulo = dto.Titulo;
        rotina.Descricao = dto.Descricao;
        rotina.Recorrencia = dto.Recorrencia;
        rotina.HoraInicio = dto.HoraInicio;
        rotina.HoraFim = dto.HoraFim;
        rotina.Ativa = dto.Ativa;
    }

    private static RotinaResponseDto ParaResponse(Rotina r) => new()
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