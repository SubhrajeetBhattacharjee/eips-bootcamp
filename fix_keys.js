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
            if (content.includes("'dev-secret-key'")) {
                content = content.replace(/'dev-secret-key'/g, "process.env.INTERNAL_API_KEY || 'eips-secret-key-2024'");
                fs.writeFileSync(filePath, content);
                console.log('Fixed', filePath);
            }
        }
    }
}

walk('./apps/web/app/api');
