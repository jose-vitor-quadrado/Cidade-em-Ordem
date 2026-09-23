using CidadeEmOrdem.Models;

namespace CidadeEmOrdem.Repositories;

public interface IOrdemRepository
{
    Ordem? GetById(int id);
    List<Ordem> GetAll();
    List<Ordem> GetByTipoProblema(TipoProblema tipoProblema);
    List<Ordem> GetByPrioridade(Prioridade prioridade);
    List<Ordem> GetByEstado(string estado);
    List<Ordem> GetByCidade(string cidade);
    List<Ordem> GetByBairro(string bairro);
    List<Ordem> GetByLogradouro(string logradouro);
    void CriarOrdemAsync(Ordem ordem);
    void AtualizarOrdemAsync(Ordem ordem);
    void RemoverOrdemAsync(Ordem ordem);
}
