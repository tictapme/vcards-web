#!/usr/bin/env node

const fs = require('fs');
const http = require('http');
const path = require('path');

function normalizeHost(value) {
  if (!value) {
    return '127.0.0.1';
  }

  const trimmed = value.trim();
  const validHosts = new Set(['0.0.0.0', '127.0.0.1', '::', '::1', 'localhost']);
  const ipv4Pattern = /^(?:\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Pattern = /^[a-fA-F0-9:]+$/;

  if (validHosts.has(trimmed) || ipv4Pattern.test(trimmed) || ipv6Pattern.test(trimmed)) {
    return trimmed;
  }

  return '127.0.0.1';
}

const rootArg = process.argv[2] || 'src';
const rootDir = path.resolve(process.cwd(), rootArg);
const port = Number(process.env.PORT || 4321);
const host = normalizeHost(process.env.PREVIEW_HOST || process.env.HOST);
const rewriteProductionUrls = process.env.PREVIEW_REWRITE_PROD !== '0';

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.m4v': 'video/mp4',
  '.map': 'application/json; charset=utf-8',
  '.mp4': 'video/mp4',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webm': 'video/webm',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
};

const TEXT_FILE_EXTENSIONS = new Set(['.css', '.html', '.js', '.json', '.map', '.txt', '.xml']);

if (!fs.existsSync(rootDir) || !fs.statSync(rootDir).isDirectory()) {
  console.error(`Static root not found: ${rootDir}`);
  process.exit(1);
}

function send(res, statusCode, body, contentType) {
  res.writeHead(statusCode, {
    'Content-Type': contentType,
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

function safePathname(urlPathname) {
  const decoded = decodeURIComponent(urlPathname.split('?')[0]);
  const normalized = path.normalize(decoded).replace(/^(\.\.[/\\])+/, '');
  return normalized.startsWith(path.sep) ? normalized.slice(1) : normalized;
}

function resolveFile(urlPathname) {
  const pathname = safePathname(urlPathname || '/');
  const directPath = path.join(rootDir, pathname);
  const candidates = [];

  if (pathname === '') {
    candidates.push(path.join(rootDir, 'index.html'));
  } else {
    candidates.push(directPath);
    if (!path.extname(directPath)) {
      candidates.push(path.join(directPath, 'index.html'));
      candidates.push(`${directPath}.html`);
    }
  }

  for (const candidate of candidates) {
    if (!candidate.startsWith(rootDir)) {
      continue;
    }

    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate;
    }
  }

  return null;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function rewriteContent(content, localOrigin) {
  if (!rewriteProductionUrls) {
    return content;
  }

  const hosts = [
    'www.tictapcards.com',
    'tictapcards.com',
    'develop.vcards-web.pages.dev',
  ];

  let rewritten = content;

  for (const hostName of hosts) {
    const escapedHost = escapeRegExp(hostName);
    const patternGroups = [
      { pattern: new RegExp(`https://${escapedHost}`, 'gi'), replacement: localOrigin },
      { pattern: new RegExp(`//${escapedHost}`, 'gi'), replacement: localOrigin },
      {
        pattern: new RegExp(`https:\\\\/\\\\/${escapedHost}`, 'gi'),
        replacement: localOrigin.replace(/\//g, '\\/'),
      },
      {
        pattern: new RegExp(`\\\\/\\\\/${escapedHost}`, 'gi'),
        replacement: localOrigin.replace(/\//g, '\\/'),
      },
    ];

    for (const { pattern, replacement } of patternGroups) {
      rewritten = rewritten.replace(pattern, replacement);
    }
  }

  return rewritten;
}

const server = http.createServer((req, res) => {
  const requestPath = new URL(req.url, `http://${req.headers.host}`).pathname;
  const filePath = resolveFile(requestPath);

  if (!filePath) {
    send(res, 404, '404 Not Found', 'text/plain; charset=utf-8');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  const localOrigin = `http://${req.headers.host || `${host}:${port}`}`;

  if (TEXT_FILE_EXTENSIONS.has(ext)) {
    fs.readFile(filePath, 'utf8', (error, content) => {
      if (error) {
        send(res, 500, '500 Internal Server Error', 'text/plain; charset=utf-8');
        return;
      }

      send(res, 200, rewriteContent(content, localOrigin), contentType);
    });
    return;
  }

  const stream = fs.createReadStream(filePath);
  res.writeHead(200, {
    'Content-Type': contentType,
    'Cache-Control': 'no-store',
  });

  stream.on('error', () => {
    send(res, 500, '500 Internal Server Error', 'text/plain; charset=utf-8');
  });

  stream.pipe(res);
});

server.on('error', (error) => {
  console.error(`Unable to start static preview on http://${host}:${port}`);
  console.error(error.message);
  process.exit(1);
});

server.listen(port, host, () => {
  console.log(`Static preview running at http://${host}:${port}`);
  console.log(`Serving: ${rootDir}`);
});
