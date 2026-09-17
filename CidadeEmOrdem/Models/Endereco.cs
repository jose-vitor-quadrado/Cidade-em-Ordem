namespace CidadeEmOrdem.Models;

public class Endereco
{
    public int Cep { get; set; }
    public string Cidade { get; set; } = string.Empty;
    public string Bairro { get; set; } = string.Empty;
    public string Logradouro { get; set; } = string.Empty;

    public Endereco(int cep, string cidade, string bairro, string logradouro)
    {
        Cep = cep;
        Cidade = cidade;
        Bairro = bairro;
        Logradouro = logradouro;
    }
}
