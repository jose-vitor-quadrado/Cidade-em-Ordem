using CidadeEmOrdem.Models;
using Microsoft.EntityFrameworkCore;

namespace CidadeEmOrdem.Data;

public class OrdemContext : DbContext
{
    public OrdemContext(DbContextOptions<OrdemContext> options) : base(options)
    {
    }

    public DbSet<Ordem> Ordens { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Ordem>(entity =>
        {
            entity.HasKey(o => o.Id);

            entity.Property(o => o.Descricao).IsRequired();

            entity.Property(o => o.TipoProblema).IsRequired();

            entity.Property(o => o.Prioridade).IsRequired();

            entity.Property(o => o.ImagemUrl).IsRequired(false);

            entity.Property(o => o.FoiResolvido).HasDefaultValue(false);

            entity.ComplexProperty(o => o.Endereco, endereco =>
            {
                endereco.Property(e => e.Estado).IsRequired();

                endereco.Property(e => e.Cidade).IsRequired();

                endereco.Property(e => e.Cep).HasMaxLength(9).IsRequired();

                endereco.Property(e => e.Bairro).IsRequired();

                endereco.Property(e => e.Logradouro).IsRequired();
            });
        });
    }
}
