import dotenv from 'dotenv';
dotenv.config();
import { GoogleGenAI } from "@google/genai";
import readlinesync from 'readline-sync';
import fetch from 'node-fetch';

// Store the history in an array
const History = [];
const ai = new GoogleGenAI(process.env.GOOGLE_API_KEY);

// Sum of two numbers
function sum({ num1, num2 }) {
    return num1 + num2;
}

// Check if a number is prime
function prime({ num }) {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
}

// Crypto currency price
async function getCryptoPrice({ coin }) {
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coin}`);
    const data = await response.json();
    return data;
}

// Sum declaration for the AI model
const SumDeclaration = {
    name: "sum",
    description: "This function takes two numbers and returns their sum.",
    parameters: {
        type: 'OBJECT',
        properties: {
            num1: {
                type: 'NUMBER',
                description: 'The first number to be added.'
            },
            num2: {
                type: 'NUMBER',
                description: 'The second number to be added.'
            }
        },
        required: ['num1', 'num2']
    }
};

// Prime declaration for the AI model
const primeDeclaration = {
    name: "prime",
    description: "This function checks if a number is prime.",
    parameters: {
        type: 'OBJECT',
        properties: {
            num: {
                type: 'NUMBER',
                description: 'The number to check for primality.'
            },
        },
        required: ['num']
    }
};

// Crypto declaration for the AI model
const cryptoDeclaration = {
    name: "getCryptoPrice",
    description: "Get the current price of any crypto currency like bitcoin.",
    parameters: {
        type: 'OBJECT',
        properties: {
            coin: {
                type: 'STRING',
                description: 'The crypto currency name, like bitcoin'
            },
        },
        required: ['coin'] // <-- fixed here
    }
};

const availableTools = {
    sum: sum,
    prime: prime,
    getCryptoPrice: getCryptoPrice,
};

// Response function calling
async function runAgent(userProblem) {
    // Push the history
    History.push({
        role: "user",
        parts: [{ text: userProblem }]
    });

    // Model configuration
    while (true) {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: History,
            config: {
                tools: [
                    {
                        functionDeclarations: [
                            SumDeclaration,
                            primeDeclaration,
                            cryptoDeclaration
                        ]
                    }
                ]
            },
        });

        if (response.functionCalls && response.functionCalls.length > 0) {
            // check if the function call is available
            console.log(response.functionCalls[0]);
            const { name, args } = response.functionCalls[0];
            const funCall = availableTools[name];
            const result = await funCall(args);

            const functionResponsePart = {
                name: name,
                response: {
                    result: result,
                },
            };

            // Push the result to the history
            History.push({
                role: "model",
                parts: [
                    {
                        functionCall: response.functionCalls[0],
                    },
                ],
            });

            // Push the result to the history
            History.push({
                role: "user",
                parts: [
                    {
                        functionResponse: functionResponsePart,
                    },
                ],
            });
        } else {
            // Maintain the history
            History.push({
                role: 'model',
                parts: [{ text: response.text }]
            });
            console.log(response.text);
            break;
        }
    }
}

async function main() {
    // Get user input
    const userProblem = readlinesync.question("Ask me anything----> ");
    await runAgent(userProblem);
    main();
}

main();