import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  X,
  Star,
  Heart,
  ShoppingCart,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Send,
  Check
} from 'lucide-react';
import { IProduct, IReview } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../utils/api';

interface ProductDetailModalProps {
  product: IProduct | null;
  onClose: () => void;
  onBuyNow: (product: IProduct, qty: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onBuyNow
}) => {
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'nutrition' | 'reviews'>('details');
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [viewMode, setViewMode] = useState<'photo' | '3d'>('photo');

  const canvasRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    if (product) {
      setQty(1);
      // Fetch reviews
      api.getProductReviews(product._id).then(res => {
        if (res.success && res.reviews) {
          setReviews(res.reviews);
        }
      });
    }
  }, [product]);

  // Three.js 3D rotating preview
  useEffect(() => {
    if (!product || viewMode !== '3d') return;
    const container = canvasRef.current;
    if (!container) return;

    const width = container.clientWidth || 380;
    const height = container.clientHeight || 380;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(4, 6, 5);
    scene.add(dirLight);

    // Create 3D shape based on product category
    const group = new THREE.Group();
    scene.add(group);

    if (product.category === 'Fruits' || product.name.toLowerCase().includes('apple')) {
      const appleGeo = new THREE.SphereGeometry(1.2, 32, 32);
      appleGeo.scale(1, 0.95, 1);
      const appleMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.25, metalness: 0.1 });
      const apple = new THREE.Mesh(appleGeo, appleMat);
      group.add(apple);

      const stemGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.6, 8);
      const stemMat = new THREE.MeshStandardMaterial({ color: 0x451a03 });
      const stem = new THREE.Mesh(stemGeo, stemMat);
      stem.position.y = 1.3;
      stem.rotation.z = 0.2;
      group.add(stem);
    } else if (product.category === 'Dairy' || product.name.toLowerCase().includes('milk')) {
      const bottleGeo = new THREE.CylinderGeometry(0.7, 0.85, 2.2, 24);
      const bottleMat = new THREE.MeshPhysicalMaterial({ color: 0xf8fafc, roughness: 0.2, transmission: 0.5 });
      const bottle = new THREE.Mesh(bottleGeo, bottleMat);
      group.add(bottle);

      const capGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16);
      const capMat = new THREE.MeshStandardMaterial({ color: 0x0284c7 });
      const cap = new THREE.Mesh(capGeo, capMat);
      cap.position.y = 1.25;
      group.add(cap);
    } else {
      // General grocery geometric model with vibrant color
      const geo = new THREE.DodecahedronGeometry(1.3, 2);
      const mat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3, metalness: 0.15 });
      const mesh = new THREE.Mesh(geo, mat);
      group.add(mesh);
    }

    // Interaction drag rotation
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      group.rotation.y += deltaX * 0.01;
      group.rotation.x += deltaY * 0.01;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };
    const onMouseUp = () => { isDragging = false; };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (!isDragging) {
        group.rotation.y += 0.008;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      renderer.dispose();
    };
  }, [product, viewMode]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !newComment.trim()) return;

    setIsSubmittingReview(true);
    try {
      const res = await api.submitReview({
        productId: product._id,
        rating: newRating,
        comment: newComment.trim(),
        userName: user?.name || 'Verified Shopper'
      });
      if (res.success && res.review) {
        setReviews(prev => [res.review, ...prev]);
        setNewComment('');
        addToast({
          type: 'success',
          title: 'Review Posted',
          message: 'Thank you for your grocery feedback!'
        });
      }
    } catch {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Could not submit review'
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (!product) return null;

  const isFav = isWishlisted(product._id);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-white rounded-3xl sm:rounded-4xl shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* Left Column: Image / 3D Canvas with Toggle */}
            <div>
              <div className="relative aspect-square w-full rounded-3xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center group shadow-inner">
                {viewMode === 'photo' ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div
                    ref={canvasRef}
                    className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center"
                    title="Drag to rotate in 3D"
                  />
                )}

                {/* Discount Badge */}
                {product.discount > 0 && (
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-xl bg-rose-600 text-white text-xs font-black tracking-wide uppercase shadow-md">
                    {product.discount}% OFF
                  </span>
                )}

                {/* 3D vs Photo View Toggle */}
                <div className="absolute bottom-4 inset-x-4 flex items-center justify-center">
                  <div className="inline-flex p-1 rounded-2xl bg-white/90 backdrop-blur-md shadow-lg border border-slate-200">
                    <button
                      onClick={() => setViewMode('photo')}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                        viewMode === 'photo'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-emerald-700'
                      }`}
                    >
                      Photo View
                    </button>
                    <button
                      onClick={() => setViewMode('3d')}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                        viewMode === '3d'
                          ? 'bg-amber-500 text-slate-950 shadow-xs'
                          : 'text-slate-600 hover:text-amber-600'
                      }`}
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>3D Preview</span>
                    </button>
                  </div>
                </div>
              </div>

              {viewMode === '3d' && (
                <p className="text-center text-xs text-slate-400 mt-2">
                  Click and drag around to spin the 3D model
                </p>
              )}
            </div>

            {/* Right Column: Information & Actions */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-emerald-700 font-bold uppercase tracking-wider mb-2">
                  <span>{product.category}</span>
                  <span className="text-slate-400 font-medium">{product.unit}</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display mb-3">
                  {product.name}
                </h1>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-2 mb-4 text-sm">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-extrabold text-slate-800">{product.rating}</span>
                  <span className="text-slate-400">({product.reviewsCount} customer reviews)</span>
                </div>

                {/* Pricing Block */}
                <div className="flex items-baseline gap-3 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 mb-6">
                  <span className="text-3xl font-extrabold text-slate-900 font-display">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-base text-slate-400 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                  {product.discount > 0 && (
                    <span className="text-xs font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-md">
                      Save ${(product.originalPrice - product.price).toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  {product.description}
                </p>

                {/* Quantity & CTAs */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-slate-700">Quantity:</span>
                    <div className="flex items-center rounded-2xl border border-slate-200 bg-white p-1">
                      <button
                        onClick={() => setQty(Math.max(1, qty - 1))}
                        className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-extrabold text-slate-900 text-sm">
                        {qty}
                      </span>
                      <button
                        onClick={() => setQty(qty + 1)}
                        className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => toggleWishlist(product)}
                      className="p-3 rounded-2xl border border-slate-200 hover:border-rose-300 text-slate-400 hover:text-rose-500 transition ml-auto"
                      title="Save to Wishlist"
                    >
                      <Heart className={`w-5 h-5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={e => {
                        addToCart(product, qty, e);
                      }}
                      className="py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>

                    <button
                      onClick={() => {
                        onBuyNow(product, qty);
                        onClose();
                      }}
                      className="py-3.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
                    >
                      <Zap className="w-4 h-4" />
                      <span>Buy Now</span>
                    </button>
                  </div>
                </div>

                {/* Delivery Assurance */}
                <div className="grid grid-cols-2 gap-2.5 pt-6 mt-6 border-t border-slate-100 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    <span>Free delivery over $35</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>100% Quality Guaranteed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabbed Section: Details, Nutrition, Reviews */}
          <div className="mt-10 pt-8 border-t border-slate-100">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-2 text-sm font-bold transition border-b-2 -mb-3.5 ${
                  activeTab === 'details'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Ingredients & Storage
              </button>
              <button
                onClick={() => setActiveTab('nutrition')}
                className={`pb-2 text-sm font-bold transition border-b-2 -mb-3.5 ${
                  activeTab === 'nutrition'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Nutrition Facts
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-2 text-sm font-bold transition border-b-2 -mb-3.5 ${
                  activeTab === 'reviews'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Customer Reviews ({reviews.length})
              </button>
            </div>

            <div className="py-6">
              {activeTab === 'details' && (
                <div className="space-y-4 text-sm text-slate-600">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Ingredients:</h4>
                    <p>{product.ingredients?.join(', ') || '100% all-natural fresh ingredient'}</p>
                  </div>
                  {product.storageInfo && (
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">Storage Instructions:</h4>
                      <p>{product.storageInfo}</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'nutrition' && (
                <div className="max-w-md">
                  <div className="rounded-2xl border border-slate-200 overflow-hidden text-sm">
                    <div className="bg-slate-50 px-4 py-2 font-bold text-slate-900 border-b border-slate-200">
                      Nutritional Value per serving
                    </div>
                    <div className="divide-y divide-slate-100">
                      <div className="flex justify-between px-4 py-2">
                        <span className="text-slate-500">Calories</span>
                        <span className="font-bold text-slate-800">{product.nutrition?.calories || '65 kcal'}</span>
                      </div>
                      <div className="flex justify-between px-4 py-2">
                        <span className="text-slate-500">Protein</span>
                        <span className="font-bold text-slate-800">{product.nutrition?.protein || '1.2 g'}</span>
                      </div>
                      <div className="flex justify-between px-4 py-2">
                        <span className="text-slate-500">Carbohydrates</span>
                        <span className="font-bold text-slate-800">{product.nutrition?.carbs || '14 g'}</span>
                      </div>
                      <div className="flex justify-between px-4 py-2">
                        <span className="text-slate-500">Fat</span>
                        <span className="font-bold text-slate-800">{product.nutrition?.fat || '0.2 g'}</span>
                      </div>
                      {product.nutrition?.fiber && (
                        <div className="flex justify-between px-4 py-2">
                          <span className="text-slate-500">Dietary Fiber</span>
                          <span className="font-bold text-slate-800">{product.nutrition.fiber}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {/* Reviews List */}
                  <div className="space-y-3">
                    {reviews.map(r => (
                      <div key={r._id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-emerald-200 text-emerald-800 font-bold text-xs flex items-center justify-center">
                              {r.userName.charAt(0)}
                            </div>
                            <span className="font-bold text-slate-900 text-xs">{r.userName}</span>
                          </div>
                          <div className="flex text-amber-400">
                            {[...Array(r.rating)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{r.comment}</p>
                      </div>
                    ))}
                  </div>

                  {/* Add Review Form */}
                  <form onSubmit={handleReviewSubmit} className="p-4 rounded-2xl border border-slate-200 bg-white">
                    <h4 className="font-bold text-sm text-slate-900 mb-2">Write a Review</h4>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs text-slate-500">Your Rating:</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setNewRating(star)}
                            className="p-0.5 text-amber-400"
                          >
                            <Star className={`w-4 h-4 ${star <= newRating ? 'fill-amber-400' : 'text-slate-200'}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <textarea
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                      placeholder="How was the freshness, taste, and packaging?"
                      rows={3}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-hidden"
                      required
                    />
                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="mt-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmittingReview ? 'Posting...' : 'Submit Review'}</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
