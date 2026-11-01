import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { Admin } from './admin';

describe('Admin', () => {
  it('carrega, mostra estatísticas e filtra por status', async () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    const fixture = TestBed.createComponent(Admin);
    fixture.detectChanges();

    TestBed.inject(HttpTestingController).expectOne('https://localhost:7119/problemas').flush([
      { id: 1, descricao: 'Buraco na rua', tipoProblema: 1, prioridade: 0, foiResolvido: false,
        endereco: { cidade: 'Catanduva', estado: 'SP', bairro: 'Centro', logradouro: 'Rua A', cep: '15800000' } },
      { id: 2, descricao: 'Poste apagado', tipoProblema: 2, prioridade: 2, foiResolvido: true,
        endereco: { cidade: 'Catanduva', estado: 'SP', bairro: 'Centro', logradouro: 'Rua B', cep: '15800000' } },
    ]);
    await fixture.whenStable();
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelectorAll('.stat-card p')[0].textContent).toBe('2');
    expect(el.querySelectorAll('app-cartao-problema-admin').length).toBe(2);

    const select = el.querySelector<HTMLSelectElement>('select[aria-label="Filtrar por status"]')!;
    select.value = 'resolvido';
    select.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    fixture.detectChanges();
    expect(el.querySelectorAll('app-cartao-problema-admin').length).toBe(1);

    const busca = el.querySelector<HTMLInputElement>('input[aria-label="Pesquisar solicitações"]')!;
    select.value = 'todos'; select.dispatchEvent(new Event('input'));
    busca.value = 'buraco'; busca.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    fixture.detectChanges();
    expect(el.querySelectorAll('app-cartao-problema-admin').length).toBe(1);
  });
});
