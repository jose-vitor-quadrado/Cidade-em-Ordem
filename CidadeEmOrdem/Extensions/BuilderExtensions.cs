using CidadeEmOrdem.Data;
using Microsoft.EntityFrameworkCore;

namespace CidadeEmOrdem.Extensions;

public static class BuilderExtensions
{
    public static void AddData(this WebApplicationBuilder builder)
    {
        builder.Services.AddDbContext<OrdemContext>(options =>
            options.UseSqlite("Data Source=cidadeemordem.db"));
    }
}
