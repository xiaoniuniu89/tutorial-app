// Frontmatter-based tutorial metadata system
// Tutorials auto-discovered from markdown files with YAML frontmatter

/**
 * Frontmatter parsed from step markdown files
 */
export interface StepFrontmatter {
  /** Step title (required) */
  title: string;
  /** Step description (required) */
  description: string;
  /** Optional duration estimate */
  duration?: string;
  /** Optional difficulty level */
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  /** Optional tags for filtering */
  tags?: string[];
}

/**
 * Optional _tutorial.yml configuration
 * Only needed for custom metadata or series information
 */
export interface TutorialConfig {
  /** Override tutorial title (defaults to folder name) */
  title?: string;
  /** Override tutorial description (defaults to first step description) */
  description?: string;
  /** Author information (defaults to "AI Training Team") */
  author?: string;
  /** Series information (optional) */
  series?: {
    /** Name of the series this tutorial belongs to */
    name: string;
    /** Part number in the series */
    part: number;
    /** ID of next tutorial in series (optional) */
    nextTutorial?: string;
    /** ID of previous tutorial in series (optional) */
    previousTutorial?: string;
  };
}

/**
 * Complete tutorial step with content
 */
export interface TutorialStep {
  /** Unique identifier for the step (derived from filename) */
  id: string;
  /** Step title from frontmatter */
  title: string;
  /** Step description from frontmatter */
  description: string;
  /** Full markdown content (without frontmatter) */
  content: string;
  /** Original filename */
  filename: string;
  /** Frontmatter data */
  frontmatter: StepFrontmatter;
}

/**
 * Complete tutorial with all metadata
 */
export interface Tutorial {
  /** Tutorial ID (folder name) */
  id: string;
  /** Tutorial title */
  title: string;
  /** Tutorial description */
  description: string;
  /** Author name */
  author: string;
  /** Tutorial steps in order */
  steps: TutorialStep[];
  /** Series information if applicable */
  series?: TutorialConfig['series'];
}

/**
 * Helper to format tutorial title from folder name
 */
export function formatTutorialTitle(folderId: string): string {
  return folderId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Helper to generate step ID from filename
 */
export function generateStepId(filename: string): string {
  return filename
    .replace(/\.md$/, '')
    .replace(/^step-\d+-/, '')
    .toLowerCase();
}