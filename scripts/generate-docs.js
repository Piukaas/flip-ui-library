const fs = require('fs');
const path = require('path');

// Configuration paths
const cssPath = path.join(__dirname, '../flip.css');
const outputDir = path.join(__dirname, '../docs/components');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, {recursive: true});
}

// Read the CSS library file
const cssContent = fs.readFileSync(cssPath, 'utf8');

// Match everything inside /* @doc ... */
const docRegex = /\/\* @doc([\s\S]*?)\*\//g;
let match;

console.log('📦 Parsing CSS for documentation...');

while ((match = docRegex.exec(cssContent)) !== null) {
    const block = match[1].trim();

    // Extract fields using simple regex parsing
    const titleMatch = block.match(/Title:\s*(.*)/);
    const descMatch = block.match(/Description:\s*(.*)/);
    const previewMatch = block.match(/Preview:\s*\[([\s\S]*?)]/);

    if (titleMatch) {
        const title = titleMatch[1].trim();
        const desc = descMatch ? descMatch[1].trim() : '';
        const preview = previewMatch ? previewMatch[1].trim() : '';
        const slug = title.toLowerCase().replace(/\s+/g, '-');

        // Generate the Markdown template
        const mdContent = `---
title: ${title}
editLink: false
---

# ${title}

${desc}

## Interactive Preview

<flip-preview>
  ${preview}
</flip-preview>

\`\`\`html
${preview}
\`\`\`
`;

        fs.writeFileSync(path.join(outputDir, `${slug}.md`), mdContent);
        console.log(`✅ Generated: ${slug}.md`);
    }
}
