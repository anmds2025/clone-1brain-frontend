import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Database, Workflow, Briefcase, Menu, X } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import logo from '@/assets/logo.png';
import UserMenu from '@/components/UserMenu';

export function RootLayout() {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen w-full">
      <aside
        className={`border-r bg-card transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <img src={logo} alt="Logo" className="h-8 w-8" />
              <span className="font-bold text-lg">{t('app.title')}</span>
            </div>
          )}
          {collapsed && <img src={logo} alt="Logo" className="h-8 w-8 mx-auto" />}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className={collapsed ? 'mx-auto mt-2' : ''}
          >
            {collapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
          </Button>
        </div>

        <nav className="flex flex-col gap-2 p-4">
          <NavLink
            to="/connectors"
            className={({ isActive }) =>
              `flex items-center ${
                collapsed ? 'justify-center' : 'gap-3'
              } rounded-lg px-3 py-2 transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent hover:text-accent-foreground'
              }`
            }
            title={collapsed ? t('app.connectors') : ''}
          >
            <Database className="h-5 w-5" />
            {!collapsed && t('app.connectors')}
          </NavLink>
          <NavLink
            to="/workflows"
            className={({ isActive }) =>
              `flex items-center ${
                collapsed ? 'justify-center' : 'gap-3'
              } rounded-lg px-3 py-2 transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent hover:text-accent-foreground'
              }`
            }
            title={collapsed ? t('app.workflows') : ''}
          >
            <Workflow className="h-5 w-5" />
            {!collapsed && t('app.workflows')}
          </NavLink>
          <NavLink
            to="/jobs"
            className={({ isActive }) =>
              `flex items-center ${
                collapsed ? 'justify-center' : 'gap-3'
              } rounded-lg px-3 py-2 transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent hover:text-accent-foreground'
              }`
            }
            title={collapsed ? t('app.jobs') : ''}
          >
            <Briefcase className="h-5 w-5" />
            {!collapsed && t('app.jobs')}
          </NavLink>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="border-b bg-card">
          <div className="flex items-center justify-end px-6 py-4 gap-4">
            <LanguageSwitcher />
            <ThemeToggle />
            <UserMenu />
          </div>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
