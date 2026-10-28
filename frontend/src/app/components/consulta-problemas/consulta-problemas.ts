import { Component, ElementRef, afterNextRender, computed, inject, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { FILTROS_PADRAO, Filtros, filtrarProblemas } from '../../core/filtros';
import { OPCOES_PRIORIDADE, valoresUnicos } from '../../core/problema.model';
import { ProblemasStore } from '../../core/problemas.store';
import { CartaoProblemaPublico } from '../cartao-problema-publico/cartao-problema-publico';

@Component({
  selector: 'app-consulta-problemas',
  imports: [FormField, CartaoProblemaPublico],
  templateUrl: './consulta-problemas.html',
  styles: `:host { display: block; }`,
})
export class ConsultaProblemas {
  protected readonly store = inject(ProblemasStore);
  protected readonly prioridades = OPCOES_PRIORIDADE;

  // O modelo dos filtros também é um signal; cada <input>/<select> se liga a um campo dele.
  private readonly modeloFiltros = signal<Filtros>({ ...FILTROS_PADRAO });
  protected readonly filtros = form(this.modeloFiltros);

  protected readonly cidades = computed(() =>
    valoresUnicos(this.store.problemas().map((p) => p.endereco.cidade)),
  );
  protected readonly estados = computed(() =>
    valoresUnicos(this.store.problemas().map((p) => p.endereco.estado)),
  );
  protected readonly filtrados = computed(() => filtrarProblemas(this.store.problemas(), this.modeloFiltros()));

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef);
    afterNextRender(() => host.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }
}
