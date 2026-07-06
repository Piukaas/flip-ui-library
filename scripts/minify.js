const fs = require('fs');
const path = require('path');

// Target paths
const srcPath = path.join(__dirname, '../flip.css');
const distDir = path.join(__dirname, '../dist');
const distPath = path.join(distDir, 'flip.min.css');

// Ensure the distribution directory exists
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, {recursive: true});
}

try {
    console.log('📦 Minifying flip.css for production distribution...');
    let css = fs.readFileSync(srcPath, 'utf8');

    // 1. Remove all comments (including the /* @doc ... */ blocks)
    css = css.replace(/\/\*[\s\S]*?\*\//g, '');

    // 2. Convert all newlines, carriage returns, and tabs into a single space
    css = css.replace(/[\r\n\t]+/g, ' ');

    // 3. Collapse multiple consecutive spaces down into a single space
    css = css.replace(/\s+/g, ' ');

    // 4. Remove spaces around structural elements only ({ } ; : ,)
    // This safely leaves spaces inside calc(l - 0.08) and oklch(from var(--x) l c h) intact!
    css = css.replace(/\s*([{};:,])\s*/g, '$1');

    // 5. Remove unnecessary trailing semicolons right before a closing brace
    css = css.replace(/;}/g, '}');

    // Clean up any remaining whitespace at the edges of the file
    css = css.trim();

    // Write the final minified file to the distribution folder
    fs.writeFileSync(distPath, css);
    console.log('⚡️ Success! Production asset compiled to dist/flip.min.css');

} catch (error) {
    console.error('❌ Minification failed:', error.message);
    process.exit(1);
}