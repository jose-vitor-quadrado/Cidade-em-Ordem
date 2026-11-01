import { Component, ElementRef, afterRenderEffect, inject, viewChild } from '@angular/core';
import { VisualizadorImagemService } from './visualizador-imagem.service';

@Component({
  selector: 'app-visualizador-imagem',
  templateUrl: './visualizador-imagem.html',
  host: { '(document:keydown.escape)': 'servico.fechar()' },
})
export class VisualizadorImagem {
  protected readonly servico = inject(VisualizadorImagemService);
  private readonly botaoFechar = viewChild<ElementRef<HTMLButtonElement>>('botaoFechar');

  constructor() {
    // Ao abrir, leva o foco para o botão de fechar (acessibilidade).
    afterRenderEffect(() => {
      if (this.servico.imagem()) this.botaoFechar()?.nativeElement.focus();
    });
  }
}
