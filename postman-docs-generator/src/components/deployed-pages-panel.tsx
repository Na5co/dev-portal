'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { X, Book, ArrowRight } from '@/components/icons';
import Link from 'next/link';

interface DeployedPage {
  id: string;
  name: string;
  description?: string;
  deployedAt: string;
  url: string;
}

interface DeployedPagesPanelProps {
  onClose: () => void;
}

export function DeployedPagesPanel({ onClose }: DeployedPagesPanelProps) {
  const [deployedPages, setDeployedPages] = useState<DeployedPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDeployedPages = async () => {
      try {
        const response = await fetch('/api/deploy');
        if (!response.ok) {
          throw new Error('Failed to load deployed pages');
        }
        const data = await response.json();
        setDeployedPages(data.deployments || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load deployed pages');
      } finally {
        setIsLoading(false);
      }
    };

    loadDeployedPages();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleOpenPage = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] bg-white shadow-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold text-slate-900">
                Deployed Documentation Pages
              </CardTitle>
              <CardDescription className="text-slate-600 mt-1">
                Manage and access your deployed documentation pages
              </CardDescription>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-slate-500 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <Separator />
        
        <CardContent className="p-0">
          <ScrollArea className="h-[60vh] p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <span className="ml-3 text-slate-600">Loading deployed pages...</span>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">Error: {error}</p>
                <Button onClick={() => window.location.reload()} variant="outline">
                  Retry
                </Button>
              </div>
            ) : deployedPages.length === 0 ? (
              <div className="text-center py-12">
                <Book className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  No deployed pages yet
                </h3>
                <p className="text-slate-600 mb-4">
                  Deploy your first documentation page to see it here.
                </p>
                <Button onClick={onClose} variant="default">
                  Close
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {deployedPages.map((page) => (
                  <Card key={page.id} className="border border-slate-200 hover:border-slate-300 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-slate-900 truncate">
                              {page.name}
                            </h4>
                            <Badge variant="secondary" className="text-xs">
                              Deployed
                            </Badge>
                          </div>
                          
                          {page.description && (
                            <p className="text-sm text-slate-600 mb-2 line-clamp-2">
                              {page.description}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-slate-500">
                              Deployed on {formatDate(page.deployedAt)}
                            </p>
                            <div className="flex items-center gap-2">
                              <Link href={page.url} target="_blank">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs"
                                >
                                  <Book className="h-3 w-3 mr-1" />
                                  View
                                </Button>
                              </Link>
                              <Button
                                onClick={() => handleOpenPage(page.url)}
                                size="sm"
                                variant="default"
                                className="text-xs"
                              >
                                Open
                                <ArrowRight className="h-3 w-3 ml-1" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
