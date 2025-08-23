using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using FluentValidation;
using Application.DTOs;
using Application.Validators;
using Application.Interfaces;
using Domain.Models;
using Infraestructure.Persistence.Services;

namespace Infraestructure.Configurations;

public static class DependencyInjection
{
    /// <summary>
    /// Desacoplamiento de algunas dependencias
    /// </summary>
    /// <param name="configuration">Configuracion de builder - appsettings</param>
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {

        // Registro de servicios de dominio
        RegisterDomainServices(services);

        // Registro de validadores
        RegisterValidators(services);

        return services;
    }

    /// <summary>
    /// Registra los servicios de dominio
    /// </summary>
    private static void RegisterDomainServices(IServiceCollection services)
    {
        services.AddScoped<IOwner, OwnerService>();
        services.AddScoped<IProperty, PropertyService>();
        services.AddScoped<IPropertyImage, PropertyImageService>();
    }

    /// <summary>
    /// Registra los validadores usando FluentValidation
    /// </summary>
    private static void RegisterValidators(IServiceCollection services)
    {
        // Registro manual 
        services.AddScoped<IValidator<OwnerDTO>, OwnerValidator>();
        services.AddScoped<IValidator<PropertyDTO>, PropertyValidator>();

    }
}