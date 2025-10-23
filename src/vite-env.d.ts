/// <reference types="vite/client" />

// Add support for importing markdown files as raw text
declare module "*.md?raw" {
  const content: string;
  export default content;
}