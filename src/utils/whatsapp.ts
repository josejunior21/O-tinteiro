import { CartItem, Product } from '../types/catalog';

export function formatBRL(amount: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
}

export function cleanPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.length === 10 || digits.length === 11) {
    return `55${digits}`;
  }
  return digits;
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  const localDigits = digits.startsWith('55') && digits.length >= 12 ? digits.slice(2) : digits;
  if (localDigits.length === 11) {
    return `(${localDigits.slice(0, 2)}) ${localDigits.slice(2, 7)}-${localDigits.slice(7)}`;
  }
  if (localDigits.length === 10) {
    return `(${localDigits.slice(0, 2)}) ${localDigits.slice(2, 6)}-${localDigits.slice(6)}`;
  }
  return phone;
}

/**
 * Generates direct WhatsApp URL for a single product
 */
export function getProductWhatsAppUrl(
  phone: string,
  product: Product,
  storeName: string
): string {
  const clean = cleanPhone(phone) || '5591989911864';
  const priceFormatted = formatBRL(product.price);
  
  const text = `Olá! Vi o catálogo da *${storeName}* e gostaria de encomendar os santinhos:\n\n` +
    `✨ *${product.title}*\n` +
    `🏷️ *Modelo/Acabamento:* ${product.category}\n` +
    `💰 *Valor:* ${priceFormatted} (100 unidades)\n` +
    `📄 *Papel:* 180g texturizado (branco ou marfim)\n\n` +
    `Gostaria de combinar a personalização (nome, data, oração) e verificar a data de entrega.`;

  return `https://wa.me/${clean}?text=${encodeURIComponent(text)}`;
}

/**
 * Generates WhatsApp URL for entire shopping cart order
 */
export function getCartOrderWhatsAppUrl(
  phone: string,
  items: CartItem[],
  storeName: string,
  customerName?: string,
  notes?: string
): string {
  const clean = cleanPhone(phone) || '5591989911864';
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalCards = items.reduce((sum, item) => sum + item.quantity * 100, 0);

  let text = `✝️ *NOVO PEDIDO DE SANTINHOS - ${storeName.toUpperCase()}*\n`;
  text += `--------------------------------------\n`;

  if (customerName && customerName.trim()) {
    text += `👤 *Nome do Cliente:* ${customerName.trim()}\n\n`;
  }

  text += `📦 *ITENS DO PEDIDO:*\n`;
  items.forEach((item, index) => {
    const itemSubtotal = formatBRL(item.product.price * item.quantity);
    text += `${index + 1}. *${item.product.title}*\n`;
    text += `   Quantidade: ${item.quantity} cento(s) (${item.quantity * 100} santinhos) | Subtotal: ${itemSubtotal}\n`;
  });

  text += `\n--------------------------------------\n`;
  text += `📊 *TOTAL DE SANTINHOS:* ${totalCards} unidades\n`;
  text += `💰 *VALOR TOTAL:* ${formatBRL(total)}\n`;

  if (notes && notes.trim()) {
    text += `\n📝 *Dados para Personalização / Data do Sacramento:*\n${notes.trim()}\n`;
  }

  text += `\nℹ️ *Prazos:* Encomenda com 15 dias de antecedência mínima. Pagamento via Pix ou Cartão.\n`;
  text += `\nOlá! Gostaria de confirmar a encomenda e enviar os dados para a arte. Obrigado(a)!`;

  return `https://wa.me/${clean}?text=${encodeURIComponent(text)}`;
}
