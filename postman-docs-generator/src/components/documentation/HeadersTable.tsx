import React from 'react';
import { ParsedRequest } from '@/lib/postman-parser';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface HeadersTableProps {
  headers: ParsedRequest['headers'];
}

export const HeadersTable: React.FC<HeadersTableProps> = ({ headers }) => {
  if (!headers || headers.length === 0) return null;

  return (
    <Accordion
      type='single'
      collapsible
      className='shadow-lg hover:shadow-xl transition-shadow rounded-xl border'
    >
      <AccordionItem value='headers' className='border-none'>
        <AccordionTrigger className='flex w-full justify-between p-3 text-sm font-semibold'>
          Headers ({headers.length})
        </AccordionTrigger>
        <AccordionContent className='px-3 pb-3 pt-0'>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead className='text-left text-gray-500'>
                <tr>
                  <th className='p-2 font-medium'>Key</th>
                  <th className='p-2 font-medium'>Value</th>
                  <th className='p-2 font-medium'>Description</th>
                </tr>
              </thead>
              <tbody>
                {headers.map((header, idx) => (
                  <tr key={idx} className='border-t'>
                    <td className='p-2 font-mono text-gray-800'>
                      {header.key}
                    </td>
                    <td className='p-2 font-mono text-gray-600'>
                      {header.value}
                    </td>
                    <td className='p-2 text-gray-600'>
                      {header.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
