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
                .NotEmpty().WithMessage("Stock es requerido");

            RuleFor(x => x.Address)
                .NotEmpty().WithMessage("Precio es requerido");

            RuleFor(x => x.Price)
                .NotEmpty().WithMessage("Stock es requerido");

            RuleFor(x => x.Rooms)
                .NotEmpty().WithMessage("Stock es requerido");

            RuleFor(x => x.Bathrooms)
                .NotEmpty().WithMessage("Stock es requerido");

            RuleFor(x => x.Area)
                .NotEmpty().WithMessage("Stock es requerido");

            RuleFor(x => x.YearConstruction)
                .NotEmpty().WithMessage("Stock es requerido");

            RuleFor(x => x.AnnualTax)
                .NotEmpty().WithMessage("Stock es requerido");

            RuleFor(x => x.MonthlyExpenses)
                .NotEmpty().WithMessage("Stock es requerido");

            RuleFor(x => x.Description)
                .NotEmpty().WithMessage("Stock es requerido");

            RuleFor(x => x.Features)
                .NotEmpty().WithMessage("Stock es requerido");
        }
    }
}
