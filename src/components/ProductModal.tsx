import React, { useState } from 'react';
import { X, MessageCircle, ShoppingBag, Plus, Minus, Check, BookOpen } from 'lucide-react';
import { Product } from '../types/catalog';
import { formatBRL, getProductWhatsAppUrl } from '../utils/whatsapp';

interface ProductModalProps {
  product: Product | null;
  whatsappNumber: string;
  storeName: string;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  whatsappNumber,
  storeName,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleDirectWhatsApp = () => {
    const url = getProductWhatsAppUrl(whatsappNumber, product, storeName);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
      {/* Backdrop click close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative bg-[#2D3A2B] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#485B43] shadow-2xl z-10 text-[#F8F1EB]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-[#CBD7CA] hover:text-white bg-[#384835] hover:bg-[#435640] rounded-full transition-colors cursor-pointer"
          aria-label="Fechar detalhes"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Column */}
          <div className="relative aspect-4/3 md:aspect-auto md:h-full bg-[#243022] flex items-center justify-center overflow-hidden border-b md:border-b-0 md:border-r border-[#3B4C37]">
            <img
              src={product.imageUrl}
              alt={product.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 bg-[#243022]/95 text-[#F8F1EB] border border-[#4E6349] text-xs font-semibold px-2.5 py-1 rounded-sm uppercase tracking-wider">
                {product.badge}
              </span>
            )}
          </div>

          {/* Details Column */}
          <div className="p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Category */}
              <div className="text-xs font-semibold text-[#A8BCA6] uppercase tracking-wider">
                {product.category}
              </div>

              {/* Title */}
              <h2 className="font-serif text-2xl font-bold text-[#F8F1EB] leading-tight">
                {product.title}
              </h2>

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#F8F1EB] tabular-nums">
                  {formatBRL(product.price)}
                </span>
                <span className="text-xs text-[#A2B5A0]">por cento (100 unidades)</span>
              </div>

              {/* Description */}
              <p className="text-sm text-[#CBD7CA] leading-relaxed">
                {product.description}
              </p>

              {/* Prayer / Verso preview if holy card */}
              {product.prayerText && (
                <div className="p-3.5 bg-[#243022] border border-[#3B4C37] rounded-xl space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#DFC38A] font-serif">
                    <BookOpen className="w-3.5 h-3.5 text-[#DFC38A]" />
                    <span>Oração no Verso da Peça:</span>
                  </div>
                  <p className="text-xs text-[#CBD7CA] italic leading-relaxed">
                    "{product.prayerText}"
                  </p>
                </div>
              )}

              {/* Order Terms & Production Notice from Canva */}
              <div className="p-3 bg-[#243022] border border-[#3B4C37] rounded-xl text-[11px] text-[#CBD7CA] space-y-1">
                <span className="font-semibold text-[#DFC38A] block">Prazos & Encomendas:</span>
                <p>
                  Para garantir todo o cuidado artesanal, encomendas devem ser solicitadas com antecedência mínima de <strong>15 dias</strong> da data do Sacramento. Pagamento via Pix ou Cartão.
                </p>
              </div>

              {/* Dimensions & Craft specs */}
              {product.dimensions && (
                <div className="text-xs text-[#A2B5A0] pt-1 border-t border-[#3B4C37] space-y-1">
                  <span className="font-semibold text-[#F8F1EB] block">Acabamento & Papel:</span>
                  <p>{product.dimensions}</p>
                </div>
              )}
            </div>

            {/* Actions & Quantity */}
            <div className="space-y-4 pt-4 border-t border-[#3B4C37]">
              {/* Quantity selector */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#CBD7CA]">Quantidade (centos):</span>
                <div className="flex items-center gap-3 border border-[#485B43] rounded-lg p-1 bg-[#243022]">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-1 hover:bg-[#324230] rounded-md text-[#CBD7CA] transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-semibold text-[#F8F1EB] w-6 text-center tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-1 hover:bg-[#324230] rounded-md text-[#CBD7CA] transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Subtotal calculation for modal */}
              <div className="flex justify-between items-center text-xs text-[#A2B5A0]">
                <span>Subtotal ({quantity * 100} santinhos):</span>
                <span className="text-sm font-bold text-[#F8F1EB] tabular-nums">
                  {formatBRL(product.price * quantity)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleDirectWhatsApp}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Pedir no WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                    added
                      ? 'bg-[#384835] text-[#F8F1EB] border-[#F8F1EB]'
                      : 'bg-[#F8F1EB] hover:bg-[#EDE3DA] text-[#273224] border-transparent'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4 text-[#F8F1EB]" />
                      <span>{quantity}x Adicionado!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-[#273224]" />
                      <span>Adicionar ao Carrinho</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
