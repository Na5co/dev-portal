import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ParsedItem } from '@/lib/postman-parser';
import { getMethodColor } from '@/lib/utils';
import { RequestPanel } from '@/components/request-panel';
// Removed individual run in postman buttons - now using prominent CTA at top
import { AuthDetails } from './AuthDetails';
import { HeadersTable } from './HeadersTable';
import { RequestBody } from './RequestBody';

interface RequestItemProps {
  item: ParsedItem;
}

export const RequestItem: React.FC<RequestItemProps> = ({
  item,
}) => {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-start'>
      <div className='space-y-6'>
        <h3 className='text-2xl font-bold tracking-tight text-gray-800'>
          {item.name}
        </h3>
        <div className='flex items-center gap-3 min-w-0'>
          <span
            className={`text-sm font-semibold px-3 py-1 rounded-md ${getMethodColor(
              item.request?.method || 'GET'
            )}`}
          >
            {item.request?.method}
          </span>
          <code className='text-base font-mono bg-slate-100 text-slate-800 px-3 py-1.5 rounded-md truncate'>
            {item.request?.url}
          </code>
        </div>
        {item.description && (
          <div className='mt-4 prose max-w-3xl'>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {item.description}
            </ReactMarkdown>
          </div>
        )}
        <AuthDetails auth={item.request?.auth} />
        <HeadersTable headers={item.request?.headers} />
        <RequestBody body={item.request?.body} />
      </div>
      <div className='lg:sticky lg:top-24 space-y-6'>
        {item.request && (
          <RequestPanel
            request={item.request}
            rawRequest={item.rawRequest}
          />
        )}
      </div>
    </div>
  );
};
