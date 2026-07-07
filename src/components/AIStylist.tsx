/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, X, ArrowUpRight, ShieldAlert, Heart, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';

interface AIStylistProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onViewProduct: (id: string) => void;
  onAddToCart: (p: Product) => void;
  onToggleWishlist: (id: string) => void;
  wishlistedIds: string[];
}

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  suggestedProducts?: Product[];
}

const PRESET_QUERIES = [
  "✨ Perfect luxury gift under ₹2000",
  "💧 Show me waterproof / pool-proof anklets",
  "💎 What earrings pair best with Gold Solitaire Pendant?",
  "🌿 Best minimalist design for daily office wear"
];

export const AIStylist: React.FC<AIStylistProps> = ({
  isOpen,
  onClose,
  products,
  onViewProduct,
  onAddToCart,
  onToggleWishlist,
  wishlistedIds
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      role: 'model',
      text: "Welcome to ASHTA. I am your personal jewelry stylist and gifting curator, powered by Google Gemini. Tell me about your occasion, outfit, budget, or gift recipient, and I will hand-select the perfect tarnish-free designs for you!"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg: Message = {
      id: `msg_user_${Date.now()}`,
      role: 'user',
      text: textToSend
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    try {
      // Clean up chat history for API payload
      const apiHistory = messages.map(m => ({
        role: m.role,
        text: m.text
      }));

      const response = await fetch('/api/stylist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: apiHistory,
          catalog: products.map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            category: p.category,
            material: p.material,
            occasion: p.occasion,
            stock: p.stock
          }))
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Stylist failed to respond.');
      }

      // Map suggested product IDs back to full products
      let suggestedProducts: Product[] = [];
      if (data.suggestedProductIds && Array.isArray(data.suggestedProductIds)) {
        suggestedProducts = products.filter(p => data.suggestedProductIds.includes(p.id));
      }

      const modelMsg: Message = {
        id: `msg_model_${Date.now()}`,
        role: 'model',
        text: data.reply,
        suggestedProducts
      };

      setMessages((prev) => [...prev, modelMsg]);

    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg_error_${Date.now()}`,
          role: 'model',
          text: `I apologize, but I encountered an error: ${err.message || 'Server timeout'}. Please ensure your internet connection is active and your API key is correctly configured.`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs"
        onClick={onClose}
      />

      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col z-10 border-l border-brand-border"
      >
        {/* Header */}
        <div className="p-4 bg-brand-primary text-white flex items-center justify-between border-b border-brand-primary shadow-sm">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white/10 text-white">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-serif tracking-wide">ASHTA AI Gifting Concierge</h3>
              <p className="text-[10px] text-brand-bg/80 font-mono">Real-time styling guided by Gemini</p>
            </div>
          </div>
          <button
            id="close-stylist-btn"
            onClick={onClose}
            className="p-1.5 text-brand-bg/80 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages and Output */}
        <div className="flex-1 overflow-y-auto p-5 bg-brand-bg/40 flex flex-col gap-5">
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex flex-col max-w-[85%] ${m.role === 'user' ? 'self-end items-end' : 'self-start items-start'}`}
              >
                {/* Chat bubble */}
                <div
                  className={`p-3.5 text-xs leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-brand-dark text-white shadow-xs'
                      : 'bg-white text-brand-dark border border-brand-border shadow-xs'
                  }`}
                >
                  {/* Handle newline formatting */}
                  <div className="whitespace-pre-line font-sans">{m.text}</div>
                </div>

                {/* Suggested Products scrolling panel */}
                {m.suggestedProducts && m.suggestedProducts.length > 0 && (
                  <div className="w-full mt-3 flex flex-col gap-2">
                    <span className="text-[10px] font-mono tracking-wider text-brand-light uppercase font-semibold">
                      Curated recommendations:
                    </span>
                    <div className="flex gap-3 overflow-x-auto py-1.5 -mx-1 px-1 scrollbar-thin">
                      {m.suggestedProducts.map((p) => (
                        <div
                          key={p.id}
                          className="bg-white border border-brand-border p-2.5 flex flex-col gap-2 shrink-0 w-44 hover:shadow-lg transition-all cursor-pointer"
                          onClick={() => onViewProduct(p.id)}
                        >
                          <div className="relative aspect-square overflow-hidden bg-brand-bg">
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleWishlist(p.id);
                              }}
                              className="absolute top-1 right-1 p-1 bg-white/95 text-brand-light hover:text-rose-500"
                            >
                              <Heart className={`w-3.5 h-3.5 ${wishlistedIds.includes(p.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                            </button>
                          </div>
                          <div className="flex flex-col">
                            <h4 className="text-[11px] font-medium text-brand-dark truncate leading-snug">{p.name}</h4>
                            <span className="text-[10px] text-brand-muted font-mono">{p.material}</span>
                            <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-brand-border">
                              <span className="text-xs font-bold text-brand-dark">₹{p.price.toLocaleString()}</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onAddToCart(p);
                                }}
                                className="bg-brand-primary hover:bg-brand-dark text-white p-1 transition-colors"
                                title="Add to Cart"
                              >
                                <ShoppingBag className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loader shimmer */}
          {loading && (
            <div className="self-start flex flex-col items-start gap-1.5 max-w-[85%]">
              <div className="bg-white border border-brand-border p-3.5 flex items-center gap-3 shadow-xs">
                <div className="flex gap-1.5 items-center">
                  <div className="w-2 h-2 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-[10px] font-mono text-brand-light">ASHTA Stylist is curating...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick chip tray */}
        {messages.length === 1 && (
          <div className="px-5 py-2.5 border-t border-brand-border bg-white flex flex-col gap-1.5">
            <span className="text-[10px] font-mono text-brand-light font-medium">Quick Suggestions:</span>
            <div className="flex flex-col gap-1.5">
              {PRESET_QUERIES.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q.replace(/^[^\s]+\s+/, ''))}
                  className="text-left text-xs bg-brand-bg border border-brand-border text-brand-muted hover:bg-brand-primary hover:text-white p-2.5 transition-all flex items-center justify-between"
                >
                  <span>{q}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-brand-light" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Form Footer */}
        <div className="p-4 border-t border-brand-border bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="flex gap-2"
          >
            <input
              id="stylist-text-input"
              type="text"
              required
              disabled={loading}
              placeholder="Ask for recommendations, styling advice..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-brand-bg border border-brand-border px-4 py-3 text-xs outline-none focus:border-brand-primary focus:bg-white transition-all disabled:opacity-55"
            />
            <button
              id="stylist-send-btn"
              type="submit"
              disabled={loading || !inputValue.trim()}
              className="bg-brand-primary hover:bg-brand-dark disabled:bg-brand-bg disabled:text-brand-light text-white p-3 transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
