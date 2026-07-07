/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, Tag, ArrowRight, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, Coupon } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQty: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  appliedCoupon: Coupon | null;
  onApplyCoupon: (coupon: Coupon | null) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  appliedCoupon,
  onApplyCoupon,
  onProceedToCheckout
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  if (!isOpen) return null;

  // Calculate Subtotal
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Free shipping threshold: 999
  const freeShippingThreshold = 999;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const remainingForFreeShipping = freeShippingThreshold - subtotal;
  const freeShippingProgressPercent = Math.min((subtotal / freeShippingThreshold) * 100, 100);

  // Calculate Discount
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = Math.round((subtotal * appliedCoupon.value) / 100);
    } else {
      discountAmount = appliedCoupon.value;
    }
  }

  const shippingFee = subtotal === 0 ? 0 : (isFreeShipping ? 0 : 99);
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setCouponError('');
    setCouponLoading(true);

    try {
      const response = await fetch('/api/coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, subtotal })
      });

      const data = await response.json();

      if (!response.ok) {
        setCouponError(data.error || 'Failed to apply coupon.');
        onApplyCoupon(null);
      } else {
        onApplyCoupon({
          code: data.code,
          discountType: data.type,
          value: data.value,
          minOrderValue: 0, // already validated server side
          description: data.description
        });
        setCouponCode('');
      }
    } catch (err) {
      setCouponError('Network error. Please try again.');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    onApplyCoupon(null);
    setCouponError('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/45 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full"
        >
          {/* Cart Header */}
          <div className="px-5 py-5 border-b border-brand-border flex items-center justify-between bg-brand-bg">
            <div className="flex items-center gap-2 text-brand-dark">
              <ShoppingCart className="w-5 h-5 text-brand-primary" />
              <h2 className="text-base font-serif font-bold tracking-wide">Your Shopping Cart</h2>
              <span className="text-xs bg-brand-primary text-white px-2.5 py-0.5 font-mono">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            </div>
            <button
              id="close-cart-btn"
              onClick={onClose}
              className="p-1.5 text-brand-dark hover:text-brand-primary hover:bg-brand-bg transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Contents */}
          <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
            {cartItems.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-brand-bg">
                <div className="w-16 h-16 bg-white border border-brand-border flex items-center justify-center text-brand-primary mb-6">
                  <ShoppingCart className="w-7 h-7" />
                </div>
                <h3 className="text-base font-medium text-brand-dark mb-2">Your cart is empty</h3>
                <p className="text-xs text-brand-muted max-w-xs mb-6 font-sans">
                  Add some beautiful tarnish-free jewelry pieces to make your style shine.
                </p>
                <button
                  id="cart-shop-now-btn"
                  onClick={() => {
                    onClose();
                  }}
                  className="bg-brand-dark hover:bg-brand-primary text-white text-xs font-semibold px-6 py-3 tracking-widest uppercase transition-colors flex items-center gap-1.5"
                >
                  Shop Now <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <>
                 {/* Free Shipping Progress Indicator */}
                <div className="bg-brand-bg border border-brand-border p-4">
                  {isFreeShipping ? (
                    <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
                      🎉 Congratulations! You have unlocked **FREE SHIPPING**!
                    </span>
                  ) : (
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs text-brand-dark font-medium">
                        Add <span className="font-bold text-brand-primary">₹{remainingForFreeShipping}</span> more to unlock <span className="font-bold text-emerald-700">FREE SHIPPING</span>
                      </span>
                      <div className="w-full h-1.5 bg-brand-border">
                        <div
                          className="h-full bg-emerald-600 transition-all duration-500"
                          style={{ width: `${freeShippingProgressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Line Items */}
                <div className="flex flex-col gap-3">
                  {cartItems.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex gap-3 bg-white p-3 border border-brand-border"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 object-cover bg-brand-bg border border-brand-border shrink-0"
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <h4 className="text-xs font-medium text-brand-dark line-clamp-1">
                            {item.product.name}
                          </h4>
                          {item.selectedSize && (
                            <span className="text-[10px] text-brand-muted font-mono">
                              Size: {item.selectedSize}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          {/* Qty Stepper */}
                          <div className="flex items-center border border-brand-border bg-brand-bg">
                            <button
                              id={`qty-minus-${item.product.id}`}
                              onClick={() => onUpdateQty(item.product.id, -1)}
                              className="p-1 hover:bg-white"
                            >
                              <Minus className="w-3.5 h-3.5 text-brand-dark" />
                            </button>
                            <span className="px-2.5 text-xs font-semibold text-brand-dark font-mono">
                              {item.quantity}
                            </span>
                            <button
                              id={`qty-plus-${item.product.id}`}
                              onClick={() => onUpdateQty(item.product.id, 1)}
                              className="p-1 hover:bg-white"
                            >
                              <Plus className="w-3.5 h-3.5 text-brand-dark" />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-xs font-semibold text-brand-dark">
                              ₹{(item.product.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Remove */}
                      <button
                        id={`cart-remove-${item.product.id}`}
                        onClick={() => onRemoveItem(item.product.id)}
                        className="p-1.5 text-brand-light hover:text-rose-500 hover:bg-rose-50 transition-colors self-start"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Cart Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-brand-border p-5 bg-brand-bg flex flex-col gap-4">
              {/* Coupon Engine */}
              <div className="flex flex-col gap-1.5">
                {!appliedCoupon ? (
                  <form onSubmit={handleApplyCouponSubmit} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-brand-light" />
                      <input
                        id="coupon-code-input"
                        type="text"
                        placeholder="ENTER COUPON CODE"
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(e.target.value);
                          setCouponError('');
                        }}
                        className="w-full bg-white border border-brand-border pl-8 pr-3 py-2 text-xs font-mono uppercase tracking-wider outline-none focus:border-brand-primary"
                      />
                    </div>
                    <button
                      id="apply-coupon-btn"
                      type="submit"
                      disabled={couponLoading}
                      className="bg-brand-dark hover:bg-brand-primary disabled:bg-brand-light text-white font-semibold text-xs px-4 py-2 transition-all"
                    >
                      {couponLoading ? 'Checking...' : 'Apply'}
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100 animate-pulse" />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-emerald-800 font-mono tracking-wide">
                          {appliedCoupon.code} APPLIED
                        </span>
                        <span className="text-[10px] text-emerald-600">
                          {appliedCoupon.description}
                        </span>
                      </div>
                    </div>
                    <button
                      id="remove-coupon-btn"
                      onClick={handleRemoveCoupon}
                      className="text-xs font-semibold text-rose-500 hover:text-rose-700 underline"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {couponError && (
                  <span className="text-[10px] text-rose-500 font-medium pl-1">{couponError}</span>
                )}

                {/* Quick codes tip */}
                {!appliedCoupon && (
                  <div className="flex gap-1.5 flex-wrap mt-0.5">
                    <span className="text-[10px] text-brand-light font-medium">Try:</span>
                    <button
                      onClick={() => setCouponCode('WELCOME10')}
                      className="text-[10px] font-mono bg-white border border-brand-border hover:border-brand-primary text-brand-muted px-1.5 py-0.5"
                    >
                      WELCOME10
                    </button>
                    <button
                      onClick={() => setCouponCode('ELEGANCE25')}
                      className="text-[10px] font-mono bg-white border border-brand-border hover:border-brand-primary text-brand-muted px-1.5 py-0.5"
                    >
                      ELEGANCE25 (above ₹1999)
                    </button>
                  </div>
                )}
              </div>

              {/* Order Summary Calculation */}
              <div className="flex flex-col gap-2 border-t border-brand-border pt-3">
                <div className="flex justify-between text-xs text-brand-muted">
                  <span>Bag Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-xs text-emerald-600 font-medium">
                    <span>Discount Coupon ({appliedCoupon.code})</span>
                    <span>-₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-xs text-brand-muted">
                  <span>Estimated Delivery Shipping</span>
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600 font-semibold">FREE</span>
                  ) : (
                    <span>₹{shippingFee}</span>
                  )}
                </div>

                <div className="flex justify-between text-sm text-brand-dark font-bold border-t border-brand-border pt-2">
                  <span>Order Total</span>
                  <span className="text-base text-brand-primary">₹{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                id="checkout-cta-btn"
                onClick={onProceedToCheckout}
                className="w-full bg-brand-dark hover:bg-brand-primary text-white font-semibold text-xs py-3.5 tracking-widest uppercase transition-all flex items-center justify-center gap-2 mt-1 active:scale-98"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
