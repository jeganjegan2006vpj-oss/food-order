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
  unit: string;
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
  createdAt?: string;
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
  updatedAt?: string;
}

export interface IAddress {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  addresses: IAddress[];
  createdAt?: string;
  isBlocked?: boolean;
}

export interface IOrder {
  _id: string;
  orderNumber?: string;
  userId: string;
  customerName?: string;
  customerEmail?: string;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    unit: string;
    image: string;
    product?: IProduct;
  }[];
  deliveryAddress?: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  shippingAddress?: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zipCode?: string;
    pincode?: string;
  };
  deliveryMethod?: 'standard' | 'express' | 'same-day';
  deliverySlot?: string;
  deliveryFee: number;
  paymentMethod: string;
  paymentStatus?: 'pending' | 'completed' | 'failed';
  orderStatus: 'Placed' | 'Confirmed' | 'Packing' | 'Out for Delivery' | 'Delivered' | 'Cancelled' | string;
  timeline?: {
    status: string;
    timestamp: string;
    note: string;
    completed: boolean;
  }[];
  subtotal: number;
  discount: number;
  tax: number;
  totalAmount?: number;
  total: number;
  estimatedDelivery?: string;
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

export type PageView =
  | 'home'
  | 'shop'
  | 'categories'
  | 'deals'
  | 'store3d'
  | 'checkout'
  | 'tracking'
  | 'wishlist'
  | 'profile'
  | 'admin'
  | 'about'
  | 'contact';
