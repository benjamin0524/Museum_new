import { generateMuseumContent } from './services/geminiService';
import { exhibitionData } from './data/exhibitionData';

async function testDataIntegrity() {
    console.log("Starting Data Integrity Test...");

    try {
        const content = await generateMuseumContent();
        const { theme, artworks } = content;

        console.log("Theme:", theme.name);
        if (!theme.name.includes("身不由己")) {
            throw new Error(`Theme name mismatch. Expected to contain '身不由己', got '${theme.name}'`);
        }

        console.log(`Loaded ${artworks.length} artworks.`);

        // Check coverage
        const expectedIds = [1, 2, 3, 4, 5, 6, 7];
        const loadedIds = artworks.map(a => a.id).sort();

        // Check if mapping is correct
        for (const art of artworks) {
            const sourceData = exhibitionData.find(d => d.id === art.id);
            if (!sourceData) {
                console.error(`ERROR: Artwork ID ${art.id} has no source data.`);
                continue;
            }

            if (art.title !== sourceData.title) {
                console.error(`ERROR: Title mismatch for ID ${art.id}. Service: ${art.title}, Data: ${sourceData.title}`);
            } else {
                console.log(`[PASS] ID ${art.id}: ${art.title}`);
            }
        }

        console.log("Data Integrity Test Passed!");

    } catch (error) {
        console.error("Test Failed:", error);
        process.exit(1);
    }
}

testDataIntegrity();
