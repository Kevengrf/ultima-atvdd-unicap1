# Projeto de Aplicativo de Receitas - UNICAP

Este repositório contém o código-fonte de um aplicativo de receitas, desenvolvido como parte de um projeto de grupo. O projeto é dividido em duas partes principais: o backend e o frontend (mobile), ambos contidos neste mesmo repositório.

**Aluno:** Keven William de Souza Rodrigues
**RA:** 00000846039

## Visão Geral do Projeto

O projeto consiste em:

- **Backend:** Uma API RESTful desenvolvida em Node.js com Express, responsável por toda a lógica de negócio, incluindo gerenciamento de receitas, categorias, usuários e favoritos. O banco de dados utilizado é o PostgreSQL, com o ORM Drizzle.
- **Frontend (Mobile):** Um aplicativo móvel desenvolvido em React Native com Expo, que consome a API do backend para exibir as receitas, permitir que os usuários pesquisem, favoritem e gerenciem suas receitas.

## Estrutura do Repositório

O repositório está organizado da seguinte forma:

- `/backend`: Contém todo o código-fonte do servidor da API.
- `/mobile`: Contém todo o código-fonte do aplicativo React Native.

## Pré-requisitos

Antes de começar, certifique-se de ter as seguintes ferramentas instaladas em sua máquina:

- [Node.js](https://nodejs.org/en/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) (geralmente vem com o Node.js)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Git](https://git-scm.com/)

## Configuração e Instalação

Siga os passos abaixo para configurar e executar o projeto em seu ambiente de desenvolvimento.

### 1. Clonar o Repositório

Primeiro, clone este repositório para sua máquina local:

```bash
git clone <URL_DO_REPOSITORIO>
cd <NOME_DO_REPOSITORIO>
```

### 2. Configurar o Backend

1.  **Navegue até o diretório do backend:**

    ```bash
    cd backend
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente:**

    Crie um arquivo `.env` na raiz do diretório `backend`, utilizando o `.env.example` como referência. Preencha as variáveis de ambiente necessárias, como as credenciais do banco de dados.

4.  **Execute as migrações do banco de dados (se aplicável):**

    Se houver migrações de banco de dados, execute o seguinte comando:

    ```bash
    # (adicione o comando de migração aqui, se houver)
    ```

5.  **Inicie o servidor de desenvolvimento:**

    ```bash
    npm run dev
    ```

    O servidor do backend estará em execução em `http://localhost:3000` (ou na porta que você configurou).

### 3. Configurar o Frontend (Mobile)

1.  **Abra um novo terminal e navegue até o diretório do frontend:**

    ```bash
    cd ../mobile
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    ```

3.  **Configure o endereço da API:**

    No diretório `mobile/constants`, localize o arquivo `api.js` e certifique-se de que o endereço da API aponta para o seu servidor de backend em execução (por exemplo, `http://localhost:3000`).

4.  **Inicie o aplicativo de desenvolvimento:**

    ```bash
    npm start
    ```

    Isso iniciará o Metro Bundler do Expo. Você pode então executar o aplicativo:

    -   **No Android:** Pressione `a` no terminal ou escaneie o código QR com o aplicativo Expo Go em seu dispositivo Android.
    -   **No iOS:** Pressione `i` no terminal ou escaneie o código QR com o aplicativo Expo Go em seu dispositivo iOS.
    -   **Na Web:** Pressione `w` no terminal.

## Funcionalidades do Aplicativo

-   [ ] Listagem e visualização de receitas
-   [ ] Pesquisa de receitas por nome ou ingredientes
-   [ ] Filtro de receitas por categoria
-   [ ] Autenticação de usuários (cadastro e login)
-   [ ] Adição e remoção de receitas favoritas
-   [ ] Visualização das receitas favoritas do usuário

## Tecnologias Utilizadas

### Backend

-   **Node.js:** Ambiente de execução JavaScript do lado do servidor.
-   **Express:** Framework web para Node.js.
-   **PostgreSQL:** Banco de dados relacional.
-   **Drizzle ORM:** ORM para interagir com o banco de dados.
-   **JWT (JSON Web Tokens):** Para autenticação e autorização.

### Frontend

-   **React Native:** Framework para desenvolvimento de aplicativos móveis multiplataforma.
-   **Expo:** Plataforma e conjunto de ferramentas para construir aplicativos React Native.
-   **Expo Router:** Para navegação e roteamento no aplicativo.
-   **Clerk:** Para gerenciamento de autenticação de usuários.

---
