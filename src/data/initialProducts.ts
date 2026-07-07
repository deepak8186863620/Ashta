/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Palmonas 18K Gold Plated Solitaire Pendant',
    description: 'An elegant, tarnish-free 18K gold-plated pendant featuring a brilliant AAA-grade cubic zirconia solitaire suspended from an adjustable fine cable chain. Perfect for everyday wear, stacking, or an elegant dinner date.',
    price: 1299,
    mrp: 2499,
    discount: 48,
    category: 'Necklaces',
    material: '18K Gold Plated',
    occasion: 'Daily Wear',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=600&auto=format&fit=crop'
    ],
    rating: 4.8,
    reviewsCount: 124,
    stock: 25,
    isBestSeller: true,
    isNewArrival: false,
    specifications: {
      Weight: '3.5 grams',
      Length: '16 inches + 2 inches extender',
      BaseMetal: 'Premium Brass',
      Gemstone: 'AAA Cubic Zirconia',
      Warranty: 'Lifetime Tarnish-Free Warranty'
    },
    reviews: [
      {
        id: 'r1_1',
        productId: 'p1',
        userName: 'Priya Sharma',
        rating: 5,
        comment: 'Absolutely gorgeous! It looks just like solid gold. I have worn it in the shower for two weeks and it has not tarnished at all!',
        date: '2026-06-15',
        verified: true
      },
      {
        id: 'r1_2',
        productId: 'p1',
        userName: 'Ananya Iyer',
        rating: 4,
        comment: 'Very delicate and classy. Packaging was beautiful too.',
        date: '2026-06-20',
        verified: true
      }
    ]
  },
  {
    id: 'p2',
    name: 'Classic 925 Sterling Silver Hoop Earrings',
    description: 'Timeless, lightweight hoops crafted in certified 925 sterling silver with a high-polish rhodium finish to prevent oxidation. Perfect for sensitive ears and a must-have accessory for office and casual styling.',
    price: 999,
    mrp: 1999,
    discount: 50,
    category: 'Earrings',
    material: '925 Sterling Silver',
    occasion: 'Office Wear',
    images: [
      'https://images.unsplash.com/photo-1635767790038-33d964f2293b?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop'
    ],
    rating: 4.6,
    reviewsCount: 89,
    stock: 40,
    isBestSeller: false,
    isNewArrival: true,
    specifications: {
      Weight: '2.8 grams',
      Size: '20mm diameter',
      BaseMetal: '925 Sterling Silver',
      Gemstone: 'None',
      Warranty: '1 Year Warranty'
    },
    reviews: [
      {
        id: 'r2_1',
        productId: 'p2',
        userName: 'Meera Patel',
        rating: 5,
        comment: 'Extremely lightweight, does not irritate my skin. I wear it to the office daily.',
        date: '2026-05-18',
        verified: true
      }
    ]
  },
  {
    id: 'p3',
    name: 'Palmonas Signature Diamond Choker Set',
    description: 'An exquisite, modern choker set embellished with brilliant lab-grown diamond simulants, sleek baguette crystals, and delicate freshwater pearls, paired with matching drop earrings. A professional, high-end set designed for formal galas and luxury celebrations.',
    price: 4599,
    mrp: 8999,
    discount: 49,
    category: 'Bridal Sets',
    material: '925 Sterling Silver',
    occasion: 'Party',
    images: [
      'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?q=80&w=600&auto=format&fit=crop'
    ],
    rating: 4.9,
    reviewsCount: 42,
    stock: 8,
    isBestSeller: true,
    isNewArrival: false,
    specifications: {
      Weight: '18.5 grams',
      Size: 'Adjustable clasp chain',
      BaseMetal: '925 Sterling Silver',
      Gemstone: 'Lab-Grown Diamonds & Pearls',
      Warranty: 'Lifetime Tarnish-Free Warranty'
    },
    reviews: [
      {
        id: 'r3_1',
        productId: 'p3',
        userName: 'Kriti Deshmukh',
        rating: 5,
        comment: 'Absolutely stunning! Wore this for an awards dinner and got so many compliments. The sparkle is unparalleled.',
        date: '2026-06-10',
        verified: true
      }
    ]
  },
  {
    id: 'p4',
    name: 'Celestial Rose Gold Adjustable Ring',
    description: 'Featuring a delicate star and crescent moon motif studded with micro-pave crystals, this ring is crafted in premium brass with thick rose gold electroplating and is easily adjustable to fit any finger size.',
    price: 799,
    mrp: 1499,
    discount: 47,
    category: 'Rings',
    material: 'Rose Gold Finish',
    occasion: 'Party',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=600&auto=format&fit=crop'
    ],
    rating: 4.5,
    reviewsCount: 74,
    stock: 50,
    isBestSeller: false,
    isNewArrival: false,
    specifications: {
      Weight: '1.5 grams',
      Size: 'Adjustable (Free Size)',
      BaseMetal: 'Brass',
      Gemstone: 'Micro-Pave Swiss Zirconia',
      Warranty: '6 Months Polish Warranty'
    },
    reviews: [
      {
        id: 'r4_1',
        productId: 'p4',
        userName: 'Rhea Mehta',
        rating: 4,
        comment: 'Cute, sparkly and super convenient that it is adjustable. Love the rose gold color!',
        date: '2026-06-25',
        verified: true
      }
    ]
  },
  {
    id: 'p5',
    name: 'Palmonas Contemporary Link Necklace',
    description: 'A sleek, high-polish link necklace crafted in tarnish-free 18K gold plating over a premium sterling silver base. Features a clean geometric design built for the modern fashion-forward individual.',
    price: 1599,
    mrp: 2999,
    discount: 47,
    category: 'Necklaces',
    material: '18K Gold Plated',
    occasion: 'Daily Wear',
    images: [
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop'
    ],
    rating: 4.7,
    reviewsCount: 56,
    stock: 12,
    isBestSeller: true,
    isNewArrival: true,
    specifications: {
      Weight: '6.5 grams',
      Length: '18 inches',
      BaseMetal: '925 Sterling Silver',
      Gemstone: 'None',
      Warranty: 'Lifetime Tarnish-Free Warranty'
    },
    reviews: [
      {
        id: 'r5_1',
        productId: 'p5',
        userName: 'Shalini Verma',
        rating: 5,
        comment: 'Perfect modern design. Simple, daily wear friendly, doesn’t look heavy at all.',
        date: '2026-07-02',
        verified: true
      }
    ]
  },
  {
    id: 'p6',
    name: 'Timeless Silver Zirconia Tennis Bracelet',
    description: 'Elegant line of brilliant-cut cubic zirconia crystals claw-set in fine 925 sterling silver with a robust box clasp and safety lock. An iconic piece that brings effortless sparkle to any outfit.',
    price: 2199,
    mrp: 3999,
    discount: 45,
    category: 'Bracelets',
    material: '925 Sterling Silver',
    occasion: 'Party',
    images: [
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop'
    ],
    rating: 4.8,
    reviewsCount: 93,
    stock: 15,
    isBestSeller: true,
    isNewArrival: false,
    specifications: {
      Weight: '6.2 grams',
      Length: '7 inches with safety clasp',
      BaseMetal: '925 Sterling Silver',
      Gemstone: 'Hearts & Arrows Cubic Zirconia',
      Warranty: '1 Year Rhodium Polish Warranty'
    },
    reviews: []
  },
  {
    id: 'p7',
    name: 'Gilded Pearl Anklet (Single / Pair)',
    description: 'An elegant anklet featuring small tarnish-free gold beads interspersed with delicate freshwater seed pearls. Made with highly durable stainless steel core to handle moisture and sand with ease.',
    price: 699,
    mrp: 1299,
    discount: 46,
    category: 'Anklets',
    material: '18K Gold Plated',
    occasion: 'Daily Wear',
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1543294001-f7cbfe92237e?q=80&w=600&auto=format&fit=crop'
    ],
    rating: 4.4,
    reviewsCount: 31,
    stock: 35,
    isBestSeller: false,
    isNewArrival: true,
    specifications: {
      Weight: '3.1 grams',
      Length: '9 inches + 1.5 inches extension chain',
      BaseMetal: 'Stainless Steel Core',
      Gemstone: 'Natural Freshwater Seed Pearls',
      Warranty: '100% Waterproof / Pool proof'
    },
    reviews: []
  },
  {
    id: 'p8',
    name: 'Sleek Emerald Drop Hoop Earrings',
    description: 'Modern, minimal drop hoops featuring brilliant hand-cut emerald-cut emerald green crystals set in high-polish 925 sterling silver. Perfect for formal wear, cocktail parties, and modern evening wear.',
    price: 1899,
    mrp: 3499,
    discount: 45,
    category: 'Earrings',
    material: '925 Sterling Silver',
    occasion: 'Party',
    images: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1635767790038-33d964f2293b?q=80&w=600&auto=format&fit=crop'
    ],
    rating: 4.7,
    reviewsCount: 61,
    stock: 5,
    isBestSeller: true,
    isNewArrival: false,
    specifications: {
      Weight: '4.5 grams per earring',
      Length: '1.2 inches',
      BaseMetal: '925 Sterling Silver',
      Gemstone: 'Emerald-Cut Green Zirconia',
      Warranty: 'Lifetime Tarnish-Free Warranty'
    },
    reviews: [
      {
        id: 'r8_1',
        productId: 'p8',
        userName: 'Tanvi Shah',
        rating: 5,
        comment: 'These hoops are beautiful! Very modern, elegant and comfortable to wear. Perfect addition to my collection.',
        date: '2026-06-30',
        verified: true
      }
    ]
  },
  {
    id: 'p9',
    name: 'Palmonas Geometric Twist Cuff',
    description: 'An architecturally inspired twist cuff bracelet crafted in durable stainless steel with thick, tarnish-free 18K gold plating. Features a contemporary open silhouette that fits comfortably on any wrist.',
    price: 1199,
    mrp: 2199,
    discount: 45,
    category: 'Bracelets',
    material: '18K Gold Plated',
    occasion: 'Office Wear',
    images: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop'
    ],
    rating: 4.7,
    reviewsCount: 22,
    stock: 18,
    isBestSeller: false,
    isNewArrival: false,
    specifications: {
      Weight: '11 grams',
      Size: 'Flexible adjustable cuff',
      BaseMetal: 'Premium Stainless Steel',
      Gemstone: 'None',
      Warranty: 'Lifetime Tarnish-Free Warranty'
    },
    reviews: []
  }
];
