import React, { useState } from 'react';
import {
  X,
  Plus,
  Edit2,
  Trash2,
  Save,
  Download,
  Upload,
  RotateCcw,
  MessageCircle,
  Image as ImageIcon,
  Check,
  Package,
  Sliders,
  Database
} from 'lucide-react';
import { Product, StoreSettings } from '../types/catalog';
import { PRODUCT_ILLUSTRATIONS, INITIAL_CATEGORIES } from '../data/initialProducts';
import { formatBRL, cleanPhone } from '../utils/whatsapp';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  categories: string[];
  settings: StoreSettings;
  onSaveProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onSaveSettings: (settings: StoreSettings) => void;
  onResetCatalog: () => void;
  onImportCatalog: (data: { products: Product[]; settings?: StoreSettings }) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  products,
  categories,
  settings,
  onSaveProduct,
  onDeleteProduct,
  onSaveSettings,
  onResetCatalog,
  onImportCatalog,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'products' | 'settings' | 'backup'>('products');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Settings form state
  const [tempSettings, setTempSettings] = useState<StoreSettings>({ ...settings });

  // Product form state
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState(categories[1] || 'Santinhos & Orações');
  const [formPrice, setFormPrice] = useState('4.50');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPrayer, setFormPrayer] = useState('');
  const [formDimensions, setFormDimensions] = useState('');
  const [formBadge, setFormBadge] = useState('');
  const [formInStock, setFormInStock] = useState(true);

  const startCreateProduct = () => {
    setEditingProduct(null);
    setIsCreatingNew(true);
    setFormTitle('');
    setFormCategory(categories[1] || 'Borda Arredondada');
    setFormPrice('250.00');
    setFormImageUrl(PRODUCT_ILLUSTRATIONS['Borda Arredondada']);
    setFormDescription('Santinho impresso em papel nobre 180g/m² texturizado (branco ou marfim).');
    setFormPrayer('');
    setFormDimensions('Papel 180g/m² · Branco ou Marfim Texturizado');
    setFormBadge('100 Unidades');
    setFormInStock(true);
  };

  const startEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setIsCreatingNew(false);
    setFormTitle(prod.title);
    setFormCategory(prod.category);
    setFormPrice(prod.price.toString());
    setFormImageUrl(prod.imageUrl);
    setFormDescription(prod.description);
    setFormPrayer(prod.prayerText || '');
    setFormDimensions(prod.dimensions || '');
    setFormBadge(prod.badge || '');
    setFormInStock(prod.inStock);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const parsedPrice = parseFloat(formPrice.replace(',', '.')) || 0;

    const productData: Product = {
      id: editingProduct ? editingProduct.id : `santinho-${Date.now()}`,
      title: formTitle.trim(),
      category: formCategory,
      price: parsedPrice,
      imageUrl: formImageUrl.trim() || PRODUCT_ILLUSTRATIONS['Borda Arredondada'],
      description: formDescription.trim(),
      prayerText: formPrayer.trim() || undefined,
      dimensions: formDimensions.trim() || undefined,
      badge: formBadge.trim() || undefined,
      inStock: formInStock,
      featured: editingProduct ? editingProduct.featured : false,
    };

    onSaveProduct(productData);
    setEditingProduct(null);
    setIsCreatingNew(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setFormImageUrl(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(tempSettings);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  // Export JSON
  const handleExportJSON = () => {
    const dataToExport = {
      products,
      settings: tempSettings,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `catalogo-produtos-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed.products)) {
          onImportCatalog({
            products: parsed.products,
            settings: parsed.settings,
          });
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 2000);
        } else if (Array.isArray(parsed)) {
          onImportCatalog({ products: parsed });
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 2000);
        } else {
          alert('Arquivo JSON inválido. Formato esperado: lista de produtos.');
        }
      } catch (err) {
        alert('Erro ao ler o arquivo JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden border border-stone-200 shadow-2xl z-10 flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-amber-200 flex items-center justify-center font-bold">
              ⚙
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-stone-900 leading-tight">
                Painel Administrativo da Loja
              </h2>
              <p className="text-xs text-stone-500">
                Gerencie produtos, número de WhatsApp e backup dos dados
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 bg-stone-100/60 px-4 sm:px-6">
          <button
            onClick={() => {
              setActiveTab('products');
              setIsCreatingNew(false);
              setEditingProduct(null);
            }}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'products'
                ? 'border-amber-700 text-amber-900 bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Gerenciar Produtos ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'settings'
                ? 'border-amber-700 text-amber-900 bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>WhatsApp & Dados da Loja</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'backup'
                ? 'border-amber-700 text-amber-900 bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Backup & Exportação</span>
          </button>
        </div>

        {/* Success Alert */}
        {saveSuccess && (
          <div className="bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-xs px-4 py-2 flex items-center gap-2 font-medium">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Alterações salvas com sucesso no navegador!</span>
          </div>
        )}

        {/* Body content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          
          {/* TAB 1: PRODUCTS */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              {!isCreatingNew && !editingProduct ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs text-stone-600">
                      Adicione novos santinhos, terços e lembrancinhas ou edite preços e descrições existentes.
                    </p>
                    <button
                      type="button"
                      onClick={startCreateProduct}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Cadastrar Novo Produto</span>
                    </button>
                  </div>

                  {/* Products Table/List */}
                  <div className="border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-200">
                    {products.map((p) => (
                      <div
                        key={p.id}
                        className="p-3 sm:p-4 flex items-center justify-between gap-3 hover:bg-stone-50 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={p.imageUrl}
                            alt={p.title}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-lg object-cover border border-stone-200 bg-stone-100 shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs sm:text-sm font-semibold text-stone-900 truncate">
                              {p.title}
                            </h4>
                            <div className="flex items-center gap-2 text-[11px] text-stone-500">
                              <span>{p.category}</span>
                              <span>·</span>
                              <span className="font-bold text-stone-800 tabular-nums">
                                {formatBRL(p.price)}
                              </span>
                              {p.badge && (
                                <>
                                  <span>·</span>
                                  <span className="text-amber-800 font-medium">
                                    {p.badge}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => startEditProduct(p)}
                            className="p-2 text-stone-600 hover:text-amber-800 hover:bg-stone-100 rounded-lg transition-colors"
                            title="Editar produto"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Deseja realmente excluir "${p.title}"?`)) {
                                onDeleteProduct(p.id);
                              }
                            }}
                            className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Excluir produto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Product Form (Create / Edit) */
                <form onSubmit={handleProductSubmit} className="space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                    <h3 className="font-serif text-lg font-bold text-stone-900">
                      {editingProduct ? 'Editar Produto' : 'Cadastrar Novo Artigo / Santinho'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingNew(false);
                        setEditingProduct(null);
                      }}
                      className="text-xs text-stone-500 hover:text-stone-800 underline"
                    >
                      Voltar para a lista
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Title */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Nome do Produto *
                      </label>
                      <input
                        type="text"
                        required
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        placeholder="Ex: Santinho de São José com Oração aos Trabalhadores"
                        className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:ring-1 focus:ring-amber-500"
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Categoria
                      </label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:ring-1 focus:ring-amber-500"
                      >
                        {categories.filter((c) => c !== 'Todos').map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Price */}
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Preço Unitário (R$) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formPrice}
                        onChange={(e) => setFormPrice(e.target.value)}
                        placeholder="Ex: 4.50"
                        className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:ring-1 focus:ring-amber-500 tabular-nums"
                      />
                    </div>

                    {/* Dimensions & Paper */}
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Medidas & Tipo de Papel / Material
                      </label>
                      <input
                        type="text"
                        value={formDimensions}
                        onChange={(e) => setFormDimensions(e.target.value)}
                        placeholder="Ex: 7 x 11 cm · Papel Couché 300g"
                        className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:ring-1 focus:ring-amber-500"
                      />
                    </div>

                    {/* Badge */}
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Selo Promocional / Tag (opcional)
                      </label>
                      <input
                        type="text"
                        value={formBadge}
                        onChange={(e) => setFormBadge(e.target.value)}
                        placeholder="Ex: Mais Pedido, Sob Encomenda, Feito à Mão"
                        className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:ring-1 focus:ring-amber-500"
                      />
                    </div>

                    {/* Description */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Descrição do Artigo
                      </label>
                      <textarea
                        rows={2}
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        placeholder="Detalhes sobre a confecção, intenções de oração e apresentação..."
                        className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:ring-1 focus:ring-amber-500 resize-none"
                      />
                    </div>

                    {/* Prayer text */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Oração Gravada no Verso (opcional)
                      </label>
                      <textarea
                        rows={2}
                        value={formPrayer}
                        onChange={(e) => setFormPrayer(e.target.value)}
                        placeholder="Texto da oração que acompanha o verso do santinho ou cartão..."
                        className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:ring-1 focus:ring-amber-500 resize-none italic"
                      />
                    </div>

                    {/* Image URL & File Upload */}
                    <div className="sm:col-span-2 space-y-2">
                      <label className="block text-xs font-semibold text-stone-700">
                        Foto do Produto
                      </label>
                      
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={formImageUrl}
                          onChange={(e) => setFormImageUrl(e.target.value)}
                          placeholder="Cole a URL da foto ou escolha uma ilustração abaixo..."
                          className="flex-1 px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:ring-1 focus:ring-amber-500"
                        />
                        <label className="inline-flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg text-xs font-medium text-stone-700 cursor-pointer">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Enviar Foto</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Presets shortcut */}
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-[11px] text-stone-500">Ou escolha uma arte pronta:</span>
                        <div className="flex gap-1.5 overflow-x-auto py-1">
                          {Object.entries(PRODUCT_ILLUSTRATIONS).map(([key, svg]) => (
                            <button
                              key={key}
                              type="button"
                              onClick={() => setFormImageUrl(svg)}
                              className="px-2 py-0.5 text-[10px] bg-stone-100 hover:bg-amber-100 border border-stone-200 rounded-sm text-stone-700 capitalize"
                            >
                              {key}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingNew(false);
                        setEditingProduct(null);
                      }}
                      className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingProduct ? 'Salvar Alterações' : 'Cadastrar Artigo'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: SETTINGS (WHATSAPP & STORE) */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettingsSubmit} className="space-y-5 max-w-xl">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Configuração de Contato e WhatsApp
                </h3>
                <p className="text-xs text-stone-500">
                  Defina o número para onde os pedidos e mensagens dos clientes serão encaminhados.
                </p>
              </div>

              {/* WhatsApp Number */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Número de WhatsApp da Loja (com DDD) *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={tempSettings.whatsappNumber}
                    onChange={(e) =>
                      setTempSettings({ ...tempSettings, whatsappNumber: e.target.value })
                    }
                    placeholder="Ex: 5511999999999 (Código do país + DDD + Número)"
                    className="flex-1 px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900 font-mono"
                  />
                  <a
                    href={`https://wa.me/${cleanPhone(tempSettings.whatsappNumber)}?text=${encodeURIComponent('Olá! Teste de conexão do catálogo O Tinteiro.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Testar Link</span>
                  </a>
                </div>
                <span className="text-[11px] text-stone-500 mt-1 block">
                  Coloque no formato 55 + DDD + Número (apenas números ou com traços).
                </span>
              </div>

              {/* Logo Selection */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-2">
                  Logotipo da Loja (Identidade OT)
                </label>
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <button
                    type="button"
                    onClick={() => setTempSettings({ ...tempSettings, logoUrl: './assets/aistudio/Logo---fundo-branco_01ed4c69.jpg' })}
                    className={`p-2.5 rounded-xl border flex items-center gap-3 text-left transition-all cursor-pointer ${
                      tempSettings.logoUrl === './assets/aistudio/Logo---fundo-branco_01ed4c69.jpg'
                        ? 'border-[#2E4231] bg-[#2E4231]/5 ring-1 ring-[#2E4231]'
                        : 'border-stone-200 hover:border-stone-300 bg-stone-50'
                    }`}
                  >
                    <img
                      src="./assets/aistudio/Logo---fundo-branco_01ed4c69.jpg"
                      alt="Logo Fundo Claro"
                      className="w-10 h-10 rounded-full object-cover border border-stone-200"
                    />
                    <div>
                      <span className="text-xs font-bold text-stone-800 block">Fundo Claro</span>
                      <span className="text-[10px] text-stone-500">Clássico / Papel</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTempSettings({ ...tempSettings, logoUrl: './assets/aistudio/Logo---fundo-verde_affc199f.jpg' })}
                    className={`p-2.5 rounded-xl border flex items-center gap-3 text-left transition-all cursor-pointer ${
                      tempSettings.logoUrl === './assets/aistudio/Logo---fundo-verde_affc199f.jpg'
                        ? 'border-[#2E4231] bg-[#2E4231]/5 ring-1 ring-[#2E4231]'
                        : 'border-stone-200 hover:border-stone-300 bg-stone-50'
                    }`}
                  >
                    <img
                      src="./assets/aistudio/Logo---fundo-verde_affc199f.jpg"
                      alt="Logo Fundo Verde"
                      className="w-10 h-10 rounded-full object-cover border border-[#2E4231]"
                    />
                    <div>
                      <span className="text-xs font-bold text-stone-800 block">Fundo Verde</span>
                      <span className="text-[10px] text-stone-500">Verde Botânico</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Store Name */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nome da Marca / Loja
                </label>
                <input
                  type="text"
                  required
                  value={tempSettings.storeName}
                  onChange={(e) =>
                    setTempSettings({ ...tempSettings, storeName: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
                />
              </div>

              {/* Slogan */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Frase de Efeito / Subtítulo
                </label>
                <input
                  type="text"
                  value={tempSettings.slogan}
                  onChange={(e) =>
                    setTempSettings({ ...tempSettings, slogan: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
                />
              </div>

              {/* Instagram */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Perfil no Instagram (opcional)
                </label>
                <input
                  type="text"
                  value={tempSettings.instagramHandle}
                  onChange={(e) =>
                    setTempSettings({ ...tempSettings, instagramHandle: e.target.value })
                  }
                  placeholder="@sualoja"
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
                />
              </div>

              {/* Shipping info */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Informação de Envio / Prazos
                </label>
                <input
                  type="text"
                  value={tempSettings.shippingInfo}
                  onChange={(e) =>
                    setTempSettings({ ...tempSettings, shippingInfo: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
                />
              </div>

              <div className="pt-4 border-t border-stone-200">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Dados de Contato</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: BACKUP & EXPORT */}
          {activeTab === 'backup' && (
            <div className="space-y-6 max-w-xl">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Backup e Migração do Catálogo
                </h3>
                <p className="text-xs text-stone-500">
                  Seus dados ficam salvos automaticamente no navegador (localStorage). Use esta aba para baixar uma cópia de segurança em arquivo JSON ou transferir para outro computador.
                </p>
              </div>

              <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-stone-800">
                  1. Exportar Catálogo Completo (JSON)
                </h4>
                <p className="text-xs text-stone-600">
                  Baixe um arquivo contendo todos os {products.length} produtos cadastrados e configurações de WhatsApp.
                </p>
                <button
                  type="button"
                  onClick={handleExportJSON}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Baixar Arquivo catalogo.json</span>
                </button>
              </div>

              <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-stone-800">
                  2. Importar ou Restaurar de um Arquivo
                </h4>
                <p className="text-xs text-stone-600">
                  Selecione um arquivo `.json` gerado anteriormente para restaurar seus produtos.
                </p>
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <span>Selecionar Arquivo JSON</span>
                  <input
                    type="file"
                    accept=".json,application/json"
                    onChange={handleImportJSON}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="p-4 bg-red-50/60 border border-red-200 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-red-900">
                  3. Restaurar Catálogo Inicial Padrão
                </h4>
                <p className="text-xs text-red-700">
                  Recarrega os 8 produtos originais de santinhos e terços.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Tem certeza de que deseja restaurar o catálogo de demonstração?')) {
                      onResetCatalog();
                    }
                  }}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-red-100 hover:bg-red-200 text-red-800 text-xs font-semibold rounded-lg transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restaurar Padrão</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
