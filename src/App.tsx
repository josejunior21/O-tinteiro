import React, { useState, useEffect, useMemo } from 'react';
import {
  INITIAL_PRODUCTS,
  INITIAL_SETTINGS,
  INITIAL_CATEGORIES,
} from './data/initialProducts';
import { Product, CartItem, StoreSettings } from './types/catalog';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { AdminModal } from './components/AdminModal';
import { GitHubGuideModal } from './components/GitHubGuideModal';
import { MessageCircle, Heart, Search, Sparkles } from 'lucide-react';
import { cleanPhone, formatPhone } from './utils/whatsapp';

export default function App() {
  // Load products from localStorage or defaults
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('ot_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          Array.isArray(parsed) &&
          parsed.length > 0 &&
          parsed.some((p: Product) => p.id === 'santinho-borda-arredondada' || p.id === 'santinho-borda-reta')
        ) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved products from localStorage', e);
    }
    return INITIAL_PRODUCTS;
  });

  // Load store settings
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('ot_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          parsed.storeName === 'Lumina Sacra' ||
          parsed.storeName === 'OT Atelier Católico' ||
          parsed.whatsappNumber === '5511998765432'
        ) {
          return INITIAL_SETTINGS;
        }
        return {
          ...INITIAL_SETTINGS,
          ...parsed,
          storeName: 'O Tinteiro',
          whatsappNumber: '5591989911864',
          instagramHandle: '@otinteiro',
        };
      }
    } catch (e) {
      console.warn('Failed to parse saved settings', e);
    }
    return INITIAL_SETTINGS;
  });

  // Load shopping cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('ot_cart');
      if (saved) {
        const parsed: CartItem[] = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Keep only items that correspond to current products
          return parsed.filter((item) =>
            INITIAL_PRODUCTS.some((p) => p.id === item.product.id)
          );
        }
      }
    } catch (e) {
      console.warn('Failed to parse cart', e);
    }
    return [];
  });

  // Active UI filters and modals
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isGitHubGuideOpen, setIsGitHubGuideOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('ot_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('ot_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('ot_cart', JSON.stringify(cart));
  }, [cart]);

  // Derive categories list dynamically
  const categories = useMemo(() => {
    const set = new Set<string>(INITIAL_CATEGORIES);
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      Todos: products.length,
    };
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Filter products by category and search
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        selectedCategory === 'Todos' || p.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.prayerText && p.prayerText.toLowerCase().includes(q)) ||
        (p.dimensions && p.dimensions.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Cart operations
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Admin operations
  const handleSaveProduct = (product: Product) => {
    setProducts((prev) => {
      const index = prev.findIndex((p) => p.id === product.id);
      if (index >= 0) {
        const next = [...prev];
        next[index] = product;
        return next;
      }
      return [product, ...prev];
    });
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((item) => item.product.id !== id));
  };

  const handleResetCatalog = () => {
    setProducts(INITIAL_PRODUCTS);
    setSettings(INITIAL_SETTINGS);
  };

  const handleImportCatalog = (data: {
    products: Product[];
    settings?: StoreSettings;
  }) => {
    setProducts(data.products);
    if (data.settings) {
      setSettings(data.settings);
    }
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleScrollToGrid = () => {
    const el = document.getElementById('catalogo-grid');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Direct WhatsApp contact floating link
  const directWhatsAppLink = `https://wa.me/${cleanPhone(settings.whatsappNumber)}?text=${encodeURIComponent(`Olá ${settings.storeName}! Gostaria de tirar uma dúvida sobre os santinhos e encomendas.`)}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#364332] text-[#F8F1EB]">
      {/* 1. Header with Search, Cart & Admin triggers */}
      <Header
        settings={settings}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenGitHubGuide={() => setIsGitHubGuideOpen(true)}
      />

      {/* 2. Hero Banner */}
      <HeroBanner
        settings={settings}
        onExploreClick={handleScrollToGrid}
      />

      {/* 3. Category Filter Tabs */}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categoryCounts={categoryCounts}
      />

      {/* 4. Products Grid Section */}
      <main id="catalogo-grid" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-[#364332]">
        {/* Ordering & Pricing Announcement from Canva */}
        <div className="mb-6 p-4 rounded-xl bg-[#2D392B] border border-[#485B43] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[#364332] border border-[#52664D] flex items-center justify-center text-[#DFC38A] font-serif font-bold text-sm shrink-0">
              ✝
            </span>
            <div>
              <p className="font-semibold text-[#F8F1EB]">
                Valor: R$ 250,00 por cento (100 unidades) · Papel 180g texturizado (branco ou marfim)
              </p>
              <p className="text-[#CBD7CA] text-[11px] mt-0.5">
                Encomendas com antecedência mínima de 15 dias em relação à data do Sacramento · Pagamento via Pix ou Cartão.
              </p>
            </div>
          </div>
          <a
            href={directWhatsAppLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3F523B] hover:bg-[#4E6449] border border-[#556D50] text-[#F8F1EB] text-[11px] font-semibold shrink-0 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Falar no WhatsApp</span>
          </a>
        </div>

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-6 border-b border-[#4A5D44]">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#F8F1EB]">
              {selectedCategory === 'Todos' ? 'Coleção de Santinhos' : selectedCategory}
            </h2>
            <p className="text-xs text-[#CBD7CA] mt-0.5">
              Exibindo {filteredProducts.length} {filteredProducts.length === 1 ? 'modelo disponível' : 'modelos disponíveis'}
              {searchQuery && ` para "${searchQuery}"`}
            </p>
          </div>

          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-semibold text-[#F8F1EB] hover:text-white underline self-start cursor-pointer"
            >
              Limpar busca
            </button>
          )}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#2C3829] border border-[#4A5D44] flex items-center justify-center text-[#CBD7CA]">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#F8F1EB]">
              Nenhum artigo encontrado
            </h3>
            <p className="text-xs text-[#CBD7CA] leading-relaxed">
              Não encontramos nenhum santinho correspondente aos filtros selecionados. Tente buscar por outro termo ou categoria.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => {
                  setSelectedCategory('Todos');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-[#F8F1EB] text-[#2C3829] text-xs font-semibold rounded-lg hover:bg-[#EAE1D6] transition-colors cursor-pointer"
              >
                Ver Todos os Modelos
              </button>
            </div>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 pt-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                whatsappNumber={settings.whatsappNumber}
                storeName={settings.storeName}
                onAddToCart={handleAddToCart}
                onViewDetails={setSelectedProduct}
              />
            ))}
          </div>
        )}
      </main>

      {/* 5. Serene Story & Trust Section */}
      <section className="bg-[#2D392B] border-t border-[#465741] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-4 space-y-2">
              <span className="font-serif text-2xl font-bold text-[#DFC38A] block">01.</span>
              <h4 className="font-serif text-lg font-bold text-[#F8F1EB]">
                Papel Nobre 180g Texturizado
              </h4>
              <p className="text-xs text-[#CBD7CA] leading-relaxed">
                Santinhos confeccionados em papel 180g/m² branco ou marfim texturizado, com corte delicado em borda arredondada, borda reta e borda rendada.
              </p>
            </div>

            <div className="p-4 space-y-2">
              <span className="font-serif text-2xl font-bold text-[#DFC38A] block">02.</span>
              <h4 className="font-serif text-lg font-bold text-[#F8F1EB]">
                Personalização para Sacramentos
              </h4>
              <p className="text-xs text-[#CBD7CA] leading-relaxed">
                Santinhos exclusivos com oração e personalização completa para Batizados, Primeira Comunhão, Crisma, Casamentos e Devoções Marianas.
              </p>
            </div>

            <div className="p-4 space-y-2">
              <span className="font-serif text-2xl font-bold text-[#DFC38A] block">03.</span>
              <h4 className="font-serif text-lg font-bold text-[#F8F1EB]">
                Prazos & Pedidos no WhatsApp
              </h4>
              <p className="text-xs text-[#CBD7CA] leading-relaxed">
                Encomendas com antecedência mínima de 15 dias da data do Sacramento. Pagamento via Pix ou Cartão. Atendimento direto pelo WhatsApp (91) 98991-1864 e Instagram @otinteiro.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="border-t border-[#465741] bg-[#273224] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-[#52664D] bg-[#364332] p-0.5">
                <img
                  src={settings.logoUrl || './assets/aistudio/Logo---fundo-verde_affc199f.jpg'}
                  alt={settings.storeName}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#F8F1EB] leading-tight">
                  {settings.storeName}
                </h3>
                <p className="text-xs text-[#CBD7CA]">
                  {settings.slogan}
                </p>
              </div>
            </div>

            <div className="text-center md:text-right text-xs text-[#CBD7CA] space-y-1">
              <p className="italic text-[#EAE2D8] font-serif text-sm">
                "Tudo posso Naquele que me fortalece." — Filipenses 4:13
              </p>
              <p className="flex flex-wrap items-center justify-center md:justify-end gap-3">
                {settings.instagramHandle && (
                  <a
                    href="https://instagram.com/otinteiro"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[#DFC38A] hover:underline"
                  >
                    Instagram: {settings.instagramHandle}
                  </a>
                )}
                <span>WhatsApp: {formatPhone(settings.whatsappNumber)}</span>
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#3A4A35] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#A5B8A4]">
            <span>© {new Date().getFullYear()} {settings.storeName}. Identidade Visual O Tinteiro.</span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsGitHubGuideOpen(true)}
                className="hover:text-[#F8F1EB] transition-colors underline cursor-pointer"
              >
                Guia de Hospedagem no GitHub Pages
              </button>
              <button
                onClick={() => setIsAdminOpen(true)}
                className="hover:text-[#F8F1EB] transition-colors underline cursor-pointer"
              >
                Painel da Loja
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Direct WhatsApp Button */}
      <a
        href={directWhatsAppLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all group cursor-pointer"
        title="Falar no WhatsApp"
      >
        <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
        <span className="text-xs font-semibold hidden sm:inline">Tirar Dúvidas</span>
      </a>

      {/* MODALS & DRAWERS */}
      {/* Product Detail Modal */}
      <ProductModal
        product={selectedProduct}
        whatsappNumber={settings.whatsappNumber}
        storeName={settings.storeName}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Cart Slide-over Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        whatsappNumber={settings.whatsappNumber}
        storeName={settings.storeName}
      />

      {/* Store Administration Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        categories={categories}
        settings={settings}
        onSaveProduct={handleSaveProduct}
        onDeleteProduct={handleDeleteProduct}
        onSaveSettings={setSettings}
        onResetCatalog={handleResetCatalog}
        onImportCatalog={handleImportCatalog}
      />

      {/* GitHub Pages Tutorial Modal */}
      <GitHubGuideModal
        isOpen={isGitHubGuideOpen}
        onClose={() => setIsGitHubGuideOpen(false)}
      />
    </div>
  );
}
