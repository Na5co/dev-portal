'use client';

import { useEffect } from 'react';
import { ExternalLink, Play, Zap } from 'lucide-react';
import { parsePostmanUid } from './run-in-postman-button';

interface RunInPostmanCTAProps {
  collectionId: string;
  workspaceId: string | null;
  collectionName: string;
}

export function RunInPostmanCTA({
  collectionId: collectionUid,
  workspaceId,
  collectionName,
}: RunInPostmanCTAProps) {
  useEffect(() => {
    const scriptId = 'postman-run-button-script';
    if (document.getElementById(scriptId)) {
      // @ts-expect-error
      window._pm?.PostmanRunObject?.init();
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://run.pstmn.io/button.js';
    script.async = true;
    script.onload = () => {
      // @ts-expect-error
      window._pm?.PostmanRunObject?.init();
    };
    document.head.appendChild(script);
  }, [collectionUid, workspaceId]);

  const parsed = parsePostmanUid(collectionUid);

  if (!parsed || !parsed.userId || !workspaceId) {
    return null;
  }

  const dataUrl = `entityId=${collectionUid}&entityType=collection&workspaceId=${workspaceId}`;

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-2xl p-8 mb-8 shadow-xl">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }} />
      </div>
      
      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl">
                <Play className="h-6 w-6 text-white fill-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">
                  Try it in Postman
                </h3>
                <p className="text-orange-100 text-sm">
                  Run this collection directly in your Postman workspace
                </p>
              </div>
            </div>
            
            <p className="text-white/90 text-lg mb-6 max-w-2xl leading-relaxed">
              Import <strong>{collectionName}</strong> into Postman to test all endpoints, 
              modify requests, and explore the API interactively with your own data.
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              {/* Official Postman Run Button */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div
                  className="postman-run-button"
                  data-postman-action="collection/fork"
                  data-postman-visibility="public"
                  data-postman-var-1={collectionUid}
                  data-postman-collection-url={dataUrl}
                />
              </div>
              
              {/* Features List */}
              <div className="flex flex-wrap items-center gap-4 text-white/90">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-300" />
                  <span className="text-sm font-medium">Live Testing</span>
                </div>
                <div className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 text-blue-200" />
                  <span className="text-sm font-medium">Environment Variables</span>
                </div>
                <div className="flex items-center gap-2">
                  <Play className="h-4 w-4 text-green-300" />
                  <span className="text-sm font-medium">Request History</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="hidden lg:block ml-8">
            <div className="relative">
              <div className="w-32 h-32 bg-white/10 rounded-full blur-xl" />
              <div className="absolute inset-0 w-24 h-24 m-auto bg-white/20 rounded-full blur-lg" />
              <div className="absolute inset-0 w-16 h-16 m-auto bg-white/30 rounded-full" />
            </div>
          </div>
        </div>
        
        {/* Bottom Info */}
        <div className="mt-8 pt-6 border-t border-white/20">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>Free to use</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full" />
                <span>Instant import</span>
              </div>
            </div>
            
            <div className="text-white/60 text-xs">
              Opens in Postman Web or Desktop App
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
