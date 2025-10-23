import { useState, useEffect } from 'react';
import { TutorialWizard } from './components/TutorialWizard';
import { TutorialList } from './components/TutorialList';
import { DebugPanel } from './components/DebugPanel';
import './App.css';
import { Button } from './components/ui/button';
import { ChevronLeft, Moon, Sun } from 'lucide-react';
import { getThemePreference, setThemePreference } from './lib/progressStore';

function App() {
  const [selectedTutorial, setSelectedTutorial] = useState<string | null>(null);
  const [isDark, setIsDark] = useState<boolean>(() => {
    // Check for saved theme preference from LowDB or system preference
    const savedTheme = getThemePreference();
    console.log('Theme loaded from LowDB:', savedTheme);
    if (savedTheme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return savedTheme === 'dark';
  });

  // Apply dark class to document
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Listen for system theme changes
  useEffect(() => {
    const savedTheme = getThemePreference();
    if (savedTheme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        setIsDark(e.matches);
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  const handleSelectTutorial = (tutorialId: string) => {
    setSelectedTutorial(tutorialId);
  };

  const handleBackToList = () => {
    setSelectedTutorial(null);
  };

  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>(() => {
    return getThemePreference();
  });

  const toggleTheme = () => {
    const currentTheme = getThemePreference();
    let newTheme: 'light' | 'dark' | 'system';
    
    // Cycle through: light -> dark -> system -> light
    switch (currentTheme) {
      case 'light':
        newTheme = 'dark';
        break;
      case 'dark':
        newTheme = 'system';
        break;
      case 'system':
        newTheme = 'light';
        break;
      default:
        newTheme = 'dark';
    }
    
    setThemeMode(newTheme);
    setThemePreference(newTheme);
    console.log('Theme changed to:', newTheme, 'Stored in LowDB');
    
    if (newTheme === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(systemPrefersDark);
    } else {
      setIsDark(newTheme === 'dark');
    }
  };

  if (selectedTutorial) {
    return (
      <div >
        {/* Back Button and Theme Toggle */}
        <div className="fixed top-4 left-4 z-10 flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBackToList}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Tutorials
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="flex items-center gap-2 min-w-[80px]"
            title={`Current: ${themeMode} theme. Click to cycle through themes.`}
          >
            {themeMode === 'system' ? '🌓' : (isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />)}
            <span className="text-xs capitalize">{themeMode}</span>
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

  return (
    <div className="relative">
      {/* Theme Toggle Button */}
      <div className="fixed top-6 right-6 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleTheme}
          className="flex items-center gap-2 shadow-lg min-w-[100px]"
          title={`Current: ${themeMode} theme. Click to cycle through themes.`}
        >
          {themeMode === 'system' ? '🌓' : (isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />)}
          <span className="capitalize">{themeMode}</span>
        </Button>
      </div>
      <TutorialList onSelectTutorial={handleSelectTutorial} />
      <DebugPanel />
    </div>
  );
}

export default App;
