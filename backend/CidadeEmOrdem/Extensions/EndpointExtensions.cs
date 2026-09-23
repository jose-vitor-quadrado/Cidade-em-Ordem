using CidadeEmOrdem.Endpoints;

namespace CidadeEmOrdem.Extensions;

/*
 * Nesta classe nós chamamos as rotas sem precisar deixar
 * o Program.cs cheio de extensões
*/
public static class EndpointExtensions
{
    public static void MapEndpoints(this WebApplication app)
    {
        // Mapeando elas abaixo
        app.MapOrdemEndpoints();
    }
}
