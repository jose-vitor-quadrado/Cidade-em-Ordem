using CidadeEmOrdem.Models;
using CidadeEmOrdem.Services;

namespace CidadeEmOrdem.Endpoints;

/* 
 * Nesta classe ficarão todas as rotas relacionadas
 * ao envio dos problemas
 * Ex: MapGet() MapPost() MapPut() MapDelete()
*/
public static class OrdemEndpoint
{
    public static WebApplication MapOrdemEndpoints(this WebApplication app)
    {
        app.MapGet("/problemas", (IOrdemService service) =>
        {
            var lista = service.GetAll();
            return Results.Ok(lista);
        });

        app.MapGet("/problemas/{id}", (int id, IOrdemService service) =>
        {
            var ordem = service.GetById(id);
            return ordem is not null
                ? Results.Ok(ordem)
                : Results.NotFound($"Ordem com id {id} não encontrada.");
        });

        app.MapPost("/problemas", (Ordem ordem, IOrdemService service) =>
        {
            try
            {
                var novaOrdem = service.CriarOrdem(ordem);
                return Results.Created($"/problemas/{novaOrdem.Id}", novaOrdem);
            }
            catch (ArgumentException ex)
            {
                return Results.BadRequest(ex.Message);
            }
        });

        app.MapPut("/problemas/{id}", (int id, Ordem ordem, IOrdemService service) =>
        {
            try
            {
                var atualizada = service.AtualizarOrdem(id, ordem);
                return Results.Ok(atualizada);
            }
            catch (KeyNotFoundException ex)
            {
                return Results.NotFound(ex.Message);
            }
        });

        app.MapDelete("/problemas/{id}", (int id, IOrdemService service) =>
        {
            try
            {
                service.RemoverOrdem(id);
                return Results.NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return Results.NotFound(ex.Message);
            }
        });

        return app;
    }
}
