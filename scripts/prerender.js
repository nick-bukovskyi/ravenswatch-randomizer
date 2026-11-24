import { readFile, rm, writeFile } from 'node:fs/promises';

const EMPTY_ROOT = '<div id="root"></div>';
const serverBuild = new URL('../dist-ssr/', import.meta.url);
const indexHtml = new URL('../dist/index.html', import.meta.url);

const { render } = await import(new URL('entry-server.js', serverBuild).href);
const template = await readFile(indexHtml, 'utf8');

if (!template.includes(EMPTY_ROOT)) {
  throw new Error(`dist/index.html has no ${EMPTY_ROOT} to prerender into`);
}

// A replacer function keeps "$" sequences literal
await writeFile(
  indexHtml,
  template.replace(EMPTY_ROOT, () => `<div id="root">${render()}</div>`),
);
await rm(serverBuild, { recursive: true });
