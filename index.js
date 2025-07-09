// import dotenv from 'dotenv';
// dotenv.config();
// import { GoogleGenAI } from "@google/genai";
// import readlinesync from 'readline-sync';
// import fetch from 'node-fetch';
// import os from 'os';



// // Store the history in an array
// const History = [];
// const ai = new GoogleGenAI(process.env.GOOGLE_API_KEY);

// // Sum of two numbers
// function sum({ num1, num2 }) {
//     return num1 + num2;
// }

// // Check if a number is prime
// function prime({ num }) {
//     if (num < 2) return false;
//     for (let i = 2; i <= Math.sqrt(num); i++) {
//         if (num % i === 0) return false;
//     }
//     return true;
// }

// // Crypto currency price
// async function getCryptoPrice({ coin }) {
//     const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coin}`);
//     const data = await response.json();
//     return data;
// }

// // Sum declaration for the AI model
// const SumDeclaration = {
//     name: "sum",
//     description: "This function takes two numbers and returns their sum.",
//     parameters: {
//         type: 'OBJECT',
//         properties: {
//             num1: {
//                 type: 'NUMBER',
//                 description: 'The first number to be added.'
//             },
//             num2: {
//                 type: 'NUMBER',
//                 description: 'The second number to be added.'
//             }
//         },
//         required: ['num1', 'num2']
//     }
// };

// // Prime declaration for the AI model
// const primeDeclaration = {
//     name: "prime",
//     description: "This function checks if a number is prime.",
//     parameters: {
//         type: 'OBJECT',
//         properties: {
//             num: {
//                 type: 'NUMBER',
//                 description: 'The number to check for primality.'
//             },
//         },
//         required: ['num']
//     }
// };

// // Crypto declaration for the AI model
// const cryptoDeclaration = {
//     name: "getCryptoPrice",
//     description: "Get the current price of any crypto currency like bitcoin.",
//     parameters: {
//         type: 'OBJECT',
//         properties: {
//             coin: {
//                 type: 'STRING',
//                 description: 'The crypto currency name, like bitcoin'
//             },
//         },
//         required: ['coin'] // <-- fixed here
//     }
// };

// const availableTools = {
//     sum: sum,
//     prime: prime,
//     getCryptoPrice: getCryptoPrice,
// };

// // Response function calling
// async function runAgent(userProblem) {
//     // Push the history
//     History.push({
//         role: "user",
//         parts: [{ text: userProblem }]
//     });

//     // Model configuration
//     while (true) {
//         const response = await ai.models.generateContent({
//             model: "gemini-2.0-flash",
//             contents: History,
//             config: {
//                 tools: [
//                     {
//                         functionDeclarations: [
//                             SumDeclaration,
//                             primeDeclaration,
//                             cryptoDeclaration
//                         ]
//                     }
//                 ]
//             },
//         });

//         if (response.functionCalls && response.functionCalls.length > 0) {
//             // check if the function call is available
//             console.log(response.functionCalls[0]);
//             const { name, args } = response.functionCalls[0];
//             const funCall = availableTools[name];
//             const result = await funCall(args);

//             const functionResponsePart = {
//                 name: name,
//                 response: {
//                     result: result,
//                 },
//             };

//             // Push the result to the history
//             History.push({
//                 role: "model",
//                 parts: [
//                     {
//                         functionCall: response.functionCalls[0],
//                     },
//                 ],
//             });

//             // Push the result to the history
//             History.push({
//                 role: "user",
//                 parts: [
//                     {
//                         functionResponse: functionResponsePart,
//                     },
//                 ],
//             });
//         } else {
//             // Maintain the history
//             History.push({
//                 role: 'model',
//                 parts: [{ text: response.text }]
//             });
//             console.log(response.text);
//             break;
//         }
//     }
// }

// async function main() {
//     // Get user input
//     const userProblem = readlinesync.question("Ask me anything----> ");
//     await runAgent(userProblem);
//     main();
// }

// main();


import dotenv from 'dotenv';
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";
import readlineSync from 'readline-sync';
import fs from 'fs/promises';
import path from 'path';
import express from 'express';
import { fileURLToPath } from 'url';

// --- Basic Setup ---
const ai = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const history = []; // This 'history' variable is declared but not used in runAgent's new chat session. It's fine for now.

// --- Web Server Globals ---
let server;
const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(__filename);


// =================================================================
// SECTION 1: TOOL DEFINITIONS (The actual JavaScript functions)
// =================================================================

/**
 * Creates and serves a web application on a local server.
 * @param {object} args - The arguments for the function.
 * @param {string} args.htmlContent - The full HTML content for the web page.
 * @param {string} args.cssContent - The full CSS content for styling.
 * @param {string} args.jsContent - The full JavaScript content for functionality.
 * @returns {Promise<string>} A message indicating success and the URL.
 */
async function createAndServeWebApp({ htmlContent, cssContent, jsContent }) {
    console.log("🤖 AI requested to build a web app. Starting process...");

    if (server) {
        // Stop the previous server if it's running
        await new Promise(resolve => server.close(resolve));
        console.log("🔌 Previous server instance stopped.");
    }

    const publicDir = path.join(_dirname, 'public');

    try {
        await fs.mkdir(publicDir, { recursive: true }); // Ensure public directory exists
        await fs.writeFile(path.join(publicDir, 'index.html'), htmlContent);
        await fs.writeFile(path.join(publicDir, 'styles.css'), cssContent);
        await fs.writeFile(path.join(publicDir, 'script.js'), jsContent);
        console.log("✅ Files created successfully in /public directory.");

        // Serve static files from the 'public' directory
        app.use(express.static(publicDir));

        return new Promise((resolve, reject) => {
            // Start the new server
            server = app.listen(port, () => {
                const url = `http://localhost:${port}`; // <-- CORRECTED LINE HERE
                console.log(`\n🚀 Web server is now running! Open this URL in your browser: ${url}`);
                resolve(`Successfully created and deployed the web app. It is available for the user at ${url}.`);
            }).on('error', (err) => {
                console.error("❌ Failed to start server:", err);
                reject(`Failed to start the web server due to an error: ${err.message}`);
            });
        });

    } catch (error) {
        console.error("❌ Error creating or serving web app:", error);
        return `Failed to create the web app due to an error: ${error.message}`;
    }
}

// =================================================================
// SECTION 2: TOOL DECLARATIONS (For the AI model to understand)
// =================================================================

const webAppDeclaration = {
    name: "createAndServeWebApp",
    description: "Generates HTML, CSS, and JavaScript files and serves them. Use this to build web applications like a 'calculator' or 'to-do list'. The HTML file must link to './styles.css' and './script.js'.",
    parameters: {
        type: 'OBJECT',
        properties: {
            htmlContent: {
                type: 'STRING',
                description: "The full HTML content. It must include <link rel='stylesheet' href='styles.css'> and <script src='script.js' defer></script>."
            },
            cssContent: { type: 'STRING', description: 'The full CSS content for styling.' },
            jsContent: { type: 'STRING', description: "The full JavaScript content for functionality." }
        },
        required: ['htmlContent', 'cssContent', 'jsContent']
    }
};

const availableTools = {
    createAndServeWebApp,
};

// =================================================================
// SECTION 3: AGENT LOGIC
// =================================================================

// Configure the AI model
const model = ai.getGenerativeModel({
    model: "gemini-1.5-flash-latest",
    systemInstruction: "You are an expert web developer. When a user asks you to 'make' or 'build' a web app, you must use the 'createAndServeWebApp' tool to generate the complete HTML, CSS, and JS and serve it. For any other questions, provide a direct text answer. Ensure the HTML links to styles.css and script.js correctly, and the JavaScript always works as expected.",
});

async function runAgent(userInput) {
    // Start a new chat session for each top-level request
    // This ensures that previous tool calls don't influence new, unrelated requests.
    const chat = model.startChat({
        tools: [{ functionDeclarations: [webAppDeclaration] }],
        history: [], // Start with a fresh history for each request to avoid state issues
    });

    try {
        // Send the user's prompt
        const result = await chat.sendMessage(userInput);
        let response = result.response;

        // Loop to handle potential multi-turn function calls
        // This loop will continue as long as the AI keeps requesting function calls.
        while (true) {
            const call = response.candidates[0]?.content?.parts[0]?.functionCall;
            
            // If the AI wants to call a function...
            if (call) {
                console.log(`\n🤖 AI wants to call function: ${call.name} with arguments:`, JSON.stringify(call.args, null, 2));
                const { name, args } = call;
                const functionToCall = availableTools[name];

                if (!functionToCall) {
                    console.error(`Error: AI tried to call an unknown function "${name}"`);
                    // Send an error message back to the AI if the function is not found
                    const errorResponse = await chat.sendMessage([
                        {
                            functionResponse: {
                                name,
                                response: {
                                    error: `Function "${name}" not found.`,
                                },
                            },
                        },
                    ]);
                    response = errorResponse.response;
                    continue; // Continue the loop to see AI's response to the error
                }

                // Call the function and get the result
                const toolResult = await functionToCall(args);

                // Send the function's result back to the AI
                const result2 = await chat.sendMessage([
                    {
                        functionResponse: {
                            name,
                            response: {
                                content: toolResult, // The content property should hold the actual result/message
                            },
                        },
                    },
                ]);
                response = result2.response; // Update response for the next iteration of the loop
            } else {
                // If the AI returns a text response, print it and exit the loop
                const textResponse = response.text();
                console.log(`\n🤖 AI: ${textResponse}\n`);
                break; // Exit the loop as the conversation turn is complete
            }
        }
    } catch (error) {
        console.error("❌ Error during AI interaction:", error);
        console.log("Please try again.");
    }
}

async function main() {
    console.log("Welcome to the AI Web Developer Agent!");
    console.log("Example prompts: 'make a calculator', 'build a simple to-do list', 'create a weather app UI'");
    console.log("Type 'exit' to quit.");

    // Ensure the public directory is clean or exists before starting
    const publicDir = path.join(_dirname, 'public');
    try {
        await fs.rm(publicDir, { recursive: true, force: true });
        console.log("🧹 Cleaned up previous 'public' directory.");
    } catch (err) {
        // Ignore if directory doesn't exist
    }


    while (true) {
        const userInput = readlineSync.question("\n👤 Ask anything---->: ");
        if (userInput.toLowerCase() === 'exit') {
            if (server) {
                await new Promise(resolve => server.close(resolve));
                console.log("🔌 Web server stopped.");
            }
            console.log("Goodbye!");
            break;
        }
        await runAgent(userInput);
    }
}

main();