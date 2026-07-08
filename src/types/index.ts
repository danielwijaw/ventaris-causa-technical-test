export interface Product {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  priceCents: number;
  imageUrl: string;
}

export interface CartItem {
  productId: string;
  name: string;
  priceCents: number;
  quantity: number;
}

export interface ShippingInfo {
  name: string;
  address: string;
  city: string;
  zip: string;
  country: string;
}

export interface Order {
  orderId: string;
  items: CartItem[];
  totalCents: number;
  shipping: ShippingInfo;
  trackingNumber: string;
}

export interface ProductListResponse {
  page: number;
  limit: number;
  total: number;
  products: Product[];
}

export interface CheckoutRequest {
  items: CartItem[];
  shipping: ShippingInfo;
}

export interface CheckoutResponse {
  orderId: string;
  items: (CartItem & { name: string })[];
  totalCents: number;
  shipping: ShippingInfo;
  trackingNumber: string;
}
