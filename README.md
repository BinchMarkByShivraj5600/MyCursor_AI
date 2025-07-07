# AI Agent with Google Gemini and Function Calling

This project is a Node.js command-line AI agent that uses the Google Gemini API to answer questions, perform math, check for prime numbers, and fetch cryptocurrency prices. It demonstrates function calling with Gemini and integrates with external APIs.

---

## Features

- **Natural language Q&A** using Google Gemini
- **Function calling**: sum of numbers, prime check, crypto price lookup
- **Command-line interface** with history
- **Easy to extend** with new functions

---

## Requirements

- **Node.js** v18 or higher (for ESM and fetch support)
- **npm** (Node package manager)
- **Google Gemini API Key** (get from [Google AI Studio](https://aistudio.google.com/app/apikey))

---

## Installation

1. **Clone the repository** (or copy the files to a folder):

   ```sh
   git clone <your-repo-url>
   cd AIAgent
   ```

2. **Install dependencies**:

   ```sh
   npm install @google/genai readline-sync node-fetch dotenv
   ```

3. **Set up your Google Gemini API key**:

   - Go to [Google AI Studio API Keys](https://aistudio.google.com/app/apikey)
   - Create a new API key
   - Create a `.env` file in your project root and add:

     ```
     GOOGLE_API_KEY=your_actual_api_key_here
     ```

---

## Usage

Run the agent from your project directory:

```sh
node index.js
```

You will see:

```
Ask me anything---->
```

Type your question or command (e.g., `sum of 2 and 7`, `is 13 prime?`, `bitcoin price`) and press Enter.

---

## Notes

- Make sure your API key is **valid and not expired**.
- If you get an error about the API key, generate a new one and update your `.env`.
- The code uses ESM imports (`import ... from ...`). Node.js v18+ is required.
- You can extend the agent by adding new function declarations and implementations.

---

## Example Questions

- `sum of 5 and 10`
- `is 17 a prime number?`
- `get price of ethereum`

---

## License

MIT (or your preferred license)