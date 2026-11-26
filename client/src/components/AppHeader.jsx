import { cn } from '@heroui/react';
import { History, LogOut, Mic } from 'lucide-react';
import { NavLink } from 'react-router';

import { useAuth } from '../auth/AuthProvider.jsx';
import IconButton from './IconButton.jsx';
import LogoMark from './LogoMark.jsx';
import ThemeToggle from './ThemeToggle.jsx';

const NAV_ITEMS = [
  { to: '/', label: 'Transcribe', icon: Mic },
  { to: '/history', label: 'History', icon: History },
];

export default function AppHeader() {
  const { signOut } = useAuth();

  return (
    <header className="border-b border-separator">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-2 px-4 py-2.5 sm:gap-3 sm:px-6 sm:py-3">
        <div className="flex items-center gap-2.5 font-semibold max-xs:hidden">
          <LogoMark />
          <span className="max-sm:hidden">Speech to Text</span>
        </div>

        <nav className="ml-auto flex gap-1 rounded-full bg-default p-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end className={navLinkClass}>
              <Icon className="size-4 max-sm:hidden" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center">
          <ThemeToggle />
          <IconButton label="Sign out" onPress={signOut}>
            <LogOut className="size-5" />
          </IconButton>
        </div>
      </div>
    </header>
  );
}

function navLinkClass({ isActive }) {
  return cn(
    'flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-all sm:px-4',
    isActive ? 'bg-segment text-segment-foreground shadow-sm' : 'text-muted hover:text-foreground',
  );
}
