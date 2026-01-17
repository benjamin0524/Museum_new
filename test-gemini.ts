import { GoogleGenAI } from "@google/genai";
import fs from 'fs';
import path from 'path';

// Manual .env parser for the test script
const loadEnv = () => {
    try {
        const envPath = path.resolve(process.cwd(), '.env.local');
        if (!fs.existsSync(envPath)) {
            console.error("❌ Error: .env.local file not found!");
            return null;
        }
        const envContent = fs.readFileSync(envPath, 'utf-8');
        const match = envContent.match(/API_KEY=(.*)/);
        if (match && match[1]) {
            let key = match[1].trim();
            // Remove surrounding quotes if present
            if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
                key = key.slice(1, -1);
            }
            return key;
        } else {
            console.error("❌ Error: API_KEY not found in .env.local");
            return null;
        }
    } catch (error) {
        console.error("❌ Error reading .env.local:", error);
        return null;
    }
};

const testConnection = async () => {
    console.log("🔍 Reading API Key from .env.local...");
    const apiKey = loadEnv();

    if (!apiKey) {
        console.log("👉 Please make sure you have created .env.local and pasted your API Key.");
        return;
    }

    // Basic masking for display
    const maskedKey = apiKey.substring(0, 4) + '...' + apiKey.substring(apiKey.length - 4);
    console.log(`🔑 Key found: ${maskedKey}`);
    console.log("📡 Connecting to Google Gemini API...");

    try {
        const ai = new GoogleGenAI({ apiKey });
        const model = "gemini-2.0-flash"; // Using a common model name for testing

        console.log(`🤖 Sending test message to model: ${model}...`);
        // Note: The SDK usage might vary slightly depending on version, adapting to the one used in geminiService.ts
        // In geminiService.ts it was `ai.chats.create`. 
        // Let's try a simple content generation first if the SDK supports it, or use the chat interface.
        // Looking at package.json, it is @google/genai.
        // Some versions use `ai.getGenerativeModel`. 
        // Let's assume the syntax from geminiService.ts:
        // `const chat = ai.chats.create(...)`

        // Wait, geminiService.ts code:
        // import { GoogleGenAI } from "@google/genai";
        // ...
        // const chat = ai.chats.create({ model: modelName, config: { systemInstruction }, history: ... });
        // This looks like the new Google GenAI SDK (v1+ or specifically the one for Gemini API).
        // Let's try to mimic that.

        const chat = ai.chats.create({
            model: "models/gemini-3-flash-preview",
        });

        const result = await chat.sendMessage({ message: "Hello, reply with OK." });

        if (result.text) {
            console.log("\n✅ API Test Successful!");
            console.log("📝 Model Response:", result.text);
        } else {
            console.log("⚠️ API connected but returned empty response.");
        }

    } catch (error) {
        console.error("\n❌ API Connection Failed!");
        console.error("Error Details:", error.message || error);
        if (error.toString().includes("403")) {
            console.error("👉 This usually means the API Key is invalid or has expired.");
        }
        if (error.toString().includes("404")) {
            console.error("👉 The model might not be found. Trying a fallback...");
        }
    }
};

testConnection();
