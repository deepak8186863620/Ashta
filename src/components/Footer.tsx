/**
 * Footer - Palmonas exact replica
 */
import React, { useState } from 'react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(''); }
  };

  return (
    <footer className="bg-white border-t border-gray-200 mt-16">

      {/* Trust / Shop With Confidence */}
      <div className="border-b border-gray-100 py-10 px-4 md:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="text-3xl">🧴</div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-black">Skin Safe</h4>
            <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
              Our jewelry is hypoallergenic and skin-safe, crafted with care to ensure comfort for all skin types.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="text-3xl">✨</div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-black">18K Gold Vermeil</h4>
            <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
              Premium metals like surgical steel, sterling silver, and thick 18k gold plating — durability and lasting shine.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="text-3xl">💎</div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-black">Authentic Diamonds</h4>
            <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
              Our lab-grown diamonds are SGL Certified, ensuring the highest standards of quality and authenticity.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="py-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">

          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-5">
            <div>
              <div className="font-serif font-bold text-black italic" style={{ fontSize: '22px', letterSpacing: '0.1em' }}>
                PALMONAS
              </div>
              <p className="text-xs text-gray-500 mt-3 leading-relaxed">
                Demifine® Jewellery — 18k thick Gold Plated. Waterproof, tarnishproof, hypoallergenic.
              </p>
            </div>
            {/* Newsletter */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-black mb-2">Subscribe for offers</p>
              {!subscribed ? (
                <form onSubmit={handleSubscribe} className="flex gap-0">
                  <input
                    id="newsletter-email"
                    type="email"
                    required
                    placeholder="Your email address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="flex-1 border border-black text-xs px-3 py-2.5 outline-none bg-white text-black placeholder-gray-400"
                    style={{ borderRight: 'none' }}
                  />
                  <button
                    id="newsletter-submit"
                    type="submit"
                    className="btn-black px-4 py-2.5"
                    style={{ borderRadius: 0 }}
                  >
                    →
                  </button>
                </form>
              ) : (
                <p className="text-xs text-green-700 font-medium">✓ You're subscribed!</p>
              )}
            </div>
            {/* Social */}
            <div className="flex gap-4">
              <a href="https://instagram.com/palmonas" target="_blank" rel="noopener noreferrer" className="text-xs text-black hover:opacity-50 font-semibold uppercase tracking-wider">Instagram</a>
              <a href="#" className="text-xs text-black hover:opacity-50 font-semibold uppercase tracking-wider">Facebook</a>
            </div>
          </div>

          {/* Policy */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-black border-b border-gray-200 pb-2">Policy</h4>
            <ul className="flex flex-col gap-3">
              {[
                'Shipping & Delivery Policy',
                'Return & Exchange Policy',
                'Palmonas Rewards Policy',
                'Lifetime Warranty Policy',
                'Lifetime BuyBack Policy',
                'Payment Policy',
                'Grievance Redressal Policy',
              ].map(item => (
                <li key={item}>
                  <button onClick={() => onNavigate('faq')} className="text-xs text-gray-500 hover:text-black text-left transition-colors">{item}</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-black border-b border-gray-200 pb-2">Help</h4>
            <ul className="flex flex-col gap-3">
              {[
                ["FAQ's", 'faq'],
                ['Contact Us', 'contact'],
                ['Terms of Service', 'faq'],
                ['Privacy Policy', 'faq'],
                ['Store Locator', 'store-locator'],
                ['About Us', 'about'],
              ].map(([label, view]) => (
                <li key={label}>
                  <button onClick={() => onNavigate(view as string)} className="text-xs text-gray-500 hover:text-black text-left transition-colors">{label}</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Collections */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-black border-b border-gray-200 pb-2">Collections</h4>
            <ul className="flex flex-col gap-3">
              {[
                'New Arrivals',
                'Best Seller',
                'Fine Silver',
                '9KT Fine Gold',
                'Demi-fine® Jewellery',
                'Gifting',
                'Earrings',
                'Necklaces',
                'Bracelets',
                'Rings',
                'Mangalsutras',
              ].map(item => (
                <li key={item}>
                  <button onClick={() => onNavigate('shop')} className="text-xs text-gray-500 hover:text-black text-left transition-colors">{item}</button>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* Store Address */}
      <div className="border-t border-gray-100 py-6 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] text-gray-400 text-center leading-relaxed">
            <strong className="text-gray-600">Demifine® FASHION PVT LTD</strong><br />
            Registered Address: Office No 501/502/503/504/505(A) 5th Floor, Verdant 84, Plot 1, Lane Z, Koregaon Park Annexe, Mundhwa, Pune, Maharashtra 411036.
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-black text-white py-4 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3 text-[10px]">
          <span className="text-gray-400">© 2026 Palmonas. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <div className="flex gap-2 items-center">
              <span className="text-gray-400">Secure Payments:</span>
              {['UPI', 'VISA', 'MC', 'COD'].map(m => (
                <span key={m} className="bg-white text-black text-[9px] font-bold px-2 py-0.5 rounded">{m}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
