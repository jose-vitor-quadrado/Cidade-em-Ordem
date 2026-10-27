document.addEventListener('DOMContentLoaded', () => {
    // URL base do backend
    const BASE_URL = 'https://localhost:7119';
    const API_URL = `${BASE_URL}/problemas`;

    // Mapeamento de enums para texto
    const CATEGORIAS = {
        0: 'Semáforo',
        1: 'Buraco',
        2: 'Iluminação pública',
        3: 'Árvore',
        4: 'Lixo',
        5: 'Outro'
    };

    const PRIORIDADES = {
        0: 'Crítica',
        1: 'Alta',
        2: 'Média',
        3: 'Baixa'
    };

    let solicitacoes = [];

    // Elementos do DOM
    const listaProblemas = document.getElementById('listaProblemas');
    const filtroBusca = document.getElementById('filtroBusca');
    const filtroStatus = document.getElementById('filtroStatus');
    const filtroCidade = document.getElementById('filtroCidade');
    const filtroEstado = document.getElementById('filtroEstado');
    const filtroPrioridade = document.getElementById('filtroPrioridade');
    const btnRecarregar = document.getElementById('btnRecarregar');

    const statTotal = document.getElementById('statTotal');
    const statPendentes = document.getElementById('statPendentes');
    const statResolvidas = document.getElementById('statResolvidas');

    // Modal
    const modalEdicao = document.getElementById('modalEdicao');
    const formEditar = document.getElementById('formEditar');
    const btnFecharModal = document.getElementById('btnFecharModal');
    const btnCancelar = document.getElementById('btnCancelar');

    // Inicialização
    carregarSolicitacoes();

    // Eventos
    btnRecarregar.addEventListener('click', carregarSolicitacoes);
    filtroBusca.addEventListener('input', filtrarEExibir);
    filtroStatus.addEventListener('change', filtrarEExibir);
    if (filtroCidade) filtroCidade.addEventListener('change', filtrarEExibir);
    if (filtroEstado) filtroEstado.addEventListener('change', filtrarEExibir);
    if (filtroPrioridade) filtroPrioridade.addEventListener('change', filtrarEExibir);

    configurarVisualizadorImagem();

    btnFecharModal.addEventListener('click', fecharModal);
    btnCancelar.addEventListener('click', fecharModal);

    modalEdicao.addEventListener('click', (e) => {
        if (e.target === modalEdicao) fecharModal();
    });

    formEditar.addEventListener('submit', salvarEdicao);

    // FUNÇÕES PRINCIPAIS

    async function carregarSolicitacoes() {
        listaProblemas.innerHTML = `
            <div class="consulta-vazia">
                <h4>Carregando solicitações...</h4>
                <p>Buscando registros do banco de dados.</p>
            </div>
        `;

        try {
            const resposta = await fetch(API_URL);

            if (!resposta.ok) {
                throw new Error(`Erro na API: ${resposta.status}`);
            }

            solicitacoes = await resposta.json();
            atualizarFiltrosLocalizacao();
            atualizarEstatisticas();
            filtrarEExibir();

        } catch (erro) {
            console.error('Erro ao conectar com a API:', erro);
            solicitacoes = [];
            atualizarEstatisticas();

            listaProblemas.innerHTML = `
                <div class="consulta-vazia">
                    <h4>Erro de Conexão</h4>
                    <p>Não foi possível conectar ao servidor em <strong>${API_URL}</strong>.</p>
                </div>
            `;
        }
    }

    function atualizarEstatisticas() {
        const total = solicitacoes.length;
        const resolvidas = solicitacoes.filter(s => s.foiResolvido === true || s.resolvido === true).length;
        const pendentes = total - resolvidas;

        if (statTotal) statTotal.textContent = total;
        if (statPendentes) statPendentes.textContent = pendentes;
        if (statResolvidas) statResolvidas.textContent = resolvidas;
    }

    function filtrarEExibir() {
        const termo = filtroBusca ? filtroBusca.value.toLowerCase().trim() : '';
        const statusFiltro = filtroStatus ? filtroStatus.value : 'todos';
        const cidadeFiltro = filtroCidade ? filtroCidade.value : 'todas';
        const estadoFiltro = filtroEstado ? filtroEstado.value : 'todos';
        const prioridadeFiltro = filtroPrioridade ? filtroPrioridade.value : 'todas';

        const filtradas = solicitacoes.filter(item => {
            const ehResolvido = item.foiResolvido === true || item.resolvido === true;

            if (statusFiltro === 'pendente' && ehResolvido) return false;
            if (statusFiltro === 'resolvido' && !ehResolvido) return false;
            if (prioridadeFiltro !== 'todas' && Number(item.prioridade ?? 2) !== Number(prioridadeFiltro)) return false;

            const end = item.endereco || {};
            const rua = end.logradouro || item.rua || '';
            const bairro = end.bairro || item.bairro || '';
            const cidade = end.cidade || item.cidade || '';
            const estado = end.estado || item.estado || '';

            if (cidadeFiltro !== 'todas' && normalizar(cidade) !== cidadeFiltro) return false;
            if (estadoFiltro !== 'todos' && normalizar(estado) !== estadoFiltro) return false;

            const textoCompleto = `${item.descricao || ''} ${cidade} ${estado} ${bairro} ${rua}`.toLowerCase();
            return textoCompleto.includes(termo);
        });

        renderizarLista(filtradas);
    }

    function normalizar(valor) {
        return String(valor ?? '').trim().toLocaleLowerCase('pt-BR');
    }

    function obterEndereco(item) {
        return item.endereco || {};
    }

    function atualizarFiltrosLocalizacao() {
        preencherFiltro(filtroCidade, 'todas', 'Todas as cidades',
            solicitacoes.map(item => {
                const end = obterEndereco(item);
                return end.cidade || item.cidade || '';
            }));
        preencherFiltro(filtroEstado, 'todos', 'Todos os estados',
            solicitacoes.map(item => {
                const end = obterEndereco(item);
                return end.estado || item.estado || '';
            }));
    }

    function preencherFiltro(select, valorPadrao, textoPadrao, valores) {
        if (!select) return;
        const valorAnterior = select.value || valorPadrao;
        const unicos = [...new Map(
            valores.map(valor => [normalizar(valor), String(valor).trim()])
                 .filter(([chave, valor]) => chave && valor)
        ).entries()].sort((a, b) => a[1].localeCompare(b[1], 'pt-BR'));

        select.innerHTML = '';
        const opcaoPadrao = document.createElement('option');
        opcaoPadrao.value = valorPadrao;
        opcaoPadrao.textContent = textoPadrao;
        select.appendChild(opcaoPadrao);

        unicos.forEach(([chave, valor]) => {
            const opcao = document.createElement('option');
            opcao.value = chave;
            opcao.textContent = valor;
            select.appendChild(opcao);
        });

        select.value = [...select.options].some(opcao => opcao.value === valorAnterior)
            ? valorAnterior : valorPadrao;
    }

    function configurarVisualizadorImagem() {
        const overlay = document.getElementById('visualizadorImagem');
        const imagemGrande = document.getElementById('imagemAmpliada');
        const legenda = document.getElementById('legendaImagemAmpliada');
        const fechar = document.getElementById('fecharImagemAmpliada');
        if (!overlay || !imagemGrande || !fechar) return;

        function fecharVisualizador() {
            overlay.classList.remove('active');
            overlay.setAttribute('aria-hidden', 'true');
            imagemGrande.src = '';
            document.body.style.overflow = '';
        }

        window.abrirImagemAmpliada = function(src, descricao) {
            imagemGrande.src = src;
            imagemGrande.alt = descricao || 'Imagem da ocorrência ampliada';
            if (legenda) legenda.textContent = descricao || 'Imagem da ocorrência';
            overlay.classList.add('active');
            overlay.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            fechar.focus();
        };

        fechar.addEventListener('click', fecharVisualizador);
        overlay.addEventListener('click', evento => {
            if (evento.target === overlay) fecharVisualizador();
        });
        imagemGrande.addEventListener('click', evento => evento.stopPropagation());
        document.addEventListener('keydown', evento => {
            if (evento.key === 'Escape') fecharVisualizador();
        });
    }

    function renderizarLista(itens) {
        if (!itens || itens.length === 0) {
            listaProblemas.innerHTML = `
                <div class="consulta-vazia">
                    <h4>Nenhuma solicitação encontrada</h4>
                    <p>Tente mudar a busca ou selecionar outro filtro.</p>
                </div>
            `;
            return;
        }

        listaProblemas.innerHTML = itens.map(item => criarCardHTML(item)).join('');
    }

    function criarCardHTML(item) {
        const ehResolvido = item.foiResolvido === true || item.resolvido === true;
        const statusTexto = ehResolvido ? 'Resolvido' : 'Pendente';
        const statusClasse = ehResolvido ? 'status-resolvido' : 'status-pendente';

        const tipoId = item.tipoProblema ?? item.tipo ?? 5;
        const nomeCategoria = CATEGORIAS[tipoId] || 'Geral';
        const prioridadeId = Number(item.prioridade ?? 2);
        const nomePrioridade = PRIORIDADES[prioridadeId] || 'Média';
        const prioridadeClasse = ({
            0: 'prioridade-critica',
            1: 'prioridade-alta',
            2: 'prioridade-media',
            3: 'prioridade-baixa'
        })[prioridadeId] || 'prioridade-media';

        // Extrai todos os campos do endereço
        const end = item.endereco || {};
        const rua = end.logradouro || item.rua || 'Não informado';
        const bairro = end.bairro || item.bairro || 'Não informado';
        const cidade = end.cidade || item.cidade || 'Não informada';
        const estado = end.estado || item.estado || 'UF';
        const cep = end.cep || item.cep || 'Não informado';

        // Trata URL da Imagem
        let imagemSrc = item.imagemUrl ?? item.ImagemUrl ?? item.imagem ?? item.Imagem ?? null;
        if (imagemSrc) {
            imagemSrc = /^https?:\/\//i.test(imagemSrc)
                ? imagemSrc
                : `${BASE_URL}${String(imagemSrc).startsWith('/') ? '' : '/'}${imagemSrc}`;
        }

        return `
            <article class="cartao-problema ${prioridadeClasse}">
                <div class="cartao-conteudo-admin">
                    <div class="cartao-cabecalho-admin">
                        <span class="etiqueta-problema">${nomeCategoria}</span>
                        <span class="status-badge ${statusClasse}">Status: ${statusTexto}</span>
                        <span class="prioridade-texto ${prioridadeClasse}">Prioridade: ${nomePrioridade}</span>
                    </div>

                    <h4>Solicitação #${item.id || 'N/A'}</h4>

                    <p class="descricao-admin"><strong>Descrição:</strong> ${item.descricao || 'Sem descrição cadastrada.'}</p>

                    <div class="cartao-detalhes-admin">
                        <span><strong>Logradouro:</strong> ${rua}</span>
                        <span><strong>Bairro:</strong> ${bairro}</span>
                        <span><strong>Cidade/UF:</strong> ${cidade}/${estado}</span>
                        <span><strong>CEP:</strong> ${cep}</span>
                        
                    </div>
                </div>

                <div class="cartao-midia-acoes">
                    <div class="imagem-container-admin">
                        ${
                            imagemSrc 
                            ? `<img src="${imagemSrc}" alt="Foto da ocorrência" loading="lazy" tabindex="0" role="button" title="Clique para ampliar" onclick="window.abrirImagemAmpliada(this.src, this.alt)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();window.abrirImagemAmpliada(this.src,this.alt)}" onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'consulta-vazia\\' style=\\'padding:20px; font-size:12px;\\'>Sem Imagem Anexada</div>';">`
                            : `<div class="consulta-vazia" style="height:100%; display:grid; place-items:center; padding:10px; font-size:13px; color:var(--texto-claro);">Sem Imagem Anexada</div>`
                        }
                    </div>

                    <div class="acoes-solicitacao-admin">
                        <button type="button" class="botao botao-secundario botao-pequeno" onclick="window.abrirModalEdicao('${item.id}')">
                            Editar Solicitação
                        </button>
                        <button type="button" class="botao botao-perigo botao-pequeno" onclick="window.excluirSolicitacao('${item.id}')">
                            Excluir Solicitação
                        </button>
                    </div>
                </div>
            </article>
        `;
    }

    // EXCLUIR SOLICITAÇÃO
    window.excluirSolicitacao = async function(id) {
        const item = solicitacoes.find(s => String(s.id) === String(id));
        if (!item) {
            alert('Não foi possível localizar esta solicitação.');
            return;
        }

        const confirmar = confirm(`Tem certeza de que deseja excluir a solicitação #${id}? Esta ação não pode ser desfeita.`);
        if (!confirmar) return;

        try {
            const resposta = await fetch(`${API_URL}/${encodeURIComponent(id)}`, {
                method: 'DELETE'
            });

            if (!resposta.ok) {
                const detalhe = await resposta.text().catch(() => '');
                throw new Error(`Erro ${resposta.status}${detalhe ? `: ${detalhe}` : ''}`);
            }

            solicitacoes = solicitacoes.filter(s => String(s.id) !== String(id));
            atualizarEstatisticas();
            atualizarFiltrosLocalizacao();
            filtrarEExibir();
            alert(`Solicitação #${id} excluída com sucesso.`);
        } catch (erro) {
            console.error('Erro ao excluir solicitação:', erro);
            alert(`Não foi possível excluir a solicitação #${id}. Verifique se a API possui o endpoint DELETE /problemas/{id}.`);
        }
    };

    // ABRIR E SALVAR MODAL

    window.abrirModalEdicao = function(id) {
        const item = solicitacoes.find(s => String(s.id) === String(id));
        if (!item) return;

        const end = item.endereco || {};

        document.getElementById('editId').value = item.id;
        document.getElementById('editDescricao').value = item.descricao || '';
        document.getElementById('editTipo').value = item.tipoProblema ?? item.tipo ?? 0;
        document.getElementById('editPrioridade').value = item.prioridade ?? 0;
        document.getElementById('editEstado').value = end.estado || item.estado || '';
        document.getElementById('editCidade').value = end.cidade || item.cidade || '';
        document.getElementById('editBairro').value = end.bairro || item.bairro || '';
        document.getElementById('editRua').value = end.logradouro || item.rua || '';
        document.getElementById('editCep').value = end.cep || item.cep || '';
        
        const resolvidoBool = item.foiResolvido === true || item.resolvido === true;
        document.getElementById('editStatus').value = resolvidoBool.toString();

        modalEdicao.classList.add('active');
    };

    function fecharModal() {
        modalEdicao.classList.remove('active');
        formEditar.reset();
    }

    function itemImagemAtual(id) {
        const item = solicitacoes.find(s => String(s.id) === String(id));
        return item ? (item.imagemUrl ?? item.ImagemUrl ?? item.imagem ?? item.Imagem ?? null) : null;
    }

    async function salvarEdicao(e) {
        e.preventDefault();

        const id = document.getElementById('editId').value;

        const dadosAtualizados = {
            id: isNaN(id) ? id : Number(id),
            descricao: document.getElementById('editDescricao').value,
            tipoProblema: Number(document.getElementById('editTipo').value),
            prioridade: Number(document.getElementById('editPrioridade').value),
            foiResolvido: document.getElementById('editStatus').value === 'true',
            // Preserva a foto existente durante edições que não alteram a imagem.
            imagemUrl: itemImagemAtual(id),
            endereco: {
                estado: document.getElementById('editEstado').value.toUpperCase(),
                cidade: document.getElementById('editCidade').value,
                bairro: document.getElementById('editBairro').value,
                logradouro: document.getElementById('editRua').value,
                cep: document.getElementById('editCep').value
            }
        };

        try {
            const resposta = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(dadosAtualizados)
            });

            if (!resposta.ok) {
                throw new Error(`Erro ao salvar no servidor: ${resposta.status}`);
            }

            fecharModal();
            carregarSolicitacoes();

        } catch (erro) {
            console.error('Erro ao atualizar registro:', erro);
            alert('Não foi possível salvar as alterações no banco de dados.');
        }
    }
});