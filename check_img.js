const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');
console.log('Total lines:', lines.length);
lines.forEach((l, i) => {
  const matches = [...l.matchAll(/<img [^>]*alt="([^"]*)"/g)];
  if (matches.length > 0) {
    console.log(`Line ${i+1}: ${matches.length} images`);
    matches.forEach(m => console.log('  alt:', m[1]));
  }
});
