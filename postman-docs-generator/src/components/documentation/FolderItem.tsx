import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ParsedItem } from '@/lib/postman-parser';

interface FolderItemProps {
  item: ParsedItem;
  renderItem: (item: ParsedItem) => React.ReactNode;
}

export const FolderItem: React.FC<FolderItemProps> = ({ item, renderItem }) => {
  return (
    <div>
      <h2 className='text-3xl font-bold tracking-tight text-gray-900 border-b pb-4'>
        {item.name}
      </h2>
      {item.description && (
        <div className='mt-6 prose max-w-3xl'>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {item.description}
          </ReactMarkdown>
        </div>
      )}
      <div className='mt-8 space-y-8'>
        {item.items?.map((child) => renderItem(child))}
      </div>
    </div>
  );
};
