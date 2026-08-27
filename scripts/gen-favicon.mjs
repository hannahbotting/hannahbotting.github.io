import sharp from 'sharp';

const hash = 'f3b3d719305fd56253fd657958d7c90e';
const size = 256;
const url = `https://gravatar.com/avatar/${hash}?s=${size * 2}&d=identicon`;

const response = await fetch(url);
if (!response.ok) {
  throw new Error(`Failed to fetch Gravatar: ${response.status}`);
}
const buffer = Buffer.from(await response.arrayBuffer());

const circleSvg = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
     <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}"/>
   </svg>`,
);

await sharp(buffer)
  .resize(size, size, { fit: 'cover' })
  .composite([{ input: circleSvg, blend: 'dest-in' }])
  .png()
  .toFile('public/favicon.png');

console.log('Generated public/favicon.png');
