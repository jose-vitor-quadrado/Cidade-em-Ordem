import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export interface RespostaViaCep {
  erro?: boolean;
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
}

@Injectable({ providedIn: 'root' })
export class ViaCepService {
  private readonly http = inject(HttpClient);

  buscar(cep: string): Promise<RespostaViaCep> {
    return firstValueFrom(this.http.get<RespostaViaCep>(`https://viacep.com.br/ws/${cep}/json/`));
  }
}
