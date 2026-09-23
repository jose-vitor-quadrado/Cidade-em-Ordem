using CidadeEmOrdem.Data;
using CidadeEmOrdem.Models;

namespace CidadeEmOrdem.Repositories;

public class OrdemRepository : IOrdemRepository
{
    private readonly OrdemContext _context;

    public OrdemRepository(OrdemContext context)
    {
        _context = context;
    }

    public List<Ordem> GetAll() => _context.Ordens.ToList();

    public Ordem? GetById(int id) => _context.Ordens.Find(id);

    public List<Ordem> GetByCondicao(Func<Ordem, bool> predicado)
        => _context.Ordens.Where(predicado).ToList();

    public List<Ordem> GetByTipoProblema(TipoProblema tipoProblema)
        => GetByCondicao(o => o.TipoProblema == tipoProblema);

    public List<Ordem> GetByPrioridade(Prioridade prioridade)
        => GetByCondicao(o => o.Prioridade == prioridade);

    public List<Ordem> GetByEstado(string estado)
        => GetByCondicao(o => o.Endereco.Estado == estado);

    public List<Ordem> GetByCidade(string cidade)
        => GetByCondicao(o => o.Endereco.Cidade == cidade);

    public List<Ordem> GetByBairro(string bairro)
        => GetByCondicao(o => o.Endereco.Bairro == bairro);

    public List<Ordem> GetByLogradouro(string logradouro)
        => GetByCondicao(o => o.Endereco.Logradouro == logradouro);

    public async void CriarOrdemAsync(Ordem ordem)
    {
        _context.Ordens.Add(ordem);
        await _context.SaveChangesAsync();
    }

    public async void AtualizarOrdemAsync(Ordem ordem)
    {
        _context.Ordens.Update(ordem);
        await _context.SaveChangesAsync();
    }

    public async void RemoverOrdemAsync(Ordem ordem)
    {
        _context.Ordens.Remove(ordem);
        await _context.SaveChangesAsync();
    }
}
