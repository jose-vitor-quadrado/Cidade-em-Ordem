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
        app.MapGet("/problemas", async (IOrdemService service) =>
        {
            var lista = await service.GetAllAsync();
            return Results.Ok(lista);
        });

        app.MapGet("/problemas/{id}", async (int id, IOrdemService service) =>
        {
            var ordem = await service.GetByIdAsync(id);
            return ordem is not null
                ? Results.Ok(ordem)
                : Results.NotFound($"Ordem com id {id} não encontrada.");
        });

        app.MapGet("/problemas/tipo/{tipoProblema}", (TipoProblema tipoProblema, IOrdemService service) =>
        {
            var ordens = service.GetByTipoProblema(tipoProblema);
            return ordens.Any()
                ? Results.Ok(ordens)
                : Results.NotFound($"Ordem com o problema {tipoProblema} não encontrada.");
        });

        app.MapGet("/problemas/estado/{estado}", (string estado, IOrdemService service) =>
        {
            var ordens = service.GetByEstado(estado);
            return ordens.Any()
                ? Results.Ok(ordens)
                : Results.NotFound($"Ordem com o estado {estado} não encontrada.");
        });

        app.MapGet("/problemas/cidade/{cidade}", (string cidade, IOrdemService service) =>
        {
            var ordens = service.GetByCidade(cidade);
            return ordens.Any()
                ? Results.Ok(ordens)
                : Results.NotFound($"Ordem com a cidade {cidade} não encontrada.");
        });

        app.MapGet("/problemas/bairro/{bairro}", (string bairro, IOrdemService service) =>
        {
            var ordens = service.GetByBairro(bairro);
            return ordens.Any()
                ? Results.Ok(ordens)
                : Results.NotFound($"Ordem com o bairro {bairro} não encontrada.");
        });

        app.MapGet("/problemas/logradouro/{logradouro}", (string logradouro, IOrdemService service) =>
        {
            var ordens = service.GetByLogradouro(logradouro);
            return ordens.Any()
                ? Results.Ok(ordens)
                : Results.NotFound($"Ordem com o logradouro {logradouro} não encontrada.");
        });

        app.MapGet("/problemas/prioridade/{prioridade}", (Prioridade prioridade, IOrdemService service) =>
        {
            var ordens = service.GetByPrioridade(prioridade);
            return ordens.Any()
                ? Results.Ok(ordens)
                : Results.NotFound($"Ordem com a prioridade {prioridade} não encontrada.");
        });

        app.MapPost("/problemas", async (Ordem ordens, IOrdemService service) =>
        {
            try
            {
                var novaOrdem = await service.CriarOrdemAsync(ordens);
                return Results.Created($"/problemas/{novaOrdem.Id}", novaOrdem);
            }
            catch (ArgumentException ex)
            {
                return Results.BadRequest(ex.Message);
            }
        });

        app.MapPut("/problemas/{id}", async (int id, Ordem ordens, IOrdemService service) =>
        {
            try
            {
                var atualizada = await service.AtualizarOrdemAsync(id, ordens);
                return Results.Ok(atualizada);
            }
            catch (KeyNotFoundException ex)
            {
                return Results.NotFound(ex.Message);
            }
        });

        app.MapDelete("/problemas/{id}", async (int id, IOrdemService service) =>
        {
            try
            {
                await service.RemoverOrdemAsync(id);
                return Results.NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return Results.NotFound(ex.Message);
            }
        });

        app.MapPost("/problemas/{id}/upload-imagem", async (int id, IFormFile imagem, IOrdemService service, IWebHostEnvironment env) =>
        {
            try
            {
                var imagemUrl = await service.SalvarImagemAsync(id, imagem, env.WebRootPath);
                return Results.Ok(new { ImagemUrl = imagemUrl });
            }
            catch (KeyNotFoundException ex)
            {
                return Results.NotFound(ex.Message);
            }
            catch (ArgumentException ex)
            {
                return Results.BadRequest(ex.Message);
            }
        })
        .DisableAntiforgery();

        return app;
    }
}
