
import { LOCAL_BACKGROUNDS } from './src/data/local_loader';

console.log("Checking tags for first 20 items:");
LOCAL_BACKGROUNDS.slice(0, 20).forEach(bg => {
    console.log(`[${bg.title}] -> Tags: ${bg.tags?.join(', ')}`);
});

const blueItems = LOCAL_BACKGROUNDS.filter(bg => bg.tags?.includes('Blue'));
console.log(`\nFound ${blueItems.length} Blue items.`);
blueItems.slice(0, 5).forEach(bg => {
    console.log(` - ${bg.title} (Tags: ${bg.tags})`);
});
