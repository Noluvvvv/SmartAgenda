using System.ComponentModel.DataAnnotations;
using SmartAgenda.Api.Models;

namespace SmartAgenda.Api.Dtos;

public class RotinaRequestDto : IValidatableObject
{
    [Required, MaxLength(150)]
    public string Titulo { get; set; } = string.Empty;

    public string? Descricao { get; set; }

    [EnumDataType(typeof(Recorrencia))]
    public Recorrencia Recorrencia { get; set; }

    [Required]
    public TimeOnly HoraInicio { get; set; }

    [Required]
    public TimeOnly HoraFim { get; set; }

    public bool Ativa { get; set; } = true;

    public IEnumerable<ValidationResult> Validate(ValidationContext context)
    {
        if (HoraFim <= HoraInicio)
            yield return new ValidationResult(
                "HoraFim deve ser posterior a HoraInicio.",
                new[] { nameof(HoraFim) });
    }
}

public class RotinaResponseDto
{
    public int Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string? Descricao { get; set; }
    public Recorrencia Recorrencia { get; set; }
    public TimeOnly HoraInicio { get; set; }
    public TimeOnly HoraFim { get; set; }
    public bool Ativa { get; set; }
}