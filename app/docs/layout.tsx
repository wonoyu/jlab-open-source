import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { source } from '@/lib/source';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.pageTree}
      nav={{
        title: (
          <span className="font-bold text-lg tracking-tight">JLab Docs</span>
        ),
        transparentMode: 'top',
      }}
      sidebar={{
        defaultOpenLevel: 1,
        banner: (
          <div className="text-xs text-muted-foreground px-2 pb-2 border-b border-border mb-2">
            Open Source Flutter Tools by{' '}
            <a
              href="https://github.com/wonoyu"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              wonoyu
            </a>
          </div>
        ),
      }}
      links={[
        {
          text: 'GitHub',
          url: 'https://github.com/wonoyu/jlab-open-source',
          active: 'none',
        },
      ]}
    >
      {children}
    </DocsLayout>
  );
}
