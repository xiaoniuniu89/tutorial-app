---
title: "Project Setup and Dependencies"
description: "Set up the project structure and install required packages for building a CLI chat agent"
---

# Project Setup and Dependencies

First, let's set up our CLI chat agent project structure and install dependencies:

## Dependencies Overview

We'll need several packages to build our chat agent:
- **OpenAI**: For interacting with GPT models
- **dotenv**: For loading environment variables
- **TypeScript**: For better development experience
- **ts-node**: For running TypeScript directly


## Installation Commands

Run these commands to install all dependencies:

`
npm install openai dotenv
`

`
npm install -D @types/node typescript ts-node
`

## TypeScript Configuration

Create a `tsconfig.json` file in your project root with the following content:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "ts-node": {
    "esm": false
  }
}
```

## Environment Configuration

Create a `.env` file in your project root to store your OpenAI API key securely:

**Environment setup (.env)**
```bash
OPENAI_API_KEY=your_api_key_here
```

> **🔐 Security Note:** Never commit your `.env` file to version control. Add it to your `.gitignore` file.

## Project Structure

Your project should look like this after setup:

```
my-chat-agent/
├── package.json
├── .env
├── .gitignore
```

**Create .gitignore**
```gitignore
node_modules/
.env
dist/
*.log
```

You're now ready to start building your CLI chat agent!