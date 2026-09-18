var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.AddData();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.MapEndpoints();

app.Run();
