// Writes a static index.html for every route (/work, /about, /work/<project>) into dist/,
// each with its own title, description, canonical and social-preview tags.
// Link previews (LinkedIn, Slack, email clients) read the static HTML and do not run JavaScript,
// so without this every case-study link would show the homepage preview.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { projects } from '../src/projects.js';

const here = dirname(fileURLToPath(import.meta.url));
const dist = join(here, '..', 'dist');
const SITE = 'https://salmanashrafportfolio.github.io';
const template = readFileSync(join(dist, 'index.html'), 'utf8');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const strip = (s) => String(s).replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();

function pageFor(route) {
  if (route.kind === 'work') return { path: '/work', title: 'Selected work | Salman Bhatti', desc: 'Selected UX/UI projects by Salman Bhatti: enterprise ERP, AR, IoT, e-learning and websites.' };
  if (route.kind === 'about') return { path: '/about', title: 'About | Salman Bhatti', desc: 'Muhammad Salman Bhatti, UX/UI Designer based in Germany. Enterprise UX/UI, user research, design systems, and AR and IoT prototypes.' };
  const p = route.project;
  const hero = p.hero ? SITE + p.hero[0] : SITE + '/og-image.png';
  return {
    path: '/work/' + p.id,
    title: `${p.pageName || p.name} | Salman Bhatti`,
    desc: strip(p.description),
    image: hero,
    imageAlt: p.hero ? strip(p.hero[1]) : 'Salman Bhatti, UX/UI Designer portfolio',
  };
}

function withMeta(page) {
  const url = SITE + page.path;
  const image = page.image || SITE + '/og-image.png';
  const alt = page.imageAlt || 'Salman Bhatti, UX/UI Designer portfolio';
  let html = template;
  const set = (re, tag) => { if (!re.test(html)) throw new Error('template tag missing: ' + re); html = html.replace(re, tag); };
  set(/<title>[^<]*<\/title>/, `<title>${esc(page.title)}</title>`);
  set(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(page.desc)}" />`);
  set(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${url}" />`);
  set(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${url}" />`);
  set(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${esc(page.title)}" />`);
  set(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${esc(page.desc)}" />`);
  set(/<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${image}" />`);
  set(/<meta property="og:image:alt" content="[^"]*" \/>/, `<meta property="og:image:alt" content="${esc(alt)}" />`);
  set(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${esc(page.title)}" />`);
  set(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${esc(page.desc)}" />`);
  set(/<meta name="twitter:image" content="[^"]*" \/>/, `<meta name="twitter:image" content="${image}" />`);
  return html;
}

const routes = [
  { kind: 'work' },
  { kind: 'about' },
  ...projects.map((project) => ({ kind: 'project', project })),
];

for (const route of routes) {
  const page = pageFor(route);
  const dir = join(dist, page.path);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), withMeta(page));
  console.log('wrote', page.path, '->', page.title);
}
