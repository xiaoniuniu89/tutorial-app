import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, ArrowRight } from 'lucide-react';
import { loadTutorials } from '@/lib/tutorialParser';
import type { Tutorial } from '@/lib/tutorialParser';

interface TutorialListProps {
  onSelectTutorial: (tutorialId: string) => void;
}

export function TutorialList({ onSelectTutorial }: TutorialListProps) {
  const [tutorials] = useState<Tutorial[]>(() => loadTutorials());
  
  const filteredTutorials = tutorials
    .filter(t => t.id !== 'tutorial-creation') // Exclude meta tutorial
    .map(t => ({ tutorialId: t.id, tutorial: t, metadata: t }));



  if (tutorials.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Tutorials Found</h3>
              <p className="text-muted-foreground mb-4">
                It looks like there are no tutorials available yet.
              </p>
              <Button onClick={() => window.location.reload()}>
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">AI Training Tutorials</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Learn to build powerful AI agents step-by-step with our interactive tutorials.
            Each tutorial guides you through hands-on coding exercises.
          </p>
        </div>

        {/* Tutorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutorials.map(({ tutorialId, tutorial, metadata }) => {
            if (!tutorial || !metadata) return null;
            
            return (
              <Card 
                key={tutorialId} 
                className="hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => onSelectTutorial(tutorialId)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {tutorial.title}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {metadata.description}
                      </CardDescription>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Tutorial Metadata */}
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {tutorial.steps.length} steps
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {metadata.author}
                    </Badge>
                    {/* Series badge (if present) */}
                    {metadata.series?.name && (
                      <Badge variant="outline" className="flex items-center gap-1" title={`Series: ${metadata.series.name}`}>
                        <span className="text-xs font-medium">{metadata.series.name}</span>
                        {typeof metadata.series.part === 'number' && (
                          <span className="text-xxs text-muted-foreground">· Part {metadata.series.part}</span>
                        )}
                      </Badge>
                    )}
                  </div>

                  {/* Steps Preview */}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Tutorial outline:
                    </p>
                    <ul className="text-sm space-y-1">
                      {tutorial.steps.slice(0, 3).map((step, index) => (
                        <li key={step.id} className="flex items-center gap-2">
                          <span className="text-primary font-medium text-xs min-w-4">
                            {index + 1}.
                          </span>
                          <span className="text-muted-foreground truncate">
                            {step.title}
                          </span>
                        </li>
                      ))}
                      {tutorial.steps.length > 3 && (
                        <li className="text-xs text-muted-foreground pl-6">
                          +{tutorial.steps.length - 3} more steps...
                        </li>
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Tutorial Creation Launcher */}
        <div className="mt-12">
          <Card 
            className="p-6 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 hover:shadow-lg transition-all cursor-pointer group"
            onClick={() => onSelectTutorial('tutorial-creation')}
          >
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
                <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
                  Want to create your own tutorial?
                </h3>
              </div>
              
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                Learn how to create engaging, step-by-step tutorials for the AI Training system. 
                Our interactive guide will teach you everything from markdown structure to advanced features.
              </p>
              
              <div className="flex items-center justify-center gap-4 mb-6">
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  Interactive Tutorial
                </Badge>
                <Badge variant="outline">
                  4 steps
                </Badge>
                <Badge variant="outline">
                  CLI-Based
                </Badge>
              </div>
              
              <Button 
                size="lg" 
                className="group-hover:scale-105 transition-transform"
              >
                <BookOpen className="h-5 w-5 mr-2" />
                Start Tutorial Creation Guide
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <p className="text-sm text-muted-foreground mt-4">
                Learn markdown structure • Tutorial metadata • Series creation • Best practices
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}