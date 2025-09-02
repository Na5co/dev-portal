'use client';

import { ParsedItem } from '@/lib/postman-parser';
import { getMethodColor } from '@/lib/utils';
import { Folder } from '@/components/icons';

interface SidebarProps {
  items: ParsedItem[];
  collectionName: string;
  activeItemId: string | null;
  onScrollTo: (id: string) => void;
}

export function Sidebar({
  items,
  collectionName,
  activeItemId,
  onScrollTo,
}: SidebarProps) {
  const renderSidebarItems = (items: ParsedItem[], level = 0) => {
    return (
      <ul className='space-y-1'>
        {items.map((item) => {
          const isFolder = item.type === 'folder';
          const isActive = activeItemId === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onScrollTo(item.id);
                }}
                className={`flex items-center gap-2 p-2 rounded-md text-sm transition-colors ${
                  isActive ? 'font-semibold' : 'text-gray-700 hover:bg-gray-100'
                }`}
                style={{
                  paddingLeft: `${1 + level * 1.5}rem`,
                  ...(isActive
                    ? {
                        backgroundColor: 'hsl(var(--accent-light))',
                        color: 'hsl(var(--accent))',
                      }
                    : {}),
                }}
              >
                {isFolder ? (
                  <Folder
                    className='h-4 w-4 flex-shrink-0'
                    aria-hidden='true'
                  />
                ) : (
                  <span
                    className={`text-xs font-bold w-12 flex-shrink-0 text-center py-0.5 rounded ${getMethodColor(
                      item.request?.method || 'GET'
                    )}`}
                  >
                    {item.request?.method || 'GET'}
                  </span>
                )}
                <span className='truncate'>{item.name}</span>
              </a>
              {isFolder && item.items && (
                <div className='mt-1'>
                  {renderSidebarItems(item.items, level + 1)}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className='w-80 border-r bg-gray-50/50 hidden md:block'>
      <div className='p-4'>
        <h2 className='font-bold text-lg mb-2'>{collectionName}</h2>
        {renderSidebarItems(items)}
      </div>
    </div>
  );
}
