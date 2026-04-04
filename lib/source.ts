import { docs } from 'collections';
import { loader } from 'fumadocs-core/source';

// fumadocs-mdx v11 returns `files` as a lazy function; fumadocs-core v15 expects an array.
// Resolve it at import time to satisfy the Source interface.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rawSource = docs.toFumadocsSource() as any;
const files = typeof rawSource.files === 'function' ? rawSource.files() : rawSource.files;

export const source = loader(
  { files },
  { baseUrl: '/docs' },
);
