import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, MessageCircle, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types/catalog';
import { formatBRL, getCartOrderWhatsAppUrl } from '../utils/whatsapp';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  whatsappNumber: string;
  storeName: string;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  whatsappNumber,
  storeName,
}) => {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckoutWhatsApp = () => {
    if (items.length === 0) return;
    const url = getCartOrderWhatsAppUrl(
      whatsappNumber,
      items,
      storeName,
      customerName,
      orderNotes
    );
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#2D3A2B] shadow-2xl flex flex-col border-l border-[#485B43] text-[#F8F1EB]">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#44563F] flex items-center justify-between bg-[#243022]">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#DFC38A]" />
              <h2 className="font-serif text-lg font-bold text-[#F8F1EB]">
                Seu Carrinho ({totalCount})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[#CBD7CA] hover:text-white rounded-full hover:bg-[#384835] transition-colors cursor-pointer"
              aria-label="Fechar carrinho"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#243022] border border-[#485B43] flex items-center justify-center text-[#DFC38A] text-2xl font-serif">
                  ✝
                </div>
                <h3 className="font-serif text-lg font-bold text-[#F8F1EB]">
                  Carrinho Vazio
                </h3>
                <p className="text-xs text-[#CBD7CA] max-w-xs">
                  Você ainda não adicionou nenhum santinho ou artigo artesanal. Navegue pelo catálogo e escolha suas peças.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 px-4 py-2 text-xs font-semibold text-[#273224] bg-[#F8F1EB] hover:bg-[#EDE3DA] rounded-lg transition-colors cursor-pointer"
                >
                  Continuar Escolhendo
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex gap-3 p-3 bg-[#243022] rounded-xl border border-[#3B4C37] items-center"
                    >
                      {/* Thumbnail */}
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.title}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 object-cover rounded-lg border border-[#485B43] bg-[#1C261A] shrink-0"
                      />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-[#F8F1EB] truncate">
                          {item.product.title}
                        </h4>
                        <div className="text-[11px] text-[#A2B5A0] tabular-nums">
                          {formatBRL(item.product.price)} / cento (100 un.)
                        </div>
                        <div className="text-xs font-bold text-[#DFC38A] mt-1 tabular-nums">
                          Subtotal: {formatBRL(item.product.price * item.quantity)} ({item.quantity * 100} un.)
                        </div>
                      </div>

                      {/* Stepper & Delete */}
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-[#A2B5A0] hover:text-red-400 p-1 transition-colors cursor-pointer"
                          title="Remover item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <div className="flex items-center gap-1 bg-[#1C261A] border border-[#485B43] rounded-md p-0.5">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 hover:bg-[#2D3A2B] rounded text-[#A2B5A0] hover:text-white transition-colors cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-semibold px-1.5 tabular-nums text-[#F8F1EB]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 hover:bg-[#2D3A2B] rounded text-[#A2B5A0] hover:text-white transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Optional Customer info for WhatsApp message */}
                {/* Production notice */}
                <div className="p-3 bg-[#243022] border border-[#3B4C37] rounded-xl text-[11px] text-[#CBD7CA] space-y-1">
                  <span className="font-semibold text-[#DFC38A] block">Prazos & Encomendas:</span>
                  <p>
                    Encomendas solicitadas com antecedência mínima de 15 dias em relação à data do Sacramento. Pagamento via Pix ou Cartão.
                  </p>
                </div>

                <div className="pt-3 border-t border-[#3B4C37] space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#E4EDE3] mb-1">
                      Seu Nome (opcional):
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Maria dos Santos"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-[#243022] border border-[#485B43] rounded-lg text-[#F8F1EB] placeholder-[#9CB099] focus:outline-hidden focus:ring-1 focus:ring-[#F8F1EB]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#E4EDE3] mb-1">
                      Observações / Dados para personalização:
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Ex: Nome da criança, data do batismo e paróquia..."
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-[#243022] border border-[#485B43] rounded-lg text-[#F8F1EB] placeholder-[#9CB099] focus:outline-hidden focus:ring-1 focus:ring-[#F8F1EB] resize-none"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer with Subtotal & WhatsApp CTA */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#44563F] bg-[#243022] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-[#CBD7CA] block">Total do Pedido:</span>
                  <span className="text-[11px] text-[#A2B5A0]">{totalCount * 100} santinhos</span>
                </div>
                <span className="font-serif text-xl font-bold text-[#F8F1EB] tabular-nums">
                  {formatBRL(total)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCheckoutWhatsApp}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-md transition-all cursor-pointer"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Enviar Pedido pelo WhatsApp</span>
              </button>

              <div className="flex justify-between items-center pt-1 text-[11px] text-[#A2B5A0]">
                <span>Atendimento humanizado via WhatsApp</span>
                <button
                  type="button"
                  onClick={onClearCart}
                  className="text-[#CBD7CA] hover:text-white underline cursor-pointer"
                >
                  Esvaziar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
