import React, { useState } from 'react';
import { ShoppingBag, MessageCircle, Eye, Check } from 'lucide-react';
import { Product } from '../types/catalog';
import { formatBRL, getProductWhatsAppUrl } from '../utils/whatsapp';

interface ProductCardProps {
  product: Product;
  whatsappNumber: string;
  storeName: string;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  whatsappNumber,
  storeName,
  onAddToCart,
  onViewDetails,
}) => {
  const [imageError, setImageError] = useState(false);
  const [addedJustNow, setAddedJustNow] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setAddedJustNow(true);
    setTimeout(() => setAddedJustNow(false), 1500);
  };

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = getProductWhatsAppUrl(whatsappNumber, product, storeName);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <article
      onClick={() => onViewDetails(product)}
      className="group relative bg-[#2D3A2B] rounded-xl border border-[#485B43] hover:border-[#73926B] hover:shadow-xl transition-all flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Product Image Container */}
      <div className="relative aspect-[1/1.08] w-full bg-[#243022] overflow-hidden border-b border-[#3B4C37]">
        {!imageError && product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-[#243022] text-[#CBD7CA] text-center">
            <span className="font-serif text-3xl font-bold text-[#EAE2D8]/40 mb-1">✝</span>
            <span className="text-xs font-serif font-bold text-[#F8F1EB]">{product.title}</span>
            <span className="text-[11px] text-[#A2B5A0] mt-1">Artigo Devocional</span>
          </div>
        )}

        {/* Quiet Subtle Badge if provided */}
        {product.badge && (
          <div className="absolute top-2.5 left-2.5 bg-[#243022]/95 backdrop-blur-xs border border-[#4E6349] text-[#F8F1EB] text-[10px] font-semibold px-2 py-0.5 rounded-sm uppercase tracking-wider">
            {product.badge}
          </div>
        )}

        {/* Quick View Hover Indicator */}
        <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity bg-[#243022]/95 text-[#F8F1EB] border border-[#4E6349] p-1.5 rounded-full shadow-xs">
          <Eye className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category - unboxed metadata */}
          <div className="text-[11px] font-medium text-[#A8BCA6] uppercase tracking-wider mb-1">
            {product.category}
          </div>

          {/* Product Title */}
          <h3 className="font-serif text-lg font-bold text-[#F8F1EB] group-hover:text-white transition-colors leading-snug line-clamp-2">
            {product.title}
          </h3>

          {/* Dimensions / Short specs */}
          {product.dimensions && (
            <p className="text-xs text-[#A2B5A0] mt-1 line-clamp-1">
              {product.dimensions}
            </p>
          )}
        </div>

        {/* Pricing and Actions */}
        <div className="pt-2 border-t border-[#3B4C37] space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-[#A2B5A0]">Valor (100 unidades)</span>
            <span className="text-lg font-bold text-[#F8F1EB] tabular-nums">
              {formatBRL(product.price)}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            {/* Direct WhatsApp Button */}
            <button
              type="button"
              onClick={handleWhatsAppClick}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 rounded-lg transition-colors cursor-pointer shadow-xs"
              title="Pedir este produto diretamente no WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Pedir no Whats</span>
            </button>

            {/* Add to Cart Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer border ${
                addedJustNow
                  ? 'bg-[#F8F1EB] text-[#273224] border-[#F8F1EB]'
                  : 'bg-[#384835] text-[#F8F1EB] hover:bg-[#435640] border-[#4E6349]'
              }`}
            >
              {addedJustNow ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#273224]" />
                  <span>Adicionado!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5 text-[#CBD7CA]" />
                  <span>+ Carrinho</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
