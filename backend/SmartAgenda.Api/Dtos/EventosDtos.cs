using System.ComponentModel.DataAnnotations;

namespace SmartAgenda.Api.Dtos;

public class EventoRequestDto : IValidatableObject
{
    [Required, MaxLength(150)]
    public string Titulo { get; set; } = string.Empty;

    public string? Descricao { get; set; }
    public string? Local { get; set; }

    [Required]
    public DateTime DataInicio { get; set; }

    [Required]
    public DateTime DataFim { get; set; }

    public int? RotinaId { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext context)
    {
        if (DataFim <= DataInicio)
            yield return new ValidationResult(
                "DataFim deve ser posterior a DataInicio.",
                new[] { nameof(DataFim) });
    }
}

public class EventoResponseDto
{
    public int Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string? Descricao { get; set; }
    public string? Local { get; set; }
    public DateTime DataInicio { get; set; }
    public DateTime DataFim { get; set; }
    public int? RotinaId { get; set; }
}