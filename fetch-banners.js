import fs from 'fs';
fetch('https://ASHTA.com/').then(r=>r.text()).then(t => { 
  const urls = [...t.matchAll(/https:\/\/cdn\.shopify\.com\/s\/files\/[^"'\?\s]+\.(?:jpg|webp|png|jpeg)/gi)].map(m => m[0]); 
  console.log([...new Set(urls)].slice(0, 50).join('\n')); 
})
