const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            walk(dirPath, callback);
        } else if (dirPath.endsWith('.ts') || dirPath.endsWith('.tsx')) {
            callback(dirPath);
        }
    });
}

const apiDir = '/Users/subhrajeetbhattacharjeee/Downloads/eips-bootcamp/apps/web/app/api';

walk(apiDir, (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Remove resolveInternalUserId function entirely
    content = content.replace(/async function resolveInternalUserId\([^)]+\)\s*\{[\s\S]*?\n\}\n/g, '');

    // Replace clerkId query params with userId
    content = content.replace(/searchParams\.get\('clerkId'\)/g, "searchParams.get('userId')");
    content = content.replace(/const clerkId = body\.userId/g, "const userId = body.userId");
    content = content.replace(/const { clerkId, /g, "const { userId, ");
    content = content.replace(/clerkId/g, "userId");

    // Remove user resolution
    content = content.replace(/const user = await resolveInternalUserId\(userId\);\s*\n\s*if \(\!user\?\.id\)\s*\{\s*\n\s*return NextResponse\.json\(\{ message: 'User not found' \}, \{ status: 404 \}\);\s*\n\s*\}/g, "");
    content = content.replace(/let user = await resolveInternalUserId\(userId\);\s*\n\s*if \(\!user\?\.id\)\s*\{[\s\S]*?if \(\!user\?\.id\)\s*\{\s*\n\s*return NextResponse\.json\(\{ message: 'User not found' \}, \{ status: 404 \}\);\s*\n\s*\}/g, "");
    
    // In API calls, replace user.id with userId
    content = content.replace(/body: JSON\.stringify\(\{ userId: user\.id/g, "body: JSON.stringify({ userId: userId");
    content = content.replace(/\$\{API_BASE\}\/[^`]*?\$\{user\.id\}/g, (match) => match.replace('user.id', 'userId'));

    if (content !== original) {
        fs.writeFileSync(filePath, content);
        console.log(`Updated: ${filePath}`);
    }
});

// Update frontend fetch calls
const dashboardDir = '/Users/subhrajeetbhattacharjeee/Downloads/eips-bootcamp/apps/web/app/dashboard';
walk(dashboardDir, (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    content = content.replace(/\?clerkId=/g, "?userId=");
    content = content.replace(/clerkId: /g, "userId: ");

    if (content !== original) {
        fs.writeFileSync(filePath, content);
        console.log(`Updated: ${filePath}`);
    }
});
