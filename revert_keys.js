const fs = require('fs');
const path = require('path');

function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            walk(filePath);
        } else if (filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.js')) {
            let content = fs.readFileSync(filePath, 'utf8');
            if (content.includes("process.env.INTERNAL_API_KEY || 'eips-secret-key-2024'")) {
                content = content.replace(/process\.env\.INTERNAL_API_KEY \|\| 'eips-secret-key-2024'/g, "'dev-secret-key'");
                fs.writeFileSync(filePath, content);
                console.log('Reverted', filePath);
            }
        }
    }
}

walk('./apps/web/app/api');
walk('./apps/web/app/lib');
