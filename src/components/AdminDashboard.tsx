import React, { useState, useEffect } from 'react';
import {
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  Clock,
  Truck,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { IProduct, ICategory, IOrder, IUser } from '../types';
import { api } from '../utils/api';
import { useToast } from '../context/ToastContext';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'categories' | 'users'>('overview');
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [stats, setStats] = useState({
    totalSales: 8940.50,
    totalOrders: 142,
    totalProducts: 24,
    totalUsers: 86
  });

  // Modal for New Product
  const [isNewProductOpen, setIsNewProductOpen] = useState(false);
  const [newProd, setNewProd] = useState({
    name: '',
    category: 'Fruits',
    price: '',
    originalPrice: '',
    unit: '1 lb',
    stock: '50',
    image: '',
    description: '',
    discount: '0',
    badge: 'Organic'
  });

  const { addToast } = useToast();

  const loadData = async () => {
    try {
      const [prodRes, catRes, ordRes, usrRes, stRes] = await Promise.all([
        api.getProducts({ limit: 50 }),
        api.getCategories(),
        api.getAdminOrders(),
        api.getAdminUsers(),
        api.getAdminStats()
      ]);

      if (prodRes.success) setProducts(prodRes.products);
      if (catRes.success) setCategories(catRes.categories);
      if (ordRes.success) setOrders(ordRes.orders);
      if (usrRes.success) setUsers(usrRes.users);
      if (stRes.success) setStats(stRes.stats);
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.name || !newProd.price) return;

    try {
      const res = await api.createProduct({
        name: newProd.name,
        category: newProd.category,
        price: parseFloat(newProd.price),
        originalPrice: parseFloat(newProd.originalPrice || newProd.price),
        unit: newProd.unit,
        stock: parseInt(newProd.stock),
        image: newProd.image || 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=400&q=80',
        description: newProd.description || 'Farm-fresh grocery staple.',
        discount: parseInt(newProd.discount || '0'),
        badge: newProd.badge
      });

      if (res.success && res.product) {
        setProducts([res.product, ...products]);
        setIsNewProductOpen(false);
        setNewProd({
          name: '',
          category: 'Fruits',
          price: '',
          originalPrice: '',
          unit: '1 lb',
          stock: '50',
          image: '',
          description: '',
          discount: '0',
          badge: 'Organic'
        });
        addToast({
          type: 'success',
          title: 'Product Created',
          message: `${res.product.name} added to catalog`
        });
      }
    } catch {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Could not create product'
      });
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      const res = await api.deleteProduct(id);
      if (res.success) {
        setProducts(products.filter(p => p._id !== id));
        addToast({
          type: 'info',
          title: 'Product Removed',
          message: `${name} deleted from catalog`
        });
      }
    } catch {
      // Fail
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await api.updateOrderStatus(orderId, status);
      if (res.success && res.order) {
        setOrders(orders.map(o => (o._id === orderId ? res.order : o)));
        addToast({
          type: 'success',
          title: 'Status Updated',
          message: `Order set to ${status}`
        });
      }
    } catch {
      // Fail
    }
  };

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Operations & Catalog Control</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 font-display">
              Supermarket Admin Dashboard
            </h1>
          </div>

          <button
            onClick={() => setIsNewProductOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Grocery Item</span>
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-200/70 mb-8 max-w-2xl overflow-x-auto text-xs font-bold text-slate-600">
          {[
            { id: 'overview', label: 'Overview & Sales', icon: DollarSign },
            { id: 'products', label: 'Catalog Products', icon: Package },
            { id: 'orders', label: 'Customer Orders', icon: ShoppingBag },
            { id: 'categories', label: 'Aisles / Categories', icon: FolderTree },
            { id: 'users', label: 'Shoppers & Team', icon: Users }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-white text-slate-950 shadow-sm'
                    : 'hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab: Overview / Metrics */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>Gross Revenue</span>
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-3xl font-extrabold text-slate-900 font-display">
                  ${stats.totalSales.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-emerald-600 font-bold mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+18.4% this week</span>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>Total Deliveries</span>
                  <Truck className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-3xl font-extrabold text-slate-900 font-display">
                  {stats.totalOrders}
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  Avg. fulfillment: 13.8 mins
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>Catalog SKUs</span>
                  <Package className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-3xl font-extrabold text-slate-900 font-display">
                  {products.length}
                </div>
                <div className="text-xs text-emerald-600 mt-2">
                  100% in stock
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>Registered Users</span>
                  <Users className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-3xl font-extrabold text-slate-900 font-display">
                  {stats.totalUsers}
                </div>
                <div className="text-xs text-purple-600 font-bold mt-2">
                  Active shoppers
                </div>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 font-display mb-4">
                Recent Fulfillment Activity
              </h3>
              <div className="divide-y divide-slate-100">
                {orders.slice(0, 5).map(o => (
                  <div key={o._id} className="py-3 flex items-center justify-between gap-4 text-xs">
                    <div>
                      <span className="font-mono font-bold text-slate-900">#{o._id.slice(-6)}</span>
                      <span className="text-slate-400 ml-2">by {o.shippingAddress?.fullName || o.deliveryAddress?.fullName || o.customerName || 'Shopper'}</span>
                      <div className="text-slate-400 mt-0.5">{o.items.length} items • {o.deliverySlot || o.deliveryMethod || 'Standard 15m'}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-slate-900">${(o.total ?? o.totalAmount ?? 0).toFixed(2)}</span>
                      <span className={`px-2.5 py-1 rounded-full font-bold uppercase text-[10px] ${
                        o.orderStatus.toLowerCase() === 'delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {o.orderStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Products List */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 font-display">
                All Products ({products.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Item</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {products.map(p => (
                    <tr key={p._id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-10 h-10 rounded-xl object-cover bg-slate-50 border border-slate-100"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{p.name}</div>
                          <div className="text-slate-400">{p.unit}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-700">{p.category}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">${p.price.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          p.stock > 10 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {p.stock} units
                        </span>
                      </td>
                      <td className="py-3 px-4 text-amber-600 font-bold">★ {p.rating}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteProduct(p._id, p.name)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: Orders Management */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 font-display">
                Orders Management ({orders.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Delivery Slot</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Change Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {orders.map(o => (
                    <tr key={o._id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        #{o._id.slice(-6)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-800">{o.shippingAddress?.fullName || o.deliveryAddress?.fullName || o.customerName || 'Shopper'}</div>
                        <div className="text-slate-400">{o.shippingAddress?.city || o.deliveryAddress?.city || 'Local'}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{o.deliverySlot || o.deliveryMethod || 'Standard 15m'}</td>
                      <td className="py-3 px-4 font-extrabold text-slate-900">${(o.total ?? o.totalAmount ?? 0).toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full font-bold uppercase text-[10px] ${
                          o.orderStatus.toLowerCase() === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : o.orderStatus.toLowerCase().includes('delivery')
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {o.orderStatus.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <select
                          value={o.orderStatus}
                          onChange={e => handleUpdateOrderStatus(o._id, e.target.value)}
                          className="text-xs p-1.5 rounded-lg border border-slate-200 bg-white font-semibold"
                        >
                          <option value="Placed">Placed</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Packing">Packing</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: Categories */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map(c => (
              <div key={c._id} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
                <img
                  src={c.image}
                  alt={c.name}
                  className="w-16 h-16 rounded-2xl object-cover bg-slate-50 flex-shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg">{c.icon}</span>
                    <h4 className="font-bold text-slate-900 text-base">{c.name}</h4>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{c.productCount} products in aisle</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab: Users */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 font-display">
                Registered Shoppers ({users.length})
              </h3>
            </div>
            <div className="divide-y divide-slate-100">
              {users.map(u => (
                <div key={u._id} className="p-4 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{u.name}</div>
                      <div className="text-slate-400">{u.email}</div>
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                    u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal: New Product Form */}
        {isNewProductOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-xl bg-white rounded-4xl p-6 sm:p-8 shadow-2xl border border-slate-100 overflow-y-auto max-h-[90vh]">
              <h3 className="text-xl font-extrabold text-slate-900 font-display mb-4">
                Add New Product to Catalog
              </h3>

              <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Product Name</label>
                  <input
                    type="text"
                    value={newProd.name}
                    onChange={e => setNewProd({ ...newProd, name: e.target.value })}
                    placeholder="e.g. Organic Blackberries"
                    required
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Category</label>
                    <select
                      value={newProd.category}
                      onChange={e => setNewProd({ ...newProd, category: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 text-sm"
                    >
                      <option value="Fruits">Fruits</option>
                      <option value="Vegetables">Vegetables</option>
                      <option value="Dairy">Dairy</option>
                      <option value="Bakery">Bakery</option>
                      <option value="Beverages">Beverages</option>
                      <option value="Snacks">Snacks</option>
                      <option value="Grains">Rice & Grains</option>
                      <option value="Household">Household</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Unit</label>
                    <input
                      type="text"
                      value={newProd.unit}
                      onChange={e => setNewProd({ ...newProd, unit: e.target.value })}
                      placeholder="e.g. 1 lb, 500g, 1 container"
                      className="w-full p-3 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newProd.price}
                      onChange={e => setNewProd({ ...newProd, price: e.target.value })}
                      placeholder="4.99"
                      required
                      className="w-full p-3 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Original ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newProd.originalPrice}
                      onChange={e => setNewProd({ ...newProd, originalPrice: e.target.value })}
                      placeholder="5.99"
                      className="w-full p-3 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Discount (%)</label>
                    <input
                      type="number"
                      value={newProd.discount}
                      onChange={e => setNewProd({ ...newProd, discount: e.target.value })}
                      placeholder="0"
                      className="w-full p-3 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Image URL (Unsplash or direct)</label>
                  <input
                    type="url"
                    value={newProd.image}
                    onChange={e => setNewProd({ ...newProd, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Description</label>
                  <textarea
                    value={newProd.description}
                    onChange={e => setNewProd({ ...newProd, description: e.target.value })}
                    rows={2}
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsNewProductOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                  >
                    Create Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
