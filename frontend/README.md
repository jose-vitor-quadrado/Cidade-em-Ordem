# Cidade em Ordem — Frontend

Interface Web do **Cidade em Ordem**, desenvolvida com HTML, CSS e JavaScript puro, sem frameworks de interface. Permite que os cidadãos registrem e consultem problemas urbanos por meio da API do projeto.

## 🧰 Tecnologias

- **HTML5** — estrutura das páginas.
- **CSS3** — estilização e layout da interface.
- **JavaScript** — interatividade e comunicação com a API.
- **Live Server** — servidor local para executar a aplicação durante o desenvolvimento.

## 📋 Pré-requisitos

- [Node.js](https://nodejs.org/), que inclui o npm.
- Backend do Cidade em Ordem configurado e em execução para utilizar as funcionalidades que dependem da API.

Verifique se o Node.js e o npm estão instalados:

```bash
node -v
npm -v
```

## 🚀 Como executar

**1. Abra o terminal na pasta do frontend.**

Entre no diretório que contém os arquivos HTML, CSS e JavaScript da interface.

**2. Inicie o servidor local.**

Execute:

```bash
npx live-server --port=5500
```

Caso o `live-server` não esteja disponível, o `npx` poderá solicitar a instalação ou execução do pacote.

**3. Acesse a aplicação.**

Abra o endereço abaixo no navegador:

http://localhost:5500

## ✨ Funcionalidades

- Registro de problemas urbanos com descrição, categoria, prioridade e endereço.
- Preenchimento dos dados do endereço a partir do CEP, quando disponível.
- Anexo opcional de fotografia da ocorrência.
- Consulta e busca de problemas cadastrados.
- Interface para utilização das funcionalidades administrativas disponibilizadas pelo sistema.

## 🔌 Integração com o backend

O frontend utiliza requisições HTTP para se comunicar com a API do Cidade em Ordem.

Para utilizar todas as funcionalidades, verifique se:

- O backend está em execução.
- A URL configurada no JavaScript corresponde ao endereço da API.
- A API permite as requisições de origem do frontend, conforme a configuração de CORS.

## 🔗 Projeto relacionado

Consulte o [README do backend](../backend/README.md) para conhecer as rotas da API, o exemplo de cadastro e as instruções para executar o servidor.

---

Projeto acadêmico da disciplina de **Linguagens de Programação I — UNIRP**.
