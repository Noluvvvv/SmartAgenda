using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartAgenda.Api.Data;
using SmartAgenda.Api.Dtos;
using System.Security.Claims;

namespace SmartAgenda.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsuariosController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IWebHostEnvironment _env;

    public UsuariosController(AppDbContext context, IWebHostEnvironment env)
    {
        _context = context;
        _env = env;
    }

    private int UsuarioId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("perfil")]
    public async Task<ActionResult<PerfilResponseDto>> GetPerfil()
    {
        var usuario = await _context.Usuarios.FindAsync(UsuarioId);
        if (usuario is null) return NotFound();

        var totalEventos = await _context.Eventos.CountAsync(e => e.UsuarioId == UsuarioId);
        var totalRotinasAtivas = await _context.Rotinas.CountAsync(r => r.UsuarioId == UsuarioId && r.Ativa);

        return Ok(new PerfilResponseDto
        {
            Id = usuario.Id,
            Nome = usuario.Nome,
            Email = usuario.Email,
            FotoUrl = usuario.FotoUrl,
            CriadoEm = usuario.CriadoEm,
            TotalEventos = totalEventos,
            TotalRotinasAtivas = totalRotinasAtivas,
        });
    }

    [HttpPut("perfil")]
    public async Task<IActionResult> AtualizarPerfil(AtualizarPerfilRequestDto dto)
    {
        var usuario = await _context.Usuarios.FindAsync(UsuarioId);
        if (usuario is null) return NotFound();

        var emailEmUso = await _context.Usuarios.AnyAsync(u => u.Email == dto.Email && u.Id != UsuarioId);
        if (emailEmUso) return BadRequest("Este e-mail já está em uso.");

        usuario.Nome = dto.Nome;
        usuario.Email = dto.Email;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpPut("senha")]
    public async Task<IActionResult> TrocarSenha(TrocarSenhaRequestDto dto)
    {
        var usuario = await _context.Usuarios.FindAsync(UsuarioId);
        if (usuario is null) return NotFound();

        if (!BCrypt.Net.BCrypt.Verify(dto.SenhaAtual, usuario.SenhaHash))
            return BadRequest("Senha atual incorreta.");

        usuario.SenhaHash = BCrypt.Net.BCrypt.HashPassword(dto.NovaSenha);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpPost("foto")]
    [RequestSizeLimit(5_000_000)]
    public async Task<ActionResult<object>> UploadFoto(IFormFile arquivo)
    {
        if (arquivo.Length == 0)
            return BadRequest("Arquivo vazio.");

        var extensoesPermitidas = new[] { ".jpg", ".jpeg", ".png", ".webp" };
        var extensao = Path.GetExtension(arquivo.FileName).ToLowerInvariant();
        if (!extensoesPermitidas.Contains(extensao))
            return BadRequest("Formato de imagem não suportado.");

        var usuario = await _context.Usuarios.FindAsync(UsuarioId);
        if (usuario is null) return NotFound();

        var pastaUploads = Path.Combine(_env.WebRootPath ?? "wwwroot", "uploads");
        Directory.CreateDirectory(pastaUploads);

        var nomeArquivo = $"usuario-{UsuarioId}{extensao}";
        var caminhoCompleto = Path.Combine(pastaUploads, nomeArquivo);

        await using (var stream = new FileStream(caminhoCompleto, FileMode.Create))
        {
            await arquivo.CopyToAsync(stream);
        }

        usuario.FotoUrl = $"/uploads/{nomeArquivo}";
        await _context.SaveChangesAsync();

        return Ok(new { fotoUrl = usuario.FotoUrl });
    }
}