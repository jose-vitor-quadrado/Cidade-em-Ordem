import { Component, computed, inject, signal } from '@angular/core';
import { FormField, FormRoot, FieldTree, form, maxLength, required } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { CartaoProblemaAdmin } from '../../components/cartao-problema-admin/cartao-problema-admin';
import { FILTROS_PADRAO, Filtros, filtrarProblemas } from '../../core/filtros';
import { OPCOES_CATEGORIA, OPCOES_PRIORIDADE, Problema, valoresUnicos } from '../../core/problema.model';
import { ProblemasStore } from '../../core/problemas.store';

interface ModeloEdicao {
  descricao: string;
  tipo: string;
  prioridade: string;
  estado: string;
  cidade: string;
  bairro: string;
  rua: string;
  cep: string;
  resolvido: string; // 'true' | 'false'
}

const MODELO_VAZIO: ModeloEdicao = {
  descricao: '', tipo: '0', prioridade: '0', estado: '', cidade: '', bairro: '', rua: '', cep: '', resolvido: 'false',
};

@Component({
  selector: 'app-admin',
  imports: [RouterLink, FormField, FormRoot, CartaoProblemaAdmin],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
  host: { '(document:keydown.escape)': 'fecharModal()' },
})
export class Admin {
  protected readonly store = inject(ProblemasStore);
  protected readonly categorias = OPCOES_CATEGORIA;
  protected readonly prioridades = OPCOES_PRIORIDADE;

  // ----- Filtros -----
  private readonly modeloFiltros = signal<Filtros>({ ...FILTROS_PADRAO });
  protected readonly filtros = form(this.modeloFiltros);

  protected readonly cidades = computed(() => valoresUnicos(this.store.problemas().map((p) => p.endereco.cidade)));
  protected readonly estados = computed(() => valoresUnicos(this.store.problemas().map((p) => p.endereco.estado)));
  protected readonly filtrados = computed(() => filtrarProblemas(this.store.problemas(), this.modeloFiltros()));

  // ----- Estatísticas (derivadas da lista, sem precisar "atualizar" na mão) -----
  protected readonly total = computed(() => this.store.problemas().length);
  protected readonly resolvidas = computed(() => this.store.problemas().filter((p) => p.foiResolvido).length);
  protected readonly pendentes = computed(() => this.total() - this.resolvidas());

  // ----- Edição (modal) -----
  protected readonly editando = signal<Problema | null>(null);
  private readonly modeloEdicao = signal<ModeloEdicao>({ ...MODELO_VAZIO });
  protected readonly novaImagem = signal<File | null>(null);

  protected readonly formEdicao = form(
    this.modeloEdicao,
    (c) => {
      required(c.descricao);
      required(c.estado);
      maxLength(c.estado, 2);
      required(c.cidade);
      required(c.bairro);
      required(c.rua);
    },
    {
      submission: {
        action: async () => {
          await this.salvar();
          return undefined;
        },
      },
    },
  );

  protected abrirEdicao(p: Problema): void {
    this.modeloEdicao.set({
      descricao: p.descricao,
      tipo: String(p.tipoProblema),
      prioridade: String(p.prioridade),
      estado: p.endereco.estado,
      cidade: p.endereco.cidade,
      bairro: p.endereco.bairro,
      rua: p.endereco.logradouro,
      cep: p.endereco.cep,
      resolvido: String(p.foiResolvido),
    });
    this.editando.set(p);
  }

  protected aoEscolherImagem(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    const arquivo = input.files?.[0] ?? null;
    if (arquivo && (!arquivo.type.startsWith('image/') || arquivo.size > 5 * 1024 * 1024)) {
      input.value = '';
      alert('Escolha uma imagem de até 5 MB.');
      return;
    }
    this.novaImagem.set(arquivo);
  }

  protected fecharModal(): void {
    this.editando.set(null);
    this.novaImagem.set(null);
  }

  private async salvar(): Promise<void> {
    const original = this.editando();
    if (!original) return;
    const m = this.modeloEdicao();
    try {
      await this.store.atualizar(
        {
          ...original,
          descricao: m.descricao,
          tipoProblema: Number(m.tipo),
          prioridade: Number(m.prioridade),
          foiResolvido: m.resolvido === 'true',
          endereco: {
            estado: m.estado.toUpperCase(),
            cidade: m.cidade,
            bairro: m.bairro,
            logradouro: m.rua,
            cep: m.cep,
          },
        },
        this.novaImagem(),
      );
      this.fecharModal();
    } catch (erro) {
      console.error('Erro ao atualizar registro:', erro);
      alert('Não foi possível salvar as alterações no banco de dados.');
    }
  }

  protected temErro(campo: FieldTree<string>): boolean {
    const e = campo();
    return e.touched() && e.invalid();
  }

  // ----- Exclusão -----
  protected async excluir(p: Problema): Promise<void> {
    if (!confirm(`Tem certeza de que deseja excluir a solicitação #${p.id}? Esta ação não pode ser desfeita.`)) return;
    try {
      await this.store.excluir(p.id);
      alert(`Solicitação #${p.id} excluída com sucesso.`);
    } catch (erro) {
      console.error('Erro ao excluir solicitação:', erro);
      alert(`Não foi possível excluir a solicitação #${p.id}. Verifique se a API possui o endpoint DELETE /problemas/{id}.`);
    }
  }
}
