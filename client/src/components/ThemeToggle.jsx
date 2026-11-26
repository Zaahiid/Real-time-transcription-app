import { useTheme } from '@heroui/react';
import { Moon, Sun } from 'lucide-react';

import IconButton from './IconButton.jsx';

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme('system');
  const isDark = resolvedTheme === 'dark';
  const Icon = isDark ? Sun : Moon;

  return (
    <IconButton
      label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onPress={() => setTheme(isDark ? 'light' : 'dark')}
    >
      <Icon key={resolvedTheme} className="size-5 motion-safe:animate-spin-in" />
    </IconButton>
  );
}
