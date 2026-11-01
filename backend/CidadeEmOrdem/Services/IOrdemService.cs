using CidadeEmOrdem.Models;

namespace CidadeEmOrdem.Services;

public interface IOrdemService
{
    Task<Ordem?> GetByIdAsync(int id);
    Task<List<Ordem>> GetAllAsync();
    List<Ordem> GetByTipoProblema(TipoProblema tipoProblema);
    List<Ordem> GetByPrioridade(Prioridade prioridade);
    List<Ordem> GetByEstado(string estado);
    List<Ordem> GetByCidade(string cidade);
    List<Ordem> GetByBairro(string bairro);
    List<Ordem> GetByLogradouro(string logradouro);
    Task<Ordem> CriarOrdemAsync(Ordem ordem);
    Task<Ordem?> AtualizarOrdemAsync(int id, Ordem ordem);
    Task<bool> RemoverOrdemAsync(int id);

    Task<string?> SalvarImagemAsync(int id, IFormFile imagem, string webRootPath);
}
