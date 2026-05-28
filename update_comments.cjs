const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walkSync(dir, callback) {
  fs.readdirSync(dir).forEach(file => {
    let fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkSync(fullPath, callback);
    } else {
      callback(fullPath);
    }
  });
}

const targetString = `* Use: Imported and utilized across the application as part of the game's system logic.\n */`;
const replacementString = `* Use: Imported and utilized across the application as part of the game's system logic.\n * #by Kiri Team\n */`;

walkSync(srcDir, (filePath) => {
  if (filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // For files that got the exact comment block added by the previous script
    if (content.includes(targetString) && !content.includes('#by Kiri Team')) {
      let newContent = content.replace(targetString, replacementString);
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Updated comments in: ${filePath}`);
    } 
    // For files like Hero3D and ThreeScene that had custom comments, we can just append it before the */
    else if (content.includes('*/') && !content.includes('#by Kiri Team') && content.startsWith('/**')) {
       let newContent = content.replace(/\n \*\//, '\n * #by Kiri Team\n */');
       fs.writeFileSync(filePath, newContent, 'utf8');
       console.log(`Updated custom comments in: ${filePath}`);
    }
  }
});
console.log("Done updating comments with #by Kiri Team.");
