export interface Endereco {
  estado: string;
  cidade: string;
  bairro: string;
  logradouro: string;
  cep: string;
}

export interface Problema {
  id: number | string;
  descricao: string;
  tipoProblema: number;
  prioridade: number;
  foiResolvido: boolean;
  /** Valor exatamente como a API devolveu (é o que devolvemos no PUT). */
  imagemUrl: string | null;
  /** URL absoluta, pronta para usar em <img>. */
  imagemSrc: string | null;
  endereco: Endereco;
}

/** Dados enviados à API ao criar uma ocorrência (sem id nem imagem). */
export type NovoProblema = Omit<Problema, 'id' | 'imagemUrl' | 'imagemSrc'>;

export const CATEGORIAS: Record<number, string> = {
  0: 'Semáforo',
  1: 'Buraco',
  2: 'Iluminação pública',
  3: 'Árvore',
  4: 'Lixo',
  5: 'Outro',
};

export const PRIORIDADES: Record<number, string> = {
  0: 'Crítica',
  1: 'Alta',
  2: 'Média',
  3: 'Baixa',
};

export const CLASSE_PRIORIDADE: Record<number, string> = {
  0: 'prioridade-critica',
  1: 'prioridade-alta',
  2: 'prioridade-media',
  3: 'prioridade-baixa',
};

/** Listas { valor, rotulo } prontas para montar <option> no template. */
export const OPCOES_CATEGORIA = Object.entries(CATEGORIAS).map(([valor, rotulo]) => ({ valor, rotulo }));
export const OPCOES_PRIORIDADE = Object.entries(PRIORIDADES).map(([valor, rotulo]) => ({ valor, rotulo }));

export function normalizar(valor: unknown): string {
  return String(valor ?? '').trim().toLocaleLowerCase('pt-BR');
}

/** Valores únicos (ignorando maiúsculas/minúsculas), ordenados, no formato { chave, rotulo }. */
export function valoresUnicos(valores: string[]): { chave: string; rotulo: string }[] {
  const mapa = new Map<string, string>();
  for (const valor of valores) {
    const chave = normalizar(valor);
    if (chave && !mapa.has(chave)) mapa.set(chave, String(valor).trim());
  }
  return [...mapa.entries()]
    .map(([chave, rotulo]) => ({ chave, rotulo }))
    .sort((a, b) => a.rotulo.localeCompare(b.rotulo, 'pt-BR'));
}
