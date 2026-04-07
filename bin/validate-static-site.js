const fs = require('fs');
const path = require('path');
const { resolvePublishContext } = require('./site-host');

const ROOT_DIR = path.join(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const { host: TARGET_HOST, nonTargetHosts } = resolvePublishContext();
const TEXT_EXTENSIONS = new Set(['.css', '.html', '.js', '.json', '.map', '.md', '.svg', '.txt', '.xml', '.xsl']);
const VALID_STATUS_CODES = new Set(['200', '301', '302', '303', '307', '308']);
const REQUIRED_SRC_FILES = ['_redirects', 'robots.txt', 'sitemap.xml', 'sitemap_index.xml', 'page-sitemap.xml', 'post-sitemap.xml'];
const ROOT_SYNC_FILES = ['_redirects'];
const MAX_REPORTED_MATCHES_PER_FILE = 3;

const errors = [];

validateRequiredFiles();
validateSyncedRootFiles();
validateNoLegacyHosts();
validateRobotsTxt();
validateSitemaps();
validateRedirects();

if (errors.length > 0) {
  console.error('Static site validation failed:\n');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log('Static site validation passed.');

function validateRequiredFiles() {
  for (const relativePath of REQUIRED_SRC_FILES) {
    const fullPath = path.join(SRC_DIR, relativePath);
    if (!fs.existsSync(fullPath)) {
      errors.push(`Missing required file in src/: ${relativePath}`);
    }
  }
}

function validateSyncedRootFiles() {
  for (const relativePath of ROOT_SYNC_FILES) {
    const rootPath = path.join(ROOT_DIR, relativePath);
    const srcPath = path.join(SRC_DIR, relativePath);

    if (!fs.existsSync(rootPath) || !fs.existsSync(srcPath)) {
      errors.push(`${relativePath} must exist both in project root and src/`);
      continue;
    }

    const rootContent = fs.readFileSync(rootPath, 'utf8').replace(/\r\n/g, '\n');
    const srcContent = fs.readFileSync(srcPath, 'utf8').replace(/\r\n/g, '\n');
    if (rootContent !== srcContent) {
      errors.push(`${relativePath} in project root and src/ must be identical`);
    }
  }
}

function validateNoLegacyHosts() {
  const files = getFilesRecursive(SRC_DIR, (filePath) => {
    const baseName = path.basename(filePath);
    const ext = path.extname(filePath).toLowerCase();
    return TEXT_EXTENSIONS.has(ext) || baseName === '_redirects' || baseName === '_headers';
  });

  for (const filePath of files) {
    const content = fs.readFileSync(filePath, 'utf8');
    const matches = findNonTargetHostMatches(content);
    if (matches.length > 0) {
      const formattedMatches = matches
        .slice(0, MAX_REPORTED_MATCHES_PER_FILE)
        .map((match) => `${match.host} (line ${match.line})`)
        .join(', ');
      errors.push(`Legacy host found in ${path.relative(ROOT_DIR, filePath)}: ${formattedMatches}`);
    }
  }
}

function validateRobotsTxt() {
  const robotsPath = path.join(SRC_DIR, 'robots.txt');
  if (!fs.existsSync(robotsPath)) {
    return;
  }

  const content = fs.readFileSync(robotsPath, 'utf8');
  if (!content.includes(`Sitemap: ${TARGET_HOST}/sitemap_index.xml`)) {
    errors.push(`robots.txt must point to the sitemap index for ${TARGET_HOST}`);
  }
}

function validateSitemaps() {
  const sitemapIndexPath = path.join(SRC_DIR, 'sitemap_index.xml');
  const sitemapAliasPath = path.join(SRC_DIR, 'sitemap.xml');
  const expectedSitemapLocs = [`${TARGET_HOST}/page-sitemap.xml`, `${TARGET_HOST}/post-sitemap.xml`];

  for (const filePath of [sitemapIndexPath, sitemapAliasPath]) {
    if (!fs.existsSync(filePath)) {
      continue;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    for (const loc of expectedSitemapLocs) {
      if (!content.includes(`<loc>${loc}</loc>`)) {
        errors.push(`${path.basename(filePath)} must include ${loc}`);
      }
    }
  }
}

function validateRedirects() {
  const redirectsPath = path.join(SRC_DIR, '_redirects');
  if (!fs.existsSync(redirectsPath)) {
    return;
  }

  const lines = fs.readFileSync(redirectsPath, 'utf8').replace(/\r\n/g, '\n').split('\n');
  for (const [index, line] of lines.entries()) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const parts = trimmed.split(/\s+/);
    if (parts.length !== 3) {
      errors.push(`Redirect rule ${index + 1} in src/_redirects must include source, destination and explicit status code`);
      continue;
    }

    const [source, destination, statusCode] = parts;
    if (source.includes('#')) {
      errors.push(`Redirect rule ${index + 1} in src/_redirects uses a URL fragment in the source path`);
    }
    if (!VALID_STATUS_CODES.has(statusCode)) {
      errors.push(`Redirect rule ${index + 1} in src/_redirects uses unsupported status code ${statusCode}`);
    }
    if (containsNonTargetHost(destination)) {
      errors.push(`Redirect rule ${index + 1} in src/_redirects points to a legacy host`);
    }
  }
}

function containsNonTargetHost(content) {
  return nonTargetHosts.some((host) => content.includes(host) || content.includes(host.replace(/^https?:\/\//, '')));
}

function findNonTargetHostMatches(content) {
  const matches = [];
  const lines = content.split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    for (const host of nonTargetHosts) {
      const hostName = host.replace(/^https?:\/\//, '');
      if (line.includes(host) || line.includes(hostName)) {
        matches.push({
          host,
          line: index + 1,
        });
      }
    }
  }

  return matches;
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
