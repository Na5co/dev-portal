import { CustomizationState } from '@/lib/types';

export const fontLinks: Record<CustomizationState['font'], string> = {
  inter:
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap',
  'roboto-mono':
    'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;600;700&display=swap',
  'source-serif':
    'https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;500;600;700;800;900&display=swap',
};

export const fontFamilies: Record<CustomizationState['font'], string> = {
  inter: "'Inter', sans-serif",
  'roboto-mono': "'Roboto Mono', monospace",
  'source-serif': "'Source Serif 4', serif",
};

export const fontOptions: Record<CustomizationState['font'], string> = {
  inter: 'Inter (Sans-serif)',
  'roboto-mono': 'Roboto Mono (Monospace)',
  'source-serif': 'Source Serif (Serif)',
};
