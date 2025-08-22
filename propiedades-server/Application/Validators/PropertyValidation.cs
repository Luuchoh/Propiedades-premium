using Application.DTOs;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Validators
{
    /// <summary>
    /// Validaciones para el DTO OwnerValidator
    /// </summary>
    public class PropertyValidator : AbstractValidator<PropertyDTO>
    {
        public PropertyValidator()
        {
            RuleFor(x => x.PropertyName)
                .NotEmpty().WithMessage("Nombre de la propiedad es requerido");

            RuleFor(x => x.PropertyType)
                .NotEmpty().WithMessage("Tipo de propiedad es requerido");

            RuleFor(x => x.Address)
                .NotEmpty().WithMessage("Dirrección es requerido");

            RuleFor(x => x.Price)
                .NotEmpty().WithMessage("Precio es requerido");

            RuleFor(x => x.Rooms)
                .NotEmpty().WithMessage("Habitaciones es requerido");

            RuleFor(x => x.Bathrooms)
                .NotEmpty().WithMessage("Baños es requerido");

            RuleFor(x => x.Area)
                .NotEmpty().WithMessage("Area es requerido");

            RuleFor(x => x.YearConstruction)
                .NotEmpty().WithMessage("Año de construcción es requerido");

            RuleFor(x => x.AnnualTax)
                .NotEmpty().WithMessage("Impuesto anual es requerido");

            RuleFor(x => x.MonthlyExpenses)
                .NotEmpty().WithMessage("Gastos mensuales es requerido");

            RuleFor(x => x.Description)
                .NotEmpty().WithMessage("Descripción es requerido");

            RuleFor(x => x.Features)
                .NotEmpty().WithMessage("Caracteristicas es requerido");
        }
    }
}
