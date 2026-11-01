import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from './api.config';
import { NovoProblema, Problema } from './problema.model';

/**
 * A API pode devolver campos com nomes ligeiramente diferentes (id/Id, imagemUrl/ImagemUrl,
 * foiResolvido/resolvido...). Este "tradutor" roda uma única vez, na entrada dos dados,
 * e o resto do app trabalha só com o tipo Problema.
 */
export function paraProblema(bruto: any, baseUrl: string): Problema {
  const end = bruto?.endereco ?? {};
  const imagem: string | null =
    bruto?.imagemUrl ?? bruto?.ImagemUrl ?? bruto?.imagem ?? bruto?.Imagem ?? null;
  const imagemSrc = imagem
    ? /^https?:\/\//i.test(imagem)
      ? imagem
      : `${baseUrl}${imagem.startsWith('/') ? '' : '/'}${imagem}`
    : null;
  return {
    id: bruto?.id ?? bruto?.Id,
    descricao: bruto?.descricao ?? '',
    tipoProblema: Number(bruto?.tipoProblema ?? bruto?.tipo ?? 5),
    prioridade: Number(bruto?.prioridade ?? 2),
    foiResolvido: bruto?.foiResolvido === true || bruto?.resolvido === true,
    imagemUrl: imagem,
    imagemSrc,
    endereco: {
      estado: end.estado ?? bruto?.estado ?? '',
      cidade: end.cidade ?? bruto?.cidade ?? '',
      bairro: end.bairro ?? bruto?.bairro ?? '',
      logradouro: end.logradouro ?? bruto?.rua ?? '',
      cep: end.cep ?? bruto?.cep ?? '',
    },
  };
}

/** Camada de acesso à API: só conversa com o backend (sem estado de tela). */
@Injectable({ providedIn: 'root' })
export class ProblemasService {
  private readonly http = inject(HttpClient);
  readonly baseUrl = inject(API_BASE_URL);
  readonly apiUrl = `${this.baseUrl}/problemas`;

  /** Cria a ocorrência e devolve o id gerado pela API (se vier). */
  async criar(dados: NovoProblema): Promise<string | number | undefined> {
    const resposta: any = await firstValueFrom(this.http.post(this.apiUrl, dados));
    return resposta?.id ?? resposta?.Id ?? resposta?.ordem?.id ?? resposta?.ordem?.Id;
  }

  enviarImagem(id: string | number, arquivo: File): Promise<unknown> {
    const corpo = new FormData();
    corpo.append('imagem', arquivo);
    return firstValueFrom(this.http.post(`${this.apiUrl}/${encodeURIComponent(id)}/upload-imagem`, corpo));
  }

  async atualizar(p: Problema): Promise<void> {
    // Mesmo corpo que o script original enviava (sem o campo imagemSrc, que é só de exibição).
    const corpo = {
      id: p.id,
      descricao: p.descricao,
      tipoProblema: p.tipoProblema,
      prioridade: p.prioridade,
      foiResolvido: p.foiResolvido,
      imagemUrl: p.imagemUrl,
      endereco: p.endereco,
    };
    await firstValueFrom(this.http.put(`${this.apiUrl}/${p.id}`, corpo));
  }

  async excluir(id: string | number): Promise<void> {
    await firstValueFrom(this.http.delete(`${this.apiUrl}/${encodeURIComponent(id)}`));
  }
}
