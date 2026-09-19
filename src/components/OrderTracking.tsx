import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  Phone,
  MessageSquare,
  ShieldCheck,
  Star,
  Sparkles,
  PackageCheck
} from 'lucide-react';
import { IOrder, PageView } from '../types';
import { api } from '../utils/api';

interface OrderTrackingProps {
  orderId?: string;
  onNavigate: (page: PageView) => void;
}

export const OrderTracking: React.FC<OrderTrackingProps> = ({
  orderId,
  onNavigate
}) => {
  const [order, setOrder] = useState<IOrder | null>(null);
  const [driverPosProgress, setDriverPosProgress] = useState(65); // percent along the route

  useEffect(() => {
    // Fetch user's active orders or specified order
    api.getMyOrders().then(res => {
      if (res.success && res.orders && res.orders.length > 0) {
        if (orderId) {
          const match = res.orders.find(o => o._id === orderId);
          setOrder(match || res.orders[0]);
        } else {
          setOrder(res.orders[0]);
        }
      }
    });
  }, [orderId]);

  // Simulate real-time GPS progress
  useEffect(() => {
    const interval = setInterval(() => {
      setDriverPosProgress(prev => (prev < 92 ? prev + 1 : 92));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const timelineSteps = [
    { title: 'Order Placed', time: '12:38 PM', desc: 'Received & sent to micro-warehouse', completed: true },
    { title: 'Packed & Chilled', time: '12:44 PM', desc: 'Cold pod packed with dry ice gel', completed: true },
    { title: 'Out for Delivery', time: '12:49 PM', desc: 'Courier Marcus en route via e-cargo bike', completed: true, active: true },
    { title: 'Delivered', time: 'Est. 1:04 PM', desc: 'Doorstep photo confirmation', completed: false }
  ];

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Live GPS Courier Feed</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 font-display">
              Order #{order?._id.slice(-6) || '984214'} Tracking
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Estimated delivery:{' '}
              <strong className="text-emerald-700 font-bold">12–15 Minutes</strong> (Arriving approx. 1:04 PM)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('shop')}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-white text-slate-700 text-xs font-bold transition"
            >
              Order More Groceries
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left 2 Cols: Interactive Map & Live Timeline */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Live Delivery Route Stylized Map Canvas */}
            <div className="relative w-full h-80 sm:h-96 rounded-4xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
              {/* Map grid streets svg visual */}
              <div className="absolute inset-0 opacity-25">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#64748b" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              {/* Highway Curves & Route */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <path
                  d="M 60 280 C 140 280, 180 180, 260 180 C 340 180, 380 90, 520 90"
                  fill="none"
                  stroke="#334155"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <path
                  d="M 60 280 C 140 280, 180 180, 260 180 C 340 180, 380 90, 520 90"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="4"
                  strokeDasharray="6 6"
                  strokeLinecap="round"
                />
              </svg>

              {/* Warehouse Pin (Start) */}
              <div className="absolute left-10 bottom-12 flex items-center gap-2 bg-slate-900/90 border border-emerald-500/40 px-3 py-1.5 rounded-xl shadow-lg backdrop-blur-md">
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-[11px] font-bold text-emerald-200">FreshCart Hub #04</span>
              </div>

              {/* Delivery Driver Animated Icon (Moving on route) */}
              <div
                className="absolute transition-all duration-1000 flex flex-col items-center"
                style={{
                  left: `${driverPosProgress}%`,
                  top: `${45 - (driverPosProgress - 50) * 0.4}%`
                }}
              >
                <div className="relative p-2 rounded-2xl bg-emerald-500 text-white shadow-xl shadow-emerald-500/40 animate-pulse">
                  <Truck className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 border-2 border-slate-900" />
                </div>
                <div className="mt-1 px-2 py-0.5 rounded-md bg-slate-950/90 text-white text-[10px] font-bold border border-slate-700 whitespace-nowrap">
                  Courier Marcus (0.8 mi away)
                </div>
              </div>

              {/* Customer Home Pin (End) */}
              <div className="absolute right-8 top-14 flex items-center gap-2 bg-slate-900/90 border border-amber-400/40 px-3 py-1.5 rounded-xl shadow-lg backdrop-blur-md">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span className="text-[11px] font-bold text-amber-200">Your Home (742 Evergreen)</span>
              </div>

              {/* Live Overlay Status Tag */}
              <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md border border-slate-700 px-3.5 py-2 rounded-2xl text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-bold text-white">ETA: 14 mins</span>
                <span className="text-slate-400">• Speed: 18 mph</span>
              </div>
            </div>

            {/* Timeline Steps Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
              <h3 className="text-lg font-extrabold text-slate-900 font-display mb-6">
                Delivery Milestones
              </h3>

              <div className="space-y-6">
                {timelineSteps.map((step, idx) => (
                  <div key={step.title} className="flex items-start gap-4 relative">
                    {idx < timelineSteps.length - 1 && (
                      <div
                        className={`absolute left-4 top-8 w-0.5 h-12 -translate-x-1/2 ${
                          step.completed ? 'bg-emerald-500' : 'bg-slate-200'
                        }`}
                      />
                    )}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                        step.completed
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                          : step.active
                          ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-100'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {step.completed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-900 text-sm">{step.title}</h4>
                        <span className="text-xs font-semibold text-slate-400">{step.time}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Driver Profile & Order Summary */}
          <div className="space-y-6">
            
            {/* Driver Profile Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 block">
                Assigned Delivery Courier
              </span>

              <div className="flex items-center gap-3.5 mb-4">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                  alt="Driver Marcus"
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500/40"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Marcus Ramirez</h4>
                  <p className="text-xs text-slate-400">FreshCart Pro Carrier</p>
                  <div className="flex items-center gap-1 text-xs text-amber-500 font-bold mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>4.98</span>
                    <span className="text-slate-400 font-normal">(1,420 deliveries)</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1.5 mb-4">
                <div className="flex justify-between text-slate-600">
                  <span>Vehicle:</span>
                  <strong className="text-slate-800">RadPower Cargo E-Bike (Chilled Box)</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Temperature:</span>
                  <strong className="text-emerald-700">38°F (Chilled & Safe)</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => alert('Connecting call with driver Marcus...')}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Call Driver</span>
                </button>
                <button
                  onClick={() => alert('Opening SMS chat with Marcus...')}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Text Driver</span>
                </button>
              </div>
            </div>

            {/* Package Contents */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h4 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
                <PackageCheck className="w-4 h-4 text-emerald-600" />
                <span>Package Contents ({order?.items.length || 3} items)</span>
              </h4>

              <div className="divide-y divide-slate-100 text-xs max-h-64 overflow-y-auto">
                {order?.items && order.items.length > 0 ? (
                  order.items.map(item => (
                    <div key={item.productId} className="py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={item.image || item.product?.image || ''}
                          alt={item.name || item.product?.name || 'Grocery item'}
                          className="w-9 h-9 rounded-lg object-cover bg-slate-50"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="font-bold text-slate-800">{item.name || item.product?.name}</div>
                          <div className="text-slate-400">Qty: {item.quantity}</div>
                        </div>
                      </div>
                      <span className="font-extrabold text-slate-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="py-4 text-center text-slate-400">
                    Organic Apples, Pasture Milk, Sourdough Loaf
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 mt-3 flex justify-between font-extrabold text-slate-900 text-sm">
                <span>Total Paid:</span>
                <span className="text-emerald-700 font-display">${(order?.total ?? order?.totalAmount ?? 24.95).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
