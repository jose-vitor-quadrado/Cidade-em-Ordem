using CidadeEmOrdem.Models;

namespace CidadeEmOrdem.Repositories;

public interface IOrdemRepository
{
    Task<Ordem?> GetByIdAsync(int id);
    Task<List<Ordem>> GetAllAsync();
    List<Ordem> GetByTipoProblema(TipoProblema tipoProblema);
    List<Ordem> GetByPrioridade(Prioridade prioridade);
    List<Ordem> GetByEstado(string estado);
    List<Ordem> GetByCidade(string cidade);
    List<Ordem> GetByBairro(string bairro);
    List<Ordem> GetByLogradouro(string logradouro);
    Task CriarOrdemAsync(Ordem ordem);
    Task AtualizarOrdemAsync(Ordem ordem);
    Task RemoverOrdemAsync(Ordem ordem);
}
