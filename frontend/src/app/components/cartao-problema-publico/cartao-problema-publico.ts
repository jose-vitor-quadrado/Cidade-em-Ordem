import { Component, computed, inject, input, signal } from '@angular/core';
import { CATEGORIAS, CLASSE_PRIORIDADE, PRIORIDADES, Problema } from '../../core/problema.model';
import { VisualizadorImagemService } from '../../shared/visualizador-imagem/visualizador-imagem.service';

@Component({
  selector: 'app-cartao-problema-publico',
  templateUrl: './cartao-problema-publico.html',
  styles: `:host { display: contents; }`,
})
export class CartaoProblemaPublico {
  private readonly visualizador = inject(VisualizadorImagemService);

  readonly problema = input.required<Problema>();
  protected readonly imagemQuebrada = signal(false);

  protected readonly categoria = computed(() => CATEGORIAS[this.problema().tipoProblema] ?? 'Outro');
  protected readonly prioridade = computed(() => PRIORIDADES[this.problema().prioridade] ?? 'Média');
  protected readonly classePrioridade = computed(
    () => CLASSE_PRIORIDADE[this.problema().prioridade] ?? 'prioridade-media',
  );

  protected ampliar(): void {
    const p = this.problema();
    if (p.imagemSrc) this.visualizador.abrir(p.imagemSrc, `Imagem da ocorrência #${p.id}`);
  }
}
