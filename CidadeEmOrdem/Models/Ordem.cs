namespace CidadeEmOrdem.Models;

public class Ordem
{
    public int Id { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public TipoProblema TipoProblema { get; set; }
    public Prioridade Prioridade { get; set; }
    public Endereco Endereco { get; set; } = new();
    public string? ImagemUrl { get; set; }
    public bool FoiResolvido { get; set; }
}
