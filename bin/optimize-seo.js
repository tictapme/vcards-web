const fs = require('fs');
const path = require('path');
const { resolvePublishContext } = require('./site-host');

const ROOT_DIR = path.join(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const { host: TARGET_HOST, nonTargetHosts: LEGACY_HOSTS } = resolvePublishContext();
const TEXT_EXTENSIONS = new Set(['.css', '.html', '.js', '.json', '.map', '.md', '.svg', '.txt', '.xml', '.xsl']);
const ROOT_SYNC_FILES = ['_redirects'];
const NOINDEX_ROUTE_PATTERNS = [/^\/404\/$/, /^\/404\.html$/, /^\/__qs\/$/, /^\/search\/test\/$/];
const SITEMAP_FILES = ['page-sitemap.xml', 'post-sitemap.xml'];

normalizeTextAssets();
normalizeRedirects();
optimizeHtml();
optimizeXmlSitemaps();
writeRobotsTxt();
syncRootFiles();

function normalizeTextAssets() {
  const textFiles = getFilesRecursive(SRC_DIR, (filePath) => {
    const baseName = path.basename(filePath);
    const ext = path.extname(filePath).toLowerCase();

    return TEXT_EXTENSIONS.has(ext) || baseName === '_redirects' || baseName === '_headers';
  });

  for (const filePath of textFiles) {
    const content = fs.readFileSync(filePath, 'utf8');
    const updated = normalizeHosts(content);

    if (updated !== content) {
      fs.writeFileSync(filePath, updated);
    }
  }
}

function normalizeRedirects() {
  const redirectsPath = path.join(SRC_DIR, '_redirects');
  if (!fs.existsSync(redirectsPath)) {
    return;
  }

  const normalizedLines = fs
    .readFileSync(redirectsPath, 'utf8')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => normalizeRedirectLine(line));

  fs.writeFileSync(redirectsPath, `${normalizedLines.join('\n').trim()}\n`);
}

function normalizeRedirectLine(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) {
    return trimmed;
  }

  const parts = trimmed.split(/\s+/);
  if (parts.length >= 3) {
    return `${parts[0]} ${parts[1]} ${parts[2]}`;
  }

  if (parts.length === 2) {
    return `${parts[0]} ${parts[1]} 301`;
  }

  return trimmed;
}

function optimizeHtml() {
  const htmlFiles = getFilesRecursive(SRC_DIR, (filePath) => filePath.endsWith('.html'));

  for (const filePath of htmlFiles) {
    const html = fs.readFileSync(filePath, 'utf8');
    const route = routeFromFile(filePath);
    const updated = setRobotsDirective(normalizeHosts(html), shouldNoindex(route));

    if (updated !== html) {
      fs.writeFileSync(filePath, updated);
    }
  }
}

function optimizeXmlSitemaps() {
  for (const fileName of SITEMAP_FILES) {
    const filePath = path.join(SRC_DIR, fileName);
    if (!fs.existsSync(filePath)) {
      continue;
    }

    const xml = fs.readFileSync(filePath, 'utf8');
    const normalized = normalizeHosts(xml);
    const entries = extractUrlEntries(normalized);
    const deduped = dedupeAndFilterEntries(entries);
    fs.writeFileSync(filePath, buildUrlSetXml(deduped));
  }

  const sitemapIndexXml = buildSitemapIndexXml();
  fs.writeFileSync(path.join(SRC_DIR, 'sitemap.xml'), sitemapIndexXml);
  fs.writeFileSync(path.join(SRC_DIR, 'sitemap_index.xml'), sitemapIndexXml);
}

function writeRobotsTxt() {
  const robotsTxt = ['User-agent: *', 'Disallow:', '', `Sitemap: ${TARGET_HOST}/sitemap_index.xml`, ''].join('\n');
  fs.writeFileSync(path.join(SRC_DIR, 'robots.txt'), robotsTxt);
}

function syncRootFiles() {
  for (const relativePath of ROOT_SYNC_FILES) {
    const srcPath = path.join(SRC_DIR, relativePath);
    const rootPath = path.join(ROOT_DIR, relativePath);

    if (!fs.existsSync(srcPath)) {
      continue;
    }

    fs.copyFileSync(srcPath, rootPath);
  }
}

function normalizeHosts(content) {
  return LEGACY_HOSTS.reduce((current, host) => {
    const escapedHost = host.replace(/\//g, '\\/');
    const escapedProdHost = TARGET_HOST.replace(/\//g, '\\/');
    const encodedHost = encodeURIComponent(host);
    const encodedProdHost = encodeURIComponent(TARGET_HOST);
    const malformedHost = host.replace('https://', 'https:/');
    const hostName = host.replace(/^https?:\/\//, '');

    return current
      .split(host)
      .join(TARGET_HOST)
      .split(malformedHost)
      .join(TARGET_HOST)
      .split(hostName)
      .join(TARGET_HOST.replace(/^https?:\/\//, ''))
      .split(escapedHost)
      .join(escapedProdHost)
      .split(encodedHost)
      .join(encodedProdHost);
  }, content);
}

function setRobotsDirective(html, noindex) {
  const desired = noindex
    ? '<meta name="robots" content="noindex, follow">'
    : '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">';

  if (/<meta name="robots" content="[^"]*">/i.test(html)) {
    return html.replace(/<meta name="robots" content="[^"]*">/i, desired);
  }

  if (/<meta name="viewport"[^>]*>/i.test(html)) {
    return html.replace(/(<meta name="viewport"[^>]*>)/i, `$1\n${desired}`);
  }

  return html.replace(/<head>/i, `<head>\n${desired}`);
}

function shouldNoindex(route) {
  return NOINDEX_ROUTE_PATTERNS.some((pattern) => pattern.test(route));
}

function routeFromFile(filePath) {
  const relativePath = path.relative(SRC_DIR, filePath).replace(/\\/g, '/');

  if (relativePath === 'index.html') {
    return '/';
  }

  if (relativePath.endsWith('/index.html')) {
    return `/${relativePath.slice(0, -'/index.html'.length)}/`;
  }

  return `/${relativePath}`;
}

function getFilesRecursive(dirPath, predicate) {
  const results = [];

  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      results.push(...getFilesRecursive(fullPath, predicate));
      continue;
    }

    if (predicate(fullPath)) {
      results.push(fullPath);
    }
  }

  return results;
}

function extractUrlEntries(xml) {
  const entries = [];
  const matches = xml.match(/<url>[\s\S]*?<\/url>/g) || [];

  for (const entryXml of matches) {
    const locMatch = entryXml.match(/<loc>([\s\S]*?)<\/loc>/);
    if (!locMatch) {
      continue;
    }

    const lastmodMatch = entryXml.match(/<lastmod>([\s\S]*?)<\/lastmod>/);
    entries.push({
      loc: decodeXml(locMatch[1].trim()),
      lastmod: lastmodMatch ? lastmodMatch[1].trim() : '',
      xml: entryXml,
    });
  }

  return entries;
}

function dedupeAndFilterEntries(entries) {
  const byLoc = new Map();

  for (const entry of entries) {
    let url;
    try {
      url = new URL(entry.loc);
    } catch {
      continue;
    }

    if (url.search || shouldNoindex(url.pathname)) {
      continue;
    }

    const normalizedPath = url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`;
    const normalizedLoc = `${TARGET_HOST}${normalizedPath}`.replace(/(?<!:)\/{2,}/g, '/').replace('https:/', 'https://');
    const normalizedXml = normalizeSitemapEntryXml(normalizeHosts(entry.xml).replace(entry.loc, normalizedLoc));
    const current = {
      loc: normalizedLoc,
      lastmod: entry.lastmod,
      xml: normalizedXml,
    };

    const previous = byLoc.get(normalizedLoc);
    if (!previous || current.lastmod > previous.lastmod) {
      byLoc.set(normalizedLoc, current);
    }
  }

  return [...byLoc.values()].sort((left, right) => left.loc.localeCompare(right.loc));
}

function normalizeSitemapEntryXml(xml) {
  return xml.replace(/<image:loc>\/(?!\/)/g, `<image:loc>${TARGET_HOST}/`);
}

function buildUrlSetXml(entries) {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    ...entries.map((entry) => `  ${entry.xml.trim()}`),
    '</urlset>',
    '',
  ].join('\n');
}

function buildSitemapIndexXml() {
  const now = new Date().toISOString();
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    `  <sitemap><loc>${TARGET_HOST}/page-sitemap.xml</loc><lastmod>${now}</lastmod></sitemap>`,
    `  <sitemap><loc>${TARGET_HOST}/post-sitemap.xml</loc><lastmod>${now}</lastmod></sitemap>`,
    '</sitemapindex>',
    '',
  ].join('\n');
}

function decodeXml(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}
