import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getUserPreferences, getAllProgress } from '@/lib/progressStore';
import { Eye, EyeOff } from 'lucide-react';

export function DebugPanel() {
  const [isVisible, setIsVisible] = useState(false);

  const preferences = getUserPreferences();
  const progress = getAllProgress();

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsVisible(true)}
          className="opacity-50 hover:opacity-100"
          title="Show LowDB Debug Info"
        >
          <Eye className="h-4 w-4" />
          Debug
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm">
      <Card className="shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm">LowDB State</CardTitle>
              <CardDescription className="text-xs">Current database contents</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
            >
              <EyeOff className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div>
            <h4 className="font-medium mb-1">User Preferences</h4>
            <div className="bg-muted rounded p-2 font-mono">
              <div>Theme: <span className="text-primary">{preferences.theme}</span></div>
              <div>Updated: {preferences.lastUpdated ? new Date(preferences.lastUpdated).toLocaleTimeString() : 'N/A'}</div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-1">Tutorial Progress</h4>
            <div className="bg-muted rounded p-2 font-mono max-h-32 overflow-y-auto">
              {Object.keys(progress).length === 0 ? (
                <div className="text-muted-foreground">No progress data</div>
              ) : (
                <pre className="text-xs">{JSON.stringify(progress, null, 2)}</pre>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}