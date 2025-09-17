import { useEffect, useState } from 'react';
import { ParsedCollection, parsePostmanCollection } from '@/lib/postman-parser';
import { CustomizationState } from '@/lib/types';

export const useAppState = () => {
  const [collection, setCollection] = useState<ParsedCollection | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customization, setCustomization] = useState<CustomizationState>({
    logo: null,
    accentColor: '#000000',
    favicon: null,
    font: 'inter',
    footer: '',
    postmanCollectionId: null,
    postmanWorkspaceId: null,
    postmanUserId: null,
  });

  const handleFileSelect = async (content: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const jsonData = JSON.parse(content);
      const parsedCollection = parsePostmanCollection(jsonData);
      setCollection(parsedCollection);
    } catch (err) {
      setError(
        "Failed to parse the collection file. Please ensure it's a valid Postman collection JSON."
      );
      console.error('Parse error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCollection(null);
    setError(null);
  };

  return {
    collection,
    isLoading,
    error,
    customization,
    setCustomization,
    handleFileSelect,
    handleReset,
  };
};
