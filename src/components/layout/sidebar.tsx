import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeRoute?: string;
}

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: '📊' },
  { href: '/campaigns', label: 'Campaigns', icon: '📚' },
  { href: '/sessions', label: 'Sessions', icon: '🎲' },
  { href: '/settings', label: 'Settings', icon: '⚙️' },
];

export function Sidebar({ activeRoute }: SidebarProps) {
  return (
    <aside className="min-h-screen w-64 border-r border-gray-200 bg-white">
      <nav className="space-y-2 p-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center space-x-3 rounded-lg px-3 py-2 transition-colors',
              activeRoute === item.href
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-700 hover:bg-gray-50'
            )}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
