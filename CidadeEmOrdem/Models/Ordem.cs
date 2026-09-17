namespace CidadeEmOrdem.Models;

public class Ordem
{
    public int Id { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public TipoProblema TipoProblema { get; set; }
    public Prioridade Prioridade { get; set; }
    public Endereco? Endereco { get; set; }
    public string? ImagemUrl { get; set; }

    public Ordem(int id, string descricao, TipoProblema tipoProblema, 
        Prioridade prioridade, Endereco? endereco, string? imagemUrl)
    {
        Id = id;
        Descricao = descricao;
        TipoProblema = tipoProblema;
        Prioridade = prioridade;
        Endereco = endereco;
        ImagemUrl = imagemUrl;
    }
}
