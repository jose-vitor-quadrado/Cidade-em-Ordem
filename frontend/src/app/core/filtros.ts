import { Problema, normalizar } from './problema.model';

export interface Filtros {
  termo: string;
  status: string; // todos | pendente | resolvido
  prioridade: string; // todas | 0..3
  cidade: string; // todas | chave normalizada
  estado: string; // todos | chave normalizada
}

export const FILTROS_PADRAO: Filtros = {
  termo: '',
  status: 'todos',
  prioridade: 'todas',
  cidade: 'todas',
  estado: 'todos',
};

/** Mesma regra de filtragem usada na página pública e no painel administrativo. */
export function filtrarProblemas(itens: Problema[], f: Filtros): Problema[] {
  const termo = normalizar(f.termo);
  return itens.filter((p) => {
    if (f.status === 'pendente' && p.foiResolvido) return false;
    if (f.status === 'resolvido' && !p.foiResolvido) return false;
    if (f.prioridade !== 'todas' && p.prioridade !== Number(f.prioridade)) return false;
    const { logradouro, bairro, cidade, estado } = p.endereco;
    if (f.cidade !== 'todas' && normalizar(cidade) !== f.cidade) return false;
    if (f.estado !== 'todos' && normalizar(estado) !== f.estado) return false;
    return normalizar(`${p.descricao} ${logradouro} ${bairro} ${cidade} ${estado} ${p.id}`).includes(termo);
  });
}
