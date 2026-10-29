# Cidade em Ordem — Frontend

Frontend do **Cidade em Ordem**, desenvolvido com Angular 22, responsável pela interface de registro e consulta de problemas urbanos.

O projeto busca facilitar a participação dos cidadãos na identificação de problemas urbanos, permitindo registrar ocorrências e consultar informações disponibilizadas pela API do sistema.

## 🧰 Tecnologias

- **Angular 22** — framework utilizado para desenvolver a interface.
- **TypeScript** — linguagem utilizada no desenvolvimento da aplicação Angular.
- **HTML5** — estruturação do conteúdo.
- **CSS3** — estilização e layout da interface.
- **Node.js e npm** — ambiente e gerenciamento de dependências.
- **Angular CLI** — ferramenta para executar, compilar e gerenciar o projeto.

## 📋 Pré-requisitos

Antes de executar a aplicação, instale:

- [Node.js](https://nodejs.org/) compatível com o Angular 22.
- npm, incluído na instalação do Node.js.

Consulte a [tabela oficial de compatibilidade do Angular](https://angular.dev/reference/versions) para verificar as versões necessárias.

Verifique as instalações pelo terminal:

```bash
node -v
npm -v
```

## 🚀 Como executar

### 1. Acesse o diretório do frontend

No terminal, entre na pasta que contém o arquivo `package.json` do projeto Angular.

### 2. Instale as dependências

```bash
npm install
```

Esse comando instala as dependências declaradas no projeto.

### 3. Inicie a aplicação

```bash
npx ng serve
```

O Angular CLI compila a aplicação e inicia o servidor de desenvolvimento.

Por padrão, a aplicação estará disponível em:

http://localhost:4200

Para abrir o navegador automaticamente, utilize:

```bash
npx ng serve --open
```

Para interromper o servidor, pressione `Ctrl + C` no terminal.

## ✨ Funcionalidades

A interface tem como objetivo disponibilizar as seguintes funcionalidades:

- **Registro de problemas urbanos:** formulário para informar a descrição, categoria, prioridade e endereço da ocorrência.
- **Consulta de problemas:** visualização dos registros cadastrados.
- **Busca por campos:** pesquisa de ocorrências utilizando os critérios disponibilizados pela API.
- **Envio de imagens:** possibilidade de anexar uma fotografia ao problema, conforme a implementação do sistema.
- **Administração de ocorrências:** interface para atualizar ou excluir registros, conforme as permissões e funcionalidades implementadas.

## 🔌 Integração com o backend

O frontend se comunica com a API Web do Cidade em Ordem para enviar e consultar informações.

Para utilizar as funcionalidades integradas:

1. Inicie o backend seguindo as instruções do [README do backend](../backend/README.md).
2. Verifique o endereço e a porta em que a API está sendo executada.
3. Confira se a URL utilizada nas requisições do frontend corresponde ao endereço configurado no backend.
4. Verifique a configuração de CORS da API caso o navegador bloqueie as requisições entre origens diferentes.

## 🏗️ Desenvolvimento

O projeto utiliza Angular para organizar a interface em componentes e facilitar a manutenção do código. A comunicação com a API é realizada por requisições HTTP.

Para consultar os detalhes da API, seus endpoints e os procedimentos de execução, acesse o README do backend.

---

Projeto acadêmico da disciplina de **Linguagens de Programação I — UNIRP**.
