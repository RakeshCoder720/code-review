
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const reviewCode = async (code, language) => {
    const model = 'gemini-2.5-flash';
    
    const prompt = `
        As an expert senior software engineer, please perform a thorough code review of the following ${language} code. Provide feedback on the following aspects:
        1. **Bugs and Errors:** Identify any potential bugs, logic errors, or edge cases that might have been missed.
        2. **Best Practices & Conventions:** Check if the code follows established best practices and language-specific conventions.
        3. **Readability & Maintainability:** Suggest improvements for clarity, simplicity, and ease of future maintenance. Use clear examples where possible.
        4. **Performance:** Point out any potential performance bottlenecks and suggest optimizations.
        5. **Security:** Highlight any potential security vulnerabilities (e.g., injection attacks, data exposure).

        Please format your response in Markdown. Use headings for each section, bullet points for specific feedback, and code blocks with syntax highlighting for suggested changes. Provide a brief summary at the end.

        Here is the code to review:
        \`\`\`${language.toLowerCase()}
        ${code}
        \`\`\`
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get review from Gemini. Please check the console for details.");
    }
};
