import React from 'react';
import { ParsedAuth } from '@/lib/postman-parser';
import { Lock } from '@/components/icons';
import { SectionCard } from './SectionCard';

interface AuthDetailsProps {
  auth: ParsedAuth | undefined;
}

export const AuthDetails: React.FC<AuthDetailsProps> = ({ auth }) => {
  if (!auth) return null;

  return (
    <SectionCard
      title='Authorization'
      icon={<Lock className='h-5 w-5 text-gray-500' aria-hidden='true' />}
    >
      <div className='overflow-x-auto'>
        <table className='w-full text-sm'>
          <tbody>
            <tr className='border-t'>
              <td className='p-2 font-mono text-gray-800 font-medium'>Type</td>
              <td className='p-2 font-mono text-gray-600'>{auth.type}</td>
            </tr>
            {Object.entries(auth)
              .filter(([key]) => key !== 'type')
              .map(([key, value]) => (
                <tr key={key} className='border-t'>
                  <td className='p-2 font-mono text-gray-800 font-medium capitalize'>
                    {key}
                  </td>
                  <td className='p-2 font-mono text-gray-600'>
                    {String(value)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
};
