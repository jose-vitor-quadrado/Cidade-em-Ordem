using CidadeEmOrdem.Models;

namespace CidadeEmOrdem.Services;

public interface IOrdemService
{
    Ordem? GetById(int id);
    List<Ordem> GetAll();
    List<Ordem> GetByTipoProblema(TipoProblema tipoProblema);
    List<Ordem> GetByPrioridade(Prioridade prioridade);
    List<Ordem> GetByEstado(string estado);
    List<Ordem> GetByCidade(string cidade);
    List<Ordem> GetByBairro(string bairro);
    List<Ordem> GetByLogradouro(string logradouro);
    Ordem? CriarOrdem(Ordem ordem);
    Ordem? AtualizarOrdem(int id, Ordem ordem);
    bool RemoverOrdem(int id);
}
