import { Component, DestroyRef, ElementRef, afterNextRender, inject, output, signal } from '@angular/core';
import { FieldTree, FormField, FormRoot, form, maxLength, required, validate } from '@angular/forms/signals';
import { OPCOES_CATEGORIA, OPCOES_PRIORIDADE } from '../../core/problema.model';
import { ProblemasService } from '../../core/problemas.service';
import { ViaCepService } from '../../core/viacep.service';

const TAMANHO_MAXIMO_IMAGEM = 5 * 1024 * 1024;

interface ModeloCadastro {
  descricao: string;
  categoria: string;
  prioridade: string;
  cep: string;
  rua: string;
  bairro: string;
  cidade: string;
  estado: string;
}

const MODELO_INICIAL: ModeloCadastro = {
  descricao: '',
  categoria: '',
  prioridade: '2',
  cep: '',
  rua: '',
  bairro: '',
  cidade: '',
  estado: '',
};

interface Aviso {
  texto: string;
  classe: '' | 'erro' | 'sucesso';
}

@Component({
  selector: 'app-formulario-problema',
  imports: [FormField, FormRoot],
  templateUrl: './formulario-problema.html',
  styleUrl: './formulario-problema.css',
})
export class FormularioProblema {
  private readonly api = inject(ProblemasService);
  private readonly viaCep = inject(ViaCepService);

  readonly cancelar = output<void>();

  protected readonly categorias = OPCOES_CATEGORIA;
  protected readonly prioridades = [...OPCOES_PRIORIDADE].reverse(); // Baixa → Crítica, como no original

  // 1) O modelo é um signal comum; 2) form() cria a árvore de campos + regras + envio.
  private readonly modelo = signal<ModeloCadastro>({ ...MODELO_INICIAL });

  protected readonly formulario = form(
    this.modelo,
    (c) => {
      required(c.descricao, { message: 'Descreva o problema.' });
      maxLength(c.descricao, 2000, { message: 'Use no máximo 2000 caracteres.' });
      required(c.categoria, { message: 'Selecione a categoria.' });
      required(c.cep, { message: 'Informe o CEP.' });
      validate(c.cep, ({ value }) =>
        value().replace(/\D/g, '').length === 8
          ? null
          : { kind: 'cep', message: 'Informe um CEP com 8 números.' },
      );
      required(c.rua, { message: 'Informe a rua.' });
      required(c.bairro, { message: 'Informe o bairro.' });
      required(c.cidade, { message: 'Informe a cidade.' });
      required(c.estado, { message: 'Informe a UF.' });
    },
    {
      submission: {
        action: async () => {
          await this.enviar();
          return undefined;
        },
        onInvalid: () => this.aviso.set({ texto: 'Revise os campos destacados.', classe: 'erro' }),
      },
    },
  );

  protected readonly cepStatus = signal<Aviso>({ texto: 'Digite os 8 números do CEP.', classe: '' });
  protected readonly aviso = signal<Aviso>({ texto: '', classe: '' });
  protected readonly textoBotao = signal('Enviar ocorrência');

  protected readonly arquivo = signal<File | null>(null);
  protected readonly previewUrl = signal<string | null>(null);

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef);
    afterNextRender(() => host.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    inject(DestroyRef).onDestroy(() => this.limparPreview());
  }

  /** Mensagem de erro de um campo (só aparece depois que o usuário mexeu nele). */
  protected erro(campo: FieldTree<string>): string | undefined {
    const estado = campo();
    return estado.touched() && estado.invalid() ? estado.errors()[0]?.message : undefined;
  }

  // ---------- CEP e UF (máscaras) ----------
  protected aoDigitarCep(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    const numeros = input.value.replace(/\D/g, '').slice(0, 8);
    const formatado = numeros.length > 5 ? `${numeros.slice(0, 5)}-${numeros.slice(5)}` : numeros;
    input.value = formatado;
    this.formulario.cep().value.set(formatado);
    if (numeros.length === 8) void this.buscarCep(numeros);
    else this.cepStatus.set({ texto: 'Digite os 8 números do CEP.', classe: '' });
  }

  protected aoDigitarUf(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    const uf = input.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 2);
    input.value = uf;
    this.formulario.estado().value.set(uf);
  }

  private async buscarCep(cep: string): Promise<void> {
    this.cepStatus.set({ texto: 'Consultando CEP...', classe: '' });
    try {
      const dados = await this.viaCep.buscar(cep);
      if (dados.erro) {
        this.cepStatus.set({ texto: 'CEP não encontrado. Confira os números.', classe: 'erro' });
        return;
      }
      this.formulario.rua().value.set(dados.logradouro ?? '');
      this.formulario.bairro().value.set(dados.bairro ?? '');
      this.formulario.cidade().value.set(dados.localidade ?? '');
      this.formulario.estado().value.set(dados.uf ?? '');
      this.cepStatus.set({ texto: 'Endereço preenchido pelo ViaCEP. Confira os dados.', classe: 'sucesso' });
    } catch {
      this.cepStatus.set({
        texto: 'Não foi possível consultar agora. Preencha o endereço manualmente.',
        classe: 'erro',
      });
    }
  }

  // ---------- Foto ----------
  protected aoEscolherImagem(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    const escolhido = input.files?.[0];
    this.limparPreview();
    this.arquivo.set(null);
    if (!escolhido) return;

    if (!escolhido.type.startsWith('image/')) {
      input.value = '';
      this.aviso.set({ texto: 'Selecione um arquivo de imagem válido.', classe: 'erro' });
      return;
    }
    if (escolhido.size > TAMANHO_MAXIMO_IMAGEM) {
      input.value = '';
      this.aviso.set({ texto: 'A imagem deve ter no máximo 5 MB.', classe: 'erro' });
      return;
    }
    this.aviso.set({ texto: '', classe: '' });
    this.arquivo.set(escolhido);
    this.previewUrl.set(URL.createObjectURL(escolhido));
  }

  protected removerImagem(input: HTMLInputElement): void {
    input.value = '';
    this.arquivo.set(null);
    this.limparPreview();
  }

  private limparPreview(): void {
    const url = this.previewUrl();
    if (url) URL.revokeObjectURL(url);
    this.previewUrl.set(null);
  }

  // ---------- Envio (chamado pelo Signal Forms só quando o formulário é válido) ----------
  private async enviar(): Promise<void> {
    const v = this.modelo();
    const arquivo = this.arquivo();
    this.textoBotao.set('Enviando ocorrência...');
    this.aviso.set({ texto: 'Cadastrando ocorrência...', classe: '' });
    try {
      const id = await this.api.criar({
        descricao: v.descricao.trim(),
        tipoProblema: Number(v.categoria),
        prioridade: Number(v.prioridade),
        foiResolvido: false,
        endereco: {
          estado: v.estado.trim().toUpperCase(),
          cidade: v.cidade.trim(),
          bairro: v.bairro.trim(),
          logradouro: v.rua.trim(),
          cep: v.cep.replace(/\D/g, ''),
        },
      });

      if (arquivo) {
        if (id === undefined || id === null || id === '') {
          throw new Error(
            'A ocorrência foi cadastrada, mas a API não retornou o ID. Para enviar a foto, o POST /problemas precisa retornar o objeto criado com seu id.',
          );
        }
        this.textoBotao.set('Enviando foto...');
        this.aviso.set({ texto: 'Ocorrência criada. Enviando a foto...', classe: '' });
        await this.api.enviarImagem(id, arquivo);
      }

      this.aviso.set({
        texto: arquivo ? 'Ocorrência e foto cadastradas com sucesso!' : 'Ocorrência cadastrada com sucesso!',
        classe: 'sucesso',
      });
      this.formulario().reset({ ...MODELO_INICIAL });
      this.arquivo.set(null);
      this.limparPreview();
      this.cepStatus.set({ texto: 'Digite os 8 números do CEP.', classe: '' });
    } catch (erro) {
      const detalhe = erro instanceof Error ? erro.message : 'verifique se a API está ligada.';
      this.aviso.set({ texto: `Não foi possível concluir o cadastro: ${detalhe}`, classe: 'erro' });
    } finally {
      this.textoBotao.set('Enviar ocorrência');
    }
  }
}
