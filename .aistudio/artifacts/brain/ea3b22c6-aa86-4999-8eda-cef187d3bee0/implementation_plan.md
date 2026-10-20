# Catálogo de Artigos & Papelaria Católica Artesanal

Plataforma completa de catálogo interativo para santinhos, cartões devocionais e artigos religiosos artesanais, inspirada no design do protótipo com cartões visuais, busca rápida, navegação por categorias, pedido imediato via WhatsApp, carrinho com totalizador, painel administrativo e exportação para GitHub Pages.

### Decisões Confirmadas & Ajustes de Revisão

> [!IMPORTANT]
> **Definições do Projeto:**
> - **Segmento Principal**: Santinhos de oração, cartões e marcadores de página artesanais, terços/dezenas, lembrancinhas de batismo e primeira eucaristia.
> - **Fluxo Duplo de WhatsApp**:
>   1. *Botão Direto no Card*: Envia mensagem instantânea com o produto específico ("*Olá! Tenho interesse no [Nome] (R$ [Preço]). Está disponível?*").
>   2. *Carrinho com Pedido Completo*: Permite selecionar múltiplos itens, calcular o valor total e gerar mensagem organizada com itens, quantidades e subtotal.
> - **Painel Administrativo Completo no Próprio Site**:
>   - Cadastro fácil de novos produtos (nome, categoria, preço, foto, descrição e estoque).
>   - Edição e exclusão rápida com pré-visualização em tempo real.
>   - Configuração do número de WhatsApp da loja e mensagem personalizada.
>   - Backup e restauração via download/upload de arquivo JSON.
> - **Publicação Gratuita no GitHub Pages**:
>   - Modal interativo "Como hospedar grátis no GitHub" com guia passo a passo, comandos do Git e configuração de repositório.
>   - Código 100% pronto e compatível com rotas relativas (`base: './'`).

---

### 1. Visão Geral & Experiência do Usuário

- **Cabeçalho & Identidade**:
  - Logotipo e nome da loja devocional.
  - Barra de pesquisa integrada em tempo real.
  - Botão de acesso ao Painel Admin e ícone do Carrinho com contador numérico de itens.
- **Área de Destaque (Hero / Banner)**:
  - Banner acolhedor no topo com mensagem inspiradora de fé e artesanato católico, alinhado à estética do Canva.
- **Navegação por Categorias**:
  - Abas interativas de filtragem rápida: *Todos*, *Santinhos & Orações*, *Cartões & Marcadores*, *Terços & Dezenas*, *Lembrancinhas & Sacramentos*.
- **Grade de Cards de Produtos**:
  - Fotografia com aspecto padronizado e cantos suaves.
  - Nome do produto legível e categoria discreta.
  - Preço formatado em Reais (`R$ 0,00`).
  - Ações diretas: Botão verde de WhatsApp com ícone e botão de adicionar ao carrinho.
- **Modal de Detalhes do Produto**:
  - Visualização da foto ampliada, descrição completa da devoção/oração, especificações de tamanho/papel e botões de compra.
- **Drawer Lateral do Carrinho**:
  - Lista de produtos selecionados com controle de quantidade (+ / -).
  - Cálculo automático de subtotal.
  - Botão de envio do pedido completo formatado para o WhatsApp da loja.

---

### 2. Identidade Visual & Design System

- **Paleta de Cores**:
  - *Fundo Principal*: Tom papel/linho quente suave (`#FAF8F5`).
  - *Cards & Painéis*: Branco puro (`#FFFFFF`) com bordas suaves (`#E7E5E4`).
  - *Tipografia*: Carvão neutro e cinza suave para máxima legibilidade.
  - *Acentos*: Verde WhatsApp vibrante (`#25D366` / `#16A34A`) para ações de compra e toques em ouro velho/âmbar para detalhes devocionais.
- **Tipografia**:
  - Títulos elegantes com toque clássico e acolhedor.
  - Textos de apoio e preços com fontes limpas e números alinhados.

---

### 3. Arquitetura Técnica

```
┌─────────────────────────────────────────────────────────────────┐
│                      Aplicação (React + Vite)                   │
├─────────────────────────────────────────────────────────────────┤
│  • Header: Marca + Busca em Tempo Real + Carrinho + Admin       │
│  • Banner Devocional Inspirador                                 │
│  • Seletor de Categorias (Abas com filtros instantâneos)        │
│  • Grade Responsiva de Cards (Foto, Nome, Preço, Botões)        │
│  • Drawer Lateral: Carrinho com Pedido Consolidado              │
│  • Modal Admin: Cadastro, Edição, Número WhatsApp e Export JSON │
│  • Modal Tutorial: Passo a Passo para Hospedar no GitHub Pages  │
└─────────────────────────────────────────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
┌────────────────────────┐              ┌─────────────────────────┐
│      localStorage      │              │       WhatsApp API      │
│  (Persistência local   │              │  (https://wa.me/...)    │
│  e backup em JSON)     │              │  Mensagem individual/   │
│                        │              │  resumo do carrinho     │
└────────────────────────┘              └─────────────────────────┘
```

---

### 4. Etapas de Construção

1. Configurar metadados do projeto e compatibilidade do Vite com GitHub Pages (`base: './'`).
2. Criar catálogo inicial completo com santinhos e artigos artesanais com fotos fotográficas em alta fidelidade.
3. Desenvolver o cabeçalho com busca em tempo real e o filtro dinâmico por categorias.
4. Construir o card de produto com layout limpo, preço tabular e botão direto do WhatsApp.
5. Desenvolver o carrinho lateral interativo com formatação automática da lista de compras para envio no WhatsApp.
6. Implementar o modal/painel de administração para adicionar, editar e remover itens em tempo real, com salvamento no `localStorage` e exportação JSON.
7. Criar o guia completo embutido de publicação gratuita no GitHub Pages.
8. Validar o build de produção (`npm run build`).
