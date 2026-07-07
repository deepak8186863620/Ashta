/**
 * Header - ASHTA exact replica
 */
import React, { useState, useEffect, useRef } from 'react';
import { Search, Heart, User, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import { Product } from '../types';

interface HeaderProps {
  wishlistCount: number;
  cartCount: number;
  products: Product[];
  currentView: string;
  onNavigate: (view: string, productId?: string | null) => void;
  onToggleCart: () => void;
  onSearchSelect: (product: Product) => void;
}

const TICKER_ITEMS = [
  "Monsoon Sale Live - Buy 4 at ₹2999",
  "★",
  "Biggest Price Drop is Here! | 🔥 Demifine Sale",
  "★",
  "⚡ FREE STUDS of ₹1495 on orders above ₹2999",
  "★",
  "Ships in 24 hours | Free Insured Shipping above ₹999",
  "★",
  "8L+ Happy Customers",
  "★",
];

const NAV_LINKS = [
  { label: "New Arrivals", view: "shop" },
  { label: "Best Seller", view: "shop" },
  { label: "Fine Silver", view: "shop" },
  { label: "9KT Fine Gold", view: "shop" },
  { label: "Emily In Paris", view: "shop" },
  { label: "Demi-fine® Jewellery", view: "shop" },
  { label: "Gifting", view: "shop" },
  { label: "About Us", view: "about" },
];

export const Header: React.FC<HeaderProps> = ({
  wishlistCount,
  cartCount,
  products,
  currentView,
  onNavigate,
  onToggleCart,
  onSearchSelect
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const suggestions = searchQuery.trim()
    ? products
        .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 5)
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSuggestionClick = (product: Product) => {
    onSearchSelect(product);
    setSearchQuery('');
    setIsSearchFocused(false);
    setSearchOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('shop');
      setIsSearchFocused(false);
      setSearchOpen(false);
    }
  };

  const tickerText = TICKER_ITEMS.join("   ");

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col bg-white header-shadow">
      {/* Announcement Ticker Bar */}
      <div className="w-full bg-black text-white overflow-hidden py-2" style={{ height: '34px' }}>
        <div className="ticker-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="text-[11px] font-medium tracking-wide whitespace-nowrap px-6">{item}</span>
          ))}
        </div>
      </div>

      {/* Main Header Row */}
      <div className="w-full bg-white border-b border-gray-100 px-4 md:px-8 flex items-center justify-between" style={{ height: '64px' }}>

        {/* Left: Mobile hamburger */}
        <div className="flex items-center gap-3">
          <button
            id="mobile-menu-toggle"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1 text-black hover:opacity-60 transition-opacity"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo */}
          <div
            onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
            className="cursor-pointer select-none flex-shrink-0"
          >
            <span
              className="font-serif font-bold text-black"
              style={{ fontSize: '26px', letterSpacing: '0.12em', fontStyle: 'italic' }}
            >
              ASHTA
            </span>
          </div>
        </div>

        {/* Center: Desktop nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map(link => (
            <button
              key={link.label}
              onClick={() => onNavigate(link.view)}
              className="text-[11px] font-semibold text-black hover:opacity-60 transition-opacity tracking-wider uppercase whitespace-nowrap"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right: Icons */}
        <div className="flex items-center gap-3">
          {/* Search icon → expands */}
          <div ref={searchContainerRef} className="relative">
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-1.5 text-black hover:opacity-60 transition-opacity"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Search dropdown */}
            {searchOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 shadow-lg z-50">
                <form onSubmit={handleSearchSubmit} className="flex items-center border-b border-gray-100 px-3 py-2">
                  <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                  <input
                    id="global-search-input"
                    type="text"
                    autoFocus
                    placeholder="Search jewellery..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    className="flex-1 text-sm outline-none bg-transparent text-black"
                  />
                  {searchQuery && (
                    <button type="button" onClick={() => setSearchQuery('')}>
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
                </form>
                {suggestions.length > 0 && (
                  <div>
                    {suggestions.map(p => (
                      <div
                        key={p.id}
                        onClick={() => handleSuggestionClick(p)}
                        className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 cursor-pointer"
                      >
                        <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-cover bg-gray-100" />
                        <div>
                          <div className="text-xs font-medium text-black">{p.name}</div>
                          <div className="text-xs text-gray-500">₹{p.price.toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {searchQuery && suggestions.length === 0 && (
                  <div className="px-3 py-4 text-xs text-gray-400 text-center">No results for "{searchQuery}"</div>
                )}
              </div>
            )}
          </div>

          {/* Wishlist */}
          <button
            id="wishlist-nav-btn"
            type="button"
            onClick={() => onNavigate('account')}
            className="p-1.5 text-black hover:opacity-60 transition-opacity relative"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Account */}
          <button
            id="account-nav-btn"
            type="button"
            onClick={() => onNavigate('account')}
            className="p-1.5 text-black hover:opacity-60 transition-opacity hidden sm:block"
            aria-label="Account"
          >
            <User className="w-5 h-5" />
          </button>

          {/* Cart */}
          <button
            id="cart-nav-btn"
            type="button"
            onClick={onToggleCart}
            className="p-1.5 text-black hover:opacity-60 transition-opacity relative flex items-center gap-1.5"
            aria-label="Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="text-[11px] font-semibold hidden sm:inline">
              {cartCount > 0 ? cartCount : 0}
            </span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold sm:hidden">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden w-full bg-white border-b border-gray-100 px-6 py-4 flex flex-col gap-4">
          <form onSubmit={handleSearchSubmit} className="flex items-center border border-gray-200 px-3 py-2">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input
              id="mobile-search-input"
              type="text"
              placeholder="Search jewellery..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="flex-1 text-sm outline-none bg-transparent text-black"
            />
          </form>
          <div className="flex flex-col gap-4">
            {NAV_LINKS.map(link => (
              <button
                key={link.label}
                onClick={() => { onNavigate(link.view); setMobileMenuOpen(false); }}
                className="text-left text-sm font-semibold text-black hover:opacity-60 uppercase tracking-wider"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
