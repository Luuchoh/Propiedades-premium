using System;
using System.Collections.Generic;
using Application.DTOs;
using FluentValidation;

namespace Application.Validators
{
    /// <summary>
    /// Validaciones para el DTO OwnerValidator
    /// </summary>
    public class OwnerValidator : AbstractValidator<OwnerDTO>
    {
        public OwnerValidator()
        {
            RuleFor(x => x.DNI)
                .NotEmpty().WithMessage("Nombre es requerido")
                .MinimumLength(2).WithMessage("Nombre demasiado corto")
                .MaximumLength(50).WithMessage("Nombre demasiado largo");

            RuleFor(x => x.OwnerName)
                .NotEmpty().WithMessage("Descripción es requerida")
                .MinimumLength(5).WithMessage("Descripción demasiado corta")
                .MaximumLength(500).WithMessage("Descripción demasiado larga");

            RuleFor(x => x.Address)
                .NotEmpty().WithMessage("Precio es requerido");

            RuleFor(x => x.Photo)
                .NotEmpty().WithMessage("Stock es requerido");

            RuleFor(x => x.Birthday)
                .NotEmpty().WithMessage("Stock es requerido");
        }
    }
}