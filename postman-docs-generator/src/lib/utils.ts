import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getMethodColor(method: string) {
  switch (method.toUpperCase()) {
    case 'GET':
      return 'bg-green-100 text-green-700 border border-green-200';
    case 'POST':
      return 'bg-blue-100 text-blue-700 border border-blue-200';
    case 'PUT':
      return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
    case 'DELETE':
      return 'bg-red-100 text-red-700 border border-red-200';
    case 'PATCH':
      return 'bg-purple-100 text-purple-700 border border-purple-200';
    default:
      return 'bg-gray-100 text-gray-700 border border-gray-200';
  }
}

export function formatJson(jsonString: string) {
  try {
    return JSON.stringify(JSON.parse(jsonString), null, 2);
  } catch {
    return jsonString;
  }
}
