/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LayoutDashboard, ShoppingBag, Truck, Star, Plus, Edit, Trash2, CheckCircle2, TrendingUp, Users, ArrowUpRight, DollarSign } from 'lucide-react';
import { Product, Order, Review } from '../types';

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  onAddProduct: (p: Product) => void;
  onUpdateProduct: (p: Product) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['orderStatus']) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  orders,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders'>('dashboard');

  // Product Form State
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPrice, setFormPrice] = useState(999);
  const [formMrp, setFormMrp] = useState(1999);
  const [formCategory, setFormCategory] = useState<Product['category']>('Necklaces');
  const [formMaterial, setFormMaterial] = useState<Product['material']>('18K Gold Plated');
  const [formOccasion, setFormOccasion] = useState<Product['occasion']>('Daily Wear');
  const [formImage1, setFormImage1] = useState('');
  const [formImage2, setFormImage2] = useState('');
  const [formStock, setFormStock] = useState(20);
  const [formWeight, setFormWeight] = useState('3.5 grams');
  const [formLength, setFormLength] = useState('18 inches');

  // Business Analytics Calculations
  const totalSales = orders
    .filter(o => o.orderStatus !== 'Cancelled' && o.paymentStatus !== 'Pending')
    .reduce((acc, o) => acc + o.total, 0);

  const averageOrderValue = orders.length > 0 ? Math.round(totalSales / orders.length) : 0;
  const pendingOrdersCount = orders.filter(o => o.orderStatus === 'Placed' || o.orderStatus === 'Processing').length;

  const handleEditProduct = (product: Product) => {
    setEditingProductId(product.id);
    setFormName(product.name);
    setFormDescription(product.description);
    setFormPrice(product.price);
    setFormMrp(product.mrp);
    setFormCategory(product.category);
    setFormMaterial(product.material);
    setFormOccasion(product.occasion);
    setFormImage1(product.images[0] || '');
    setFormImage2(product.images[1] || '');
    setFormStock(product.stock);
    setFormWeight(product.specifications?.Weight || '4 grams');
    setFormLength(product.specifications?.Length || '18 inches');
    setShowProductForm(true);
  };

  const handleOpenNewProductForm = () => {
    setEditingProductId(null);
    setFormName('');
    setFormDescription('');
    setFormPrice(999);
    setFormMrp(1999);
    setFormCategory('Necklaces');
    setFormMaterial('18K Gold Plated');
    setFormOccasion('Daily Wear');
    setFormImage1('https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop');
    setFormImage2('https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=600&auto=format&fit=crop');
    setFormStock(25);
    setFormWeight('3.5 grams');
    setFormLength('16 inches + 2 inches extension');
    setShowProductForm(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    const discountPercent = Math.round(((formMrp - formPrice) / formMrp) * 100);

    const productPayload: Product = {
      id: editingProductId || `p_custom_${Date.now()}`,
      name: formName,
      description: formDescription,
      price: Number(formPrice),
      mrp: Number(formMrp),
      discount: discountPercent > 0 ? discountPercent : 0,
      category: formCategory,
      material: formMaterial,
      occasion: formOccasion,
      images: [formImage1 || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600', formImage2 || 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=600'].filter(img => img !== ''),
      rating: editingProductId ? (products.find(p => p.id === editingProductId)?.rating || 5.0) : 5.0,
      reviewsCount: editingProductId ? (products.find(p => p.id === editingProductId)?.reviewsCount || 0) : 0,
      stock: Number(formStock),
      specifications: {
        Weight: formWeight,
        Length: formLength,
        BaseMetal: 'Premium Brass',
        Warranty: 'Lifetime Tarnish-Free Warranty'
      }
    };

    if (editingProductId) {
      onUpdateProduct(productPayload);
    } else {
      onAddProduct(productPayload);
    }

    setShowProductForm(false);
  };

  return (
    <div id="admin-panel" className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col gap-8 min-h-screen">
      {/* Admin Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-brand-border pb-5 gap-4">
        <div>
          <span className="text-xs font-mono uppercase text-brand-primary font-semibold tracking-widest">
            Manager Control Deck
          </span>
          <h1 className="text-2xl font-serif font-bold text-brand-dark mt-1">ASHTA Store Administration</h1>
        </div>

        {/* Tab selection */}
        <div className="flex gap-1 bg-brand-bg p-1 border border-brand-border">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-all ${
              activeTab === 'dashboard' ? 'bg-brand-dark text-white shadow-xs' : 'text-brand-muted hover:text-brand-dark'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-all ${
              activeTab === 'products' ? 'bg-brand-dark text-white shadow-xs' : 'text-brand-muted hover:text-brand-dark'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" /> Catalog
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-all ${
              activeTab === 'orders' ? 'bg-brand-dark text-white shadow-xs' : 'text-brand-muted hover:text-brand-dark'
            }`}
          >
            <Truck className="w-3.5 h-3.5" /> Orders ({pendingOrdersCount})
          </button>
        </div>
      </div>

      {/* TABS CONTENT */}

      {/* 1. DASHBOARD OVERVIEW */}
      {activeTab === 'dashboard' && (
        <div className="flex flex-col gap-8 animate-in fade-in duration-200">
          {/* Top stats grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 border border-brand-border flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono tracking-wider text-brand-light uppercase font-semibold">Total Revenue</span>
                <h3 className="text-xl font-bold text-brand-dark mt-1">₹{totalSales.toLocaleString()}</h3>
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-2">
                  <TrendingUp className="w-3 h-3" /> +15% vs yesterday
                </span>
              </div>
              <div className="w-10 h-10 bg-brand-bg flex items-center justify-center text-brand-primary">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-6 border border-brand-border flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono tracking-wider text-brand-light uppercase font-semibold">Total Orders</span>
                <h3 className="text-xl font-bold text-brand-dark mt-1">{orders.length}</h3>
                <span className="text-[10px] text-brand-muted font-semibold block mt-2">
                  {orders.filter(o => o.orderStatus === 'Delivered').length} fulfilled orders
                </span>
              </div>
              <div className="w-10 h-10 bg-brand-bg flex items-center justify-center text-brand-primary">
                <ShoppingBag className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-6 border border-brand-border flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono tracking-wider text-brand-light uppercase font-semibold">Average Order Value</span>
                <h3 className="text-xl font-bold text-brand-dark mt-1">₹{averageOrderValue.toLocaleString()}</h3>
                <span className="text-[10px] text-brand-primary font-semibold block mt-2">
                  Premium basket size
                </span>
              </div>
              <div className="w-10 h-10 bg-brand-bg flex items-center justify-center text-brand-primary">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-6 border border-brand-border flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono tracking-wider text-brand-light uppercase font-semibold">Active Customers</span>
                <h3 className="text-xl font-bold text-brand-dark mt-1">{Math.max(4, orders.length + 3)}</h3>
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-2">
                  <ArrowUpRight className="w-3 h-3" /> 100% positive ratings
                </span>
              </div>
              <div className="w-10 h-10 bg-brand-bg flex items-center justify-center text-brand-primary">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Quick lists row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Pending Shipments */}
            <div className="bg-white p-6 border border-brand-border flex flex-col lg:col-span-2">
              <div className="flex justify-between items-center border-b border-brand-border pb-3 mb-4">
                <h3 className="text-sm font-bold text-brand-dark font-serif tracking-wide">Awaiting Dispatch</h3>
                <span className="text-[10px] bg-brand-bg text-brand-primary border border-brand-border font-bold px-2.5 py-1 font-mono">
                  {orders.filter(o => o.orderStatus === 'Placed' || o.orderStatus === 'Processing').length} Active
                </span>
              </div>

              <div className="flex flex-col gap-3 flex-1 overflow-y-auto max-h-80">
                {orders.filter(o => o.orderStatus === 'Placed' || o.orderStatus === 'Processing').length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mb-2" />
                    <span className="text-xs text-brand-muted">All orders are fully dispatched!</span>
                  </div>
                ) : (
                  orders
                    .filter(o => o.orderStatus === 'Placed' || o.orderStatus === 'Processing')
                    .map(o => (
                      <div key={o.id} className="flex justify-between items-center p-3.5 border border-brand-border hover:bg-brand-bg/30 transition-all">
                        <div>
                          <div className="text-xs font-semibold text-brand-dark font-mono">{o.id}</div>
                          <div className="text-[11px] text-brand-muted mt-0.5">{o.customerName} • {o.items.length} items</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-brand-dark">₹{o.total.toLocaleString()}</span>
                          <button
                            onClick={() => onUpdateOrderStatus(o.id, 'Shipped')}
                            className="bg-brand-dark hover:bg-brand-primary text-white font-bold text-[10px] px-3.5 py-2 tracking-wider uppercase transition-all"
                          >
                            Mark Dispatched
                          </button>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>

            {/* Low Stock Alerts */}
            <div className="bg-white p-6 border border-brand-border flex flex-col">
              <div className="flex justify-between items-center border-b border-brand-border pb-3 mb-4">
                <h3 className="text-sm font-bold text-brand-dark font-serif tracking-wide">Low Inventory Warnings</h3>
                <span className="text-[10px] bg-rose-50 text-rose-700 font-bold px-2.5 py-1">
                  Action Required
                </span>
              </div>

              <div className="flex flex-col gap-3 overflow-y-auto max-h-80">
                {products.filter(p => p.stock <= 8).map(p => (
                  <div key={p.id} className="flex gap-3 items-center p-2.5 border border-brand-border">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 object-cover bg-brand-bg border border-brand-border shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-medium text-brand-dark truncate">{p.name}</h4>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 ${p.stock === 0 ? 'bg-rose-100 text-rose-800' : 'bg-brand-bg text-brand-primary'}`}>
                          {p.stock} In Stock
                        </span>
                        <span className="text-[10px] text-brand-muted">₹{p.price.toLocaleString()}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleEditProduct(p)}
                      className="text-xs font-bold text-brand-primary hover:underline shrink-0 font-mono"
                    >
                      Restock
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. CATALOG MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          {/* Header Row */}
          <div className="flex justify-between items-center pb-3 border-b border-brand-border">
            <h3 className="text-base font-bold text-brand-dark font-serif tracking-wide">Product Inventory ({products.length} Items)</h3>
            <button
              id="admin-add-product-btn"
              onClick={handleOpenNewProductForm}
              className="bg-brand-dark hover:bg-brand-primary text-white font-semibold text-xs px-4 py-2.5 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add New Design
            </button>
          </div>

          {/* Product Form Drawer/Section */}
          {showProductForm && (
            <form onSubmit={handleSaveProduct} className="bg-brand-bg border border-brand-border p-6 flex flex-col gap-4">
              <h4 className="text-sm font-serif font-bold text-brand-dark border-b border-brand-border pb-2 tracking-wide">
                {editingProductId ? 'Edit Product Parameters' : 'Register New Luxury Design'}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono uppercase text-brand-light font-semibold">Product Name</label>
                  <input
                    id="form-name-input"
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Classic Sterling Silver Studs"
                    className="bg-white border border-brand-border p-2.5 text-xs outline-none focus:border-brand-primary"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono uppercase text-brand-light font-semibold">Category</label>
                  <select
                    id="form-category-select"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as Product['category'])}
                    className="bg-white border border-brand-border p-2.5 text-xs outline-none focus:border-brand-primary"
                  >
                    <option value="Necklaces">Necklaces</option>
                    <option value="Earrings">Earrings</option>
                    <option value="Rings">Rings</option>
                    <option value="Bracelets">Bracelets</option>
                    <option value="Anklets">Anklets</option>
                    <option value="Mangalsutras">Mangalsutras</option>
                    <option value="Bridal Sets">Bridal Sets</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono uppercase text-brand-light font-semibold">Base Material</label>
                  <select
                    id="form-material-select"
                    value={formMaterial}
                    onChange={(e) => setFormMaterial(e.target.value as Product['material'])}
                    className="bg-white border border-brand-border p-2.5 text-xs outline-none focus:border-brand-primary"
                  >
                    <option value="18K Gold Plated">18K Gold Plated</option>
                    <option value="925 Sterling Silver">925 Sterling Silver</option>
                    <option value="Premium Kundan">Premium Kundan</option>
                    <option value="Rose Gold Finish">Rose Gold Finish</option>
                    <option value="Polki Fashion">Polki Fashion</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono uppercase text-brand-light font-semibold">Selling Price (₹)</label>
                  <input
                    id="form-price-input"
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="bg-white border border-brand-border p-2.5 text-xs outline-none focus:border-brand-primary"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono uppercase text-brand-light font-semibold">Original Price / MRP (₹)</label>
                  <input
                    id="form-mrp-input"
                    type="number"
                    required
                    value={formMrp}
                    onChange={(e) => setFormMrp(Number(e.target.value))}
                    className="bg-white border border-brand-border p-2.5 text-xs outline-none focus:border-brand-primary"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono uppercase text-brand-light font-semibold">Initial Stock Level</label>
                  <input
                    id="form-stock-input"
                    type="number"
                    required
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    className="bg-white border border-brand-border p-2.5 text-xs outline-none focus:border-brand-primary"
                  />
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-[11px] font-mono uppercase text-brand-light font-semibold">Image URL 1 (Primary)</label>
                  <input
                    id="form-image1-input"
                    type="text"
                    required
                    value={formImage1}
                    onChange={(e) => setFormImage1(e.target.value)}
                    className="bg-white border border-brand-border p-2.5 text-xs outline-none focus:border-brand-primary"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-mono uppercase text-brand-light font-semibold">Image URL 2 (Hover Display)</label>
                  <input
                    id="form-image2-input"
                    type="text"
                    value={formImage2}
                    onChange={(e) => setFormImage2(e.target.value)}
                    className="bg-white border border-brand-border p-2.5 text-xs outline-none focus:border-brand-primary"
                  />
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-3">
                  <label className="text-[11px] font-mono uppercase text-brand-light font-semibold">Luxury Description</label>
                  <textarea
                    id="form-desc-textarea"
                    required
                    rows={2}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Introduce the aesthetic, polish, and warranty of the piece..."
                    className="bg-white border border-brand-border p-2.5 text-xs outline-none focus:border-brand-primary flex-1 resize-none"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 mt-2 border-t border-brand-border pt-3">
                <button
                  id="form-cancel-btn"
                  type="button"
                  onClick={() => setShowProductForm(false)}
                  className="bg-brand-bg hover:bg-brand-border text-brand-dark font-semibold text-xs px-5 py-2.5 transition-all"
                >
                  Cancel
                </button>
                <button
                  id="form-save-btn"
                  type="submit"
                  className="bg-brand-dark hover:bg-brand-primary text-white font-semibold text-xs px-5 py-2.5 transition-all"
                >
                  {editingProductId ? 'Save Changes' : 'Confirm New Product'}
                </button>
              </div>
            </form>
          )}

          {/* Table of Products */}
          <div className="bg-white border border-brand-border shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-brand-bg border-b border-brand-border text-[10px] font-mono uppercase tracking-wider text-brand-muted font-bold">
                    <th className="p-4">Product Info</th>
                    <th className="p-4">Category & Material</th>
                    <th className="p-4 text-right">Price Structure</th>
                    <th className="p-4 text-center">Stock Status</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border text-xs">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-brand-bg/20 transition-colors">
                      <td className="p-4 flex gap-3 items-center">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 object-cover bg-brand-bg border border-brand-border shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-semibold text-brand-dark truncate max-w-[200px]">{p.name}</div>
                          <div className="text-[10px] text-brand-muted font-mono mt-0.5">ID: {p.id}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-medium text-brand-dark">{p.category}</span>
                        <div className="text-[10px] text-brand-muted font-mono mt-0.5">{p.material}</div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="font-bold text-brand-dark">₹{p.price.toLocaleString()}</div>
                        <div className="text-[10px] text-brand-muted line-through">MRP: ₹{p.mrp.toLocaleString()}</div>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-block px-2.5 py-1 text-[10px] font-mono font-semibold ${
                          p.stock === 0
                            ? 'bg-rose-50 text-rose-700 border border-rose-100'
                            : p.stock <= 5
                            ? 'bg-amber-50 text-amber-700 border border-amber-100 animate-pulse'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        }`}>
                          {p.stock === 0 ? 'Out of Stock' : `${p.stock} Units`}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditProduct(p)}
                            className="p-1.5 hover:bg-brand-bg hover:text-brand-primary text-brand-light transition-colors"
                            title="Edit Product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteProduct(p.id)}
                            className="p-1.5 hover:bg-rose-50 hover:text-rose-600 text-brand-light transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. ORDER DISPATCH MODULE */}
      {activeTab === 'orders' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          <h3 className="text-base font-bold text-brand-dark font-serif tracking-wide">Customer Orders ({orders.length} Records)</h3>

          <div className="bg-white border border-brand-border shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-brand-bg border-b border-brand-border text-[10px] font-mono uppercase tracking-wider text-brand-muted font-bold">
                    <th className="p-4">Order ID & Date</th>
                    <th className="p-4">Recipient Detail</th>
                    <th className="p-4">Purchase Breakdown</th>
                    <th className="p-4 text-right">Order Total</th>
                    <th className="p-4 text-center">Fulfillment Phase</th>
                    <th className="p-4 text-center">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border text-xs">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-brand-bg/20 transition-colors">
                      <td className="p-4">
                        <div className="font-mono font-bold text-brand-dark">{o.id}</div>
                        <div className="text-[10px] text-brand-muted font-mono mt-0.5">{o.orderDate}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-brand-dark">{o.customerName}</div>
                        <div className="text-[10px] text-brand-muted font-mono mt-0.5">{o.customerEmail}</div>
                        <div className="text-[10px] text-brand-muted font-mono mt-0.5">{o.shippingAddress.city}, {o.shippingAddress.state}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1 max-w-[180px]">
                          {o.items.map((item, idx) => (
                            <span key={idx} className="truncate text-[11px] text-brand-dark font-medium">
                              {item.quantity}x {item.productName}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="font-bold text-brand-dark">₹{o.total.toLocaleString()}</div>
                        <div className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wider mt-0.5">{o.paymentMethod} • {o.paymentStatus}</div>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-block px-2.5 py-1 text-[10px] font-mono font-semibold ${
                          o.orderStatus === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : o.orderStatus === 'Cancelled'
                            ? 'bg-rose-50 text-rose-700 border border-rose-100'
                            : o.orderStatus === 'Shipped'
                            ? 'bg-blue-50 text-blue-700 border border-blue-100'
                            : 'bg-amber-50 text-amber-700 border border-amber-100 animate-pulse'
                        }`}>
                          {o.orderStatus}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled' && (
                          <div className="flex items-center justify-center gap-1.5">
                            <select
                              value={o.orderStatus}
                              onChange={(e) => onUpdateOrderStatus(o.id, e.target.value as Order['orderStatus'])}
                              className="bg-white border border-brand-border text-[10px] p-1.5 outline-none cursor-pointer focus:border-brand-primary"
                            >
                              <option value="Placed">Placed</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
