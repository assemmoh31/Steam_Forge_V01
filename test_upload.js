
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

async function testUpload() {
    try {
        // Create a dummy GIF file
        fs.writeFileSync('test.gif', 'GIF89a...');

        const form = new FormData();
        form.append('file', fs.createReadStream('test.gif'));
        form.append('title', 'Test GIF');
        form.append('description', 'This is a test');

        console.log('Uploading...');
        const response = await axios.post('http://localhost:3005/api/artwork', form, {
            headers: {
                ...form.getHeaders()
            }
        });

        console.log('Upload success:', response.data);
    } catch (error) {
        console.error('Upload failed:', error.response ? error.response.data : error.message);
    }
}

testUpload();
