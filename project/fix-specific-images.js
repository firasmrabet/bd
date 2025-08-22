import fs from 'fs';
import path from 'path';

// Specific image mappings for better accuracy
const specificImageMappings = {
  // Cables should have cable images
  'cable': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&auto=format',
  'câble': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&auto=format',
  
  // Armoires and cabinets
  'armoire': 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop&auto=format',
  'coffret': 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop&auto=format',
  'tableau': 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop&auto=format',
  
  // Circuit breakers and protection devices
  'disjoncteur': 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=600&fit=crop&auto=format',
  'sectionneur': 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=600&fit=crop&auto=format',
  'parafoudre': 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=600&fit=crop&auto=format',
  'fusible': 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=600&fit=crop&auto=format',
  'relais': 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=600&fit=crop&auto=format',
  'contacteur': 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=600&fit=crop&auto=format',
  'bornier': 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=600&fit=crop&auto=format',
  'capteur': 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=600&fit=crop&auto=format',
  
  // Electronic components
  'condensateur': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop&auto=format',
  'variateur': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop&auto=format',
  'automate': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop&auto=format',
  
  // Heavy equipment
  'transformateur': 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop&auto=format',
  'moteur': 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop&auto=format',
  'projecteur': 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop&auto=format',
  
  // Cable management
  'goulotte': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&auto=format',
  'chemin': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&auto=format'
};

// Read the products.ts file
const productsPath = path.join(process.cwd(), 'src', 'data', 'products.ts');
let content = fs.readFileSync(productsPath, 'utf8');

console.log('🔧 Fixing specific product images...');

// Specific fixes for products that have wrong images
const specificFixes = [
  {
    productName: 'Câble Nexans 20kV XLPE Al 3x50mm²',
    correctImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&auto=format'
  },
  {
    productName: 'Câble Lapp ÖLFLEX CLASSIC 110 12G1.5',
    correctImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&auto=format'
  },
  {
    productName: 'Goulotte Legrand PVC 50x50 mm',
    correctImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&auto=format'
  }
];

// Apply specific fixes
specificFixes.forEach(fix => {
  const regex = new RegExp(`(name: '${fix.productName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'[\\s\\S]*?image: ')[^']*(')`);
  if (content.match(regex)) {
    content = content.replace(regex, `$1${fix.correctImage}$2`);
    console.log(`✅ Fixed: ${fix.productName}`);
  }
});

// General fix for all cables that don't have cable images
console.log('🔌 Fixing all cable products...');
const cablePattern = /name: '([^']*[Cc]âble[^']*)'[\s\S]*?image: '([^']*)'/g;
let cableMatch;
let cableUpdates = 0;

while ((cableMatch = cablePattern.exec(content)) !== null) {
  const [fullMatch, cableName, currentImage] = cableMatch;
  const correctCableImage = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&auto=format';
  
  if (currentImage !== correctCableImage) {
    content = content.replace(currentImage, correctCableImage);
    console.log(`✅ Fixed cable: ${cableName}`);
    cableUpdates++;
  }
}

// Fix image arrays for cables
console.log('🖼️ Fixing cable image arrays...');
const cableImageArrayPattern = /name: '([^']*[Cc]âble[^']*)'[\s\S]*?images: \[[^\]]*\]/g;
let cableArrayMatch;

while ((cableArrayMatch = cableImageArrayPattern.exec(content)) !== null) {
  const [fullMatch, cableName] = cableArrayMatch;
  const correctCableImage = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&auto=format';
  const newImageArray = `images: [\n      '${correctCableImage}'\n    ]`;
  
  content = content.replace(/images: \[[^\]]*\]/, newImageArray);
  console.log(`✅ Fixed cable array: ${cableName}`);
}

// Write the updated content
fs.writeFileSync(productsPath, content, 'utf8');

console.log('🎉 Specific image fixes completed!');
console.log(`📊 Fixed ${cableUpdates} cable images`);
console.log(`📁 File saved: ${productsPath}`);
console.log('🚀 All cable products now have proper cable images!');
