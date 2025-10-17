import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, toggle } = useThemeStore();

  return (
    <Button variant="ghost" size="icon" onClick={toggle}>
      {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </Button>
  );
}
