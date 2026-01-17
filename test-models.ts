import { GoogleGenAI } from "@google/genai";
import fs from 'fs';
import path from 'path';

const loadEnv = () => {
    try {
        const envPath = path.resolve(process.cwd(), '.env.local');
        if (!fs.existsSync(envPath)) return null;
        const envContent = fs.readFileSync(envPath, 'utf-8');
        const match = envContent.match(/API_KEY=(.*)/);
        if (match && match[1]) {
            let key = match[1].trim();
            if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
                key = key.slice(1, -1);
            }
            return key;
        }
        return null;
    } catch { return null; }
};

const listModels = async () => {
    console.log("🔍 Checking available models...");
    const apiKey = loadEnv();
    if (!apiKey) { console.error("No API Key"); return; }

    const ai = new GoogleGenAI({ apiKey });

    try {
        const response: any = await ai.models.list();
        // console.log("Debug: ", JSON.stringify(response, null, 2));

        console.log("✅ Models found:");

        let models = [];
        if (Array.isArray(response)) {
            models = response;
        } else if (response && response.models) {
            models = response.models;
        } else if (response && response.data) {
            models = response.data;
        }

        if (models.length > 0) {
            models.forEach((m: any) => {
                // Basic filtering to show relevant models
                if (m.name.includes("gemini")) {
                    console.log(`- ${m.name}`);
                }
            });
        } else {
            console.log("⚠️ Response structure unknown or empty:", response);
        }

    } catch (error: any) {
        console.error("❌ Failed to list models:", error.message || error);
    }
};

listModels();
