import { useEffect, useState } from 'react';
import { Wizard, useWizard } from 'react-use-wizard';
import { TutorialStep } from './TutorialStep';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, BookOpen, Check } from 'lucide-react';
import type { Tutorial } from '@/lib/tutorialParser';
import { getTutorial, getTutorialsBySeries } from '@/lib/tutorialParser';
import { markStepVisited, getTutorialProgress } from '@/lib/progressStore';

interface TutorialWizardProps {
  tutorialId?: string;
  onBackToTutorials?: () => void;
}

// Navigation Footer Component
function WizardNavigation({ onBackToTutorials }: { onBackToTutorials?: () => void }) {
  const { isFirstStep, isLastStep, previousStep, nextStep, activeStep, stepCount } = useWizard();

  return (
    <div className="max-w-4xl mx-auto p-6 pt-0">
      <div className="flex justify-between items-center p-6 border-t bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2">
          {onBackToTutorials && (
            <Button
              variant="ghost"
              onClick={onBackToTutorials}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Tutorials
            </Button>
          )}
          <Button
            variant="outline"
            onClick={previousStep}
            disabled={isFirstStep}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            Step {activeStep + 1} of {stepCount}
          </Badge>
        </div>
        
        <Button
          onClick={nextStep}
          disabled={isLastStep}
          className="flex items-center gap-2"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// Progress Header Component
function WizardHeader({ tutorial, tutorialId }: { tutorial: Tutorial; tutorialId: string }) {
  const { activeStep, stepCount } = useWizard();
  const [stepProgress, setStepProgress] = useState<Record<string, any>>({});
  
  // Load progress on mount and when tutorial changes
  useEffect(() => {
    const progress = getTutorialProgress(tutorialId);
    setStepProgress(progress);
  }, [tutorialId]);
  
  // Mark current step as visited whenever activeStep changes
  useEffect(() => {
    if (tutorial.steps[activeStep]) {
      const stepId = tutorial.steps[activeStep].id;
      markStepVisited(tutorialId, stepId);
      // Update local state
      setStepProgress(prev => ({
        ...prev,
        [stepId]: { ...prev[stepId], visited: true }
      }));
    }
  }, [activeStep, tutorial.steps, tutorialId]);
  
  // Calculate progress based on visited steps
  const visitedCount = tutorial.steps.filter(step => 
    stepProgress[step.id]?.visited
  ).length;
  const progress = (visitedCount / stepCount) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6 pb-0">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-primary" />
            {tutorial.title}
          </CardTitle>
          <p className="text-muted-foreground">
            {tutorial.description}
          </p>
          {/* Series display */}
          {tutorial.series?.name && (
            <div className="flex items-center gap-3 mt-2">
              <Badge variant="secondary">{tutorial.series.name}</Badge>
              {typeof tutorial.series.part === 'number' && (
                <div className="text-sm text-muted-foreground">Part {tutorial.series.part}</div>
              )}
            </div>
          )}
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          
          {/* Step Indicators */}
          <div className="flex gap-2 pt-2">
            {tutorial.steps.map((step, index) => {
              const isVisited = stepProgress[step.id]?.visited;
              const isCurrent = index === activeStep;
              
              return (
                <div key={step.id} className="flex items-center gap-2">
                  <div
                    className={`min-w-8 h-8 flex items-center justify-center text-sm font-medium transition-colors rounded-full ${
                      isCurrent
                        ? 'bg-primary text-primary-foreground font-bold'
                        : isVisited
                        ? 'bg-primary/20 text-primary'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {isVisited && !isCurrent ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  {index < tutorial.steps.length - 1 && (
                    <div className={`h-0.5 w-8 transition-colors ${isVisited ? 'bg-primary' : 'bg-muted'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}

// Individual Step Wrapper
function StepWrapper({ step, stepNumber }: { step: any; stepNumber: number }) {
  return <TutorialStep step={step} stepNumber={stepNumber} />;
}

// Main Tutorial Wizard Component
export function TutorialWizard({ tutorialId = 'simple-chat-cli', onBackToTutorials }: TutorialWizardProps) {
  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTutorial = () => {
      try {
        setLoading(true);
        const loadedTutorial = getTutorial(tutorialId);
        
        if (!loadedTutorial) {
          setError('Tutorial not found');
          return;
        }
        
        if (loadedTutorial.steps.length === 0) {
          setError('No steps found in tutorial');
          return;
        }
        
        setTutorial(loadedTutorial);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tutorial');
      } finally {
        setLoading(false);
      }
    };

    loadTutorial();
  }, [tutorialId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading tutorial...</p>
        </div>
      </div>
    );
  }

  if (error || !tutorial) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-destructive mb-4">❌ {error || 'Tutorial not found'}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Wizard
        header={<WizardHeader tutorial={tutorial} tutorialId={tutorialId} />}
        footer={<WizardNavigation onBackToTutorials={onBackToTutorials} />}
      >
        {tutorial.steps.map((step, index) => (
          <StepWrapper
            key={step.id}
            step={step}
            stepNumber={index + 1}
          />
        ))}
      </Wizard>
      {/* Series navigation (Prev/Next tutorial in same series) */}
      {tutorial?.series?.name && (
        <div className="max-w-4xl mx-auto p-6 pt-0">
          <div className="flex justify-between items-center p-4 border-t bg-muted/50 rounded-lg">
            <SeriesNavButtons
              tutorial={tutorial}
              onNavigate={(id: string) => {
                const t = getTutorial(id);
                if (t) setTutorial(t);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function SeriesNavButtons({ tutorial, onNavigate }: { tutorial: Tutorial; onNavigate: (id: string) => void }) {
  const seriesMap = getTutorialsBySeries();
  const seriesName = tutorial.series?.name || '';
  const seriesList = seriesMap[seriesName] || [];
  const index = seriesList.findIndex(t => t.id === tutorial.id);

  const prev = index > 0 ? seriesList[index - 1] : null;
  const next = index >= 0 && index < seriesList.length - 1 ? seriesList[index + 1] : null;

  return (
    <>
      <div>
        {prev ? (
          <Button variant="ghost" onClick={() => onNavigate(prev.id)} className="flex items-center gap-2">
            ← Prev in series: {prev.title}
          </Button>
        ) : (
          <div className="text-sm text-muted-foreground">No previous tutorial in series</div>
        )}
      </div>

      <div>
        {next ? (
          <Button onClick={() => onNavigate(next.id)} className="flex items-center gap-2">
            Next in series: {next.title} →
          </Button>
        ) : (
          <div className="text-sm text-muted-foreground">No next tutorial in series</div>
        )}
      </div>
    </>
  );
}