// api/icon.js
const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
    const iconPath = path.join(__dirname, '../public/icon.png');
    
    try {
        const icon = fs.readFileSync(iconPath);
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 'public, max-age=31536000');
        res.status(200).send(icon);
    } catch (error) {
        res.status(404).send('Icon not found');
    }
};