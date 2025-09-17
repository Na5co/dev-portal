import { ParsedCollection, ParsedItem } from '@/lib/postman-parser';
import { CustomizationState } from '@/lib/types';

function getMethodColor(method: string) {
  switch (method.toUpperCase()) {
    case 'GET':
      return 'background: #22c55e; color: white;';
    case 'POST':
      return 'background: #3b82f6; color: white;';
    case 'PUT':
      return 'background: #f59e0b; color: white;';
    case 'DELETE':
      return 'background: #ef4444; color: white;';
    case 'PATCH':
      return 'background: #8b5cf6; color: white;';
    default:
      return 'background: #6b7280; color: white;';
  }
}

function formatJson(jsonString: string) {
  try {
    return JSON.stringify(JSON.parse(jsonString), null, 2);
  } catch {
    return jsonString;
  }
}

function renderRequestItem(item: ParsedItem): string {
  if (!item.request) return '';
  
  const methodStyle = getMethodColor(item.request.method || 'GET');
  
  return `
    <div style="border-top: 1px solid #e2e8f0; padding: 48px 0;">
      <div style="display: grid; grid-template-columns: 1fr; gap: 48px;">
        <div>
          <h3 style="font-size: 24px; font-weight: bold; color: #1f2937; margin-bottom: 16px;">
            ${item.name}
          </h3>
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
            <span style="${methodStyle} padding: 4px 12px; border-radius: 6px; font-size: 14px; font-weight: 600;">
              ${item.request.method}
            </span>
            <code style="background: #f1f5f9; color: #1e293b; padding: 6px 12px; border-radius: 6px; font-family: monospace;">
              ${item.request.url}
            </code>
          </div>
          ${item.description ? `
            <div style="margin-bottom: 24px; line-height: 1.6;">
              <p>${item.description}</p>
            </div>
          ` : ''}
          
          ${item.request.headers && item.request.headers.length > 0 ? `
            <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <div style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #374151;">
                Headers (${item.request.headers.length})
              </div>
              <div style="padding: 16px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <thead>
                    <tr style="background: #f8fafc;">
                      <th style="padding: 8px; text-align: left; border: 1px solid #e2e8f0; font-weight: 500; color: #6b7280;">Key</th>
                      <th style="padding: 8px; text-align: left; border: 1px solid #e2e8f0; font-weight: 500; color: #6b7280;">Value</th>
                      <th style="padding: 8px; text-align: left; border: 1px solid #e2e8f0; font-weight: 500; color: #6b7280;">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${item.request.headers.map(header => `
                      <tr>
                        <td style="padding: 8px; border: 1px solid #e2e8f0; font-family: monospace; color: #1f2937;">${header.key}</td>
                        <td style="padding: 8px; border: 1px solid #e2e8f0; font-family: monospace; color: #6b7280;">${header.value}</td>
                        <td style="padding: 8px; border: 1px solid #e2e8f0; color: #6b7280;">${header.description || ''}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          ` : ''}
          
          ${item.request.body && item.request.body.raw ? `
            <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <div style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #374151;">
                Request Body
              </div>
              <div style="padding: 16px;">
                <div style="background: #1e293b; color: #f1f5f9; border-radius: 8px; padding: 16px; overflow-x: auto;">
                  <pre style="margin: 0; font-family: monospace; font-size: 14px;"><code>${formatJson(item.request.body.raw)}</code></pre>
                </div>
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

function renderFolderItem(item: ParsedItem): string {
  return `
    <div style="border-top: 1px solid #e2e8f0; padding: 48px 0;">
      <h2 style="font-size: 30px; font-weight: bold; color: #111827; border-bottom: 1px solid #e2e8f0; padding-bottom: 16px;">
        ${item.name}
      </h2>
      ${item.description ? `
        <div style="margin-top: 24px; line-height: 1.6;">
          <p>${item.description}</p>
        </div>
      ` : ''}
      <div style="margin-top: 32px;">
        ${item.items ? item.items.map(child => 
          child.type === 'folder' ? renderFolderItem(child) : renderRequestItem(child)
        ).join('') : ''}
      </div>
    </div>
  `;
}

export function exportToStaticHtml(collection: ParsedCollection, customization: CustomizationState) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${collection.name} - API Documentation</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            line-height: 1.5;
            color: #374151;
            background-color: #f8fafc;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 24px;
        }
        
        header {
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(8px);
            border-bottom: 1px solid #e2e8f0;
            position: sticky;
            top: 0;
            z-index: 50;
            height: 69px;
        }
        
        .header-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 100%;
            padding: 0 24px;
        }
        
        .logo {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .logo img {
            height: 32px;
            width: auto;
        }
        
        .logo-fallback {
            width: 32px;
            height: 32px;
            background: #111827;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 18px;
        }
        
        .main-content {
            padding: 32px 0;
        }
        
        .title-section {
            padding-bottom: 32px;
        }
        
        .title {
            font-size: 48px;
            font-weight: 900;
            color: #111827;
            margin-bottom: 24px;
            letter-spacing: -0.025em;
        }
        
        .description {
            font-size: 16px;
            line-height: 1.7;
            color: #6b7280;
            max-width: 768px;
        }
        
        .footer {
            margin-top: 48px;
            padding-top: 32px;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            color: #6b7280;
            font-size: 14px;
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 0 16px;
            }
            
            .title {
                font-size: 32px;
            }
            
            .header-content {
                padding: 0 16px;
            }
        }
    </style>
</head>
<body>
    <header>
        <div class="header-content">
            <div class="logo">
                ${customization.logo ? 
                    `<img src="${customization.logo}" alt="Logo">` : 
                    `<div class="logo-fallback">📚</div>`
                }
                <span style="font-size: 18px; font-weight: 600; color: #111827;">${collection.name}</span>
            </div>
        </div>
    </header>
    
    <main class="main-content">
        <div class="container">
            <div class="title-section">
                <h1 class="title">${collection.name}</h1>
                ${collection.description ? `
                    <div class="description">
                        <p>${collection.description}</p>
                    </div>
                ` : ''}
            </div>
            
            <div>
                ${collection.items.map(item => 
                    item.type === 'folder' ? renderFolderItem(item) : renderRequestItem(item)
                ).join('')}
            </div>
            
            ${customization.footer ? `
                <div class="footer">
                    <p>${customization.footer}</p>
                </div>
            ` : ''}
        </div>
    </main>
</body>
</html>`;

    // Download the file
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${collection.name.replace(/\s/g, '_')}_docs.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}
