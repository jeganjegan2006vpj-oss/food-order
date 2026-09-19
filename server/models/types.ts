// Database models and in-memory persisted MongoDB-compatible mock engine

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string; // hashed in production / mock hash
  phone: string;
  role: 'customer' | 'admin';
  addresses: {
    id: string;
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    isDefault: boolean;
  }[];
  createdAt: string;
  isBlocked?: boolean;
}

export interface IProduct {
  _id: string;
  name: string;
  category: string;
  categorySlug: string;
  description: string;
  price: number;
  discount: number; // percentage
  originalPrice: number;
  stock: number;
  unit: string; // e.g. "1 kg", "500 g", "1 liter", "Pack of 6"
  image: string;
  badge?: string;
  rating: number;
  reviewsCount: number;
  isOrganic?: boolean;
  isFeatured?: boolean;
  isDeal?: boolean;
  ingredients?: string[];
  nutrition?: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
    fiber?: string;
  };
  storageInfo?: string;
  createdAt: string;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  image: string;
  description: string;
  productCount: number;
  color: string;
}

export interface ICartItem {
  productId: string;
  product: IProduct;
  quantity: number;
}

export interface ICart {
  _id: string;
  userId: string;
  items: ICartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  tax: number;
  total: number;
  couponCode?: string;
  updatedAt: string;
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    unit: string;
    image: string;
  }[];
  deliveryAddress: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  deliveryMethod: 'standard' | 'express' | 'same-day';
  deliveryFee: number;
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'cod';
  paymentStatus: 'pending' | 'completed' | 'failed';
  orderStatus: 'Placed' | 'Confirmed' | 'Packing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  timeline: {
    status: string;
    timestamp: string;
    note: string;
    completed: boolean;
  }[];
  subtotal: number;
  discount: number;
  tax: number;
  totalAmount: number;
  estimatedDelivery: string;
  createdAt: string;
}

export interface IReview {
  _id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: string;
}
