document.addEventListener('DOMContentLoaded', () => {
  const BASE_URL = 'https://localhost:7119';
  const API_URL = `${BASE_URL}/problemas`;
  const CATEGORIAS = {0:'Semáforo',1:'Buraco',2:'Iluminação pública',3:'Árvore',4:'Lixo',5:'Outro'};
  const PRIORIDADES = {0:'Crítica',1:'Alta',2:'Média',3:'Baixa'};
  const areaConteudo = document.getElementById('areaConteudo');
  const btnRegistrar = document.getElementById('btnRegistrar');
  const btnConsultar = document.getElementById('btnConsultar');
  const btnConsultarHero = document.querySelector('.hero-botoes a.botao-secundario');
  let problemas = [];

  configurarVisualizadorImagemPublico();

  btnRegistrar.addEventListener('click', mostrarFormulario);
  btnConsultar.addEventListener('click', mostrarConsulta);
  if (btnConsultarHero) btnConsultarHero.addEventListener('click', evento => { evento.preventDefault(); mostrarConsulta(); });

  function mostrarFormulario() {
    areaConteudo.hidden = false;
    areaConteudo.innerHTML = `
      <form id="formCadastroProblema" class="formulario-problema">
        <h3>Registrar um problema</h3><p class="form-intro">Preencha as informações abaixo. O CEP pode completar automaticamente rua, bairro, cidade e estado.</p>
        <div class="form-grid-publico">
          <div class="form-group-publico full"><label for="cadDescricao">Descrição do problema *</label><textarea id="cadDescricao" required maxlength="2000" placeholder="Descreva o que aconteceu e como isso afeta a região..."></textarea></div>
          <div class="form-group-publico"><label for="cadCategoria">Categoria *</label><select id="cadCategoria" required><option value="">Selecione a categoria</option><option value="0">Semáforo</option><option value="1">Buraco</option><option value="2">Iluminação pública</option><option value="3">Árvore</option><option value="4">Lixo</option><option value="5">Outro</option></select></div>
          <div class="form-group-publico"><label for="cadPrioridade">Prioridade percebida *</label><select id="cadPrioridade" required><option value="3">Baixa</option><option value="2" selected>Média</option><option value="1">Alta</option><option value="0">Crítica</option></select></div>
          <div class="form-group-publico"><label for="cadCep">CEP *</label><input id="cadCep" name="cep" type="text" inputmode="numeric" autocomplete="postal-code" maxlength="9" placeholder="00000-000" required><span id="cepStatus" class="cep-status" aria-live="polite">Digite os 8 números do CEP.</span></div>
          <div class="form-group-publico"><label for="cadRua">Rua / logradouro *</label><input id="cadRua" required autocomplete="address-line1" placeholder="Nome da rua"></div>
          <div class="form-group-publico"><label for="cadBairro">Bairro *</label><input id="cadBairro" required autocomplete="address-level3" placeholder="Bairro"></div>
          <div class="form-group-publico"><label for="cadCidade">Cidade *</label><input id="cadCidade" required autocomplete="address-level2" placeholder="Cidade"></div>
          <div class="form-group-publico"><label for="cadEstado">Estado (UF) *</label><input id="cadEstado" required maxlength="2" autocomplete="address-level1" placeholder="SP"></div>
          <div class="form-group-publico full"><label for="cadImagem">Foto do problema (opcional)</label><input id="cadImagem" type="file" accept="image/*"><small class="ajuda-arquivo">Anexe uma foto em JPG, PNG, WEBP ou outro formato de imagem. Tamanho máximo: 5 MB.</small><div id="previewImagemContainer" class="preview-imagem-container" hidden><img id="previewImagem" alt="Pré-visualização da foto selecionada"><button type="button" id="removerImagem" class="botao botao-secundario">Remover foto</button></div></div>
        </div>
        <div class="form-rodape"><button class="botao" type="submit" id="btnEnviarCadastro">Enviar ocorrência</button><button class="botao botao-secundario" type="button" id="btnCancelarCadastro">Cancelar</button><span id="cadMensagem" class="form-mensagem" role="status" aria-live="polite"></span></div>
      </form>`;
    const form = document.getElementById('formCadastroProblema');
    const cep = document.getElementById('cadCep');
    cep.addEventListener('input', () => {
      const numeros = cep.value.replace(/\D/g,'').slice(0,8);
      cep.value = numeros.length > 5 ? `${numeros.slice(0,5)}-${numeros.slice(5)}` : numeros;
      if (numeros.length === 8) buscarCep(numeros);
      else setCepStatus('Digite os 8 números do CEP.');
    });
    document.getElementById('cadEstado').addEventListener('input', e => e.target.value = e.target.value.toUpperCase().replace(/[^A-Z]/g,'').slice(0,2));
    const campoImagem = document.getElementById('cadImagem');
    campoImagem.addEventListener('change', () => {
      const arquivo = campoImagem.files && campoImagem.files[0];
      const container = document.getElementById('previewImagemContainer');
      const preview = document.getElementById('previewImagem');
      if (!arquivo) { container.hidden = true; preview.removeAttribute('src'); return; }
      if (!arquivo.type.startsWith('image/')) {
        campoImagem.value = '';
        setMensagemCadastro('Selecione um arquivo de imagem válido.', 'erro');
        container.hidden = true;
        return;
      }
      if (arquivo.size > 5 * 1024 * 1024) {
        campoImagem.value = '';
        setMensagemCadastro('A imagem deve ter no máximo 5 MB.', 'erro');
        container.hidden = true;
        return;
      }
      preview.src = URL.createObjectURL(arquivo);
      container.hidden = false;
    });
    document.getElementById('removerImagem').addEventListener('click', () => {
      campoImagem.value = '';
      document.getElementById('previewImagem').removeAttribute('src');
      document.getElementById('previewImagemContainer').hidden = true;
    });
    document.getElementById('btnCancelarCadastro').addEventListener('click', () => { areaConteudo.hidden = true; areaConteudo.innerHTML=''; });
    form.addEventListener('submit', cadastrarProblema);
    areaConteudo.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function setCepStatus(texto, classe='') {
    const el = document.getElementById('cepStatus');
    if (!el) return;
    el.textContent = texto;
    el.className = `cep-status ${classe}`.trim();
  }

  async function buscarCep(cep) {
    setCepStatus('Consultando CEP...');
    try {
      const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (!resposta.ok) throw new Error('Falha na consulta do CEP.');
      const dados = await resposta.json();
      if (dados.erro) { setCepStatus('CEP não encontrado. Confira os números.', 'erro'); return; }
      document.getElementById('cadRua').value = dados.logradouro || '';
      document.getElementById('cadBairro').value = dados.bairro || '';
      document.getElementById('cadCidade').value = dados.localidade || '';
      document.getElementById('cadEstado').value = dados.uf || '';
      setCepStatus('Endereço preenchido pelo ViaCEP. Confira os dados.', 'sucesso');
    } catch (erro) {
      console.error('Erro ao consultar ViaCEP:', erro);
      setCepStatus('Não foi possível consultar agora. Preencha o endereço manualmente.', 'erro');
    }
  }

  function setMensagemCadastro(texto, classe='') {
    const mensagem = document.getElementById('cadMensagem');
    if (!mensagem) return;
    mensagem.textContent = texto;
    mensagem.className = `form-mensagem ${classe}`.trim();
  }

  async function cadastrarProblema(evento) {
    evento.preventDefault();
    const botao = document.getElementById('btnEnviarCadastro');
    const campoImagem = document.getElementById('cadImagem');
    const arquivoImagem = campoImagem?.files?.[0] || null;
    const cep = document.getElementById('cadCep').value.replace(/\D/g,'');
    if (cep.length !== 8) { setMensagemCadastro('Informe um CEP com 8 números.', 'erro'); return; }
    if (arquivoImagem && !arquivoImagem.type.startsWith('image/')) {
      setMensagemCadastro('Selecione um arquivo de imagem válido.', 'erro'); return;
    }
    if (arquivoImagem && arquivoImagem.size > 5 * 1024 * 1024) {
      setMensagemCadastro('A imagem deve ter no máximo 5 MB.', 'erro'); return;
    }

    const dados = {
      descricao: document.getElementById('cadDescricao').value.trim(),
      tipoProblema: Number(document.getElementById('cadCategoria').value),
      prioridade: Number(document.getElementById('cadPrioridade').value),
      foiResolvido: false,
      endereco: {
        estado: document.getElementById('cadEstado').value.trim().toUpperCase(),
        cidade: document.getElementById('cadCidade').value.trim(),
        bairro: document.getElementById('cadBairro').value.trim(),
        logradouro: document.getElementById('cadRua').value.trim(),
        cep: cep
      }
    };
    botao.disabled = true;
    botao.textContent = 'Enviando ocorrência...';
    setMensagemCadastro('Cadastrando ocorrência...', '');
    try {
      const resposta = await fetch(API_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(dados)
      });
      const textoResposta = await resposta.text().catch(() => '');
      if (!resposta.ok) {
        throw new Error(`A API respondeu ${resposta.status}${textoResposta ? `: ${textoResposta}` : ''}`);
      }

      let ordemCriada = {};
      try { ordemCriada = textoResposta ? JSON.parse(textoResposta) : {}; } catch (_) {}
      let idCriado = ordemCriada.id ?? ordemCriada.Id ?? ordemCriada.ordem?.id ?? ordemCriada.ordem?.Id;

      if (arquivoImagem) {
        if (idCriado === undefined || idCriado === null || idCriado === '') {
          throw new Error('A ocorrência foi cadastrada, mas a API não retornou o ID. Para enviar a foto, o POST /problemas precisa retornar o objeto criado com seu id.');
        }
        botao.textContent = 'Enviando foto...';
        setMensagemCadastro('Ocorrência criada. Enviando a foto...', '');
        const formularioImagem = new FormData();
        formularioImagem.append('imagem', arquivoImagem);
        // A rota deve chamar SalvarImagemAsync(id, imagem, webRootPath) no backend.
        const respostaImagem = await fetch(`${API_URL}/${encodeURIComponent(idCriado)}/upload-imagem`, {
          method: 'POST',
          body: formularioImagem
        });
        if (!respostaImagem.ok) {
          const detalheImagem = await respostaImagem.text().catch(() => '');
          throw new Error(`A ocorrência foi cadastrada, mas o envio da foto falhou (HTTP ${respostaImagem.status})${detalheImagem ? `: ${detalheImagem}` : ''}. Confira a rota POST /problemas/{id}/upload-imagem no backend.`);
        }
      }

      setMensagemCadastro(arquivoImagem ? 'Ocorrência e foto cadastradas com sucesso!' : 'Ocorrência cadastrada com sucesso!', 'sucesso');
      document.getElementById('formCadastroProblema').reset();
      setCepStatus('Digite os 8 números do CEP.');
      const previewContainer = document.getElementById('previewImagemContainer');
      const preview = document.getElementById('previewImagem');
      if (preview) preview.removeAttribute('src');
      if (previewContainer) previewContainer.hidden = true;
    } catch (erro) {
      console.error('Erro ao cadastrar ocorrência:', erro);
      setMensagemCadastro(`Não foi possível concluir o cadastro: ${erro.message || 'verifique se a API está ligada.'}`, 'erro');
    } finally {
      botao.disabled = false;
      botao.textContent = 'Enviar ocorrência';
    }
  }

  async function mostrarConsulta() {
    areaConteudo.hidden = false;
    areaConteudo.innerHTML = `
      <section class="consulta-painel" id="painelConsulta"><h3>Consultar problemas</h3><p class="form-intro">Pesquise por descrição ou localização e combine os filtros.</p>
      <div class="filtros-publicos">
        <input id="buscaPublica" type="search" placeholder="Pesquisar descrição, rua, bairro..." aria-label="Pesquisar ocorrências">
        <select id="statusPublico" aria-label="Filtrar por status"><option value="todos">Todos os status</option><option value="pendente">Pendentes</option><option value="resolvido">Resolvidos</option></select>
        <select id="prioridadePublica" aria-label="Filtrar por prioridade"><option value="todas">Todas as prioridades</option><option value="0">Crítica</option><option value="1">Alta</option><option value="2">Média</option><option value="3">Baixa</option></select>
        <select id="cidadePublica" aria-label="Filtrar por cidade"><option value="todas">Todas as cidades</option></select>
        <select id="estadoPublico" aria-label="Filtrar por estado"><option value="todos">Todos os estados</option></select>
        <button type="button" class="botao botao-secundario" id="atualizarPublico">Atualizar resultados</button>
      </div><div id="resultadoContagem" class="form-intro" aria-live="polite"></div><div id="cardsPublicos" class="cards-publicos"><div class="consulta-vazia"><h4>Carregando ocorrências...</h4></div></div></section>`;
    ['buscaPublica','statusPublico','prioridadePublica','cidadePublica','estadoPublico'].forEach(id => document.getElementById(id).addEventListener(id==='buscaPublica'?'input':'change', renderizarConsulta));
    document.getElementById('atualizarPublico').addEventListener('click', carregarProblemas);
    await carregarProblemas();
    const listagem = document.getElementById('cardsPublicos');
    if (listagem) listagem.scrollIntoView({behavior:'smooth', block:'start'});
  }

  async function carregarProblemas() {
    const cards = document.getElementById('cardsPublicos');
    if (!cards) return;
    cards.innerHTML = '<div class="consulta-vazia"><h4>Carregando ocorrências...</h4></div>';
    try {
      const resposta = await fetch(API_URL);
      if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
      const dados = await resposta.json();
      problemas = Array.isArray(dados) ? dados : (dados.items || dados.dados || []);
      preencherFiltrosPublicos(); renderizarConsulta();
    } catch (erro) {
      console.error('Erro ao carregar ocorrências:', erro);
      cards.innerHTML = `<div class="consulta-vazia"><h4>Não foi possível carregar os problemas</h4><p>Verifique se a API está em <strong>${API_URL}</strong>.</p></div>`;
    }
  }

  function normalizar(valor) { return String(valor ?? '').trim().toLocaleLowerCase('pt-BR'); }
  function enderecoDe(item) { return item.endereco || {}; }
  function obterCampo(item, campoInterno, campoDireto) { const end=enderecoDe(item); return end[campoInterno] || item[campoDireto] || ''; }
  function preencherSelect(id, padrao, texto, valores) {
    const select=document.getElementById(id); if(!select) return;
    const anterior=select.value || padrao;
    const unicos=[...new Map(valores.map(v=>[normalizar(v),String(v||'').trim()]).filter(([k,v])=>k&&v)).entries()].sort((a,b)=>a[1].localeCompare(b[1],'pt-BR'));
    select.innerHTML=''; const op=document.createElement('option'); op.value=padrao; op.textContent=texto; select.appendChild(op);
    unicos.forEach(([chave,valor])=>{const o=document.createElement('option');o.value=chave;o.textContent=valor;select.appendChild(o);});
    select.value=[...select.options].some(o=>o.value===anterior)?anterior:padrao;
  }
  function preencherFiltrosPublicos() {
    preencherSelect('cidadePublica','todas','Todas as cidades',problemas.map(p=>obterCampo(p,'cidade','cidade')));
    preencherSelect('estadoPublico','todos','Todos os estados',problemas.map(p=>obterCampo(p,'estado','estado')));
  }

  function configurarVisualizadorImagemPublico() {
    const overlay = document.getElementById('visualizadorImagemPublico');
    const imagemGrande = document.getElementById('imagemAmpliadaPublico');
    const legenda = document.getElementById('legendaImagemAmpliadaPublico');
    const fechar = document.getElementById('fecharImagemAmpliadaPublico');
    if (!overlay || !imagemGrande || !fechar) return;

    function fecharVisualizador() {
      overlay.classList.remove('active');
      overlay.setAttribute('aria-hidden', 'true');
      imagemGrande.src = '';
      document.body.style.overflow = '';
    }

    window.abrirImagemAmpliadaPublico = function(src, descricao) {
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
      if (evento.key === 'Escape' && overlay.classList.contains('active')) fecharVisualizador();
    });
  }

  function renderizarConsulta() {
    const cards=document.getElementById('cardsPublicos'); if(!cards) return;
    const termo=normalizar(document.getElementById('buscaPublica')?.value);
    const status=document.getElementById('statusPublico')?.value || 'todos';
    const prioridade=document.getElementById('prioridadePublica')?.value || 'todas';
    const cidade=document.getElementById('cidadePublica')?.value || 'todas';
    const estado=document.getElementById('estadoPublico')?.value || 'todos';
    const filtrados=problemas.filter(p=>{
      const resolvido=p.foiResolvido===true || p.resolvido===true;
      if(status==='pendente'&&resolvido) return false; if(status==='resolvido'&&!resolvido) return false;
      if(prioridade!=='todas'&&Number(p.prioridade??2)!==Number(prioridade)) return false;
      const rua=obterCampo(p,'logradouro','rua'), bairro=obterCampo(p,'bairro','bairro'), cid=obterCampo(p,'cidade','cidade'), uf=obterCampo(p,'estado','estado');
      if(cidade!=='todas'&&normalizar(cid)!==cidade) return false; if(estado!=='todos'&&normalizar(uf)!==estado) return false;
      return normalizar(`${p.descricao||''} ${rua} ${bairro} ${cid} ${uf} ${p.id||''}`).includes(termo);
    });
    document.getElementById('resultadoContagem').textContent=`${filtrados.length} ocorrência(s) encontrada(s).`;
    if(!filtrados.length){cards.innerHTML='<div class="consulta-vazia"><h4>Nenhuma ocorrência encontrada</h4><p>Tente alterar a pesquisa ou os filtros.</p></div>';return;}
    cards.innerHTML=filtrados.map(criarCardPublico).join('');
  }
  function escapar(valor) { return String(valor ?? '').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function criarCardPublico(item) {
    const resolvido=item.foiResolvido===true||item.resolvido===true;
    const status=resolvido?'Resolvido':'Pendente'; const statusClasse=resolvido?'status-resolvido':'status-pendente';
    const categoria=CATEGORIAS[item.tipoProblema??item.tipo??5]||'Outro';
    const prioridadeId=Number(item.prioridade??2); const prioridade=PRIORIDADES[prioridadeId]||'Média';
    const pClasse=({0:'prioridade-critica',1:'prioridade-alta',2:'prioridade-media',3:'prioridade-baixa'})[prioridadeId]||'prioridade-media';
    const rua=obterCampo(item,'logradouro','rua')||'Não informado'; const bairro=obterCampo(item,'bairro','bairro')||'Não informado';
    const cidade=obterCampo(item,'cidade','cidade')||'Não informada'; const estado=obterCampo(item,'estado','estado')||'UF'; const cep=obterCampo(item,'cep','cep')||'Não informado';
    let imagem=item.imagemUrl||item.ImagemUrl||item.imagem||item.Imagem||''; if(imagem&&!/^https?:\/\//i.test(imagem)) imagem=`${BASE_URL}${imagem.startsWith('/')?'':'/'}${imagem}`;
    return `<article class="cartao-problema-publico ${pClasse}"><div class="cartao-cabecalho-publico"><span class="etiqueta-problema">${escapar(categoria)}</span><span class="status-badge ${statusClasse}">Status: ${status}</span><span class="prioridade-texto ${pClasse}">Prioridade: ${escapar(prioridade)}</span></div><h4>Ocorrência #${escapar(item.id||'—')}</h4><p class="descricao-card">${escapar(item.descricao||'Sem descrição cadastrada.')}</p><div class="detalhes-card"><span><strong>Logradouro:</strong> ${escapar(rua)}</span><span><strong>Bairro:</strong> ${escapar(bairro)}</span><span><strong>Cidade/UF:</strong> ${escapar(cidade)}/${escapar(estado)}</span><span><strong>CEP:</strong> ${escapar(cep)}</span></div>${imagem?`<img class="imagem-card-publico imagem-ampliavel" src="${escapar(imagem)}" alt="Imagem da ocorrência #${escapar(item.id||'')}" loading="lazy" tabindex="0" role="button" title="Clique para ampliar" onclick="window.abrirImagemAmpliadaPublico(this.src, this.alt)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();window.abrirImagemAmpliadaPublico(this.src,this.alt)}" onerror="this.remove()">`:''}</article>`;
  }
});