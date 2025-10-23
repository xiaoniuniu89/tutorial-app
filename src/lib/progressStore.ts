import { LocalStoragePreset } from 'lowdb/browser';

export interface StepProgress {
  visited: boolean;
  completed: boolean;
  lastVisited?: number; // timestamp
}

export interface TutorialProgress {
  [tutorialId: string]: {
    [stepId: string]: StepProgress;
  };
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  lastUpdated?: number;
}

interface ProgressData {
  tutorials: TutorialProgress;
  preferences: UserPreferences;
}

const defaultData: ProgressData = {
  tutorials: {},
  preferences: {
    theme: 'system',
    lastUpdated: Date.now(),
  },
};

// Initialize the database with LocalStorage
const db = LocalStoragePreset<ProgressData>('tutorial-progress', defaultData);

/**
 * Mark a step as visited
 */
export function markStepVisited(tutorialId: string, stepId: string): void {
  if (!db.data.tutorials[tutorialId]) {
    db.data.tutorials[tutorialId] = {};
  }
  
  if (!db.data.tutorials[tutorialId][stepId]) {
    db.data.tutorials[tutorialId][stepId] = {
      visited: true,
      completed: false,
      lastVisited: Date.now(),
    };
  } else {
    db.data.tutorials[tutorialId][stepId].visited = true;
    db.data.tutorials[tutorialId][stepId].lastVisited = Date.now();
  }
  
  db.write();
}

/**
 * Mark a step as completed
 */
export function markStepCompleted(tutorialId: string, stepId: string): void {
  if (!db.data.tutorials[tutorialId]) {
    db.data.tutorials[tutorialId] = {};
  }
  
  if (!db.data.tutorials[tutorialId][stepId]) {
    db.data.tutorials[tutorialId][stepId] = {
      visited: true,
      completed: true,
      lastVisited: Date.now(),
    };
  } else {
    db.data.tutorials[tutorialId][stepId].completed = true;
  }
  
  db.write();
}

/**
 * Get progress for a specific tutorial
 */
export function getTutorialProgress(tutorialId: string): Record<string, StepProgress> {
  return db.data.tutorials[tutorialId] || {};
}

/**
 * Get progress for a specific step
 */
export function getStepProgress(tutorialId: string, stepId: string): StepProgress | null {
  return db.data.tutorials[tutorialId]?.[stepId] || null;
}

/**
 * Check if a step has been visited
 */
export function isStepVisited(tutorialId: string, stepId: string): boolean {
  return db.data.tutorials[tutorialId]?.[stepId]?.visited || false;
}

/**
 * Check if a step has been completed
 */
export function isStepCompleted(tutorialId: string, stepId: string): boolean {
  return db.data.tutorials[tutorialId]?.[stepId]?.completed || false;
}

/**
 * Reset progress for a tutorial
 */
export function resetTutorialProgress(tutorialId: string): void {
  delete db.data.tutorials[tutorialId];
  db.write();
}

/**
 * Reset all progress
 */
export function resetAllProgress(): void {
  db.data.tutorials = {};
  db.write();
}

/**
 * Get all progress data (useful for debugging)
 */
export function getAllProgress(): TutorialProgress {
  return db.data.tutorials;
}

/**
 * Set user theme preference
 */
export function setThemePreference(theme: 'light' | 'dark' | 'system'): void {
  db.data.preferences.theme = theme;
  db.data.preferences.lastUpdated = Date.now();
  db.write();
}

/**
 * Get user theme preference
 */
export function getThemePreference(): 'light' | 'dark' | 'system' {
  return db.data.preferences.theme;
}

/**
 * Get all user preferences
 */
export function getUserPreferences(): UserPreferences {
  return db.data.preferences;
}

/**
 * Update user preferences
 */
export function updateUserPreferences(preferences: Partial<UserPreferences>): void {
  db.data.preferences = {
    ...db.data.preferences,
    ...preferences,
    lastUpdated: Date.now(),
  };
  db.write();
}
