/**
 * ProductCard - Palmonas style
 */
import React from 'react';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onViewDetails: (id: string) => void;
  onToggleWishlist: (id: string) => void;
  isWishlisted: boolean;
  onAddToCart: (product: Product, size?: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
  onToggleWishlist,
  isWishlisted,
  onAddToCart
}) => {
  const discountPct = product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  return (
    <div
      className="product-card group relative bg-white flex flex-col cursor-pointer"
      style={{ minWidth: '220px' }}
    >
      {/* Image wrapper */}
      <div
        className="img-zoom-wrap relative bg-gray-50"
        style={{ aspectRatio: '3/4' }}
        onClick={() => onViewDetails(product.id)}
      >
        <img
          src={product.images[0]}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="product-card-img w-full h-full object-cover"
        />

        {/* Labels */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNewArrival && (
            <span className="label-tag">New</span>
          )}
          {product.isBestSeller && !product.isNewArrival && (
            <span className="label-tag">Best Seller</span>
          )}
          {discountPct >= 40 && (
            <span className="label-tag label-tag-red">Flat ₹999</span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          type="button"
          onClick={e => { e.stopPropagation(); onToggleWishlist(product.id); }}
          className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm hover:scale-110 transition-transform"
          aria-label="Add to wishlist"
        >
          <Heart
            className="w-4 h-4"
            style={{ fill: isWishlisted ? '#000' : 'none', color: '#000' }}
          />
        </button>

        {/* Quick Add overlay */}
        <div className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            type="button"
            onClick={e => { e.stopPropagation(); onAddToCart(product); }}
            className="w-full bg-black text-white text-[10px] font-bold uppercase tracking-widest py-2.5 hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Add to Bag
          </button>
        </div>
      </div>

      {/* Info */}
      <div
        className="flex flex-col gap-1 pt-3 px-1 pb-2"
        onClick={() => onViewDetails(product.id)}
      >
        {/* Rating */}
        <div className="flex items-center gap-1">
          {[1,2,3,4,5].map(s => (
            <Star
              key={s}
              className="w-2.5 h-2.5"
              style={{
                fill: s <= Math.round(product.rating) ? '#000' : 'none',
                color: '#000',
                strokeWidth: 1.5
              }}
            />
          ))}
          <span className="text-[10px] text-gray-400 ml-1">({product.reviewsCount})</span>
        </div>

        {/* Name */}
        <h3 className="text-xs font-medium text-black leading-snug line-clamp-2">{product.name}</h3>

        {/* Price */}
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-sm font-bold text-black">₹{product.price.toLocaleString()}</span>
          {product.mrp > product.price && (
            <span className="text-xs text-gray-400 line-through">₹{product.mrp.toLocaleString()}</span>
          )}
          {discountPct > 0 && (
            <span className="text-[10px] font-bold text-green-700">{discountPct}% off</span>
          )}
        </div>

        {/* Stock warning */}
        {product.stock <= 5 && product.stock > 0 && (
          <span className="text-[10px] text-red-600 font-medium">Only {product.stock} left!</span>
        )}
      </div>
    </div>
  );
};
