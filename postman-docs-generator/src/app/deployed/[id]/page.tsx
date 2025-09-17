'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { DocumentationViewer } from '@/components/documentation-viewer';
import { generateColorTheme } from '@/lib/colors';
import { fontLinks, fontFamilies } from '@/lib/constants';
import { ParsedCollection } from '@/lib/postman-parser';
import { CustomizationState } from '@/lib/types';
import { FlowsReadonly } from '@/components/flows-readonly';
import { Button } from '@/components/ui/button';
import { Book, Zap, ArrowLeft } from '@/components/icons';
import Image from 'next/image';
import Link from 'next/link';

// Import global styles to ensure they're available
import '@/app/globals.css';

interface DeployedPage {
  id: string;
  name: string;
  description?: string;
  deployedAt: string;
  collection: ParsedCollection;
  customization: CustomizationState;
}

export default function DeployedDocumentationPage() {
  const params = useParams();
  const deploymentId = params.id as string;
  
  const [deployedPage, setDeployedPage] = useState<DeployedPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'documentation' | 'flows'>('documentation');

  useEffect(() => {
    const loadDeployedPage = async () => {
      try {
        // Use API endpoint to load deployed page data
        const response = await fetch(`/api/deployed/${deploymentId}`);
        if (!response.ok) {
          throw new Error(`Deployed page not found (HTTP ${response.status})`);
        }
        const data: DeployedPage = await response.json();
        setDeployedPage(data);
        console.log('Successfully loaded deployed page:', data);
      } catch (err) {
        console.error('Error loading deployed page:', err);
        setError(`Failed to load deployed documentation page: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    };

    if (deploymentId) {
      console.log('Loading deployment with ID:', deploymentId);
      loadDeployedPage();
    }
  }, [deploymentId]);

  // Set up favicon and font when customization loads
  useEffect(() => {
    if (deployedPage?.customization) {
      const { favicon, font } = deployedPage.customization;
      
      if (favicon) {
        let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
        if (link) {
          link.href = favicon;
        } else {
          link = document.createElement('link');
          link.rel = 'icon';
          link.href = favicon;
          document.getElementsByTagName('head')[0].appendChild(link);
        }
      }

      const fontLink = document.getElementById('font-link') as HTMLLinkElement;
      if (fontLink) {
        fontLink.href = fontLinks[font];
      }
    }
  }, [deployedPage?.customization]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading documentation...</p>
        </div>
      </div>
    );
  }

  if (error || !deployedPage) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Page Not Found</h1>
          <p className="text-slate-600 mb-4">
            {error || 'The requested documentation page could not be found.'}
          </p>
          <Link href="/">
            <Button variant="default">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const styles = {
    ...generateColorTheme(deployedPage.customization.accentColor),
    '--font-family': fontFamilies[deployedPage.customization.font],
  } as React.CSSProperties;

  return (
    <div className="min-h-screen bg-slate-50">
      <style dangerouslySetInnerHTML={{
        __html: `
          :root {
            ${Object.entries(styles).map(([key, value]) => `${key}: ${value};`).join('\n            ')}
          }
          body {
            font-family: ${fontFamilies[deployedPage.customization.font]};
          }
          .prose {
            color: #374151;
            max-width: none;
            font-size: 0.875rem;
            line-height: 1.5;
          }
          .prose h1 {
            color: #111827;
            font-size: 1.25rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            margin-top: 1rem;
          }
          .prose h2 {
            color: #111827;
            font-size: 1.125rem;
            font-weight: 600;
            margin-bottom: 0.375rem;
            margin-top: 0.875rem;
          }
          .prose h3, .prose h4, .prose h5, .prose h6 {
            color: #111827;
            font-weight: 600;
            margin-bottom: 0.25rem;
            margin-top: 0.75rem;
          }
          .prose p {
            margin-bottom: 0.5rem;
            line-height: 1.5;
          }
          .prose code {
            background-color: #f3f4f6;
            padding: 0.125rem 0.25rem;
            border-radius: 0.25rem;
            font-size: 0.8rem;
            color: #dc2626;
          }
          .prose pre {
            background-color: #f9fafb;
            padding: 0.5rem;
            border-radius: 0.25rem;
            overflow-x: auto;
            margin: 0.5rem 0;
          }
          .prose ul, .prose ol {
            margin-bottom: 0.5rem;
            padding-left: 1rem;
          }
          .prose li {
            margin-bottom: 0.125rem;
          }
          .prose blockquote {
            border-left: 3px solid #e5e7eb;
            padding-left: 0.75rem;
            margin: 0.5rem 0;
            font-style: italic;
            color: #6b7280;
          }
        `
      }} />
      
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            {deployedPage.customization.logo ? (
              <img
                src={deployedPage.customization.logo}
                alt="Logo"
                className="h-7 w-auto"
              />
            ) : (
              <div className="w-7 h-7 bg-gray-900 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">📚</span>
              </div>
            )}
            <div>
              <h1 className="text-base font-semibold text-slate-900">{deployedPage.name}</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveView('documentation')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                activeView === 'documentation'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📚 Documentation
            </button>
            <button
              onClick={() => setActiveView('flows')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                activeView === 'flows'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ⚡ Flows
            </button>
            <a
              href="/"
              className="px-3 py-1.5 border border-slate-300 rounded text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              ← Back to Editor
            </a>
          </div>
        </div>
      </header>

      {/* Content */}
      {activeView === 'documentation' ? (
        <div className="h-[calc(100vh-57px)]">
          <DocumentationViewer
            collection={{
              ...deployedPage.collection,
              description: deployedPage.description ? 
                deployedPage.description + (deployedPage.collection.description ? '\n\n---\n\n' + deployedPage.collection.description : '') 
                : deployedPage.collection.description
            }}
            footerContent={deployedPage.customization.footer}
            postmanCollectionId={deployedPage.customization.postmanCollectionId}
            postmanWorkspaceId={deployedPage.customization.postmanWorkspaceId}
          />
        </div>
      ) : (
        <div className="bg-white min-h-[calc(100vh-57px)]">
          <FlowsReadonly />
        </div>
      )}
    </div>
  );
}
