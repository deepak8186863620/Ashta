const fs = require('fs');
fetch('https://ASHTA.com/collections/necklaces').then(r=>r.text()).then(t => {
  const urls = [...t.matchAll(/https:\/\/www\.ASHTA\.com\/cdn\/shop\/files\/[^\s"'\?]+\.(jpg|webp|png|jpeg)/g)].map(m => m[0]);
  const cdnUrls = [...t.matchAll(/https:\/\/cdn\.shopify\.com\/s\/files\/[^\s"'\?]+\.(jpg|webp|png|jpeg)/g)].map(m => m[0]);
  console.log(Array.from(new Set([...urls, ...cdnUrls])).join('\n'));
});
