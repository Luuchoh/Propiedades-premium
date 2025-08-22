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
            RuleFor(x => x.OwnerName)
                .NotEmpty().WithMessage("Nombre del propietario es requerida")
                .MinimumLength(5).WithMessage("Nombre del propietario demasiado corta")
                .MaximumLength(500).WithMessage("Nombre del propietario demasiado larga");

            RuleFor(x => x.Phone)
                .NotEmpty().WithMessage("Telefono celular es requerido");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Correo electronico es requerido");

            RuleFor(x => x.Address)
                .NotEmpty().WithMessage("Dirección es requerido");

            RuleFor(x => x.Photo)
                .NotEmpty().WithMessage("Fotografia es requerido");

            RuleFor(x => x.Birthday)
                .NotEmpty().WithMessage("Dia de cumpleaños es requerido");
        }
    }
}