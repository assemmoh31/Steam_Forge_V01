const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const bucketName = 'my-gifs';
const backgroundsDir = path.join(__dirname, 'public', 'backgrounds');

if (!fs.existsSync(backgroundsDir)) {
    console.error(`Directory not found: ${backgroundsDir}`);
    process.exit(1);
}

const files = fs.readdirSync(backgroundsDir);
const totalFiles = files.length;

console.log(`Found ${totalFiles} files to upload.`);

files.forEach((file, index) => {
    if (file.endsWith('.gif') || file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')) {
        const filePath = path.join(backgroundsDir, file);
        // Key will be just the filename so url is ...r2.dev/filename.gif
        const key = file;

        console.log(`[${index + 1}/${totalFiles}] Uploading ${file}...`);

        try {
            // Use npx wrangler explicitly or just wrangler if in path. 
            // Using 'wrangler' assuming it's available globally or via npm run script context.
            // On Windows cmd, we might need 'cmd /c wrangler'.
            // Safest is likely just 'wrangler' given previous success, but let's be robust.
            const command = `wrangler r2 object put "${bucketName}/${key}" --file "${filePath}" --remote`;
            execSync(command, { stdio: 'inherit' });
        } catch (error) {
            console.error(`Failed to upload ${file}:`, error.message);
        }
    }
});

console.log('Upload process complete.');
