using CidadeEmOrdem.Models;

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
        app.MapGet("/problemas", () =>
        {
            var lista = new List<Ordem>
            {
                new Ordem
                {
                    Descricao = "Buraco na rua principal",
                    TipoProblema = TipoProblema.Buraco,
                    Prioridade = Prioridade.Alta,
                    Endereco = new Endereco
                    {
                        Estado = "SP",
                        Cidade = "Sjrp",
                        Cep = "15560-098",
                        Bairro = "Sao Joao",
                        Logradouro = "Rua Sao Vicente de Paula 654"
                    },
                    ImagemUrl = "https://exemplo.com/buraco.jpg",
                    FoiResolvido = false
                },
                new Ordem
                {
                    Descricao = "Arvore maluca atacando os pedestres",
                    TipoProblema = TipoProblema.Arvore,
                    Prioridade = Prioridade.Media,
                    Endereco = new Endereco
                    {
                        Estado = "SP",
                        Cidade = "Palestina",
                        Cep = "15560-078",
                        Bairro = "Tem bairro",
                        Logradouro = "Aquela la daquele lugar 123"
                    },
                    ImagemUrl = "https://exemplo.com/arvore-do-mal.jpg",
                    FoiResolvido = false
                }
            };

            return lista;
        });

        return app;
    }
}
