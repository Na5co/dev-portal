'use client';

import { useState, useRef, CSSProperties, useEffect } from 'react';
import { DocumentationViewer } from '@/components/documentation-viewer';
import { parsePostmanCollection, ParsedCollection } from '@/lib/postman-parser';
import { ConfigurationPanel } from '@/components/configuration-panel';
import { generateColorTheme } from '@/lib/colors';
import { LandingPage } from '@/components/landing-page';
import { Header } from '@/components/header';

export interface CustomizationState {
  logo: string | null;
  accentColor: string;
  favicon: string | null;
  font: 'inter' | 'roboto-mono' | 'source-serif';
  footer: string;
  postmanCollectionId: string | null;
  postmanWorkspaceId: string | null;
}

const fontLinks: Record<CustomizationState['font'], string> = {
  inter:
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap',
  'roboto-mono':
    'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;600;700&display=swap',
  'source-serif':
    'https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;500;600;700;800;900&display=swap',
};

const fontFamilies: Record<CustomizationState['font'], string> = {
  inter: "'Inter', sans-serif",
  'roboto-mono': "'Roboto Mono', monospace",
  'source-serif': "'Source Serif 4', serif",
};

export default function Home() {
  const [collection, setCollection] = useState<ParsedCollection | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const documentationRef = useRef<HTMLDivElement>(null);
  const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(false);
  const [customization, setCustomization] = useState<CustomizationState>({
    logo: null,
    accentColor: '#000000',
    favicon: null,
    font: 'inter',
    footer: '',
    postmanCollectionId: null,
    postmanWorkspaceId: null,
  });

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

  const handleExport = () => {
    const configPanel = document.getElementById('config-panel');
    if (configPanel) configPanel.style.display = 'none';

    if (documentationRef.current) {
      const content = documentationRef.current.innerHTML;
      const styles = Array.from(document.styleSheets)
        .map((styleSheet) => {
          try {
            return Array.from(styleSheet.cssRules)
              .map((rule) => rule.cssText)
              .join('');
          } catch (e) {
            console.warn('Cannot read styles from cross-origin stylesheet.', e);
            return '';
          }
        })
        .join('');

      const theme = generateColorTheme(customization.accentColor);
      const customStyles = `
        :root {
          --accent: ${theme['--accent']};
          --accent-light: ${theme['--accent-light']};
          --accent-foreground: ${theme['--accent-foreground']};
          --font-family: ${fontFamilies[customization.font]};
        }
      `;

      const faviconLink = customization.favicon
        ? `<link rel="icon" href="${customization.favicon}">`
        : '';
      const fontLink = `<link id="font-link" rel="stylesheet" href="${
        fontLinks[customization.font]
      }">`;

      const postmanScript = customization.postmanCollectionId
        ? `
      <script type="text/javascript">
        (function (p,o,s,t,m,a,n) {
          !p[s] && (p[s] = function () { (p[t] || (p[t] = [])).push(arguments); });
          !o.getElementById(s+t) && o.getElementsByTagName("head")[0].appendChild((
            (n = o.createElement("script")),
            (n.id = s+t), (n.async = 1), (n.src = m), n
          ));
        }(window, document, "_pm", "PostmanRunObject", "https://run.pstmn.io/button.js"));
      </script>
    `
        : '';

      const html = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${
              collection?.name || 'API Documentation'
            } - API Documentation</title>
            ${faviconLink}
            ${fontLink}
            <style>${styles}${customStyles}</style>
            ${postmanScript}
          </head>
          <body>
            ${content}
          </body>
        </html>
      `;

      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${
        collection?.name?.toLowerCase().replace(/\s+/g, '-') ||
        'api-documentation'
      }.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    if (configPanel) configPanel.style.display = 'block';
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
      className='min-h-screen bg-white'
    >
      <Header
        logo={customization.logo}
        onCustomizeClick={() => setIsConfigPanelOpen(true)}
        onExportClick={handleExport}
        onResetClick={handleReset}
      />
      <div ref={documentationRef}>
        <DocumentationViewer
          collection={collection}
          footerContent={customization.footer}
          postmanCollectionId={customization.postmanCollectionId}
          postmanWorkspaceId={customization.postmanWorkspaceId}
        />
      </div>
      {isConfigPanelOpen && (
        <ConfigurationPanel
          customization={customization}
          onCustomizationChange={setCustomization}
          onClose={() => setIsConfigPanelOpen(false)}
        />
      )}
    </div>
  );
}
