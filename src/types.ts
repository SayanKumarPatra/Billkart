export * from './types/index';

export interface VideoConfig {
  url: string;
  name: string;
  isCustom: boolean;
  aspectRatio: 'cover' | 'contain';
}

export interface LoadingStep {
  progress: number;
  message: string;
}

export type AppScreen = 'splash' | 'onboarding' | 'auth' | 'business-setup' | 'dashboard';
