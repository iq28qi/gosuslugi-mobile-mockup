const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

// Find all image sources and their sizes
const imgMatches = [...content.matchAll(/<img [^>]*src="([^"]+)"[^>]*alt="([^"]*)"/g)];
console.log('Found images:', imgMatches.length);
imgMatches.forEach((m, idx) => {
  const isBase64 = m[1].startsWith('data:image');
  console.log(`Image ${idx+1}: alt="${m[2]}", isBase64=${isBase64}, length=${m[1].length}`);
});
