import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VisualizadorImagem } from './shared/visualizador-imagem/visualizador-imagem';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, VisualizadorImagem],
  template: `
    <router-outlet />
    <app-visualizador-imagem />
  `,
})
export class App {}
