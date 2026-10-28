import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConsultaProblemas } from '../../components/consulta-problemas/consulta-problemas';
import { FormularioProblema } from '../../components/formulario-problema/formulario-problema';

type Secao = 'nenhuma' | 'registrar' | 'consultar';

@Component({
  selector: 'app-home',
  imports: [RouterLink, FormularioProblema, ConsultaProblemas],
  templateUrl: './home.html',
})
export class Home {
  protected readonly secao = signal<Secao>('nenhuma');
  protected readonly ano = new Date().getFullYear();
}
