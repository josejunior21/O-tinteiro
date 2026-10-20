import React from 'react';
import { ShoppingBag, Settings, Github, Search, X } from 'lucide-react';
import { StoreSettings } from '../types/catalog';

interface HeaderProps {
  settings: StoreSettings;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  onOpenGitHubGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  searchQuery,
  onSearchChange,
  cartCount,
  onOpenCart,
  onOpenAdmin,
  onOpenGitHubGuide,
}) => {
  const logoSrc = settings.logoUrl || './assets/aistudio/Logo---fundo-verde_affc199f.jpg';

  return (
    <header className="sticky top-0 z-30 bg-[#2F3C2C]/95 backdrop-blur-md border-b border-[#44563F] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-22">
          
          {/* Zone 1: Brand Wordmark with Real OT Logo */}
          <div className="flex items-center gap-3.5 shrink-0">
            <a href="#" className="relative block group">
              <div className="w-13 h-13 rounded-full overflow-hidden border-2 border-[#556B50] shadow-sm bg-[#364332] p-0.5 group-hover:border-[#F8F1EB] transition-colors">
                <img
                  src={logoSrc}
                  alt={settings.storeName}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </a>
            <div>
              <a href="#" className="font-serif text-2xl font-bold tracking-tight text-[#F8F1EB] block leading-tight">
                {settings.storeName}
              </a>
              <span className="text-xs text-[#CBD7CA] font-medium block">
                {settings.slogan}
              </span>
            </div>
          </div>

          {/* Zone 2: Search Bar */}
          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-[#A2B5A0] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar santinho, oração, terço ou lembrança..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-9 py-2 text-sm bg-[#243022]/90 border border-[#485B43] rounded-full text-[#F8F1EB] placeholder-[#9EB19E] focus:outline-hidden focus:ring-2 focus:ring-[#F8F1EB]/20 focus:border-[#F8F1EB]/70 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  aria-label="Limpar busca"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A2B5A0] hover:text-[#F8F1EB] p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* GitHub Hosting Guide Button */}
            <button
              onClick={onOpenGitHubGuide}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#F8F1EB] bg-[#384835] border border-[#485B43] rounded-lg hover:bg-[#435640] hover:border-[#5B7154] transition-colors shadow-xs cursor-pointer"
              title="Guia de como hospedar grátis no GitHub Pages"
            >
              <Github className="w-4 h-4 text-[#EAE2D8]" />
              <span className="hidden lg:inline">Hospedar no GitHub</span>
            </button>

            {/* Admin Management Button */}
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#F8F1EB] bg-[#384835] border border-[#485B43] rounded-lg hover:bg-[#435640] hover:border-[#5B7154] transition-colors shadow-xs cursor-pointer"
              title="Gerenciar produtos e WhatsApp"
            >
              <Settings className="w-4 h-4 text-[#D2DFD1]" />
              <span className="hidden sm:inline">Painel da Loja</span>
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#273224] bg-[#F8F1EB] hover:bg-[#EDE3DA] active:bg-[#E1D7CD] rounded-lg transition-colors shadow-sm cursor-pointer"
              aria-label={`Carrinho com ${cartCount} itens`}
            >
              <ShoppingBag className="w-4 h-4 text-[#273224]" />
              <span className="hidden sm:inline">Carrinho</span>
              {cartCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[11px] font-bold bg-[#364332] text-[#F8F1EB] rounded-full tabular-nums">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Row */}
        <div className="pb-3.5 md:hidden">
          <div className="relative">
            <Search className="w-4 h-4 text-[#A2B5A0] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar santinho, oração, terço..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-9 py-2 text-sm bg-[#243022]/90 border border-[#485B43] rounded-full text-[#F8F1EB] placeholder-[#9EB19E] focus:outline-hidden focus:ring-2 focus:ring-[#F8F1EB]/20 focus:border-[#F8F1EB]/70 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                aria-label="Limpar busca"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A2B5A0] hover:text-[#F8F1EB] p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
