import ReactMarkdown from 'react-markdown';
import { CodeBlock } from './CodeBlock';
import { CopyableCommand } from './CopyableCommand';
import type { TutorialStep as TutorialStepType } from '@/lib/tutorialParser';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TutorialStepProps {
  step: TutorialStepType;
  stepNumber: number;
}

export function TutorialStep({ step, stepNumber }: TutorialStepProps) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <span className="text-2xl font-bold text-primary">
              {stepNumber}.
            </span>
            {step.title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Render markdown content */}
          <div className="prose prose-slate max-w-none dark:prose-invert prose-code:bg-transparent prose-pre:bg-transparent prose-ul:pl-0 prose-ol:pl-0 prose-li:pl-0">
            <ReactMarkdown
              components={{
                // Custom renderer for code blocks
                code({ className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  const language = match ? match[1] : '';
                  const code = String(children).replace(/\n$/, '');
                  
                  // Check if this is a block-level code (multiline or long)
                  const isBlock = code.includes('\n') || code.length > 50;
                  
                  // Check if this is a single-line command that should be copyable
                  const isCommand = !isBlock && (
                    code.startsWith('npm ') ||
                    code.startsWith('yarn ') ||
                    code.startsWith('node ') ||
                    code.startsWith('mkdir ') ||
                    code.startsWith('touch ') ||
                    code.startsWith('cd ') ||
                    code.startsWith('ls ') ||
                    code.startsWith('git ') ||
                    code.startsWith('cp ') ||
                    code.startsWith('mv ') ||
                    code.startsWith('rm ') ||
                    code.startsWith('echo ') ||
                    code.startsWith('cat ') ||
                    code.includes('&&') ||
                    /^[a-zA-Z0-9_-]+\s+[^\s]/.test(code) // Generic command pattern
                  );
                  
                  if (isBlock) {
                    // For larger code blocks, use our custom CodeBlock component
                    return (
                      <CodeBlock
                        code={code}
                        language={language || 'text'}
                        className="my-4"
                      />
                    );
                  }
                  
                  if (isCommand) {
                    // For single-line commands, use the copyable command component
                    return (
                      <CopyableCommand
                        command={code}
                        className="my-2"
                      />
                    );
                  }
                  
                  // For inline code, use default styling
                  return (
                    <code className={`${className} bg-muted px-1 py-0.5 rounded text-sm font-mono`} {...props}>
                      {children}
                    </code>
                  );
                },

                // Handle pre elements to ensure they become code blocks
                pre({ children }) {
                  // Extract code content from pre elements
                  const codeElement = children as any;
                  if (codeElement?.props?.children) {
                    const code = String(codeElement.props.children).replace(/\n$/, '');
                    const className = codeElement.props.className || '';
                    const match = /language-(\w+)/.exec(className);
                    const language = match ? match[1] : 'text';
                    
                    return (
                      <CodeBlock
                        code={code}
                        language={language}
                        className="my-4"
                      />
                    );
                  }
                  return <pre className="whitespace-pre-wrap font-mono text-sm bg-muted p-4 rounded">{children}</pre>;
                },
                
                // Style headers
                h1: ({ children }) => (
                  <h1 className="text-2xl font-bold mb-4 text-foreground">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-xl font-semibold mb-3 text-foreground">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-lg font-medium mb-2 text-foreground">
                    {children}
                  </h3>
                ),
                
                // Style lists
                ul: ({ children }) => (
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-0">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-0">
                    {children}
                  </ol>
                ),
                
                // Style list items
                li: ({ children }) => (
                  <li className="text-muted-foreground leading-relaxed">
                    {children}
                  </li>
                ),
                
                // Style paragraphs
                p: ({ children }) => {
                  // Check if this paragraph contains only a single code element that might be a command
                  if (Array.isArray(children) && children.length === 1) {
                    const child = children[0];
                    if (typeof child === 'object' && child !== null && 'type' in child && child.type === 'code') {
                      // Let the code renderer handle it, don't wrap in a paragraph
                      return <div className="my-2">{children}</div>;
                    }
                  }
                  
                  return (
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {children}
                    </p>
                  );
                },
                
                // Style blockquotes
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-primary pl-4 py-2 bg-muted/50 rounded-r-md my-4">
                    <div className="text-muted-foreground italic">
                      {children}
                    </div>
                  </blockquote>
                ),
                
                // Style links
                a: ({ href, children }) => (
                  <a 
                    href={href} 
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
                
                // Style strong text
                strong: ({ children }) => (
                  <strong className="font-semibold text-foreground">
                    {children}
                  </strong>
                ),
              }}
            >
              {step.content}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}