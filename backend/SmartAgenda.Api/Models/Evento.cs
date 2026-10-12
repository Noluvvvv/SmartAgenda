namespace SmartAgenda.Api.Models;

public class Evento
{
    public int Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string? Descricao { get; set; }
    public string? Local { get; set; }
    public DateTime DataInicio { get; set; }
    public DateTime DataFim { get; set; }

    public int? RotinaId { get; set; }
    public Rotina? Rotina { get; set; }

    public int UsuarioId { get; set; }
    public Usuario? Usuario { get; set; }
}