import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
}

export function CodeBlock({ code, language = 'text', filename, className = '' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  // Detect language from content if not specified
  const detectedLanguage = language === 'text' || !language ? detectLanguage(code) : language;

  return (
    <div className={`relative group ${className}`}>
      <Card className="overflow-hidden">
        {/* Header with filename and copy button */}
        <div className="flex justify-between items-center bg-muted px-4 py-2 border-b">
          <div className="flex items-center gap-2">
            {filename && (
              <span className="text-sm font-mono text-muted-foreground">
                {filename}
              </span>
            )}
            {detectedLanguage && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                {detectedLanguage}
              </span>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </>
            )}
          </Button>
        </div>
        
        {/* Code content */}
        <div className="relative text-left">
          <pre className="overflow-x-auto p-4 text-sm bg-muted/30 font-mono text-left">
            <code className={`language-${detectedLanguage} whitespace-pre text-left`}>
              {code}
            </code>
          </pre>
        </div>
      </Card>
    </div>
  );
}

/**
 * Simple language detection based on content patterns
 */
function detectLanguage(code: string): string {
  // Check for common patterns
  if (code.includes('├──') || code.includes('└──') || code.includes('│')) {
    return 'tree';
  }
  if (code.includes('npm install') || code.includes('npm run')) {
    return 'bash';
  }
  if (code.includes('OPENAI_API_KEY') || code.includes('=') && !code.includes('{')) {
    return 'env';
  }
  if (code.includes('node_modules') || code.includes('.env') || code.includes('*.log')) {
    return 'gitignore';
  }
  if (code.includes('{') && (code.includes('"dependencies"') || code.includes('"scripts"'))) {
    return 'json';
  }
  if (code.includes('import ') || code.includes('export ') || code.includes('const ') || code.includes('function ')) {
    return 'typescript';
  }
  
  return 'text';
}

/**
 * Extract code blocks from markdown content
 */
export function extractCodeBlocks(markdown: string): Array<{ code: string; language?: string; filename?: string }> {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const blocks: Array<{ code: string; language?: string; filename?: string }> = [];
  
  let match;
  while ((match = codeBlockRegex.exec(markdown)) !== null) {
    const language = match[1] || 'text';
    const code = match[2].trim();
    
    // Try to extract filename from the previous line
    const beforeBlock = markdown.substring(0, match.index);
    const lines = beforeBlock.split('\n');
    const previousLine = lines[lines.length - 1];
    const filenameMatch = previousLine.match(/\*\*([^*]+)\*\*/);
    const filename = filenameMatch ? filenameMatch[1] : undefined;
    
    blocks.push({ code, language, filename });
  }
  
  return blocks;
}