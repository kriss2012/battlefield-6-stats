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

const currentDate = new Date().toISOString().split('T')[0];

walkSync(srcDir, (filePath) => {
  if (filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);

    const targetString = `* #Made WIth Love TO The Kiri Family\n */`;
    const replacementString = `* File: ${fileName}\n * Date: ${currentDate}\n * #by Kiri Team\n */`;

    if (content.includes(targetString) && !content.includes(`* File: ${fileName}`)) {
      let newContent = content.replace(targetString, replacementString);
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Added file name and date to: ${filePath}`);
    } else if (content.includes('* #by Kiri Team\r\n */') && !content.includes(`* File: ${fileName}`)) {
      // Handle windows line endings if they exist
      const targetStringWin = `* #by Kiri Team\r\n */`;
      const replacementStringWin = `* File: ${fileName}\r\n * Date: ${currentDate}\r\n * #by Kiri Team\r\n */`;
      let newContent = content.replace(targetStringWin, replacementStringWin);
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Added file name and date to (Win CRLF): ${filePath}`);
    }
  }
});
console.log("Done updating comments with file name and date.");
