# Portfólio Moderno para Pedro Ernesto

Este é um projeto de portfólio moderno e responsivo criado para o desenvolvedor Full Stack Pedro Ernesto. O projeto foi desenvolvido com as tecnologias mais recentes do ecossistema React, com foco em uma experiência de usuário fluida e agradável.

## 🚀 Tecnologias Utilizadas

- **Next.js**: Framework React para renderização no lado do servidor (SSR), geração de sites estáticos e rotas.
- **Tailwind CSS**: Framework CSS utilitário para estilização rápida e responsiva.
- **Framer Motion**: Biblioteca de animação para React, usada para criar transições suaves e interativas.
- **Spline**: Ferramenta de design 3D para a web, utilizada na seção Hero para um fundo interativo.
- **next-themes**: Para gerenciamento de tema (dark/light mode).
- **TypeScript**: Para um código mais robusto e escalável.

## 🧩 Estrutura do Projeto

O projeto segue a estrutura de diretórios do Next.js App Router:

```
/
├── app/                  # Páginas e layouts
├── components/           # Componentes React reutilizáveis
│   ├── providers/
│   ├── sections/
│   └── ui/
├── lib/                  # Funções e dados auxiliares
├── public/               # Arquivos estáticos (imagens, fontes)
└── ...                   # Arquivos de configuração
```

- Os dados dos projetos estão centralizados em `lib/data.ts`, facilitando a adição de novos projetos.
- As seções da página (`Hero`, `About`, `Projects`, `Contact`) são componentizadas e se encontram em `components/sections`.

## ⚙️ Como Executar o Projeto

1.  **Clone o repositório:**
    ```bash
    git clone <url-do-repositorio>
    cd <nome-do-repositorio>
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```
    ou
    ```bash
    yarn install
    ```

3.  **Execute o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
    Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

## 🎨 Personalização

- **Projetos**: Para adicionar ou modificar projetos, edite o arquivo `lib/data.ts`. Lembre-se de adicionar as imagens dos projetos na pasta `public/`.
- **Informações Pessoais**: Altere as informações na seção `About` (`components/sections/about.tsx`) e os links de contato em `components/sections/contact.tsx`.
- **Estilos e Cores**: As cores principais do tema podem ser ajustadas no arquivo `tailwind.config.ts`.

## deploy na vercel

O deploy para a Vercel é automático. Basta conectar seu repositório Git à Vercel e a plataforma cuidará do resto. 