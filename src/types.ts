/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // Actual selling price in INR
  mrp: number; // Strike-through original price
  discount: number; // Percentage discount
  category: 'Necklaces' | 'Earrings' | 'Rings' | 'Bracelets' | 'Anklets' | 'Mangalsutras' | 'Bridal Sets';
  material: '18K Gold Plated' | '925 Sterling Silver' | 'Premium Kundan' | 'Rose Gold Finish' | 'Polki Fashion';
  occasion: 'Wedding' | 'Daily Wear' | 'Festive' | 'Office Wear' | 'Party';
  images: string[]; // Minimum 2 images for hover effect
  rating: number; // Avg rating, e.g. 4.8
  reviewsCount: number;
  stock: number; // Inventory level
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  specifications: {
    Weight?: string;
    Length?: string;
    Size?: string;
    Gemstone?: string;
    BaseMetal?: string;
    Warranty?: string;
  };
  reviews?: Review[];
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  image?: string; // Optional user uploaded photo URL
  verified: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    addressLine: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  couponApplied?: string;
  discountAmount: number;
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'COD';
  paymentStatus: 'Pending' | 'Paid' | 'COD_Confirmed';
  orderStatus: 'Placed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  orderDate: string;
  estimatedDelivery: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minOrderValue: number;
  description: string;
}
