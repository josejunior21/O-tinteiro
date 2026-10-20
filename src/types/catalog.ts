export interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  imageUrl: string;
  description: string;
  prayerText?: string;
  dimensions?: string;
  badge?: string;
  inStock: boolean;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface StoreSettings {
  storeName: string;
  slogan: string;
  whatsappNumber: string; // e.g. "5511999999999"
  instagramHandle: string;
  welcomeMessage: string;
  shippingInfo: string;
  logoUrl?: string;
  logoDarkUrl?: string;
}
