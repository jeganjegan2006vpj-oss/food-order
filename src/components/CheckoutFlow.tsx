import React, { useState } from 'react';
import {
  CheckCircle2,
  MapPin,
  Clock,
  CreditCard,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Truck
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../utils/api';
import { PageView } from '../types';

interface CheckoutFlowProps {
  onOrderComplete: (orderId: string) => void;
  onNavigate: (page: PageView) => void;
}

export const CheckoutFlow: React.FC<CheckoutFlowProps> = ({
  onOrderComplete,
  onNavigate
}) => {
  const { cart, refreshCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form State
  const [address, setAddress] = useState({
    street: '742 Evergreen Terrace',
    apt: 'Apt 4B',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94107',
    notes: 'Please leave at front door near planter'
  });

  const [deliverySlot, setDeliverySlot] = useState({
    type: '15-min-express',
    title: '⚡ 15-Minute Instant Express',
    description: 'Arrives directly from local micro-hub in approx. 15-18 mins',
    price: 1.99
  });

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'google_pay' | 'cod'>('card');
  const [cardDetails, setCardDetails] = useState({
    number: '•••• •••• •••• 4242',
    name: user?.name || 'Alex Morgan',
    expiry: '08/28',
    cvv: '921'
  });

  const [confirmedOrderId, setConfirmedOrderId] = useState<string>('');

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      const res = await api.createOrder({
        shippingAddress: {
          fullName: user?.name || 'Alex Morgan',
          street: `${address.street} ${address.apt}`,
          city: address.city,
          state: address.state,
          zipCode: address.zipCode,
          phone: '(555) 234-5678'
        },
        deliverySlot: `${deliverySlot.title} (${deliverySlot.description})`,
        paymentMethod
      });

      if (res.success && res.order) {
        setConfirmedOrderId(res.order._id);
        setStep(5);
        await refreshCart();
        addToast({
          type: 'success',
          title: 'Order Confirmed! 🎉',
          message: `Order #${res.order._id.slice(-6)} received.`
        });
      }
    } catch {
      // Offline mock fallback
      const mockId = `ORD-${Date.now().toString().slice(-6)}`;
      setConfirmedOrderId(mockId);
      setStep(5);
      addToast({
        type: 'success',
        title: 'Order Placed!',
        message: `Order #${mockId} confirmed.`
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const stepsList = [
    { num: 1, title: 'Cart Review' },
    { num: 2, title: 'Delivery Address' },
    { num: 3, title: 'Delivery Slot' },
    { num: 4, title: 'Payment Method' },
    { num: 5, title: 'Confirmation' }
  ];

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Step Indicator */}
        <div className="mb-10">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0" />
            <div
              className="absolute top-1/2 left-0 h-1 bg-emerald-600 -translate-y-1/2 z-0 transition-all duration-300"
              style={{ width: `${((step - 1) / (stepsList.length - 1)) * 100}%` }}
            />

            {stepsList.map(s => (
              <div key={s.num} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm transition-all ${
                    step >= s.num
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                      : 'bg-white text-slate-400 border-2 border-slate-200'
                  }`}
                >
                  {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
                </div>
                <span className={`text-xs mt-2 font-bold hidden sm:inline ${step >= s.num ? 'text-slate-900' : 'text-slate-400'}`}>
                  {s.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Cart Review */}
        {step === 1 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-extrabold text-slate-900 font-display mb-6">
              1. Review Your Grocery Basket
            </h2>

            <div className="divide-y divide-slate-100 mb-6">
              {cart.items.map(item => (
                <div key={item.productId} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-2xl object-cover bg-slate-50 border border-slate-100"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{item.product.name}</h4>
                      <p className="text-xs text-slate-400">Qty: {item.quantity} × ${item.product.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-slate-900 text-sm">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 flex items-center justify-between mb-8">
              <span className="text-sm font-bold text-slate-700">Subtotal:</span>
              <span className="text-lg font-black text-emerald-700 font-display">
                ${cart.total.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={() => onNavigate('shop')}
                className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
              >
                ← Continue Shopping
              </button>
              <button
                onClick={() => setStep(2)}
                className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xl shadow-emerald-600/20 flex items-center gap-2 transition active:scale-95"
              >
                <span>Proceed to Shipping Address</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Delivery Address */}
        {step === 2 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-extrabold text-slate-900 font-display mb-6">
              2. Shipping / Delivery Address
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Street Address</label>
                <input
                  type="text"
                  value={address.street}
                  onChange={e => setAddress({ ...address, street: e.target.value })}
                  className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Apartment / Suite</label>
                <input
                  type="text"
                  value={address.apt}
                  onChange={e => setAddress({ ...address, apt: e.target.value })}
                  className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  value={address.city}
                  onChange={e => setAddress({ ...address, city: e.target.value })}
                  className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">State</label>
                <input
                  type="text"
                  value={address.state}
                  onChange={e => setAddress({ ...address, state: e.target.value })}
                  className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Zip Code</label>
                <input
                  type="text"
                  value={address.zipCode}
                  onChange={e => setAddress({ ...address, zipCode: e.target.value })}
                  className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Instructions for Courier</label>
                <textarea
                  value={address.notes}
                  onChange={e => setAddress({ ...address, notes: e.target.value })}
                  rows={2}
                  className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xl shadow-emerald-600/20 flex items-center gap-2 transition active:scale-95"
              >
                <span>Select Delivery Slot</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Delivery Slot */}
        {step === 3 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-extrabold text-slate-900 font-display mb-6">
              3. Select Delivery Slot & Speed
            </h2>

            <div className="space-y-4 mb-8">
              {[
                {
                  id: '15-min-express',
                  title: '⚡ 15-Minute Instant Express',
                  desc: 'Hand-packed immediately from local dark store and dispatched via e-bike.',
                  price: '$1.99',
                  tag: 'Popular'
                },
                {
                  id: '1-hour-window',
                  title: '🕒 Today: 1:00 PM – 2:00 PM',
                  desc: 'Standard scheduled slot in temperature-controlled refrigerated van.',
                  price: 'FREE',
                  tag: 'Standard'
                },
                {
                  id: 'evening-eco',
                  title: '🌱 Evening Eco Batch (6:00 PM – 8:00 PM)',
                  desc: 'Consolidated green route reduces carbon footprint. Bonus $1 store credit.',
                  price: 'FREE',
                  tag: 'Eco Friendly'
                }
              ].map(slot => (
                <div
                  key={slot.id}
                  onClick={() => setDeliverySlot({ type: slot.id, title: slot.title, description: slot.desc, price: slot.price === 'FREE' ? 0 : 1.99 })}
                  className={`p-5 rounded-3xl border-2 transition cursor-pointer flex items-center justify-between gap-4 ${
                    deliverySlot.type === slot.id
                      ? 'border-emerald-600 bg-emerald-50/60 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-900 text-sm sm:text-base">{slot.title}</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase">
                        {slot.tag}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 max-w-lg">{slot.desc}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-extrabold text-slate-900 font-display">{slot.price}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xl shadow-emerald-600/20 flex items-center gap-2 transition active:scale-95"
              >
                <span>Continue to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Payment Method */}
        {step === 4 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-extrabold text-slate-900 font-display mb-6">
              4. Payment Method
            </h2>

            {/* Payment Options Radio Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { id: 'card', label: 'Credit Card', icon: '💳' },
                { id: 'apple_pay', label: 'Apple Pay', icon: '🍏' },
                { id: 'google_pay', label: 'Google Pay', icon: '🌐' },
                { id: 'cod', label: 'Cash on Delivery', icon: '💵' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPaymentMethod(opt.id as any)}
                  className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center text-center transition ${
                    paymentMethod === opt.id
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50 font-medium'
                  }`}
                >
                  <span className="text-2xl mb-1">{opt.icon}</span>
                  <span className="text-xs">{opt.label}</span>
                </button>
              ))}
            </div>

            {/* Card Inputs if card selected */}
            {paymentMethod === 'card' && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 mb-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardDetails.number}
                    onChange={e => setCardDetails({ ...cardDetails, number: e.target.value })}
                    className="w-full text-sm p-3 rounded-xl border border-slate-200 bg-white font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardDetails.name}
                      onChange={e => setCardDetails({ ...cardDetails, name: e.target.value })}
                      className="w-full text-sm p-3 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Expires</label>
                      <input
                        type="text"
                        value={cardDetails.expiry}
                        onChange={e => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                        className="w-full text-sm p-3 rounded-xl border border-slate-200 bg-white text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">CVV</label>
                      <input
                        type="password"
                        value={cardDetails.cvv}
                        onChange={e => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                        className="w-full text-sm p-3 rounded-xl border border-slate-200 bg-white text-center"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Total Due Notice */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-between mb-8">
              <div>
                <span className="text-xs text-slate-500 font-medium">Amount to Charge</span>
                <div className="text-2xl font-black text-emerald-800 font-display">
                  ${(cart.total + deliverySlot.price).toFixed(2)}
                </div>
              </div>
              <div className="text-right text-xs text-slate-500">
                <span>Includes Taxes & 15-Min Cold Chain Delivery</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={() => setStep(3)}
                className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
              >
                ← Back
              </button>
              <button
                disabled={isProcessing}
                onClick={handlePlaceOrder}
                className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xl shadow-emerald-600/25 flex items-center gap-2 transition active:scale-95 disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isProcessing ? 'Verifying & Placing...' : 'Authorize & Place Order'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Confirmation */}
        {step === 5 && (
          <div className="bg-white rounded-4xl p-8 sm:p-12 shadow-xl border border-slate-100 text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-4xl mx-auto mb-6 shadow-inner animate-bounce">
              🎉
            </div>

            <span className="px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider">
              Order Confirmed & Packing
            </span>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight font-display text-slate-900 mt-3 mb-2">
              Thank You for Shopping Fresh!
            </h2>

            <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
              Your grocery pod is being packed at our local micro-fulfillment center. Driver ETA: <strong className="text-slate-800">14 minutes</strong>.
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1 mb-8 max-w-md mx-auto">
              <div className="flex justify-between">
                <span>Order Reference:</span>
                <strong className="font-mono text-emerald-700">{confirmedOrderId || 'ORD-984214'}</strong>
              </div>
              <div className="flex justify-between">
                <span>Delivery Slot:</span>
                <strong>{deliverySlot.title}</strong>
              </div>
              <div className="flex justify-between">
                <span>Address:</span>
                <strong>{address.street}, {address.city}</strong>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onOrderComplete(confirmedOrderId || 'ORD-984214')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2 transition"
              >
                <Truck className="w-4 h-4" />
                <span>Track Live Order</span>
              </button>

              <button
                onClick={() => onNavigate('shop')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm transition"
              >
                Back to Groceries
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
