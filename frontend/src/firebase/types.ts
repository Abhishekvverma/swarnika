export interface Product {
  id?: string;
  name: string;
  category: string;
  price: number;
  weight: number;
  description: string;
  image: string;
  inStock: boolean;
  createdAt: Date;
  gender?: string;
  purity?: string;
  totalPrice?: number;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id?: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "completed" | "cancelled";
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  img: string;
}

export interface Banner {
  id: string;
  image: string;
  title?: string;
  subtitle?: string;
}

export interface UserProfile {
  id?: string;
  username: string;
  email: string;
  role: string;
  createdAt?: any;
  pushToken?: string;
  phoneNumber?: string;
  avatar?: string;
}
