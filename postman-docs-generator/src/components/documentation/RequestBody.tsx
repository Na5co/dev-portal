import React from 'react';
import { ParsedRequest } from '@/lib/postman-parser';
import { formatJson } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { SectionCard } from './SectionCard';
import { Info } from '@/components/icons';

interface RequestBodyProps {
  body: ParsedRequest['body'];
}

export const RequestBody: React.FC<RequestBodyProps> = ({ body }) => {
  const hasRequestBody =
    body && (body.raw || (body.formdata && body.formdata.length > 0));

  if (!hasRequestBody) {
    return (
      <div className='bg-slate-50 border border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center'>
        <Info className='h-6 w-6 text-slate-400 mb-3' />
        <span className='text-sm text-slate-500 font-medium'>
          This request does not have a body.
        </span>
      </div>
    );
  }

  return (
    <SectionCard title='Request Body'>
      {body.raw && (
        <div className='bg-slate-900 text-slate-100 rounded-lg p-4 overflow-x-auto'>
          <pre className='text-sm'>
            <code>{formatJson(body.raw)}</code>
          </pre>
        </div>
      )}
      {body.formdata && (
        <div className='space-y-2'>
          {body.formdata.map((param, idx) => (
            <div
              key={idx}
              className='grid grid-cols-3 gap-2 items-center p-2 bg-slate-50 rounded-md border border-slate-200'
            >
              <span className='font-mono text-sm font-medium text-slate-700'>
                {param.key}
              </span>
              <span className='font-mono text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200'>
                {param.value}
              </span>
              <Badge
                variant='outline'
                className='border-slate-300 text-slate-500 w-fit'
              >
                {param.type}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
};
