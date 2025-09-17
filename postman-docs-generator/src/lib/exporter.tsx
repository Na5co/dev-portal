import React from 'react';
import { CustomizationState } from '@/lib/types';
import { ParsedCollection } from './postman-parser';

export const exportToHtml = async (
  documentationRef: React.RefObject<HTMLDivElement | null>,
  collection: ParsedCollection | null,
  customization: CustomizationState
) => {
  if (!collection) {
    alert('Please upload a collection first');
    return;
  }

  try {
    // Show loading state
    const originalText = 'Export';
    const exportButton = document.querySelector('[data-export-id="export-button"]') as HTMLButtonElement;
    if (exportButton) {
      exportButton.disabled = true;
      exportButton.textContent = 'Generating...';
    }

    // Create the export data
    const exportData = { collection, customization };
    const exportJson = JSON.stringify(exportData, null, 2);
    
    // Download export.json
    const blob = new Blob([exportJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'export.json';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Reset button state
    if (exportButton) {
      exportButton.disabled = false;
      exportButton.textContent = originalText;
    }

  } catch (error) {
    console.error('Export failed:', error);
    alert('Export failed. Please try again.');
    
    // Reset button state on error
    const exportButton = document.querySelector('[data-export-id="export-button"]') as HTMLButtonElement;
    if (exportButton) {
      exportButton.disabled = false;
      exportButton.textContent = 'Export';
    }
  }
};