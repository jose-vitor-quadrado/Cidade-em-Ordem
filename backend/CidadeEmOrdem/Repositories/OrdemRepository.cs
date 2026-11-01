using CidadeEmOrdem.Data;
using CidadeEmOrdem.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace CidadeEmOrdem.Repositories;

public class OrdemRepository : IOrdemRepository
{
    private readonly OrdemContext _context;

    public OrdemRepository(OrdemContext context)
    {
        _context = context;
    }

    public async Task<List<Ordem>> GetAllAsync()
    {
        return await _context.Ordens
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<Ordem?> GetByIdAsync(int id)
    {
        return await _context.Ordens.FindAsync(id); 
    }

    public List<Ordem> GetByCondicao(
        Expression<Func<Ordem, bool>> predicado
    )
    {
        return _context.Ordens
            .Where(predicado)
            .ToList();
    }

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

    public async Task CriarOrdemAsync(Ordem ordem)
    {
        _context.Ordens.Add(ordem);
        await _context.SaveChangesAsync();
    }

    public async Task AtualizarOrdemAsync(Ordem ordem)
    {
        _context.Ordens.Update(ordem);
        await _context.SaveChangesAsync();
    }

    public async Task RemoverOrdemAsync(Ordem ordem)
    {
        _context.Ordens.Remove(ordem);
        await _context.SaveChangesAsync();
    }
}
