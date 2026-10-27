using CidadeEmOrdem.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

// Builder Extensions
builder.AddData();

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy
            .WithOrigins("http://localhost:5500")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

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
