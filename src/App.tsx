import { useState } from 'react';
import { TutorialWizard } from './components/TutorialWizard';
import { TutorialList } from './components/TutorialList';
import './App.css';
import { Button } from './components/ui/button';
import { ChevronLeft } from 'lucide-react';

function App() {
  const [selectedTutorial, setSelectedTutorial] = useState<string | null>(null);

  const handleSelectTutorial = (tutorialId: string) => {
    setSelectedTutorial(tutorialId);
  };

  const handleBackToList = () => {
    setSelectedTutorial(null);
  };

  if (selectedTutorial) {
    return (
      <div >
        {/* Back Button */}
        <div className="fixed top-4 left-4 z-10">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBackToList}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Tutorials
          </Button>
        </div>
        
        {/* Tutorial Wizard */}
        <TutorialWizard 
          tutorialId={selectedTutorial} 
          onBackToTutorials={handleBackToList}
        />
      </div>
    );
  }

  return <TutorialList onSelectTutorial={handleSelectTutorial} />;
}

export default App;
