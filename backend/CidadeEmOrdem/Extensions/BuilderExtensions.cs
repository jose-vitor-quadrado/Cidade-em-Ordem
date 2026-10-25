using CidadeEmOrdem.Data;
using CidadeEmOrdem.Repositories;
using CidadeEmOrdem.Services;
using Microsoft.EntityFrameworkCore;

namespace CidadeEmOrdem.Extensions;

public static class BuilderExtensions
{
    public static void AddData(this WebApplicationBuilder builder)
    {
        builder.Services.AddDbContext<OrdemContext>(options =>
            options.UseSqlite("Data Source=cidadeemordem.db"));
        builder.Services.AddScoped<IOrdemRepository, OrdemRepository>();
        builder.Services.AddScoped<IOrdemService, OrdemService>();
        builder.Services.AddOpenApi();
    }

    public static void AddFrontend(this WebApplicationBuilder builder)
    {
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("FrontendPolicy", policy =>
            {
                policy
                    .WithOrigins("http://127.0.0.1:5500")
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            });
        });
    }
}
