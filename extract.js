const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

const imgMatches = [...content.matchAll(/<img [^>]*src="([^"]+)"[^>]*alt="([^"]*)"/g)];
console.log('Total extracted:', imgMatches.length);

const images = {};
images.story1 = imgMatches[0][1]; // Доступ к важным сайтам
images.story2 = imgMatches[1][1]; // Защита близких от взлома
images.story3 = imgMatches[2][1]; // Оформите налоговый вычет
images.story4 = imgMatches[3][1]; // Аренда
images.docPassport = imgMatches[4][1]; // Паспорт
images.docSnils = imgMatches[5][1]; // СНИЛС
images.docInn = imgMatches[6][1]; // ИНН
images.docAll = imgMatches[7][1]; // Все
images.servHealth = imgMatches[8][1]; // Здоровье
images.servAuto = imgMatches[9][1]; // Авто
images.servSchool = imgMatches[10][1]; // Моя школа
images.servOther = imgMatches[11][1]; // Другие
images.assistant = imgMatches[12][1]; // Помощник

fs.writeFileSync('extracted_images.json', JSON.stringify(images, null, 2));
console.log('Successfully saved extracted_images.json!');
