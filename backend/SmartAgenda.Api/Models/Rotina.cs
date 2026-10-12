namespace SmartAgenda.Api.Models;

public enum Recorrencia
{
    Diaria = 1,
    Semanal = 2,
    Mensal = 3
}

public class Rotina
{
    public int Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string? Descricao { get; set; }
    public Recorrencia Recorrencia { get; set; }
    public TimeOnly HoraInicio { get; set; }
    public TimeOnly HoraFim { get; set; }
    public bool Ativa { get; set; } = true;

    public List<Evento> Eventos { get; set; } = new();

    public int UsuarioId { get; set; }
    public Usuario? Usuario { get; set; }
}