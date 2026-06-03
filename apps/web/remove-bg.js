const sharp = require('sharp');

async function processImage() {
  const { data, info } = await sharp('public/logo-original.jpg')
    .raw()
    .ensureAlpha()
    .toBuffer({ resolveWithObject: true });

  // Make dark pixels transparent
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // The logo is bright green, the background is dark green/black.
    // If the pixel is relatively dark or heavily skewed to very dark green, make it transparent.
    // A simple threshold: if it's less bright than some value, hide it.
    // We can also check if green is high.
    const brightness = (r + g + b) / 3;
    if (brightness < 60) {
      data[i + 3] = 0; // Alpha to 0
    } else {
      // Smooth anti-aliasing for edges
      if (brightness >= 60 && brightness < 100) {
        data[i + 3] = Math.floor(((brightness - 60) / 40) * 255);
      }
    }
  }

  await sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4
    }
  })
  .png()
  .toFile('public/logo.png');

  // Also create icon.png
  await sharp('public/logo.png')
    .resize(32, 32)
    .toFile('app/icon.png');
    
  console.log('Background removed successfully!');
}

processImage().catch(console.error);
