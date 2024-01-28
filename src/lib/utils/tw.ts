import { ClassValue, clsx } from 'clsx';
import { merge as lodashMerge } from 'lodash';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
