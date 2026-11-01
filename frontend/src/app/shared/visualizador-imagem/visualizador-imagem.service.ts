import { DOCUMENT } from '@angular/common';
import { Injectable, effect, inject, signal } from '@angular/core';

export interface ImagemAmpliada {
  src: string;
  legenda: string;
}

/** Substitui as funções globais window.abrirImagemAmpliada* do projeto original. */
@Injectable({ providedIn: 'root' })
export class VisualizadorImagemService {
  private readonly document = inject(DOCUMENT);
  readonly imagem = signal<ImagemAmpliada | null>(null);

  constructor() {
    // Trava a rolagem da página enquanto a imagem está aberta.
    effect(() => {
      this.document.body.style.overflow = this.imagem() ? 'hidden' : '';
    });
  }

  abrir(src: string, legenda: string): void {
    this.imagem.set({ src, legenda: legenda || 'Imagem da ocorrência' });
  }

  fechar(): void {
    this.imagem.set(null);
  }
}
