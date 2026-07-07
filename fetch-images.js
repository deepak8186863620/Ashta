import fs from 'fs';

async function fetchImages() {
  const res = await fetch('https://ASHTA.com/collections/all');
  const text = await res.text();
  const regex = /https:\/\/www\.ASHTA\.com\/cdn\/shop\/files\/[^"'\?\s]+\.(?:jpg|png|webp)/g;
  const matches = [...text.matchAll(regex)].map(m => m[0]);
  
  // also look for cdn.shopify.com
  const regex2 = /https:\/\/cdn\.shopify\.com\/s\/files\/[^"'\?\s]+\.(?:jpg|png|webp)/g;
  const matches2 = [...text.matchAll(regex2)].map(m => m[0]);
  
  const allUrls = [...new Set([...matches, ...matches2])];
  
  // filter out logos, small icons, etc.
  const productImages = allUrls.filter(u => u.includes('files/') && !u.includes('logo') && !u.includes('icon'));
  
  console.log(productImages.slice(0, 40).join('\n'));
}

fetchImages();
