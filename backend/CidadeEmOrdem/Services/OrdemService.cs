using CidadeEmOrdem.Models;
using CidadeEmOrdem.Repositories;

namespace CidadeEmOrdem.Services;

public class OrdemService : IOrdemService
{
    private readonly IOrdemRepository _repository;

    public OrdemService(IOrdemRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<Ordem>> GetAllAsync() 
    {
        return await _repository.GetAllAsync();
    }

    public async Task<Ordem?> GetByIdAsync(int id) 
    {
        return await _repository.GetByIdAsync(id);
    }

    public List<Ordem> GetByTipoProblema(TipoProblema tipoProblema)
        => _repository.GetByTipoProblema(tipoProblema);

    public List<Ordem> GetByPrioridade(Prioridade prioridade)
        => _repository.GetByPrioridade(prioridade);

    public List<Ordem> GetByEstado(string estado)
        => _repository.GetByEstado(estado);

    public List<Ordem> GetByCidade(string cidade)
        => _repository.GetByCidade(cidade);

    public List<Ordem> GetByBairro(string bairro)
        => _repository.GetByBairro(bairro);

    public List<Ordem> GetByLogradouro(string logradouro)
        => _repository.GetByLogradouro(logradouro);

    public async Task<Ordem> CriarOrdemAsync(Ordem ordem)
    {
        await _repository.CriarOrdemAsync(ordem);
        return ordem;
    }

    public async Task<Ordem?> AtualizarOrdemAsync(int id, Ordem ordem)
    {
        var ordemExistente = await _repository.GetByIdAsync(id);
        if (ordemExistente == null) return null;

        ordemExistente.Descricao = ordem.Descricao;
        ordemExistente.TipoProblema = ordem.TipoProblema;
        ordemExistente.Prioridade = ordem.Prioridade;
        ordemExistente.Endereco.Estado = ordem.Endereco.Estado;
        ordemExistente.Endereco.Cidade = ordem.Endereco.Cidade;
        ordemExistente.Endereco.Cep = ordem.Endereco.Cep;
        ordemExistente.Endereco.Bairro = ordem.Endereco.Bairro;
        ordemExistente.Endereco.Logradouro = ordem.Endereco.Logradouro;
        ordemExistente.ImagemUrl = ordem.ImagemUrl;
        ordemExistente.FoiResolvido = ordem.FoiResolvido;

        await _repository.AtualizarOrdemAsync(ordemExistente);
        return ordemExistente;
    }

    public async Task<bool> RemoverOrdemAsync(int id)
    {
        var ordem = await _repository.GetByIdAsync(id);
        if (ordem == null) return false;

        await _repository.RemoverOrdemAsync(ordem);
        return true;
    }

    public async Task<string?> SalvarImagemAsync(
        int id, 
        IFormFile imagem, 
        string webRootPath) 
    {
        if (imagem == null || imagem.Length == 0)
            return null;

        var ordem = await _repository.GetByIdAsync(id);

        if (ordem == null)
            return null;

        if (string.IsNullOrEmpty(webRootPath))
        {
            webRootPath = Path.Combine(
                Directory.GetCurrentDirectory(), 
                "wwwroot");
        }

        var uploadsFolder = Path.Combine(
            webRootPath, 
            "uploads");

        Directory.CreateDirectory(uploadsFolder);

        var fileName = 
            $"{Guid.NewGuid()}{Path.GetExtension(imagem.FileName)}";

        var filePath = Path.Combine(uploadsFolder, fileName);

        using (var steam = new FileStream(filePath, FileMode.Create))
        {
            await imagem.CopyToAsync(steam);
        }

        ordem.ImagemUrl = $"/uploads/{fileName}";

        await _repository.AtualizarOrdemAsync(ordem);

        return ordem.ImagemUrl;
    }
}
