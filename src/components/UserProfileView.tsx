import React, { useState, useEffect } from 'react';
import { User, MapPin, Package, ShieldCheck, Sparkles, Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { IOrder, PageView } from '../types';

interface UserProfileViewProps {
  onNavigate: (page: PageView) => void;
  onTrackOrder: (orderId: string) => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  onNavigate,
  onTrackOrder
}) => {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState<IOrder[]>([]);

  useEffect(() => {
    api.getMyOrders().then(res => {
      if (res.success && res.orders) {
        setOrders(res.orders);
      }
    });
  }, []);

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile Card */}
        <div className="bg-white rounded-4xl p-6 sm:p-8 shadow-sm border border-slate-100 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-emerald-600/25">
              {user?.name.charAt(0).toUpperCase() || 'A'}
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h2 className="text-2xl font-extrabold text-slate-900 font-display">
                  {user?.name || 'Alex Morgan'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                  {user?.role || 'Customer'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{user?.email || 'alex@example.com'}</p>
              <div className="flex items-center gap-2 mt-2 text-xs text-emerald-700 font-semibold justify-center sm:justify-start">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>FreshCart Club Member • 480 Harvest Points</span>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="px-5 py-2.5 rounded-xl border border-slate-200 hover:border-rose-300 text-slate-600 hover:text-rose-600 text-xs font-bold transition"
          >
            Sign Out
          </button>
        </div>

        {/* Saved Addresses & Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Saved Addresses */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Saved Delivery Addresses</span>
            </h3>

            <div className="p-4 rounded-2xl bg-slate-50 border border-emerald-200/80 space-y-1 text-xs text-slate-600">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span>Primary Residence (Home)</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px]">Default</span>
              </div>
              <p>742 Evergreen Terrace, Apt 4B</p>
              <p>San Francisco, CA 94107</p>
              <p className="text-slate-400 text-[11px] pt-1">Notes: Ring bell 4B or leave in lobby pod</p>
            </div>

            <button
              onClick={() => alert('Add new delivery address feature')}
              className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 hover:border-emerald-500 text-slate-600 hover:text-emerald-700 text-xs font-bold transition"
            >
              + Add Another Address
            </button>
          </div>

          {/* Orders History List */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-600" />
                <span>Recent Grocery Orders ({orders.length})</span>
              </h3>
            </div>

            <div className="divide-y divide-slate-100">
              {orders.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No orders placed yet. Start shopping fresh!
                </div>
              ) : (
                orders.map(order => (
                  <div key={order._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900">
                          #{order._id.slice(-6)}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full uppercase font-bold text-[10px] ${
                          order.orderStatus.toLowerCase() === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {order.orderStatus.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-slate-500 mt-1">
                        {order.items.length} items • Total: <strong className="text-slate-800">${(order.total ?? order.totalAmount ?? 0).toFixed(2)}</strong>
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{order.deliverySlot || order.deliveryMethod || 'Standard 15m'}</p>
                    </div>

                    <button
                      onClick={() => onTrackOrder(order._id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 font-bold transition"
                    >
                      <span>Track Order</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
