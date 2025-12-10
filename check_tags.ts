
import { SIMPLE_BACKGROUNDS } from './src/data/simple_backgrounds';

const total = SIMPLE_BACKGROUNDS.length;
const noTags = SIMPLE_BACKGROUNDS.filter((bg: any) => !bg.tags || bg.tags.length === 0).length;
const hasTags = total - noTags;

console.log(`Total Backgrounds: ${total}`);
console.log(`With Tags: ${hasTags}`);
console.log(`Without Tags: ${noTags}`);

if (noTags > 0) {
    console.log("\nExamples of untagged items:");
    SIMPLE_BACKGROUNDS.filter((bg: any) => !bg.tags || bg.tags.length === 0).slice(0, 5).forEach(bg => {
        console.log(` - ${bg.name}`);
    });
}
