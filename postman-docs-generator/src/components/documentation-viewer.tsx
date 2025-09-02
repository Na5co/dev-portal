'use client';

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ParsedCollection, ParsedItem } from '@/lib/postman-parser';
import { getMethodColor } from '@/lib/utils';
import { Sidebar } from '@/components/sidebar';
import { RequestPanel } from '@/components/request-panel';
import { RunInPostmanButton } from '@/components/run-in-postman-button';

interface DocumentationViewerProps {
  collection: ParsedCollection;
  footerContent: string;
  postmanCollectionId: string | null;
  postmanWorkspaceId: string | null;
}

export function DocumentationViewer({
  collection,
  footerContent,
  postmanCollectionId,
  postmanWorkspaceId,
}: DocumentationViewerProps) {
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        const intersectingEntry = entries.find((entry) => entry.isIntersecting);
        if (intersectingEntry) {
          setActiveItemId(intersectingEntry.target.id);
        }
      },
      { rootMargin: '-20% 0px -80% 0px', threshold: 0 }
    );

    const currentObserver = observer.current;
    itemRefs.current.forEach((el) => {
      if (el) currentObserver.observe(el);
    });

    if (collection.items.length > 0 && !activeItemId) {
      setActiveItemId(collection.items[0].id);
    }

    return () => {
      if (currentObserver) {
        currentObserver.disconnect();
      }
    };
  }, [collection.items, activeItemId]);

  const handleScrollTo = (id: string) => {
    const element = itemRefs.current.get(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveItemId(id);
    }
  };

  const renderItem = (item: ParsedItem) => {
    const isFolder = item.type === 'folder';

    return (
      <div
        key={item.id}
        id={item.id}
        ref={(el) => {
          if (el) itemRefs.current.set(item.id, el);
        }}
        className='py-12'
      >
        {isFolder ? (
          <div>
            <h2 className='text-3xl font-bold tracking-tight text-gray-900 border-b pb-4'>
              {item.name}
            </h2>
            {item.description && (
              <div className='mt-6 prose max-w-none prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded'>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {item.description}
                </ReactMarkdown>
              </div>
            )}
            <div className='mt-8 space-y-8'>
              {item.items?.map((child) => renderItem(child))}
            </div>
          </div>
        ) : (
          <div>
            <h3 className='text-2xl font-bold tracking-tight text-gray-800'>
              {item.name}
            </h3>
            <div className='flex items-center gap-3 mt-4'>
              <span
                className={`text-sm font-semibold px-3 py-1 rounded-md ${getMethodColor(
                  item.request?.method || 'GET'
                )}`}
              >
                {item.request?.method}
              </span>
              <code className='text-base font-mono bg-gray-100 text-gray-800 px-3 py-1.5 rounded-md'>
                {item.request?.url}
              </code>
            </div>
            {item.description && (
              <div className='mt-4 prose max-w-none text-gray-600 prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded'>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {item.description}
                </ReactMarkdown>
              </div>
            )}
            {item.request && (
              <RequestPanel
                request={item.request}
                rawRequest={item.rawRequest}
              />
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className='flex h-[calc(100vh-69px)] bg-white'>
      <Sidebar
        items={collection.items}
        collectionName={collection.name}
        activeItemId={activeItemId}
        onScrollTo={handleScrollTo}
      />
      <div className='flex-1'>
        <ScrollArea
          className='h-full'
          ref={mainContentRef}
        >
          <div className='max-w-7xl mx-auto p-8'>
            {postmanCollectionId && (
              <RunInPostmanButton
                collectionId={postmanCollectionId}
                workspaceId={postmanWorkspaceId}
              />
            )}
            <div className='pb-8'>
              <h1 className='text-5xl font-extrabold tracking-tight text-gray-900'>
                {collection.name}
              </h1>
              {collection.description && (
                <div className='mt-6 prose max-w-none text-gray-600 prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded'>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {collection.description}
                  </ReactMarkdown>
                </div>
              )}
            </div>
            <div>
              {collection.items.map((item) => (
                <div
                  key={item.id}
                  className='border-t'
                >
                  {renderItem(item)}
                </div>
              ))}
            </div>
            {footerContent && (
              <div className='mt-12 pt-8 border-t text-center text-gray-500'>
                <div className='prose max-w-none'>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {footerContent}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
