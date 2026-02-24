const fs = require('fs');
const newLayoutContent = fs.readFileSync('new_layout.jsx', 'utf8');
const originalContent = fs.readFileSync('components/searchBar.jsx', 'utf8');

const targetStr = '  return (\n    <div className="flex justify-between items-center';
const idx = originalContent.indexOf(targetStr);

if (idx !== -1) {
    const updatedContent = originalContent.substring(0, idx) + newLayoutContent;
    fs.writeFileSync('components/searchBar.jsx', updatedContent, 'utf8');
    console.log("Successfully replaced layout in searchBar.jsx");
} else {
    console.log("Could not find the target return block to replace");
}
