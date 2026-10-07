import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import {
  AppShell,
  Badge,
  DropdownMenu,
  Footer,
  IconButton,
  SearchField,
  Sidebar,
  SidebarItem,
  SidebarSection,
  Spinner,
  Topbar,
  useTheme,
} from '@jkpeyi/focus-ui';
import { BookOpen, Compass, LayoutDashboard, Monitor, Moon, Paintbrush, Rocket, Sun } from 'lucide-react';
import { componentDocs, groups } from '../content/components';
import { Installation } from '../content/guides/Installation';
import { Introduction } from '../content/guides/Introduction';
import { Principles } from '../content/guides/Principles';
import { Theming } from '../content/guides/Theming';
import { ComponentPage } from './ComponentPage';
import { navigate, useRoute } from './router';

const ErpApp = lazy(() => import('../demo/ErpApp'));

const guides = [
  { slug: 'introduction', title: 'Introduction', icon: <BookOpen />, Page: Introduction },
  { slug: 'installation', title: 'Installation', icon: <Rocket />, Page: Installation },
  { slug: 'theming', title: 'Theming', icon: <Paintbrush />, Page: Theming },
  { slug: 'principles', title: 'Design principles', icon: <Compass />, Page: Principles },
];

function Logo() {
  return (
    <a href="#/introduction" className="focus-ring flex items-center gap-2.5 rounded-lg">
      <span className="flex size-7 items-center justify-center rounded-[9px] bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-raised">
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
        </svg>
      </span>
      <span className="text-[15px] font-semibold tracking-[-0.01em] group-data-[collapsed=true]/sidebar:hidden">Focus UI</span>
    </a>
  );
}

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.2-3.1-.1-.4-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.7 1.6.2 2.8.1 3.2.8.8 1.2 1.9 1.2 3.1 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z" />
  </svg>
);

function ThemeMenu() {
  const { mode, setMode, resolved } = useTheme();
  return (
    <DropdownMenu
      aria-label="Appearance"
      trigger={<IconButton label="Appearance" icon={resolved === 'dark' ? <Moon /> : <Sun />} />}
      items={[
        { label: 'Light', icon: <Sun />, checked: mode === 'light', onSelect: () => setMode('light') },
        { label: 'Dark', icon: <Moon />, checked: mode === 'dark', onSelect: () => setMode('dark') },
        { label: 'System', icon: <Monitor />, checked: mode === 'system', onSelect: () => setMode('system') },
      ]}
    />
  );
}

export function App() {
  const route = useRoute();
  const [filter, setFilter] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [route]);

  const filteredDocs = useMemo(() => componentDocs.filter((c) => c.title.toLowerCase().includes(filter.toLowerCase())), [filter]);

  if (route === 'demo' || route.startsWith('demo/')) {
    return (
      <Suspense
        fallback={
          <div className="flex h-dvh items-center justify-center">
            <Spinner size="lg" />
          </div>
        }
      >
        <ErpApp route={route.slice(5)} />
      </Suspense>
    );
  }

  const guide = guides.find((g) => g.slug === route);
  const doc = route.startsWith('components/') ? componentDocs.find((c) => `components/${c.slug}` === route) : undefined;

  return (
    <AppShell
      sidebar={
        <Sidebar header={<Logo />}>
          <SidebarSection title="Getting started">
            {guides.map((g) => (
              <SidebarItem key={g.slug} icon={g.icon} label={g.title} href={`#/${g.slug}`} active={route === g.slug} />
            ))}
            <SidebarItem icon={<LayoutDashboard />} label="ERP demo" href="#/demo" badge="Live" />
          </SidebarSection>
          {groups.map((group) => {
            const items = filteredDocs.filter((c) => c.group === group);
            if (items.length === 0) return null;
            return (
              <SidebarSection key={group} title={group} collapsible>
                {items.map((c) => (
                  <SidebarItem
                    key={c.slug}
                    icon={
                      <span className="flex size-[18px] items-center justify-center">
                        <span className="size-1.5 rounded-full bg-current opacity-50" />
                      </span>
                    }
                    label={c.title}
                    href={`#/components/${c.slug}`}
                    active={route === `components/${c.slug}`}
                  />
                ))}
              </SidebarSection>
            );
          })}
        </Sidebar>
      }
      topbar={
        <Topbar
          start={
            <SearchField
              size="sm"
              placeholder="Filter components"
              value={filter}
              onValueChange={setFilter}
              shortcut="k"
              className="max-w-72"
            />
          }
          end={
            <>
              <Badge variant="outline" className="hidden sm:inline-flex">
                v0.1.0
              </Badge>
              <ThemeMenu />
              <IconButton
                label="GitHub"
                icon={<GithubIcon />}
                onClick={() => window.open('https://github.com/jkpeyi/focus-ui', '_blank')}
              />
            </>
          }
        />
      }
      footer={
        <Footer
          containerClassName="max-w-5xl sm:px-8"
          brand="Focus UI"
          copyright="© 2026 · MIT License"
          links={[
            { label: 'GitHub', href: 'https://github.com/jkpeyi/focus-ui', external: true },
            { label: 'Installation', href: '#/installation' },
            { label: 'ERP demo', href: '#/demo' },
          ]}
          meta={<span className="text-[13px] text-fg-subtle">Built with Focus UI · React · Tailwind CSS v4</span>}
        />
      }
    >
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-8 sm:py-12">
        {guide ? (
          <guide.Page />
        ) : doc ? (
          <ComponentPage key={doc.slug} doc={doc} />
        ) : (
          <div className="py-24 text-center">
            <h1 className="text-2xl font-semibold">Page not found</h1>
            <button className="mt-4 text-accent" onClick={() => navigate('introduction')}>
              Back to introduction
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
