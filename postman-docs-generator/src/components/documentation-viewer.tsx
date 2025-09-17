'use client';

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ParsedCollection, ParsedItem } from '@/lib/postman-parser';
import { Sidebar } from '@/components/sidebar';
import { RequestItem } from './documentation/RequestItem';
import { FolderItem } from './documentation/FolderItem';
import { RunInPostmanCTA } from '@/components/run-in-postman-cta';

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
      element.scrollIntoView({ behavior: 'auto', block: 'start' });
      setActiveItemId(id);
    }
  };

  const renderItem = (item: ParsedItem) => {
    return (
      <div
        key={item.id}
        id={item.id}
        ref={(el) => {
          if (el) itemRefs.current.set(item.id, el);
        }}
        className='py-12'
      >
        {item.type === 'folder' ? (
          <FolderItem item={item} renderItem={renderItem} />
        ) : (
          <RequestItem
            item={item}
          />
        )}
      </div>
    );
  };

  return (
    <div className='flex h-[calc(100vh-69px)] bg-slate-50'>
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
          <div className='max-w-7xl mx-auto p-4 sm:p-6 lg:p-8'>
            <div className='pb-8'>
              <h1 className='text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900'>
                {collection.name}
              </h1>
              {collection.description && (
                <div className='mt-6 prose max-w-3xl'>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {collection.description}
                  </ReactMarkdown>
                </div>
              )}
            </div>
            
            {/* Prominent Run in Postman CTA */}
            {postmanCollectionId && postmanWorkspaceId && (
              <RunInPostmanCTA
                collectionId={postmanCollectionId}
                workspaceId={postmanWorkspaceId}
                collectionName={collection.name}
              />
            )}
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
