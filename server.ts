/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini API client
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    throw new Error('GEMINI_API_KEY is not configured. Please add it in the Secrets panel.');
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// 1. AI Jewelry Stylist Endpoint
app.post('/api/stylist', async (req, res) => {
  try {
    const { message, history, catalog } = req.body;

    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    // Lazy load and handle missing API key gracefully
    let ai;
    try {
      ai = getAiClient();
    } catch (keyError: any) {
      // Graceful fallback for missing key
      res.json({
        reply: "✨ [Aurelia AI Stylist Demo Mode] ✨\n\nI would love to help you select the perfect piece of jewelry! To activate my real AI styling capabilities, please add a valid **GEMINI_API_KEY** in the Secrets panel.\n\nHere is a recommendation based on our premium collection: Our *Aurelia 18K Gold Plated Solitaire Pendant* paired with *Classic 925 Sterling Silver Hoop Earrings* is an absolute customer favorite for timeless styling!",
        suggestedProductIds: ['p1', 'p2']
      });
      return;
    }

    // Build the context system prompt
    const systemInstruction = `
You are the "Aurelia Luxe AI Personal Jewelry Stylist & Gifting Advisor".
Your job is to assist clients in selecting exquisite gold-plated, sterling silver, or fashion jewelry.
We sell necklaces, earrings, rings, bracelets, anklets, and signature sets.

Here is our current product catalog:
${JSON.stringify(catalog, null, 2)}

Instructions:
1. Speak in a sophisticated, elegant, warm, and professional D2C fashion expert tone.
2. Recommend specific products from our catalog that fit the user's budget, occasion (wedding, festive, daily wear, office wear, party), material preference, or gift recipient.
3. Provide styling tips on how to pair items ("complete the look"), stack rings, or layer necklaces.
4. Keep replies relatively concise, engaging, and readable.
5. In your response, if you mention any products from our catalog, list their product IDs in a clean JSON structure at the very end of your response under a special tag: [RECOMMENDED: p1, p2]. This allows the UI to display the product cards directly! Example: "[RECOMMENDED: p1, p3]".
`;

    // Map history to Google GenAI schema
    const contents = [];
    if (history && Array.isArray(history)) {
      for (const msg of history) {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    const textReply = response.text || "I apologize, but I could not formulate a recommendation at this moment.";

    // Parse product IDs out of the reply if present
    const recommendedMatch = textReply.match(/\[RECOMMENDED:\s*([^\]]+)\]/);
    let suggestedProductIds: string[] = [];
    if (recommendedMatch) {
      suggestedProductIds = recommendedMatch[1]
        .split(',')
        .map(id => id.trim());
    }

    // Clean up the text reply to remove the structural tag so it looks elegant to the user
    const cleanedReply = textReply.replace(/\[RECOMMENDED:\s*[^\]]+\]/, '').trim();

    res.json({
      reply: cleanedReply,
      suggestedProductIds
    });

  } catch (error: any) {
    console.error('Error in /api/stylist:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

// 2. Coupon Validation Endpoint
app.post('/api/coupon', (req, res) => {
  const { code, subtotal } = req.body;
  if (!code) {
    res.status(400).json({ error: 'Coupon code is required' });
    return;
  }

  const coupons: Record<string, { type: 'percentage' | 'fixed'; value: number; min: number; desc: string }> = {
    'WELCOME10': { type: 'percentage', value: 10, min: 0, desc: '10% off for new customers!' },
    'ELEGANCE25': { type: 'percentage', value: 25, min: 1999, desc: '25% off on orders above ₹1999!' },
    'GOLDEN500': { type: 'fixed', value: 500, min: 2999, desc: 'Flat ₹500 off on luxury sets above ₹2999!' },
    'TARNISHFREE': { type: 'percentage', value: 15, min: 999, desc: '15% off waterproof jewelry!' }
  };

  const upperCode = code.toUpperCase();
  const coupon = coupons[upperCode];

  if (!coupon) {
    res.status(404).json({ error: 'Invalid coupon code' });
    return;
  }

  if (subtotal < coupon.min) {
    res.status(400).json({ error: `Minimum order value for ${upperCode} is ₹${coupon.min}` });
    return;
  }

  res.json({
    code: upperCode,
    type: coupon.type,
    value: coupon.value,
    description: coupon.desc
  });
});

// 3. Vite development server middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite middleware integrated.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
