const fs = require('fs');
const path = require('path');

const mediapipeFilePath = path.resolve(
  __dirname,
  'node_modules',
  '@mediapipe',
  'tasks-vision',
  'vision_bundle_mjs.js'
);

// Check if the file exists
if (fs.existsSync(mediapipeFilePath)) {
  // Read the file
  let fileContent = fs.readFileSync(mediapipeFilePath, 'utf-8');

  // Find and remove the sourceMappingURL reference
  const sourceMapRegex = /\/\/# sourceMappingURL=vision_bundle_mjs.js.map/g;
  fileContent = fileContent.replace(sourceMapRegex, '// //# sourceMappingURL=vision_bundle_mjs.js.map');

  // Write the modified content back to the file
  fs.writeFileSync(mediapipeFilePath, fileContent, 'utf-8');

  console.log('Source map reference removed successfully.');
} else {
  console.log('Mediapipe vision_bundle_mjs.js file not found.');
}
