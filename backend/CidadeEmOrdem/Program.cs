using CidadeEmOrdem.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Builder Extensions
builder.AddData();
builder.AddFrontend();

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

app.UseStaticFiles();

// Habilita o frontend
app.UseCors("FrontendPolicy");

// Endpoint Extensions
app.MapEndpoints();

app.Run();
