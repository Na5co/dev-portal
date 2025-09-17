'use client';
import { useState } from 'react';
import { ParsedItem } from '@/lib/postman-parser';
import { getMethodColor } from '@/lib/utils';
import { ChevronDown } from '@/components/icons';
import { Input } from '@/components/ui/input';

interface SidebarProps {
  items: ParsedItem[];
  collectionName: string;
  activeItemId: string | null;
  onScrollTo: (id: string) => void;
}

const SidebarItem = ({
  item,
  level,
  activeItemId,
  onScrollTo,
  openFolders,
  toggleFolder,
}: {
  item: ParsedItem;
  level: number;
  activeItemId: string | null;
  onScrollTo: (id: string) => void;
  openFolders: Set<string>;
  toggleFolder: (id: string) => void;
}) => {
  const isFolder = item.type === 'folder';
  const isActive = activeItemId === item.id;
  const isOpen = isFolder && openFolders.has(item.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isFolder) {
      toggleFolder(item.id);
    }
    onScrollTo(item.id);
  };

  return (
    <li className='list-none'>
      <a
        href={`#${item.id}`}
        onClick={handleClick}
        className={`flex items-center justify-between gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
          isActive
            ? 'font-semibold bg-gray-100 text-gray-900'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
        style={{ paddingLeft: `${0.75 + level * 1}rem` }}
      >
        <div className='flex items-center gap-2 truncate'>
          {isFolder ? (
            <>
              <ChevronDown
                className={`h-4 w-4 flex-shrink-0 transition-transform ${
                  isOpen ? 'rotate-0' : '-rotate-90'
                }`}
              />
              <span className='truncate'>{item.name}</span>
            </>
          ) : (
            <span className='truncate'>{item.name}</span>
          )}
        </div>
        {!isFolder && (
          <span
            className={`text-xs font-bold w-12 flex-shrink-0 text-center ${getMethodColor(
              item.request?.method || 'GET'
            )}`}
          >
            {item.request?.method || 'GET'}
          </span>
        )}
      </a>
      {isFolder && isOpen && item.items && (
        <div className='mt-1'>
          <ul className='space-y-1'>
            {item.items.map((child) => (
              <SidebarItem
                key={child.id}
                item={child}
                level={level + 1}
                activeItemId={activeItemId}
                onScrollTo={onScrollTo}
                openFolders={openFolders}
                toggleFolder={toggleFolder}
              />
            ))}
          </ul>
        </div>
      )}
    </li>
  );
};

export function Sidebar({
  items,
  collectionName,
  activeItemId,
  onScrollTo,
}: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [openFolders, setOpenFolders] = useState(new Set<string>());

  const toggleFolder = (id: string) => {
    setOpenFolders((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filterItems = (items: ParsedItem[], term: string): ParsedItem[] => {
    if (!term) return items;
    return items.reduce((acc, item) => {
      const nameMatch = item.name.toLowerCase().includes(term.toLowerCase());
      if (item.type === 'folder') {
        const children = filterItems(item.items || [], term);
        if (children.length > 0 || nameMatch) {
          acc.push({ ...item, items: children });
        }
      } else {
        if (nameMatch) {
          acc.push(item);
        }
      }
      return acc;
    }, [] as ParsedItem[]);
  };

  const filteredItems = filterItems(items, searchTerm);

  return (
    <div className='w-80 border-r border-slate-200 bg-white text-gray-900 hidden md:flex md:flex-col'>
      <div className='p-4 border-b border-slate-200'>
        <h2 className='font-bold text-lg mb-4 text-gray-900'>{collectionName}</h2>
        <Input
          type='search'
          placeholder='Search...'
          className='w-full bg-slate-100 border-slate-200 text-gray-900 placeholder:text-slate-400'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className='flex-1 overflow-y-auto p-4'>
        <ul className='space-y-1'>
          {filteredItems.map((item) => (
            <SidebarItem
              key={item.id}
              item={item}
              level={0}
              activeItemId={activeItemId}
              onScrollTo={onScrollTo}
              openFolders={openFolders}
              toggleFolder={toggleFolder}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
