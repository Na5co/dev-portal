'use client';

import { useRef, CSSProperties, useEffect, useState } from 'react';
import { DocumentationViewer } from '@/components/documentation-viewer';
import { ConfigurationPanel } from '@/components/configuration-panel';
import { DeployedPagesPanel } from '@/components/deployed-pages-panel';
import { generateColorTheme } from '@/lib/colors';
import { LandingPage } from '@/components/landing-page';
import { Header } from '@/components/header';
import { fontLinks, fontFamilies } from '@/lib/constants';
import { useAppState } from '@/lib/hooks/useAppState';
import { Flows } from '@/components/Flows';
// Removed export functionality 

export default function Home() {
  const {
    collection,
    isLoading,
    error,
    customization,
    setCustomization,
    handleFileSelect,
    handleReset,
  } = useAppState();
  const documentationRef = useRef<HTMLDivElement>(null);
  const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(false);
  const [isDeployedPanelOpen, setIsDeployedPanelOpen] = useState(false);
  const [activeView, setActiveView] = useState<'documentation' | 'flows'>(
    'documentation'
  );
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentResult, setDeploymentResult] = useState<{ success: boolean; url?: string; message: string } | null>(null);

  useEffect(() => {
    if (customization.favicon) {
      let link: HTMLLinkElement | null =
        document.querySelector("link[rel*='icon']");
      if (link) {
        link.href = customization.favicon;
      } else {
        link = document.createElement('link');
        link.rel = 'icon';
        link.href = customization.favicon;
        document.getElementsByTagName('head')[0].appendChild(link);
      }
    }

    const fontLink = document.getElementById('font-link') as HTMLLinkElement;
    if (fontLink) {
      fontLink.href = fontLinks[customization.font];
    }
  }, [customization.favicon, customization.font]);

  const handleDeploy = async () => {
    if (!collection) {
      alert('Cannot deploy without a collection.');
      return;
    }

    setIsDeploying(true);
    setDeploymentResult(null);
    
    try {
      const response = await fetch('/api/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ collection, customization }),
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        setDeploymentResult({
          success: true,
          url: result.url,
          message: result.message,
        });
        
        // Show success message with link
        alert(`✅ ${result.message}\n\nYour documentation is now available at:\n${window.location.origin}${result.url}\n\nClick OK to visit the deployed page.`);
        
        // Open the deployed page in a new tab
        window.open(`${window.location.origin}${result.url}`, '_blank');
      } else {
        throw new Error(result.message || 'Deployment failed');
      }
    } catch (error) {
      console.error('Deployment failed:', error);
      setDeploymentResult({
        success: false,
        message: error instanceof Error ? error.message : 'Deployment failed. Please try again.',
      });
      alert(`❌ Deployment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsDeploying(false);
    }
  };

  const styles = {
    ...generateColorTheme(customization.accentColor),
    '--font-family': fontFamilies[customization.font],
  } as CSSProperties;

  if (!collection) {
    return (
      <div style={styles}>
        <LandingPage
          onFileSelect={handleFileSelect}
          isLoading={isLoading}
          error={error}
        />
      </div>
    );
  }

  return (
    <div
      style={styles}
      className='min-h-screen bg-slate-50 max-w-full overflow-x-hidden'
    >
      <Header
        logo={customization.logo}
        activeView={activeView}
        onNavigate={setActiveView}
        onCustomizeClick={() => setIsConfigPanelOpen(true)}
        onDeployClick={handleDeploy}
        isDeploying={isDeploying}
        onViewDeployedClick={() => setIsDeployedPanelOpen(true)}
        onResetClick={handleReset}
      />
      <div ref={documentationRef}>
        {activeView === 'documentation' ? (
          <DocumentationViewer
            collection={collection}
            footerContent={customization.footer}
            postmanCollectionId={customization.postmanCollectionId}
            postmanWorkspaceId={customization.postmanWorkspaceId}
          />
        ) : (
          <Flows />
        )}
      </div>
      {isConfigPanelOpen && (
        <ConfigurationPanel
          customization={customization}
          onCustomizationChange={setCustomization}
          onClose={() => setIsConfigPanelOpen(false)}
        />
      )}
      {isDeployedPanelOpen && (
        <DeployedPagesPanel
          onClose={() => setIsDeployedPanelOpen(false)}
        />
      )}
    </div>
  );
}
