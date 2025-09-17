import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getMethodColor(method: string) {
  switch (method.toUpperCase()) {
    case 'GET':
      return 'text-green-600';
    case 'POST':
      return 'text-blue-600';
    case 'PUT':
      return 'text-amber-600';
    case 'DELETE':
      return 'text-red-600';
    case 'PATCH':
      return 'text-purple-600';
    default:
      return 'text-gray-600';
  }
}

export function formatJson(jsonString: string) {
  try {
    return JSON.stringify(JSON.parse(jsonString), null, 2);
  } catch {
    return jsonString;
  }
}
