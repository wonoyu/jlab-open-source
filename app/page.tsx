import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center text-center px-4 py-24 bg-gradient-to-b from-background to-muted/30">
      {/* Logo / Icon */}
      <div className="mb-8 flex items-center justify-center w-20 h-20 rounded-2xl bg-foreground/5 border border-border shadow-sm">
        <span className="text-4xl">⚗️</span>
      </div>

      {/* Heading */}
      <h1 className="text-5xl font-bold tracking-tight mb-4">
        JLab Open Source
      </h1>
      <p className="text-xl text-muted-foreground max-w-xl mb-10">
        Open source Flutter development tools, kits, and libraries — built for
        modern mobile teams.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          href="/docs"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background font-semibold hover:opacity-90 transition-opacity"
        >
          Read the Docs →
        </Link>
        <a
          href="https://github.com/wonoyu/jlab-open-source"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border font-semibold hover:bg-muted transition-colors"
        >
          GitHub ↗
        </a>
      </div>

      {/* Project cards */}
      <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl w-full text-left">
        <div className="p-6 rounded-2xl border border-border bg-card hover:shadow-md transition-shadow">
          <h2 className="font-semibold text-lg mb-1">JLab FDK</h2>
          <p className="text-muted-foreground text-sm">
            Flutter Development Kit — a complete toolkit for building scalable
            Flutter apps fast.
          </p>
          <Link href="/docs" className="text-sm font-medium mt-3 inline-block hover:underline">
            Read docs →
          </Link>
        </div>
        <div className="p-6 rounded-2xl border border-border bg-card hover:shadow-md transition-shadow opacity-60">
          <h2 className="font-semibold text-lg mb-1">More coming soon</h2>
          <p className="text-muted-foreground text-sm">
            Additional open source projects will be documented here as they are
            released.
          </p>
        </div>
      </div>
    </main>
  );
}
