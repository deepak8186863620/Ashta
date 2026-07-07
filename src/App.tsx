/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, ChevronRight, Star, Check, Truck, Sparkles, AlertCircle, MapPin,
  MessageSquare, Mail, Phone, ShoppingCart, HelpCircle, Heart, Tag, Search, Plus, Minus, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Components
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { AdminPanel } from './components/AdminPanel';
import { AIStylist } from './components/AIStylist';

// Data & Types
import { INITIAL_PRODUCTS } from './data/initialProducts';
import { Product, CartItem, Order, Coupon, Review } from './types';

export default function App() {
  // --- STATE ---
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Navigation Router: page can be 'home', 'shop', 'product', 'checkout', 'account', 'admin', 'about', 'contact', 'faq', 'store-locator'
  const [viewState, setViewState] = useState<{
    page: string;
    selectedProductId: string | null;
    filters: {
      category?: string;
      material?: string;
      occasion?: string;
      maxPrice: number;
    };
  }>({
    page: 'home',
    selectedProductId: null,
    filters: {
      maxPrice: 5000
    }
  });

  // UI Toggles
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isStylistOpen, setIsStylistOpen] = useState(false);

  // Hero carousel index
  const [heroIndex, setHeroIndex] = useState(0);

  // Authentication simulation
  const [userEmail, setUserEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Checkout Form State
  const [checkoutName, setCheckoutName] = useState('');
  const [checkoutEmail, setCheckoutEmail] = useState('');
  const [checkoutPhone, setCheckoutPhone] = useState('');
  const [checkoutAddress, setCheckoutAddress] = useState('');
  const [checkoutCity, setCheckoutCity] = useState('');
  const [checkoutState, setCheckoutState] = useState('');
  const [checkoutPincode, setCheckoutPincode] = useState('');
  const [checkoutPayment, setCheckoutPayment] = useState<'UPI' | 'Card' | 'NetBanking' | 'COD'>('UPI');
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  // Review Form State on PDP
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewFormSuccess, setReviewFormSuccess] = useState(false);

  // --- INITIALIZATION & PERSISTENCE ---
  useEffect(() => {
    // Products
    const storedProducts = localStorage.getItem('aur_products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem('aur_products', JSON.stringify(INITIAL_PRODUCTS));
    }

    // Orders
    const storedOrders = localStorage.getItem('aur_orders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    } else {
      const mockOrders: Order[] = [
        {
          id: 'AUR-82049',
          customerName: 'Anjali Verma',
          customerEmail: 'anjali@example.com',
          customerPhone: '9876543211',
          shippingAddress: {
            addressLine: 'Apt 4B, Signature Towers',
            city: 'Gurugram',
            state: 'Haryana',
            pincode: '122002'
          },
          items: [
            {
              productId: 'p1',
              productName: 'Palmonas 18K Gold Plated Solitaire Pendant',
              price: 1299,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600'
            }
          ],
          discountAmount: 0,
          subtotal: 1299,
          shippingFee: 0,
          total: 1299,
          paymentMethod: 'UPI',
          paymentStatus: 'Paid',
          orderStatus: 'Delivered',
          orderDate: '2026-06-28',
          estimatedDelivery: '2026-07-02'
        }
      ];
      setOrders(mockOrders);
      localStorage.setItem('aur_orders', JSON.stringify(mockOrders));
    }

    // Cart
    const storedCart = localStorage.getItem('aur_cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }

    // Wishlist
    const storedWishlist = localStorage.getItem('aur_wishlist');
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }

    // Login state
    const storedAuth = localStorage.getItem('aur_auth');
    if (storedAuth) {
      setUserEmail(storedAuth);
      setIsLoggedIn(true);
    }
  }, []);

  // Sync state functions
  const saveProductsToDb = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem('aur_products', JSON.stringify(newProducts));
  };

  const saveOrdersToDb = (newOrders: Order[]) => {
    setOrders(newOrders);
    localStorage.setItem('aur_orders', JSON.stringify(newOrders));
  };

  const updateCartState = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('aur_cart', JSON.stringify(newCart));
  };

  const updateWishlistState = (newWishlist: string[]) => {
    setWishlist(newWishlist);
    localStorage.setItem('aur_wishlist', JSON.stringify(newWishlist));
  };

  // --- ACTIONS ---
  const handleAddToCart = (product: Product, size?: string) => {
    const existingIndex = cart.findIndex(
      (item) => item.product.id === product.id && item.selectedSize === size
    );

    let updatedCart = [...cart];
    if (existingIndex >= 0) {
      updatedCart[existingIndex].quantity += 1;
    } else {
      updatedCart.push({ product, quantity: 1, selectedSize: size });
    }

    updateCartState(updatedCart);
    setIsCartOpen(true); // Open drawer instantly for great D2C conversion flow
  };

  const handleUpdateCartQty = (productId: string, delta: number) => {
    const updatedCart = cart
      .map((item) => {
        if (item.product.id === productId) {
          const nextQty = item.quantity + delta;
          return { ...item, quantity: Math.max(1, nextQty) };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);

    updateCartState(updatedCart);
  };

  const handleRemoveFromCart = (productId: string) => {
    const updatedCart = cart.filter((item) => item.product.id !== productId);
    updateCartState(updatedCart);
  };

  const handleToggleWishlist = (productId: string) => {
    let updatedWishlist = [...wishlist];
    if (updatedWishlist.includes(productId)) {
      updatedWishlist = updatedWishlist.filter((id) => id !== productId);
    } else {
      updatedWishlist.push(productId);
    }
    updateWishlistState(updatedWishlist);
  };

  const handleNavigate = (page: string, productId: string | null = null) => {
    setViewState((prev) => ({
      ...prev,
      page,
      selectedProductId: productId
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSelect = (product: Product) => {
    handleNavigate('product', product.id);
  };

  // Login simulation
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userEmail) {
      setIsLoggedIn(true);
      localStorage.setItem('aur_auth', userEmail);
      setShowLoginPrompt(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail('');
    localStorage.removeItem('aur_auth');
  };

  // Place Order Action
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const isFreeShipping = subtotal >= 999;
    const shippingFee = isFreeShipping ? 0 : 99;

    let discountAmount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.discountType === 'percentage') {
        discountAmount = Math.round((subtotal * appliedCoupon.value) / 100);
      } else {
        discountAmount = appliedCoupon.value;
      }
    }

    const total = Math.max(0, subtotal - discountAmount + shippingFee);
    const orderId = `AUR-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder: Order = {
      id: orderId,
      customerName: checkoutName,
      customerEmail: checkoutEmail,
      customerPhone: checkoutPhone,
      shippingAddress: {
        addressLine: checkoutAddress,
        city: checkoutCity,
        state: checkoutState,
        pincode: checkoutPincode
      },
      items: cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.images[0]
      })),
      couponApplied: appliedCoupon?.code,
      discountAmount,
      subtotal,
      shippingFee,
      total,
      paymentMethod: checkoutPayment,
      paymentStatus: checkoutPayment === 'COD' ? 'COD_Confirmed' : 'Paid',
      orderStatus: 'Placed',
      orderDate: new Date().toISOString().split('T')[0],
      estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    // Update Product Stock levels
    const updatedProducts = products.map((prod) => {
      const cartItem = cart.find((c) => c.product.id === prod.id);
      if (cartItem) {
        return {
          ...prod,
          stock: Math.max(0, prod.stock - cartItem.quantity),
          reviewsCount: prod.reviewsCount // Keep review counts
        };
      }
      return prod;
    });

    saveProductsToDb(updatedProducts);

    // Append Order
    const updatedOrders = [newOrder, ...orders];
    saveOrdersToDb(updatedOrders);

    // Reset Checkout Form and Cart
    setPlacedOrder(newOrder);
    setCart([]);
    localStorage.removeItem('aur_cart');
    setAppliedCoupon(null);

    // Reset Form Fields
    setCheckoutName('');
    setCheckoutEmail('');
    setCheckoutPhone('');
    setCheckoutAddress('');
    setCheckoutCity('');
    setCheckoutState('');
    setCheckoutPincode('');
  };

  // PDP Review Placement
  const handleAddReview = (e: React.FormEvent, productId: string) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;

    const newReview: Review = {
      id: `rev_${Date.now()}`,
      productId,
      userName: reviewName,
      rating: reviewRating,
      comment: reviewComment,
      date: new Date().toISOString().split('T')[0],
      verified: true
    };

    const updatedProducts = products.map((prod) => {
      if (prod.id === productId) {
        const currentReviews = prod.reviews || [];
        const nextReviews = [newReview, ...currentReviews];
        const nextAvgRating = Number(
          (nextReviews.reduce((acc, r) => acc + r.rating, 0) / nextReviews.length).toFixed(1)
        );

        return {
          ...prod,
          reviews: nextReviews,
          rating: nextAvgRating,
          reviewsCount: nextReviews.length
        };
      }
      return prod;
    });

    saveProductsToDb(updatedProducts);

    // Reset Review fields
    setReviewName('');
    setReviewComment('');
    setReviewRating(5);
    setReviewFormSuccess(true);

    setTimeout(() => setReviewFormSuccess(false), 3000);
  };

  // Admin Catalog Modification Proxy Handlers
  const handleAdminAddProduct = (p: Product) => {
    saveProductsToDb([p, ...products]);
  };

  const handleAdminUpdateProduct = (updatedP: Product) => {
    const nextList = products.map((p) => (p.id === updatedP.id ? updatedP : p));
    saveProductsToDb(nextList);
  };

  const handleAdminDeleteProduct = (id: string) => {
    const nextList = products.filter((p) => p.id !== id);
    saveProductsToDb(nextList);
  };

  const handleAdminUpdateOrderStatus = (orderId: string, status: Order['orderStatus']) => {
    const nextList = orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          orderStatus: status,
          paymentStatus: status === 'Cancelled' ? o.paymentStatus : (status === 'Delivered' ? 'Paid' as const : o.paymentStatus)
        };
      }
      return o;
    });
    saveOrdersToDb(nextList);
  };

  // --- RENDERING ROUTER PAGES ---

  // Selected product object
  const currentProduct = products.find((p) => p.id === viewState.selectedProductId);

  // Filtered listing products
  const filteredProducts = products.filter((p) => {
    // Category filter
    if (viewState.filters.category && p.category !== viewState.filters.category) return false;
    // Material filter
    if (viewState.filters.material && p.material !== viewState.filters.material) return false;
    // Occasion filter
    if (viewState.filters.occasion && p.occasion !== viewState.filters.occasion) return false;
    // Price filter
    if (p.price > viewState.filters.maxPrice) return false;
    return true;
  });

  // Hero carousel list
  const HERO_SLIDES = [
    {
      title: "Monsoon Sale Live",
      subtitle: "BUY 4 AT â‚¹2999",
      desc: "Refresh your jewelry box with our exclusive monsoon offers. Waterproof, sweat-proof, and tarnish-free styles for every day.",
      image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=1200",
      cta: "Shop The Sale",
      category: "Necklaces"
    },
    {
      title: "THE 999 SALE",
      subtitle: "BIGGEST PRICE DROP",
      desc: "Demifine sale is here. Shop our best-selling rings, earrings, and chains at a flat â‚¹999. Hurry, ends soon!",
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200",
      cta: "Shop Flat â‚¹999",
      category: "Earrings"
    },
    {
      title: "PLAY Collection",
      subtitle: "NEW ARRIVALS",
      desc: "Discover fun, playful, and versatile pieces to stack and layer. Featuring 9KT Fine Gold and 925 Sterling Silver.",
      image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=1200",
      cta: "Explore PLAY",
      category: "Bracelets"
    }
  ];

  return (
    <div className="bg-white min-h-screen flex flex-col" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* 1. Header component */}
      <Header
        wishlistCount={wishlist.length}
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
        products={products}
        currentView={viewState.page}
        onNavigate={handleNavigate}
        onToggleCart={() => setIsCartOpen(!isCartOpen)}
        onSearchSelect={handleSearchSelect}
      />

      {/* 2. Main Content views */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {/* A. HOMEPAGE */}
          {viewState.page === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col"
            >
              {/* â”€â”€ HERO BANNER â”€â”€ */}
              <div className="relative w-full overflow-hidden bg-gray-900" style={{ height: 'clamp(340px, 56vw, 600px)' }}>
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-700"
                  style={{ backgroundImage: `url(${HERO_SLIDES[heroIndex].image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex items-center px-8 md:px-16 lg:px-24">
                  <div className="max-w-lg text-white flex flex-col gap-4">
                    <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/60">
                      {HERO_SLIDES[heroIndex].subtitle}
                    </span>
                    <h1 className="font-serif font-bold text-white leading-tight" style={{ fontSize: 'clamp(28px, 5vw, 54px)' }}>
                      {HERO_SLIDES[heroIndex].title}
                    </h1>
                    <p className="text-sm text-white/75 leading-relaxed max-w-sm">
                      {HERO_SLIDES[heroIndex].desc}
                    </p>
                    <div className="mt-2">
                      <button
                        id="hero-cta-btn"
                        onClick={() => {
                          setViewState(prev => ({
                            ...prev, page: 'shop',
                            filters: { ...prev.filters, category: HERO_SLIDES[heroIndex].category }
                          }));
                        }}
                        className="btn-black"
                      >
                        {HERO_SLIDES[heroIndex].cta}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {HERO_SLIDES.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setHeroIndex(idx)}
                      aria-label={`Slide ${idx + 1}`}
                      style={{
                        width: heroIndex === idx ? '24px' : '8px',
                        height: '8px',
                        borderRadius: '4px',
                        background: heroIndex === idx ? '#fff' : 'rgba(255,255,255,0.4)',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* â”€â”€ CATEGORY CIRCLES â”€â”€ */}
              <div className="w-full bg-white py-10 px-4 md:px-8 border-b border-gray-100">
                <div className="max-w-6xl mx-auto">
                  <div className="flex gap-6 overflow-x-auto pb-2 justify-start md:justify-center" style={{ scrollbarWidth: 'none' }}>
                    {[
                      { name: 'Earrings', img: 'https://images.unsplash.com/photo-1635767790038-33d964f2293b?q=80&w=300' },
                      { name: 'Necklaces', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=300' },
                      { name: 'Bracelets', img: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=300' },
                      { name: 'Rings', img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=300' },
                      { name: 'Mangalsutras', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=300' },
                      { name: 'Mens', img: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=300' },
                    ].map((cat, idx) => (
                      <div
                        key={idx}
                        onClick={() => setViewState(prev => ({ ...prev, page: 'shop', filters: { ...prev.filters, category: cat.name } }))}
                        className="flex flex-col items-center gap-2 cursor-pointer group shrink-0"
                      >
                        <div
                          style={{
                            width: '100px', height: '100px', borderRadius: '50%',
                            overflow: 'hidden', border: '2px solid #E5E5E5',
                            transition: 'border-color 0.2s'
                          }}
                          className="group-hover:border-black"
                        >
                          <img
                            src={cat.img}
                            alt={cat.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <span className="text-[11px] font-semibold text-black group-hover:opacity-50 transition-opacity text-center uppercase tracking-wide">
                          {cat.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* â”€â”€ BEST SELLERS â”€â”€ */}
              <div className="w-full py-10 px-4 md:px-8 border-b border-gray-100">
                <div className="max-w-6xl mx-auto flex flex-col gap-5">
                  <div className="flex items-end justify-between pb-3 border-b border-gray-100">
                    <h2 className="section-heading">Best Sellers</h2>
                    <button onClick={() => handleNavigate('shop')} className="text-[11px] font-semibold uppercase tracking-wider text-black hover:opacity-50 transition-opacity underline underline-offset-4">
                      View all
                    </button>
                  </div>
                  <div className="pal-scroll-track">
                    {products.filter(p => p.isBestSeller).map((p) => (
                      <div key={p.id} style={{ minWidth: '210px', maxWidth: '230px' }} className="shrink-0">
                        <ProductCard
                          product={p}
                          onViewDetails={(id) => handleNavigate('product', id)}
                          onToggleWishlist={handleToggleWishlist}
                          isWishlisted={wishlist.includes(p.id)}
                          onAddToCart={(p) => handleAddToCart(p)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* â”€â”€ NECKLACES â”€â”€ */}
              <div className="w-full py-10 px-4 md:px-8 border-b border-gray-100">
                <div className="max-w-6xl mx-auto flex flex-col gap-5">
                  <div className="flex items-end justify-between pb-3 border-b border-gray-100">
                    <h2 className="section-heading">Necklaces</h2>
                    <button onClick={() => handleNavigate('shop')} className="text-[11px] font-semibold uppercase tracking-wider text-black hover:opacity-50 transition-opacity underline underline-offset-4">View all</button>
                  </div>
                  <div className="pal-scroll-track">
                    {products.filter(p => p.category === 'Necklaces').concat(products.slice(0,3)).map((p, i) => (
                      <div key={`${p.id}-${i}`} style={{ minWidth: '210px', maxWidth: '230px' }} className="shrink-0">
                        <ProductCard product={p} onViewDetails={(id) => handleNavigate('product', id)} onToggleWishlist={handleToggleWishlist} isWishlisted={wishlist.includes(p.id)} onAddToCart={(p) => handleAddToCart(p)} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* â”€â”€ GIFT BANNER â”€â”€ */}
              <div className="w-full py-10 px-4 md:px-8 border-b border-gray-100">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: 'Gifts For Her', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=700', bg: '#F5F0EB' },
                    { title: 'Gifts For Him', img: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=700', bg: '#EBEBEB' },
                  ].map((item, i) => (
                    <div key={i} onClick={() => handleNavigate('shop')} className="relative cursor-pointer overflow-hidden group" style={{ height: '280px', background: item.bg }}>
                      <img
                        src={item.img}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-black">Shop by Recipient</p>
                        <h3 className="font-serif font-bold text-black text-3xl">{item.title}</h3>
                        <button className="btn-outline text-[10px] mt-1">Shop Now</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* â”€â”€ BRACELETS â”€â”€ */}
              <div className="w-full py-10 px-4 md:px-8 border-b border-gray-100">
                <div className="max-w-6xl mx-auto flex flex-col gap-5">
                  <div className="flex items-end justify-between pb-3 border-b border-gray-100">
                    <h2 className="section-heading">Bracelets</h2>
                    <button onClick={() => handleNavigate('shop')} className="text-[11px] font-semibold uppercase tracking-wider text-black hover:opacity-50 transition-opacity underline underline-offset-4">View all</button>
                  </div>
                  <div className="pal-scroll-track">
                    {products.filter(p => p.category === 'Bracelets').concat(products.slice(0,4)).map((p, i) => (
                      <div key={`${p.id}-b-${i}`} style={{ minWidth: '210px', maxWidth: '230px' }} className="shrink-0">
                        <ProductCard product={p} onViewDetails={(id) => handleNavigate('product', id)} onToggleWishlist={handleToggleWishlist} isWishlisted={wishlist.includes(p.id)} onAddToCart={(p) => handleAddToCart(p)} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* â”€â”€ EARRINGS â”€â”€ */}
              <div className="w-full py-10 px-4 md:px-8 border-b border-gray-100">
                <div className="max-w-6xl mx-auto flex flex-col gap-5">
                  <div className="flex items-end justify-between pb-3 border-b border-gray-100">
                    <h2 className="section-heading">Earrings</h2>
                    <button onClick={() => handleNavigate('shop')} className="text-[11px] font-semibold uppercase tracking-wider text-black hover:opacity-50 transition-opacity underline underline-offset-4">View all</button>
                  </div>
                  <div className="pal-scroll-track">
                    {products.filter(p => p.category === 'Earrings').concat(products.slice(0,4)).map((p, i) => (
                      <div key={`${p.id}-e-${i}`} style={{ minWidth: '210px', maxWidth: '230px' }} className="shrink-0">
                        <ProductCard product={p} onViewDetails={(id) => handleNavigate('product', id)} onToggleWishlist={handleToggleWishlist} isWishlisted={wishlist.includes(p.id)} onAddToCart={(p) => handleAddToCart(p)} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* â”€â”€ SHRADDHA / BRAND STORY â”€â”€ */}
              <div className="w-full py-14 px-4 md:px-8 bg-gray-50 border-b border-gray-100">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div className="relative overflow-hidden" style={{ aspectRatio: '4/5' }}>
                    <img
                      src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=600"
                      alt="Because You Deserve to Shine"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-5">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">The Palmonas Story</p>
                      <h2 className="font-serif font-bold text-black leading-tight" style={{ fontSize: '36px' }}>
                        Because You Deserve To Shine
                      </h2>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      At Palmonas, we create jewellery that's made to be worn â€” every day and on the days that matter most. It's premium in quality, thoughtful in design, and priced so it feels right.
                    </p>
                    <blockquote className="border-l-2 border-black pl-5">
                      <p className="font-serif italic text-sm text-gray-700 leading-relaxed">
                        "A lot of us find real gold too expensive â€” and we don't want our jewellery locked away. At the same time, imitation jewellery fades, breaks, and doesn't last. So at Palmonas, we're building something in the middle â€” a new category called DemifineÂ®."
                      </p>
                      <footer className="text-[10px] font-bold uppercase tracking-widest text-black mt-3">â€” Shraddha Kapoor</footer>
                    </blockquote>
                    <div>
                      <button onClick={() => handleNavigate('about')} className="btn-black">
                        Trace The Journey
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* â”€â”€ TRUST BADGES â”€â”€ */}
              <div className="w-full py-10 px-4 md:px-8 bg-white border-b border-gray-100">
                <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  {[
                    { icon: 'ðŸ§´', title: 'Skin Safe', desc: 'Hypoallergenic, no nickel or brass' },
                    { icon: 'âœ¨', title: '18K Gold Vermeil', desc: 'Premium metals, lasting shine' },
                    { icon: 'ðŸ’Ž', title: 'SGL Certified Diamonds', desc: 'Authentic lab-grown diamonds' },
                    { icon: 'ðŸšš', title: 'Ships in 24 Hours', desc: 'Free insured shipping above â‚¹999' },
                  ].map((b, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 py-4">
                      <span className="text-3xl">{b.icon}</span>
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-black">{b.title}</h4>
                      <p className="text-[10px] text-gray-400 leading-relaxed">{b.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* â”€â”€ REVIEWS â”€â”€ */}
              <div className="w-full py-12 px-4 md:px-8 bg-gray-50 border-b border-gray-100">
                <div className="max-w-6xl mx-auto flex flex-col gap-8">
                  <div className="text-center">
                    <h2 className="section-heading">Trusted by our community</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {[
                      { name: 'Amila M.', review: "They are soooo pretty. I always wished to have such earrings in real gold, but gold is sooo expensive now. So i am glad i stumbled into Palmonas. Thank you and keep up the awesome work.", product: 'Golden Heart Love Hoops' },
                      { name: 'Deepali B.', review: "Its the exact product shown in the image. Great for styling in different occasion and everyday use too.", product: 'Chevron Ring' },
                      { name: 'Meenakshi', review: "Super quality I love the product very much â¤ï¸", product: 'Sarvani Mangalsutra Bracelet' },
                    ].map((rev, i) => (
                      <div key={i} className="bg-white p-6 border border-gray-100">
                        <div className="flex gap-0.5 mb-3">
                          {[1,2,3,4,5].map(s => (
                            <Star key={s} className="w-3 h-3" style={{ fill: '#000', color: '#000' }} />
                          ))}
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed italic">"{rev.review}"</p>
                        <div className="mt-4 pt-3 border-t border-gray-100">
                          <p className="text-[11px] font-bold text-black">{rev.name}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">on {rev.product}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-center">
                    <button onClick={() => handleNavigate('shop')} className="btn-outline">View All Reviews</button>
                  </div>
                </div>
              </div>

              {/* â”€â”€ BLOG â”€â”€ */}
              <div className="w-full py-12 px-4 md:px-8 bg-white">
                <div className="max-w-6xl mx-auto flex flex-col gap-7">
                  <div className="flex items-end justify-between border-b border-gray-100 pb-4">
                    <h2 className="section-heading">From The Journal</h2>
                    <button onClick={() => handleNavigate('about')} className="text-[11px] font-semibold uppercase tracking-wider text-black hover:opacity-50 transition-opacity underline underline-offset-4">View all</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { title: 'Lab-Grown Diamonds: Styling & Care for the Modern Indian Woman', tag: 'Diamonds', img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=400' },
                      { title: 'Jewellery Stacking & Layering: The Ultimate Guide', tag: 'Styling', img: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=400' },
                      { title: 'The Perfect Necklace for Every Neckline', tag: 'Necklaces', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=400' },
                    ].map((post, i) => (
                      <div key={i} className="flex flex-col gap-3 cursor-pointer group">
                        <div className="overflow-hidden" style={{ aspectRatio: '4/3' }}>
                          <img src={post.img} alt={post.title} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{post.tag}</p>
                        <h3 className="text-sm font-semibold text-black leading-snug group-hover:opacity-60 transition-opacity">{post.title}</h3>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </motion.div>
          )}


          {/* B. CATEGORY LISTING / SHOP COLLECTION */}
          {viewState.page === 'shop' && (
            <motion.div
              key="shop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col gap-6"
            >
              {/* Breadcrumbs */}
              <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                <button onClick={() => handleNavigate('home')} className="hover:text-amber-800">Home</button>
                <ChevronRight className="w-3 h-3" />
                <span className="text-slate-800">Shop Collection</span>
              </div>

              {/* Banner */}
              <div className="bg-amber-950/10 border border-amber-900/10 rounded-2xl p-6 md:p-10 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex flex-col gap-2">
                  <h1 className="text-xl md:text-2xl font-serif font-bold text-amber-950">
                    {viewState.filters.category ? `${viewState.filters.category} Collection` : 'All Fine Jewelry'}
                  </h1>
                  <p className="text-xs text-slate-500 max-w-xl">
                    Browse our handcrafted, 100% waterproof and tarnish-free gold-plated and certified sterling silver pieces. Pair together to craft your signature stack.
                  </p>
                </div>
                {viewState.filters.category && (
                  <button
                    onClick={() => setViewState(prev => ({ ...prev, filters: { ...prev.filters, category: undefined } }))}
                    className="bg-white border border-slate-200 text-xs px-4 py-2 rounded-lg font-semibold text-slate-600 hover:border-amber-700"
                  >
                    Clear Category Filter
                  </button>
                )}
              </div>

              {/* Grid content */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Side filters panel */}
                <div className="bg-white border border-slate-100 rounded-2xl p-5 flex flex-col gap-6 h-fit">
                  <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Filters</h3>
                    <button
                      onClick={() => setViewState(prev => ({ ...prev, filters: { maxPrice: 5000 } }))}
                      className="text-[10px] text-amber-800 hover:underline font-semibold"
                    >
                      Reset All
                    </button>
                  </div>

                  {/* Filter by Category */}
                  <div className="flex flex-col gap-2.5">
                    <h4 className="text-xs font-semibold text-slate-700">Categories</h4>
                    <div className="flex flex-col gap-1.5 text-xs text-slate-500">
                      {['Necklaces', 'Earrings', 'Rings', 'Bracelets', 'Anklets', 'Mangalsutras', 'Bridal Sets'].map((c) => (
                        <label key={c} className="flex items-center gap-2 cursor-pointer hover:text-amber-950">
                          <input
                            type="checkbox"
                            checked={viewState.filters.category === c}
                            onChange={() => {
                              setViewState(prev => ({
                                ...prev,
                                filters: { ...prev.filters, category: prev.filters.category === c ? undefined : c }
                              }));
                            }}
                            className="rounded border-slate-200 text-amber-700 focus:ring-amber-500"
                          />
                          <span>{c}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Filter by Material */}
                  <div className="flex flex-col gap-2.5">
                    <h4 className="text-xs font-semibold text-slate-700">Materials</h4>
                    <div className="flex flex-col gap-1.5 text-xs text-slate-500">
                      {['18K Gold Plated', '925 Sterling Silver', 'Premium Kundan', 'Rose Gold Finish', 'Polki Fashion'].map((m) => (
                        <label key={m} className="flex items-center gap-2 cursor-pointer hover:text-amber-950">
                          <input
                            type="checkbox"
                            checked={viewState.filters.material === m}
                            onChange={() => {
                              setViewState(prev => ({
                                ...prev,
                                filters: { ...prev.filters, material: prev.filters.material === m ? undefined : m }
                              }));
                            }}
                            className="rounded border-slate-200 text-amber-700 focus:ring-amber-500"
                          />
                          <span>{m}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Filter by Occasion */}
                  <div className="flex flex-col gap-2.5">
                    <h4 className="text-xs font-semibold text-slate-700">Occasions</h4>
                    <div className="flex flex-col gap-1.5 text-xs text-slate-500">
                      {['Wedding', 'Daily Wear', 'Festive', 'Office Wear', 'Party'].map((o) => (
                        <label key={o} className="flex items-center gap-2 cursor-pointer hover:text-amber-950">
                          <input
                            type="checkbox"
                            checked={viewState.filters.occasion === o}
                            onChange={() => {
                              setViewState(prev => ({
                                ...prev,
                                filters: { ...prev.filters, occasion: prev.filters.occasion === o ? undefined : o }
                              }));
                            }}
                            className="rounded border-slate-200 text-amber-700 focus:ring-amber-500"
                          />
                          <span>{o}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Filter by Price */}
                  <div className="flex flex-col gap-2.5 border-t border-slate-100 pt-4">
                    <h4 className="text-xs font-semibold text-slate-700">Max Price (â‚¹{viewState.filters.maxPrice.toLocaleString()})</h4>
                    <input
                      type="range"
                      min={500}
                      max={5000}
                      step={100}
                      value={viewState.filters.maxPrice}
                      onChange={(e) => {
                        const price = Number(e.target.value);
                        setViewState(prev => ({
                          ...prev,
                          filters: { ...prev.filters, maxPrice: price }
                        }));
                      }}
                      className="w-full accent-amber-800"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>â‚¹500</span>
                      <span>â‚¹5,000+</span>
                    </div>
                  </div>
                </div>

                {/* Listing grid */}
                <div className="lg:col-span-3 flex flex-col gap-6">
                  {/* Results counts */}
                  <div className="flex justify-between items-center text-xs text-slate-500 bg-white border border-slate-100 p-3 rounded-xl">
                    <span>Showing <span className="font-bold text-slate-800">{filteredProducts.length}</span> luxury jewelry pieces</span>
                    {filteredProducts.length === 0 && (
                      <span className="text-rose-500">No products match selected filters.</span>
                    )}
                  </div>

                  {/* Cards grid */}
                  {filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center py-20 bg-white border border-slate-100 rounded-2xl p-8">
                      <HelpCircle className="w-12 h-12 text-slate-300 mb-2" />
                      <h3 className="text-sm font-semibold text-slate-700">No matching items found</h3>
                      <p className="text-xs text-slate-400 mt-1">Please try modifying your filters or price selectors.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredProducts.map((p) => (
                        <ProductCard
                          key={p.id}
                          product={p}
                          onViewDetails={(id) => handleNavigate('product', id)}
                          onToggleWishlist={handleToggleWishlist}
                          isWishlisted={wishlist.includes(p.id)}
                          onAddToCart={(p) => handleAddToCart(p)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* C. PRODUCT DETAIL PAGE (PDP) */}
          {viewState.page === 'product' && currentProduct && (
            <motion.div
              key="product"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col gap-8"
            >
              {/* Back Breadcrumb */}
              <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                <button onClick={() => handleNavigate('shop')} className="hover:text-amber-800">Shop Collection</button>
                <ChevronRight className="w-3 h-3" />
                <span className="text-slate-800 truncate max-w-[150px]">{currentProduct.name}</span>
              </div>

              {/* PDP Detail Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white border border-slate-100 p-5 md:p-8 rounded-3xl shadow-xs">
                {/* Left: Image Gallery */}
                <div className="flex flex-col gap-4">
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
                    <img
                      src={currentProduct.images[0]}
                      alt={currentProduct.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    {currentProduct.discount > 0 && (
                      <span className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        {currentProduct.discount}% OFF
                      </span>
                    )}
                  </div>

                  {/* Thumbnail Row */}
                  <div className="flex gap-3">
                    {currentProduct.images.map((img, idx) => (
                      <div
                        key={idx}
                        className="w-20 h-20 rounded-xl overflow-hidden border-2 border-amber-800 bg-slate-50 cursor-pointer shrink-0"
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Info and CTA */}
                <div className="flex flex-col gap-5 justify-between">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded">
                        {currentProduct.category}
                      </span>
                      <span className="bg-slate-100 text-slate-600 text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded">
                        {currentProduct.material}
                      </span>
                    </div>

                    <h1 className="text-xl md:text-3xl font-serif font-bold text-slate-900 leading-tight">
                      {currentProduct.name}
                    </h1>

                    {/* Ratings */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center text-amber-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-xs font-bold ml-1 text-slate-700">{currentProduct.rating}</span>
                      </div>
                      <span className="text-xs text-slate-400">â€¢</span>
                      <button className="text-xs text-amber-800 hover:underline font-semibold">
                        {currentProduct.reviewsCount} Client Reviews
                      </button>
                    </div>

                    {/* Pricing */}
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl font-bold text-slate-900">â‚¹{currentProduct.price.toLocaleString()}</span>
                      {currentProduct.mrp > currentProduct.price && (
                        <span className="text-sm text-slate-400 line-through">â‚¹{currentProduct.mrp.toLocaleString()}</span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed mt-2">
                      {currentProduct.description}
                    </p>

                    {/* Specifications specs */}
                    <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 mt-2 text-xs">
                      <div>
                        <span className="text-slate-400 font-mono block">Base Metal</span>
                        <span className="font-semibold text-slate-800">{currentProduct.specifications.BaseMetal || 'Brass'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-mono block">Weight</span>
                        <span className="font-semibold text-slate-800">{currentProduct.specifications.Weight || '3.5 grams'}</span>
                      </div>
                      {currentProduct.specifications.Length && (
                        <div>
                          <span className="text-slate-400 font-mono block">Length / Size</span>
                          <span className="font-semibold text-slate-800">{currentProduct.specifications.Length}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-slate-400 font-mono block">Warranty</span>
                        <span className="font-semibold text-slate-800">{currentProduct.specifications.Warranty || 'Lifetime Warranty'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3 mt-6 border-t border-slate-100 pt-6">
                    <div className="flex gap-4">
                      {/* ATC Button */}
                      <button
                        id="pdp-add-to-cart"
                        onClick={() => handleAddToCart(currentProduct)}
                        className="flex-1 bg-amber-800 hover:bg-amber-950 text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" /> Add to Shopping Bag
                      </button>

                      {/* Wishlist Button */}
                      <button
                        id="pdp-toggle-wishlist"
                        onClick={() => handleToggleWishlist(currentProduct.id)}
                        className={`p-3 border rounded-xl transition-all ${
                          wishlist.includes(currentProduct.id)
                            ? 'border-rose-200 text-rose-500 bg-rose-50'
                            : 'border-slate-200 text-slate-400 hover:text-slate-700'
                        }`}
                        title="Add to wishlist"
                      >
                        <Heart className="w-5 h-5 fill-current" />
                      </button>
                    </div>

                    <button
                      id="pdp-buy-now"
                      onClick={() => {
                        // Quick buy flow
                        handleAddToCart(currentProduct);
                        handleNavigate('checkout');
                      }}
                      className="w-full bg-slate-900 hover:bg-black text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-sm"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>

              {/* Reviews & Form section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
                {/* Write review form */}
                <div className="bg-white border border-slate-100 p-5 rounded-2xl h-fit">
                  <h3 className="font-serif font-bold text-slate-900 mb-4 text-sm">Write an Honest Review</h3>
                  <form onSubmit={(e) => handleAddReview(e, currentProduct.id)} className="flex flex-col gap-3.5">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Your Name</label>
                      <input
                        id="review-name"
                        type="text"
                        required
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        placeholder="e.g. Shalini Patel"
                        className="border border-slate-200 rounded-lg p-2 text-xs outline-none focus:border-amber-700 bg-slate-50/55"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Rating Star</label>
                      <select
                        id="review-rating"
                        value={reviewRating}
                        onChange={(e) => setReviewRating(Number(e.target.value))}
                        className="border border-slate-200 rounded-lg p-2 text-xs outline-none focus:border-amber-700 bg-slate-50/55"
                      >
                        <option value={5}>â­â­â­â­â­ (5 Stars)</option>
                        <option value={4}>â­â­â­â­ (4 Stars)</option>
                        <option value={3}>â­â­â­ (3 Stars)</option>
                        <option value={2}>â­â­ (2 Stars)</option>
                        <option value={1}>â­ (1 Star)</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Your Experience</label>
                      <textarea
                        id="review-comment"
                        required
                        rows={3}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Share your thoughts on the plating, shine, and fit..."
                        className="border border-slate-200 rounded-lg p-2 text-xs outline-none focus:border-amber-700 resize-none bg-slate-50/55"
                      />
                    </div>

                    <button
                      id="submit-review-btn"
                      type="submit"
                      className="bg-slate-800 hover:bg-slate-950 text-white font-semibold text-xs py-2.5 rounded-lg transition-colors shadow-xs"
                    >
                      Post My Review
                    </button>

                    {reviewFormSuccess && (
                      <span className="text-[11px] text-emerald-600 font-medium text-center block bg-emerald-50 py-1.5 rounded-lg">
                        âœ“ Review posted. Thank you!
                      </span>
                    )}
                  </form>
                </div>

                {/* Reviews List */}
                <div className="lg:col-span-2 bg-white border border-slate-100 p-5 rounded-2xl flex flex-col gap-4">
                  <h3 className="font-serif font-bold text-slate-900 border-b border-slate-50 pb-2.5 text-sm">Client Testimonials ({currentProduct.reviewsCount})</h3>

                  <div className="flex flex-col gap-4 divide-y divide-slate-50 overflow-y-auto max-h-96">
                    {(!currentProduct.reviews || currentProduct.reviews.length === 0) ? (
                      <div className="py-10 text-center text-slate-400 text-xs">
                        No reviews yet for this design. Be the first to leave a review!
                      </div>
                    ) : (
                      currentProduct.reviews.map((rev) => (
                        <div key={rev.id} className="pt-4 first:pt-0 flex flex-col gap-1">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-800">{rev.userName}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{rev.date}</span>
                          </div>
                          <div className="flex items-center text-amber-500 my-0.5">
                            {Array.from({ length: rev.rating }).map((_, idx) => (
                              <Star key={idx} className="w-3 h-3 fill-current" />
                            ))}
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed font-sans">{rev.comment}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* D. CHECKOUT FLOW */}
          {viewState.page === 'checkout' && (
            <motion.div
              key="checkout"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col gap-6"
            >
              <h1 className="text-2xl font-serif font-bold text-slate-900 border-b border-amber-50 pb-3">Complete Your Purchase</h1>

              {placedOrder ? (
                /* Success Page */
                <div className="bg-white border border-emerald-100 p-6 md:p-12 rounded-3xl text-center flex flex-col items-center gap-5 max-w-xl mx-auto shadow-sm">
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 border border-emerald-100">
                    <Check className="w-8 h-8 stroke-[3]" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-serif font-bold text-slate-900">Your Order is Confirmed!</h2>
                  <p className="text-xs text-slate-500 max-w-md leading-relaxed">
                    Thank you for shopping with Palmonas, <span className="font-bold text-slate-800">{placedOrder.customerName}</span>. Your luxury parcel is being packed by our concierge under strict sanitary guidelines.
                  </p>

                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-left w-full text-xs font-mono flex flex-col gap-2.5">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Order Reference</span>
                      <span className="font-bold text-slate-800">{placedOrder.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Recipient Email</span>
                      <span>{placedOrder.customerEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Paid</span>
                      <span className="font-bold text-slate-900">â‚¹{placedOrder.total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Estimated Delivery</span>
                      <span className="font-bold text-emerald-700">{placedOrder.estimatedDelivery}</span>
                    </div>
                  </div>

                  <div className="flex gap-4 w-full mt-4">
                    <button
                      onClick={() => {
                        setPlacedOrder(null);
                        handleNavigate('home');
                      }}
                      className="flex-1 bg-slate-900 hover:bg-black text-white font-semibold text-xs py-3 rounded-xl transition-all"
                    >
                      Return to Store
                    </button>
                    <button
                      onClick={() => {
                        setPlacedOrder(null);
                        handleNavigate('account');
                      }}
                      className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs py-3 rounded-xl transition-all"
                    >
                      Track Shipment
                    </button>
                  </div>
                </div>
              ) : (
                /* Checkout Form */
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Forms */}
                  <div className="lg:col-span-2 bg-white border border-slate-100 p-5 md:p-8 rounded-3xl shadow-xs">
                    <form onSubmit={handlePlaceOrder} className="flex flex-col gap-6">
                      {/* Shipping detail */}
                      <div className="flex flex-col gap-4">
                        <h3 className="text-sm font-bold font-serif text-slate-800 border-b border-slate-50 pb-2">1. Shipping Address & Contact</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Full Name</label>
                            <input
                              id="checkout-name"
                              type="text"
                              required
                              value={checkoutName}
                              onChange={(e) => setCheckoutName(e.target.value)}
                              placeholder="e.g. Shalini Patel"
                              className="border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-amber-700 bg-slate-50/40"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Mobile Number (WhatsApp tracking)</label>
                            <input
                              id="checkout-phone"
                              type="tel"
                              required
                              value={checkoutPhone}
                              onChange={(e) => setCheckoutPhone(e.target.value)}
                              placeholder="e.g. 9876543210"
                              className="border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-amber-700 bg-slate-50/40"
                            />
                          </div>
                          <div className="flex flex-col gap-1 md:col-span-2">
                            <label className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Email (Order receipt)</label>
                            <input
                              id="checkout-email"
                              type="email"
                              required
                              value={checkoutEmail}
                              onChange={(e) => setCheckoutEmail(e.target.value)}
                              placeholder="e.g. shalini@example.com"
                              className="border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-amber-700 bg-slate-50/40"
                            />
                          </div>
                          <div className="flex flex-col gap-1 md:col-span-2">
                            <label className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Flat / Villa / Street Address</label>
                            <input
                              id="checkout-address"
                              type="text"
                              required
                              value={checkoutAddress}
                              onChange={(e) => setCheckoutAddress(e.target.value)}
                              placeholder="e.g. 4B, Silver Towers, Sector 43"
                              className="border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-amber-700 bg-slate-50/40"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-mono text-slate-400 uppercase font-semibold">City</label>
                            <input
                              id="checkout-city"
                              type="text"
                              required
                              value={checkoutCity}
                              onChange={(e) => setCheckoutCity(e.target.value)}
                              placeholder="Gurugram"
                              className="border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-amber-700 bg-slate-50/40"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-mono text-slate-400 uppercase font-semibold">State</label>
                            <input
                              id="checkout-state"
                              type="text"
                              required
                              value={checkoutState}
                              onChange={(e) => setCheckoutState(e.target.value)}
                              placeholder="Haryana"
                              className="border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-amber-700 bg-slate-50/40"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Pincode</label>
                            <input
                              id="checkout-pincode"
                              type="text"
                              required
                              value={checkoutPincode}
                              onChange={(e) => setCheckoutPincode(e.target.value)}
                              placeholder="122002"
                              className="border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-amber-700 bg-slate-50/40"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Payment detail selection */}
                      <div className="flex flex-col gap-4 border-t border-slate-100 pt-5">
                        <h3 className="text-sm font-bold font-serif text-slate-800 border-b border-slate-50 pb-2">2. Payment Option</h3>
                        <div className="grid grid-cols-2 gap-3.5 text-xs">
                          {[
                            { value: 'UPI', label: 'UPI / GooglePay (Instant 5% discount)', icon: 'ðŸ“±' },
                            { value: 'Card', label: 'Credit / Debit Card', icon: 'ðŸ’³' },
                            { value: 'NetBanking', label: 'NetBanking', icon: 'ðŸ¦' },
                            { value: 'COD', label: 'Cash on Delivery (COD)', icon: 'ðŸ’µ' }
                          ].map((pay) => (
                            <label
                              key={pay.value}
                              className={`p-4 border rounded-xl flex items-center gap-3 cursor-pointer hover:border-amber-700 transition-all ${
                                checkoutPayment === pay.value ? 'border-amber-800 bg-amber-50/20 text-amber-950 font-bold' : 'border-slate-200'
                              }`}
                            >
                              <input
                                type="radio"
                                name="paymentMethod"
                                value={pay.value}
                                checked={checkoutPayment === pay.value}
                                onChange={() => setCheckoutPayment(pay.value as any)}
                                className="text-amber-800 focus:ring-amber-500 border-slate-200"
                              />
                              <div className="flex items-center gap-2">
                                <span>{pay.icon}</span>
                                <span>{pay.label}</span>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      <button
                        id="submit-order-btn"
                        type="submit"
                        disabled={cart.length === 0}
                        className="bg-amber-900 hover:bg-amber-950 disabled:bg-slate-300 text-white font-bold text-xs py-4 rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all mt-4"
                      >
                        Place Insured Order (â‚¹{
                          Math.max(
                            0,
                            cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0) +
                            (cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0) >= 999 ? 0 : 99)
                          ).toLocaleString()
                        }) <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  </div>

                  {/* Sidebar summary */}
                  <div className="bg-white border border-slate-100 p-5 rounded-3xl h-fit flex flex-col gap-4">
                    <h3 className="font-serif font-bold text-slate-900 border-b border-slate-50 pb-2.5 text-sm">Order Summary</h3>

                    <div className="flex flex-col gap-3">
                      {cart.map((item) => (
                        <div key={item.product.id} className="flex gap-2.5 items-center">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 object-cover bg-slate-50 rounded-lg border"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-[11px] font-medium text-slate-800 truncate leading-snug">{item.product.name}</h4>
                            <span className="text-[10px] text-slate-400 font-mono">Qty: {item.quantity}</span>
                          </div>
                          <span className="text-xs font-semibold text-slate-800 font-mono">â‚¹{(item.product.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-slate-100 pt-3 flex flex-col gap-2 text-xs">
                      <div className="flex justify-between text-slate-400">
                        <span>Bag Subtotal</span>
                        <span>â‚¹{cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Shipping Cost</span>
                        {cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0) >= 999 ? (
                          <span className="text-emerald-600 font-semibold">FREE</span>
                        ) : (
                          <span>â‚¹99</span>
                        )}
                      </div>
                      <div className="flex justify-between text-slate-800 font-bold border-t border-slate-100 pt-2.5">
                        <span>Grand Total</span>
                        <span>â‚¹{
                          Math.max(
                            0,
                            cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0) +
                            (cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0) >= 999 ? 0 : 99)
                          ).toLocaleString()
                        }</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* E. ACCOUNT AREA */}
          {viewState.page === 'account' && (
            <motion.div
              key="account"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col gap-8 min-h-screen"
            >
              {!isLoggedIn ? (
                /* Login Portal */
                <div className="bg-white border border-slate-100 p-6 md:p-10 rounded-3xl text-center max-w-md mx-auto shadow-sm flex flex-col gap-5">
                  <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-800 mx-auto">
                    <Sparkles className="w-6 h-6 fill-amber-100" />
                  </div>
                  <div>
                    <h2 className="text-lg font-serif font-bold text-slate-900">Palmonas Member Portal</h2>
                    <p className="text-xs text-slate-400 mt-1">Access your saved wishlist, trace deliveries, and manage address registries.</p>
                  </div>

                  <form onSubmit={handleLoginSubmit} className="flex flex-col gap-3.5">
                    <div className="flex flex-col gap-1 text-left">
                      <label className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Email address</label>
                      <input
                        id="login-email-input"
                        type="email"
                        required
                        placeholder="e.g. shalini@example.com"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        className="border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-amber-700 bg-slate-50/40"
                      />
                    </div>
                    <button
                      id="login-portal-submit-btn"
                      type="submit"
                      className="bg-amber-800 hover:bg-amber-950 text-white font-semibold text-xs py-3 rounded-lg transition-colors shadow-xs"
                    >
                      Authenticate Access
                    </button>
                  </form>
                </div>
              ) : (
                /* Account Dashboard */
                <div className="flex flex-col gap-8">
                  {/* Banner */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-5 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <span className="text-[10px] font-mono tracking-widest text-amber-700 font-semibold uppercase">Client Account</span>
                      <h2 className="text-xl font-serif font-bold text-slate-800 mt-0.5">Welcome Back, {userEmail}</h2>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="text-xs font-semibold text-rose-500 hover:underline border border-rose-100 hover:bg-rose-50 px-3 py-1.5 rounded-lg"
                    >
                      Sign Out
                    </button>
                  </div>

                  {/* Grid of details */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Orders tracker */}
                    <div className="lg:col-span-2 bg-white border border-slate-100 p-5 rounded-2xl flex flex-col gap-4">
                      <h3 className="text-sm font-bold font-serif text-slate-800 border-b border-slate-50 pb-2.5">Your Orders History</h3>

                      <div className="flex flex-col gap-4 divide-y divide-slate-50 max-h-96 overflow-y-auto">
                        {orders.length === 0 ? (
                          <div className="py-10 text-center text-slate-400 text-xs">
                            No orders placed yet.
                          </div>
                        ) : (
                          orders.map((o) => (
                            <div key={o.id} className="pt-4 first:pt-0 flex flex-col gap-3">
                              <div className="flex justify-between items-center text-xs">
                                <div>
                                  <span className="font-mono font-bold text-slate-800">{o.id}</span>
                                  <span className="text-slate-400 font-mono ml-2">Placed: {o.orderDate}</span>
                                </div>
                                <span className="font-semibold text-slate-800">â‚¹{o.total.toLocaleString()}</span>
                              </div>

                              <div className="flex flex-col gap-1">
                                {o.items.map((item, idx) => (
                                  <span key={idx} className="text-xs text-slate-600 font-medium">
                                    {item.quantity}x {item.productName}
                                  </span>
                                ))}
                              </div>

                              {/* Progress pipeline tracker */}
                              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] flex justify-between items-center">
                                <div className="flex gap-1.5 items-center">
                                  <span className="animate-ping rounded-full bg-amber-500 w-2 h-2" />
                                  <span className="font-bold text-slate-700">Status: {o.orderStatus}</span>
                                </div>
                                <span className="text-slate-400 font-mono">Delivery Est: {o.estimatedDelivery}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Wishlist Sidebar */}
                    <div className="bg-white border border-slate-100 p-5 rounded-2xl flex flex-col gap-4 h-fit">
                      <h3 className="text-sm font-bold font-serif text-slate-800 border-b border-slate-50 pb-2.5">Your Wishlisted Items ({wishlist.length})</h3>

                      <div className="flex flex-col gap-3.5 max-h-80 overflow-y-auto">
                        {wishlist.length === 0 ? (
                          <div className="py-10 text-center text-slate-400 text-xs">
                            Your wishlist is empty.
                          </div>
                        ) : (
                          products
                            .filter((p) => wishlist.includes(p.id))
                            .map((p) => (
                              <div
                                key={p.id}
                                className="flex gap-2.5 items-center p-1.5 hover:bg-slate-50/50 rounded-xl cursor-pointer"
                                onClick={() => handleNavigate('product', p.id)}
                              >
                                <img
                                  src={p.images[0]}
                                  alt={p.name}
                                  referrerPolicy="no-referrer"
                                  className="w-10 h-10 object-cover bg-slate-50 border rounded-lg"
                                />
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-[11px] font-medium text-slate-800 truncate">{p.name}</h4>
                                  <span className="text-[10px] text-amber-700 font-semibold">â‚¹{p.price.toLocaleString()}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleWishlist(p.id);
                                  }}
                                  className="text-xs text-rose-500 hover:scale-105"
                                  title="Remove"
                                >
                                  âœ•
                                </button>
                              </div>
                            ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* F. ADMIN CONSOLE */}
          {viewState.page === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AdminPanel
                products={products}
                orders={orders}
                onAddProduct={handleAdminAddProduct}
                onUpdateProduct={handleAdminUpdateProduct}
                onDeleteProduct={handleAdminDeleteProduct}
                onUpdateOrderStatus={handleAdminUpdateOrderStatus}
              />
            </motion.div>
          )}

          {/* G. OTHER BRAND PAGES */}
          {viewState.page === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto px-6 py-12 flex flex-col gap-6 bg-white border border-slate-100 p-8 rounded-3xl mt-8 shadow-xs leading-relaxed"
            >
              <span className="text-[10px] font-mono tracking-widest text-amber-700 uppercase font-semibold text-center">About Palmonas</span>
              <h1 className="text-3xl font-serif font-bold text-center text-slate-900 leading-tight">The Heritage of Waterproof Luxury</h1>
              <p className="text-xs text-slate-500 mt-2">
                Palmonas was founded with a humble purpose: creating fine jewelry designed to be loved, worn, and lived in. We noticed a major disparity in the jewelry landscape â€” beautiful designs either came at a prohibitive price point in solid 22k gold, or tarnished and turned skin green within three wears if bought from fashion outlets.
              </p>
              <p className="text-xs text-slate-500">
                Our metallurgical team researched modern vapor plating technology to solve this. Using **PVD (Physical Vapor Deposition)**, we bond certified 18K Yellow Gold or Rhodium-finished 925 Sterling Silver directly onto robust surgical stainless steel and premium nickel-free jeweler's brass cores. This process molecularly anchors the precious gold layer, yielding a finish that is 10 times thicker and 50 times more tarnish-resistant than standard flash electroplating.
              </p>
              <p className="text-xs text-slate-500 font-semibold text-amber-900 bg-amber-50/50 p-4 rounded-xl border border-amber-100/40">
                âœ¨ "Shower in it, swim in it, sweat in it. Your Palmonas pieces handle salt-water, chlorine, soaps, and perfumes with ease. We back every design with a lifetime tarnish-free color warranty."
              </p>
            </motion.div>
          )}

          {/* H. CONTACT US */}
          {viewState.page === 'contact' && (
            <motion.div
              key="contact"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 bg-white border border-slate-100 p-8 rounded-3xl mt-8 shadow-xs"
            >
              <div>
                <span className="text-[10px] font-mono tracking-widest text-amber-700 uppercase font-semibold">Client Concierge</span>
                <h1 className="text-2xl font-serif font-bold text-slate-900 mt-1">Get in Touch</h1>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Have questions about our lifetime warranty, need assistance selecting an anniversary gift, or want custom size options? Reach our concierge team directly. We response in less than 2 hours.
                </p>

                <div className="flex flex-col gap-4 mt-6 text-xs text-slate-600">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-amber-700" />
                    <span>concierge@palmonas.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-amber-700" />
                    <span>+91 98765 43210 (Mon-Sat 10am-7pm)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-amber-700" />
                    <span>Gold Souk, Sector 43, Gurugram, India</span>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('Thank you! Our concierge team will reach out to you shortly.');
                }}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shalini Patel"
                    className="border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-amber-700 bg-slate-50"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Email address</label>
                  <input
                    type="email"
                    required
                    placeholder="shalini@example.com"
                    className="border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-amber-700 bg-slate-50"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Message</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us how we can help you..."
                    className="border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-amber-700 resize-none bg-slate-50"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-amber-800 hover:bg-amber-950 text-white font-semibold text-xs py-2.5 rounded-lg transition-all"
                >
                  Send Message
                </button>
              </form>
            </motion.div>
          )}

          {/* I. FAQ */}
          {viewState.page === 'faq' && (
            <motion.div
              key="faq"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto px-6 py-12 flex flex-col gap-6 bg-white border border-slate-100 p-8 rounded-3xl mt-8 shadow-xs"
            >
              <h1 className="text-2xl font-serif font-bold text-center text-slate-900 border-b border-slate-50 pb-4">Caring Guides & FAQs</h1>

              <div className="flex flex-col gap-5 text-xs text-slate-600 divide-y divide-slate-100">
                {[
                  { q: "Is the gold-plated jewelry really waterproof?", a: "Yes! Unlike standard jewelry plated with cheap flash-gold over nickel, our products use advanced PVD deposition techniques. This anchors premium 18K yellow gold molecularly onto medical-grade stainless steel cores. It will not fade or rub off during showers, beach outings, swimming or intense workouts." },
                  { q: "What is your warranty policy?", a: "We cover all color-fading, tarnish, or structural gemstone defects with a lifetime warranty. If your item oxidizes, simply contact concierge@palmonas.com with your Order ID, and we will dispatch a brand-new replacement parcel." },
                  { q: "How long does shipping take?", a: "We ship all prepaid orders for free within 24 hours. Metro deliveries across India (Delhi NCR, Mumbai, Bengaluru) typically arrive in 2-3 business days. Regional areas take 4-5 business days." },
                  { q: "What is your return policy?", a: "We offer an absolute hassle-free, no-questions-asked 7-day return policy. If you aren't completely in love with your pieces, let us know and we will arrange a reverse pickup from your address at no charge. A full refund or store credit will be dispatched instantly." }
                ].map((faq, idx) => (
                  <div key={idx} className="pt-4 first:pt-0 flex flex-col gap-1.5">
                    <h4 className="font-semibold text-slate-800 text-sm">Q: {faq.q}</h4>
                    <p className="leading-relaxed text-slate-500">{faq.a}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* J. STORE LOCATOR */}
          {viewState.page === 'store-locator' && (
            <motion.div
              key="store-locator"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto px-6 py-12 flex flex-col gap-6 bg-white border border-slate-100 p-8 rounded-3xl mt-8 shadow-xs"
            >
              <h1 className="text-2xl font-serif font-bold text-slate-900 border-b border-slate-50 pb-3">Our Boutique Showrooms</h1>
              <p className="text-xs text-slate-400">Experience Palmonas in person. Visit our experiential luxury bars to touch, stack, and customize your orders.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="p-5 border border-amber-50 bg-amber-50/10 rounded-2xl flex flex-col gap-2">
                  <h3 className="font-serif font-bold text-slate-800">Gurugram flagship Boutique</h3>
                  <span className="text-[10px] text-amber-800 font-mono font-semibold">EXPERIENTIAL STORE</span>
                  <p className="text-xs text-slate-500 mt-1">Ground Floor, Gold Souk Mall, Sector 43, Gurugram, HR</p>
                  <span className="text-xs text-slate-500 mt-1">â˜Ž +91 98765 43212 â€¢ Open daily 11:00 AM - 9:00 PM</span>
                </div>
                <div className="p-5 border border-slate-100 bg-slate-50/40 rounded-2xl flex flex-col gap-2">
                  <h3 className="font-serif font-bold text-slate-800">Mumbai South Boutique</h3>
                  <span className="text-[10px] text-slate-500 font-mono font-semibold">STUDIO CONCEPT</span>
                  <p className="text-xs text-slate-500 mt-1">Colaba Causeway, Landmark Palace, Colaba, Mumbai, MH</p>
                  <span className="text-xs text-slate-500 mt-1">â˜Ž +91 98765 43213 â€¢ Open daily 11:00 AM - 9:00 PM</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating AI Stylist Action Bubble */}
      <button
        id="floating-ai-stylist-bubble"
        type="button"
        onClick={() => setIsStylistOpen(true)}
        className="fixed bottom-6 right-6 z-30 bg-brand-dark text-white p-3.5 md:p-4 shadow-lg hover:shadow-xl hover:bg-brand-primary transition-all group flex items-center gap-1.5 active:scale-95 border border-brand-border"
        title="Open AI Gifting Stylist"
      >
        <Sparkles className="w-5 h-5 text-brand-primary fill-brand-primary group-hover:rotate-12 transition-transform" />
        <span className="text-xs font-bold font-serif hidden md:inline tracking-wider">Palmonas AI Concierge</span>
      </button>

      {/* 3. Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* 4. Cart Drawer Sliding Panel */}
      <AnimatePresence>
        {isCartOpen && (
          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cartItems={cart}
            onUpdateQty={handleUpdateCartQty}
            onRemoveItem={handleRemoveFromCart}
            appliedCoupon={appliedCoupon}
            onApplyCoupon={setAppliedCoupon}
            onProceedToCheckout={() => {
              setIsCartOpen(false);
              handleNavigate('checkout');
            }}
          />
        )}
      </AnimatePresence>

      {/* 5. AI Stylist Sliding Panel */}
      <AnimatePresence>
        {isStylistOpen && (
          <AIStylist
            isOpen={isStylistOpen}
            onClose={() => setIsStylistOpen(false)}
            products={products}
            onViewProduct={(id) => {
              setIsStylistOpen(false);
              handleNavigate('product', id);
            }}
            onAddToCart={(p) => handleAddToCart(p)}
            onToggleWishlist={handleToggleWishlist}
            wishlistedIds={wishlist}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
