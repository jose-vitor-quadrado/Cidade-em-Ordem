using CidadeEmOrdem.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.AddData();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();

    // Aplica as migrations automaticamente
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<OrdemContext>();
    db.Database.Migrate();
}

app.UseHttpsRedirection();

app.MapEndpoints();

app.Run();
