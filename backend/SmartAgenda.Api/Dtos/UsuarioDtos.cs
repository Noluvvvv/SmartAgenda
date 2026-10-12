using System.ComponentModel.DataAnnotations;

namespace SmartAgenda.Api.Dtos;

public class AtualizarPerfilRequestDto
{
    [Required, MaxLength(150)]
    public string Nome { get; set; } = string.Empty;

    [Required, EmailAddress, MaxLength(200)]
    public string Email { get; set; } = string.Empty;
}

public class TrocarSenhaRequestDto
{
    [Required]
    public string SenhaAtual { get; set; } = string.Empty;

    [Required, MinLength(6)]
    public string NovaSenha { get; set; } = string.Empty;
}

public class PerfilResponseDto
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? FotoUrl { get; set; }
    public DateTime CriadoEm { get; set; }
    public int TotalEventos { get; set; }
    public int TotalRotinasAtivas { get; set; }
}