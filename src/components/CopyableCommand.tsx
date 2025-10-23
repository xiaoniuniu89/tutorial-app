import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Copy } from 'lucide-react';

interface CopyableCommandProps {
  command: string;
  className?: string;
}

export function CopyableCommand({ command, className = '' }: CopyableCommandProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy command:', error);
    }
  };

  return (
    <div className={`inline-flex items-center gap-2 bg-muted rounded-md px-3 py-2 my-1 group hover:bg-muted/80 transition-colors ${className}`}>
      <code className="font-mono text-sm text-foreground select-all flex-1">
        {command}
      </code>
      <Button
        variant="ghost"
        size="sm"
        onClick={copyToClipboard}
        className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground transition-colors"
        title="Copy command"
      >
        {copied ? (
          <Check className="h-3 w-3" />
        ) : (
          <Copy className="h-3 w-3" />
        )}
      </Button>
    </div>
  );
}