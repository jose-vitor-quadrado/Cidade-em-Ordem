using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CidadeEmOrdem.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Ordens",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Descricao = table.Column<string>(type: "TEXT", nullable: false),
                    TipoProblema = table.Column<int>(type: "INTEGER", nullable: false),
                    Prioridade = table.Column<int>(type: "INTEGER", nullable: false),
                    ImagemUrl = table.Column<string>(type: "TEXT", nullable: true),
                    FoiResolvido = table.Column<bool>(type: "INTEGER", nullable: false, defaultValue: false),
                    Endereco_Bairro = table.Column<string>(type: "TEXT", nullable: false),
                    Endereco_Cep = table.Column<string>(type: "TEXT", maxLength: 9, nullable: false),
                    Endereco_Cidade = table.Column<string>(type: "TEXT", nullable: false),
                    Endereco_Estado = table.Column<string>(type: "TEXT", nullable: false),
                    Endereco_Logradouro = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ordens", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Ordens");
        }
    }
}
