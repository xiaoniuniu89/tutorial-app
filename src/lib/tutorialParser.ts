// Auto-discovery tutorial parser using frontmatter
// Scans tutorials/ folder and parses markdown files with YAML frontmatter

import yaml from 'js-yaml';
import type { 
  Tutorial, 
  TutorialStep, 
  TutorialConfig, 
  StepFrontmatter
} from './tutorialMetadata';

// Import formatters
import { formatTutorialTitle as formatTitle, generateStepId as genStepId } from './tutorialMetadata';

// Vite's import.meta.glob for dynamic imports
// This runs at build time and bundles all markdown files
const tutorialFiles = import.meta.glob('../../tutorials/**/*.md', { 
  query: '?raw',
  import: 'default',
  eager: true 
});

const tutorialConfigFiles = import.meta.glob('../../tutorials/**/_tutorial.yml', {
  query: '?raw',
  import: 'default',
  eager: true
});

/**
 * Simple frontmatter parser (browser-compatible)
 */
function parseFrontmatter(content: string): { data: any; content: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { data: {}, content };
  }
  
  try {
    const data = yaml.load(match[1]) || {};
    const markdownContent = match[2];
    return { data, content: markdownContent };
  } catch (error) {
    console.error('Error parsing YAML frontmatter:', error);
    return { data: {}, content };
  }
}

/**
 * Parse a step markdown file with frontmatter
 */
function parseStepFile(filepath: string, content: string): TutorialStep | null {
  try {
    const parsed = parseFrontmatter(content);
    const frontmatter = parsed.data as StepFrontmatter;
    
    // Validate required frontmatter fields
    if (!frontmatter.title || !frontmatter.description) {
      console.warn(`Step ${filepath} missing required frontmatter (title, description)`);
      return null;
    }
    
    const filename = filepath.split('/').pop() || '';
    const id = genStepId(filename);
    
    return {
      id,
      title: frontmatter.title,
      description: frontmatter.description,
      content: parsed.content,
      filename,
      frontmatter
    };
  } catch (error) {
    console.error(`Error parsing step file ${filepath}:`, error);
    return null;
  }
}

/**
 * Parse optional _tutorial.yml config file
 */
function parseTutorialConfig(content: string): TutorialConfig | null {
  try {
    return yaml.load(content) as TutorialConfig;
  } catch (error) {
    console.error('Error parsing _tutorial.yml:', error);
    return null;
  }
}

/**
 * Extract tutorial ID from file path
 */
function extractTutorialId(filepath: string): string {
  const parts = filepath.split('/');
  const tutorialsIndex = parts.indexOf('tutorials');
  return parts[tutorialsIndex + 1] || '';
}

/**
 * Group files by tutorial folder and build tutorials
 */
function discoverTutorials(): Record<string, Tutorial> {
  const tutorialMap = new Map<string, {
    steps: TutorialStep[];
    config?: TutorialConfig;
  }>();
  
  // Parse all step files
  for (const [filepath, content] of Object.entries(tutorialFiles)) {
    const tutorialId = extractTutorialId(filepath);
    const filename = filepath.split('/').pop() || '';
    
    // Skip non-step files
    if (!filename.startsWith('step-') || !filename.endsWith('.md')) {
      continue;
    }
    
    const step = parseStepFile(filepath, content as string);
    if (!step) continue;
    
    if (!tutorialMap.has(tutorialId)) {
      tutorialMap.set(tutorialId, { steps: [] });
    }
    
    tutorialMap.get(tutorialId)!.steps.push(step);
  }
  
  // Parse optional _tutorial.yml configs
  for (const [filepath, content] of Object.entries(tutorialConfigFiles)) {
    const tutorialId = extractTutorialId(filepath);
    const config = parseTutorialConfig(content as string);
    
    if (config && tutorialMap.has(tutorialId)) {
      tutorialMap.get(tutorialId)!.config = config;
    }
  }
  
  // Build complete tutorial objects
  const tutorials: Record<string, Tutorial> = {};
  
  for (const [tutorialId, data] of tutorialMap.entries()) {
    // Sort steps by filename (step-1, step-2, etc.)
    const sortedSteps = data.steps.sort((a, b) => 
      a.filename.localeCompare(b.filename, undefined, { numeric: true })
    );
    
    if (sortedSteps.length === 0) continue;
    
    // Build tutorial with defaults or config overrides
    const config = data.config;
    const title = config?.title || formatTitle(tutorialId);
    const description = config?.description || sortedSteps[0]?.description || '';
    const author = config?.author || 'AI Training Team';
    
    tutorials[tutorialId] = {
      id: tutorialId,
      title,
      description,
      author,
      steps: sortedSteps,
      series: config?.series
    };
  }
  
  return tutorials;
}

// Discover and cache tutorials at module load time
const tutorialCache = discoverTutorials();

console.log(`📚 Discovered ${Object.keys(tutorialCache).length} tutorials:`, Object.keys(tutorialCache));

/**
 * Load a single tutorial by ID
 */
export function loadTutorial(tutorialId: string): Tutorial | null {
  return tutorialCache[tutorialId] || null;
}

/**
 * Get all available tutorials
 */
export function loadTutorials(): Tutorial[] {
  return Object.values(tutorialCache);
}

/**
 * Get tutorial metadata (same as loadTutorial for this simple system)
 */
export function getTutorialMetadata(tutorialId: string): Tutorial | null {
  return loadTutorial(tutorialId);
}

/**
 * Get all tutorial metadata
 */
export function getAllTutorialMetadata(): Record<string, Tutorial> {
  return { ...tutorialCache };
}

/**
 * Search tutorials by query
 */
export function searchTutorials(query: string): Tutorial[] {
  const lowerQuery = query.toLowerCase();
  
  return Object.values(tutorialCache).filter(tutorial => 
    tutorial.title.toLowerCase().includes(lowerQuery) ||
    tutorial.description.toLowerCase().includes(lowerQuery) ||
    tutorial.steps.some(step => 
      step.title.toLowerCase().includes(lowerQuery) ||
      step.description.toLowerCase().includes(lowerQuery)
    )
  );
}

/**
 * Get tutorial by ID (alias for loadTutorial)
 */
export function getTutorial(tutorialId: string): Tutorial | null {
  return loadTutorial(tutorialId);
}

/**
 * Get tutorials grouped by series
 */
export function getTutorialsBySeries(): Record<string, Tutorial[]> {
  const seriesMap: Record<string, Tutorial[]> = {};
  
  for (const tutorial of Object.values(tutorialCache)) {
    if (tutorial.series?.name) {
      const seriesName = tutorial.series.name;
      if (!seriesMap[seriesName]) {
        seriesMap[seriesName] = [];
      }
      seriesMap[seriesName].push(tutorial);
    }
  }
  
  // Sort each series by part number
  for (const series of Object.values(seriesMap)) {
    series.sort((a, b) => (a.series?.part || 0) - (b.series?.part || 0));
  }
  
  return seriesMap;
}

// Re-export types for convenience
export type { Tutorial, TutorialStep };