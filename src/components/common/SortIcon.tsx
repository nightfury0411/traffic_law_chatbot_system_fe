import React from 'react';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';

/**
 * A reusable sort icon component that displays the sort direction.
 * @param {object} props - The component props.
 * @param {'asc' | 'desc' | null} props.direction - The current sort direction ('asc', 'desc', or null for no sort).
 */
export default function SortIcon({ direction }) {
  if (direction === 'asc') {
    return <ArrowUp size={16} className="ml-2 text-gray-700" />;
  } else if (direction === 'desc') {
    return <ArrowDown size={16} className="ml-2 text-gray-700" />;
  }
  // Default icon when column is not sorted, or you can return null for no icon
  return <ArrowUpDown size={16} className="ml-2 text-gray-400 opacity-60 group-hover:opacity-100 transition-opacity" />;
}