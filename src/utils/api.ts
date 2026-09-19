import { IProduct, ICategory, ICart, IOrder, IUser, IReview } from '../types';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('freshcart_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  let guestSession = localStorage.getItem('freshcart_guest_id');
  if (!guestSession) {
    guestSession = `guest_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('freshcart_guest_id', guestSession);
  }
  headers['x-guest-session'] = guestSession;
  return headers;
}

export const api = {
  // Auth
  async login(email: string, password: string): Promise<{ success: boolean; token?: string; user?: IUser; message?: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  async register(data: { name: string; email: string; password: string; phone?: string }): Promise<{ success: boolean; token?: string; user?: IUser; message?: string }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Products
  async getProducts(params?: { category?: string; search?: string; deal?: boolean; organic?: boolean; sort?: string; minPrice?: number; maxPrice?: number; limit?: number }): Promise<{ success: boolean; products: IProduct[]; count: number }> {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    if (params?.deal) query.append('deal', 'true');
    if (params?.organic) query.append('organic', 'true');
    if (params?.sort) query.append('sort', params.sort);
    if (params?.minPrice !== undefined) query.append('minPrice', params.minPrice.toString());
    if (params?.maxPrice !== undefined) query.append('maxPrice', params.maxPrice.toString());
    if (params?.limit !== undefined) query.append('limit', params.limit.toString());

    const res = await fetch(`${API_BASE}/products?${query.toString()}`);
    return res.json();
  },

  async getProduct(id: string): Promise<{ success: boolean; product: IProduct; related?: IProduct[] }> {
    const res = await fetch(`${API_BASE}/products/${id}`);
    return res.json();
  },

  async getCategories(): Promise<{ success: boolean; categories: ICategory[] }> {
    const res = await fetch(`${API_BASE}/products/categories`);
    return res.json();
  },

  // Cart
  async getCart(): Promise<{ success: boolean; cart: ICart }> {
    const res = await fetch(`${API_BASE}/cart`, {
      headers: getAuthHeader()
    });
    return res.json();
  },

  async addToCart(productId: string, quantity = 1): Promise<{ success: boolean; cart: ICart; message?: string }> {
    const res = await fetch(`${API_BASE}/cart`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ productId, quantity })
    });
    return res.json();
  },

  async updateCartItem(productId: string, quantity: number): Promise<{ success: boolean; cart: ICart }> {
    const res = await fetch(`${API_BASE}/cart/${productId}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify({ quantity })
    });
    return res.json();
  },

  async removeCartItem(productId: string): Promise<{ success: boolean; cart: ICart; message?: string }> {
    const res = await fetch(`${API_BASE}/cart/${productId}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return res.json();
  },

  async applyCoupon(code: string): Promise<{ success: boolean; cart?: ICart; message: string }> {
    const res = await fetch(`${API_BASE}/cart/coupon`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ code })
    });
    return res.json();
  },

  // Orders
  async createOrder(orderData: any): Promise<{ success: boolean; order: IOrder; message?: string }> {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(orderData)
    });
    return res.json();
  },

  async getOrders(): Promise<{ success: boolean; orders: IOrder[] }> {
    const res = await fetch(`${API_BASE}/orders`, {
      headers: getAuthHeader()
    });
    return res.json();
  },

  async getMyOrders(): Promise<{ success: boolean; orders: IOrder[] }> {
    return this.getOrders();
  },

  async getAdminOrders(): Promise<{ success: boolean; orders: IOrder[] }> {
    return this.getOrders();
  },

  async getAdminUsers(): Promise<{ success: boolean; users: any[] }> {
    const res = await this.getCustomers();
    return { success: res.success, users: res.customers || [] };
  },

  async getOrder(id: string): Promise<{ success: boolean; order: IOrder }> {
    const res = await fetch(`${API_BASE}/orders/${id}`, {
      headers: getAuthHeader()
    });
    return res.json();
  },

  async updateOrderStatus(orderId: string, status: string, note?: string): Promise<{ success: boolean; order: IOrder }> {
    const res = await fetch(`${API_BASE}/orders/${orderId}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify({ status, note })
    });
    return res.json();
  },

  // User Profile
  async getProfile(): Promise<{ success: boolean; user: IUser }> {
    const res = await fetch(`${API_BASE}/users/profile`, {
      headers: getAuthHeader()
    });
    return res.json();
  },

  async updateProfile(data: Partial<IUser>): Promise<{ success: boolean; user: IUser; message?: string }> {
    const res = await fetch(`${API_BASE}/users/profile`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async addAddress(address: any): Promise<{ success: boolean; addresses: any[]; message?: string }> {
    const res = await fetch(`${API_BASE}/users/address`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(address)
    });
    return res.json();
  },

  // Reviews
  async getProductReviews(productId: string): Promise<{ success: boolean; reviews: IReview[] }> {
    const res = await fetch(`${API_BASE}/reviews/${productId}`);
    return res.json();
  },

  async submitReview(data: { productId: string; rating: number; comment: string; userName?: string }): Promise<{ success: boolean; review: IReview; message?: string }> {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Admin
  async getAdminStats(): Promise<{ success: boolean; stats: any }> {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: getAuthHeader()
    });
    return res.json();
  },

  async getCustomers(search?: string): Promise<{ success: boolean; customers: any[] }> {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    const res = await fetch(`${API_BASE}/admin/customers${query}`, {
      headers: getAuthHeader()
    });
    return res.json();
  },

  async toggleBlockCustomer(id: string): Promise<{ success: boolean; isBlocked: boolean; message?: string }> {
    const res = await fetch(`${API_BASE}/admin/customers/${id}/block`, {
      method: 'PUT',
      headers: getAuthHeader()
    });
    return res.json();
  },

  async addProduct(productData: any): Promise<{ success: boolean; product: IProduct; message?: string }> {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(productData)
    });
    return res.json();
  },

  async createProduct(productData: any): Promise<{ success: boolean; product: IProduct; message?: string }> {
    return this.addProduct(productData);
  },

  async updateProduct(id: string, productData: any): Promise<{ success: boolean; product: IProduct; message?: string }> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify(productData)
    });
    return res.json();
  },

  async deleteProduct(id: string): Promise<{ success: boolean; message?: string }> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return res.json();
  }
};
