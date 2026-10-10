const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');
const line10 = lines[9];
console.log('Line 10 length:', line10.length);
// Find buttons and their text in line 10
const regex = /<button[^>]*>.*?<\/button>/g;
let m;
while ((m = regex.exec(line10)) !== null) {
  const snippet = m[0].replace(/data:image\/[^;]+;base64,[^"]+/g, '[BASE64]');
  console.log(snippet.slice(0, 150));
}
