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
            if (content.includes("http://localhost:4000")) {
                content = content.replace(/http:\/\/localhost:4000/g, "http://127.0.0.1:4000");
                fs.writeFileSync(filePath, content);
                console.log('Fixed', filePath);
            }
        }
    }
}

walk('./apps/web/app/api');
walk('./apps/web/app/lib');
