import { httpResource } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Problema } from './problema.model';
import { ProblemasService, paraProblema } from './problemas.service';

/**
 * Estado da LISTA de ocorrências, compartilhado pela consulta pública e pelo painel admin.
 * O httpResource faz o GET sozinho e expõe value / isLoading / error / reload() como signals.
 * Só é criado quando alguém injeta a classe, então o formulário de cadastro não dispara GET à toa.
 */
@Injectable({ providedIn: 'root' })
export class ProblemasStore {
  private readonly api = inject(ProblemasService);

  private readonly lista = httpResource<Problema[]>(() => this.api.apiUrl, {
    defaultValue: [],
    parse: (bruto) => {
      const itens = Array.isArray(bruto) ? bruto : ((bruto as any)?.items ?? (bruto as any)?.dados ?? []);
      return itens.map((item: unknown) => paraProblema(item, this.api.baseUrl));
    },
  });

  readonly problemas = this.lista.value;
  readonly carregando = this.lista.isLoading;
  readonly erro = this.lista.error;
  readonly apiUrl = this.api.apiUrl;

  recarregar(): void {
    this.lista.reload();
  }

  async atualizar(problema: Problema): Promise<void> {
    await this.api.atualizar(problema);
    this.recarregar();
  }

  async excluir(id: Problema['id']): Promise<void> {
    await this.api.excluir(id);
    this.recarregar();
  }
}
