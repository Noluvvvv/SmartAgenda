using System.ComponentModel.DataAnnotations;

namespace SmartAgenda.Api.Dtos;

public class RegistroRequestDto
{
    [Required, MaxLength(150)]
    public string Nome { get; set; } = string.Empty;

    [Required, EmailAddress, MaxLength(200)]
    public string Email { get; set; } = string.Empty;

    [Required, MinLength(6)]
    public string Senha { get; set; } = string.Empty;
}

public class LoginRequestDto
{
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Senha { get; set; } = string.Empty;
}

public class UsuarioResponseDto
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? FotoUrl { get; set; }
}

public class AuthResponseDto
{
    public string Token { get; set; } = string.Empty;
    public UsuarioResponseDto Usuario { get; set; } = new();
}