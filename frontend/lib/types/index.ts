export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  role?: string;
}

export interface Product {
  id: string;
  title: string;
  description: string | null;
  price: number;
  fileUrl: string | null;
  fileName: string | null;
  fileSize: number | null;
  sellerId: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCardData {
  id: string;
  title: string;
  description: string;
  price: number;
  fileUrl?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  price: number;
  product: Product;
}
