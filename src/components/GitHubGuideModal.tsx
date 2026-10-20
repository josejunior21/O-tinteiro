import React, { useState } from 'react';
import { X, Github, Check, Copy, ExternalLink, Sparkles } from 'lucide-react';

interface GitHubGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubGuideModal: React.FC<GitHubGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const gitCommands = `# 1. Inicialize o repositório git na pasta do projeto
git init

# 2. Adicione todos os arquivos
git add .

# 3. Faça o commit inicial
git commit -m "Catálogo O Tinteiro - Artigos Católicos com WhatsApp"

# 4. Renomeie o branch para main
git branch -M main

# 5. Conecte ao seu repositório no GitHub (substitua pelo seu link)
git remote add origin https://github.com/SEU_USUARIO/catalogo-o-tinteiro.git

# 6. Envie os arquivos para o GitHub
git push -u origin main`;

  const githubActionsWorkflow = `name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Build static site
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative bg-[#1A261C] rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto border border-[#314534] shadow-2xl z-10 flex flex-col text-[#F4EFE6]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#314534] flex items-center justify-between bg-[#152017]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#223124] border border-[#3A503E] text-white flex items-center justify-center">
              <Github className="w-5 h-5 text-[#E6C687]" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-[#F4EFE6] leading-tight">
                Como Hospedar Grátis no GitHub Pages
              </h2>
              <p className="text-xs text-[#8DA391]">
                Guia passo a passo para colocar seu site no ar gratuitamente para sempre
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#8DA391] hover:text-white rounded-full hover:bg-[#253727] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-6 text-[#C8D6C9]">
          
          {/* Highlight Card */}
          <div className="p-4 bg-[#202D22] border border-[#3A503E] rounded-xl flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[#E6C687] shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <strong className="text-[#F4EFE6] block font-semibold">
                Este projeto já está 100% configurado para o GitHub Pages!
              </strong>
              <p className="text-[#A8BAAA] leading-relaxed">
                O arquivo <code className="bg-[#152017] px-1 py-0.5 rounded text-[#E6C687] font-mono border border-[#314534]">vite.config.ts</code> já possui a instrução <code className="bg-[#152017] px-1 py-0.5 rounded text-[#E6C687] font-mono border border-[#314534]">base: './'</code> configurada, garantindo que o catálogo funcione perfeitamente tanto no link padrão do GitHub (<code className="font-mono text-[#D4E2D5]">https://seu-usuario.github.io/meu-catalogo</code>) quanto em domínio próprio personalizado.
              </p>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#E6C687] text-[#1E2B20] text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h3 className="font-serif text-base font-bold text-[#F4EFE6]">
                  Crie um Repositório Gratuito no GitHub
                </h3>
              </div>
              <p className="text-xs text-[#A8BAAA] pl-8">
                Acesse <a href="https://github.com/new" target="_blank" rel="noopener noreferrer" className="text-[#E6C687] font-semibold underline inline-flex items-center gap-1">github.com/new <ExternalLink className="w-3 h-3" /></a>, defina um nome como <code className="bg-[#152017] border border-[#314534] px-1.5 py-0.5 rounded text-[#F4EFE6] font-mono">catalogo-o-tinteiro</code> e selecione o repositório como <strong>Público</strong> (Public).
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#E6C687] text-[#1E2B20] text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h3 className="font-serif text-base font-bold text-[#F4EFE6]">
                  Envie o Código para o Repositório
                </h3>
              </div>
              <p className="text-xs text-[#A8BAAA] pl-8">
                No terminal do seu computador (na pasta do projeto), execute estes comandos:
              </p>
              
              <div className="ml-8 relative">
                <pre className="bg-[#121B13] border border-[#2E4231] text-[#E8DFD1] text-xs p-3.5 rounded-xl font-mono overflow-x-auto">
                  {gitCommands}
                </pre>
                <button
                  onClick={() => copyToClipboard(gitCommands, 1)}
                  className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-[#202D22] hover:bg-[#2B3D2E] text-[#F4EFE6] text-[11px] font-medium rounded-md border border-[#3D5641] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedIndex === 1 ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copiar Comandos</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Step 3 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#E6C687] text-[#1E2B20] text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <h3 className="font-serif text-base font-bold text-[#F4EFE6]">
                  Ative o GitHub Pages em 2 Cliques
                </h3>
              </div>
              <div className="text-xs text-[#A8BAAA] pl-8 space-y-1.5">
                <p>1. Vá na aba <strong>Settings</strong> do seu repositório no GitHub.</p>
                <p>2. No menu lateral esquerdo, clique em <strong>Pages</strong>.</p>
                <p>3. Em <strong>Build and deployment &gt; Source</strong>, escolha <strong>GitHub Actions</strong>.</p>
                <p>4. O arquivo de deploy automático <code className="bg-[#152017] border border-[#314534] px-1.5 py-0.5 rounded text-[#E6C687] font-mono">.github/workflows/deploy.yml</code> já está pronto no projeto!</p>
              </div>

              <div className="ml-8 relative">
                <pre className="bg-[#121B13] border border-[#2E4231] text-[#A8BAAA] text-[11px] p-3.5 rounded-xl font-mono overflow-x-auto max-h-56">
                  {githubActionsWorkflow}
                </pre>
                <button
                  onClick={() => copyToClipboard(githubActionsWorkflow, 2)}
                  className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-[#202D22] hover:bg-[#2B3D2E] text-[#F4EFE6] text-[11px] font-medium rounded-md border border-[#3D5641] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedIndex === 2 ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copiar Workflow</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Step 4 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                  ✓
                </span>
                <h3 className="font-serif text-base font-bold text-[#F4EFE6]">
                  Pronto! Seu site estará no ar gratuitamente
                </h3>
              </div>
              <p className="text-xs text-[#A8BAAA] pl-8 leading-relaxed">
                Após alguns instantes, o GitHub Pages gerará seu link público oficial. Você poderá divulgar o link na sua bio do Instagram, cartões de visita e enviar diretamente aos seus clientes pelo WhatsApp!
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-[#314534] bg-[#152017] flex items-center justify-between">
          <span className="text-xs text-[#8DA391]">
            Hospedagem 100% gratuita sem limite de tempo
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#F4EFE6] hover:bg-[#EAE4D9] text-[#1E2B20] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Entendido, fechar guia
          </button>
        </div>
      </div>
    </div>
  );
};
