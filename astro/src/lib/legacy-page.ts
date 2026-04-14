import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const sourceRoot = path.join(process.cwd(), 'src');
const partialsRoot = path.join(process.cwd(), 'astro', 'src', 'partials');
const SITE_ORIGIN = 'https://www.tictapcards.com';

const _sharedHeaderByLang: Record<string, string> = {};
let _sharedFooterHtml: string | null = null;
let _sharedNavCss: string | null = null;

function headerFileForLang(lang: 'es' | 'en' | 'de'): string {
  return lang === 'es' ? 'shared-header.html' : `shared-header.${lang}.html`;
}

function langFromRelativePath(relativePath: string): 'es' | 'en' | 'de' {
  if (relativePath.startsWith('en/')) return 'en';
  if (relativePath.startsWith('de/')) return 'de';
  return 'es';
}

function loadSharedHeader(lang: 'es' | 'en' | 'de' = 'es'): string {
  if (!_sharedHeaderByLang[lang]) {
    _sharedHeaderByLang[lang] = fs.readFileSync(
      path.join(partialsRoot, headerFileForLang(lang)),
      'utf8',
    );
  }
  return _sharedHeaderByLang[lang];
}

function loadSharedFooter(): string {
  if (_sharedFooterHtml === null) {
    _sharedFooterHtml = fs.readFileSync(path.join(partialsRoot, 'shared-footer.html'), 'utf8');
  }
  return _sharedFooterHtml;
}

function loadSharedNavCss(): string {
  if (_sharedNavCss === null) {
    const css = fs.readFileSync(path.join(partialsRoot, 'shared-nav.css'), 'utf8');
    const js = `
document.addEventListener('click', function(e) {
  var link = e.target.closest('.menu-item-has-children > a.elementor-item, .menu-item-has-children > a.elementor-item *');
  if (!link) return;
  var anchor = link.closest('a.elementor-item');
  if (!anchor) return;
  var li = anchor.parentElement;
  if (!li || !li.classList.contains('menu-item-has-children')) return;
  var href = anchor.getAttribute('href');
  if (href && href !== '#' && href !== '') return;
  e.preventDefault();
  e.stopImmediatePropagation();
}, true);
`;
    const articleCss = fs.readFileSync(path.join(partialsRoot, 'shared-article.css'), 'utf8');
    _sharedNavCss = `<style id="nav-spacing-override">${css}</style><style id="blog-article-layout-override">${articleCss}</style><script id="nav-submenu-keepopen">${js}</script>`;
  }
  return _sharedNavCss;
}

function replaceHeader(bodyHtml: string, lang: 'es' | 'en' | 'de' = 'es'): string {
  const headerPattern = /<header\b[^>]*data-elementor-type=["']header["'][^>]*>[\s\S]*?<\/header>/i;
  const match = bodyHtml.match(headerPattern);
  if (!match) return bodyHtml;
  return bodyHtml.replace(match[0], loadSharedHeader(lang));
}

function replaceFooter(bodyHtml: string): string {
  const footerPattern = /(<footer\b[^>]*data-elementor-type=["']footer["'][\s\S]*?<\/div>\s*<!--\s*#page\s*-->)/i;
  const match = bodyHtml.match(footerPattern);
  if (!match) return bodyHtml;
  return bodyHtml.replace(match[0], loadSharedFooter());
}

function injectNavCss(headHtml: string): string {
  const cleaned = headHtml
    .replace(/<style id="nav-spacing-override">[\s\S]*?<\/style>/g, '')
    .replace(/<style id="blog-article-layout-override">[\s\S]*?<\/style>/g, '')
    .replace(/<script id="nav-submenu-keepopen">[\s\S]*?<\/script>/g, '');
  return cleaned + '\n' + loadSharedNavCss();
}

type LegacyRoute = {
  relativePath: string;
  route: string;
};

function rewriteToLocal(html: string) {
  return html
    .replace(/https?:\/\/127\.0\.0\.1:\d+/gi, '')
    .replace(/(href|src)=["']\/\/fonts\.googleapis\.com/gi, '$1="https://fonts.googleapis.com')
    .replace(/(href|src)=["']\/\/fonts\.gstatic\.com/gi, '$1="https://fonts.gstatic.com');
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function mustMatch(html: string, pattern: RegExp, label: string) {
  const match = html.match(pattern);
  if (!match) {
    throw new Error(`Could not extract ${label}`);
  }
  return match[1];
}

function readSourceFile(relativePath: string) {
  return fs.readFileSync(path.join(sourceRoot, relativePath), 'utf8');
}

function readSourceFileFromHead(relativePath: string) {
  return execFileSync(
    'git',
    ['show', `HEAD:src/${relativePath}`],
    {
      cwd: process.cwd(),
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );
}

function toPublicPath(relativePath: string) {
  if (relativePath === 'index.html') {
    return '/';
  }

  if (relativePath.endsWith('/index.html')) {
    return `/${relativePath.slice(0, -'/index.html'.length)}/`;
  }

  if (relativePath.endsWith('.html')) {
    return `/${relativePath.slice(0, -'.html'.length)}`;
  }

  return `/${relativePath}`;
}

function toRoute(relativePath: string) {
  if (relativePath === 'index.html') {
    return '/';
  }

  if (relativePath.endsWith('/index.html')) {
    return `/${relativePath.slice(0, -'/index.html'.length)}`;
  }

  if (relativePath.endsWith('.html')) {
    return `/${relativePath.slice(0, -'.html'.length)}`;
  }

  return `/${relativePath}`;
}

function toAbsoluteSiteUrl(value: string) {
  if (!value.startsWith('/')) {
    return value;
  }

  return `${SITE_ORIGIN}${value}`;
}

function normalizeHeadExtraHtml(headInner: string, relativePath: string) {
  const pagePath = toPublicPath(relativePath);
  const pageUrl = `${SITE_ORIGIN}${pagePath}`;
  const hreflangUrls = {
    es: `${SITE_ORIGIN}/`,
    en: `${SITE_ORIGIN}/en/`,
    de: `${SITE_ORIGIN}/de/`,
    'x-default': `${SITE_ORIGIN}/`,
  } as const;

  let normalized = headInner
    .replace(/<meta charset=["'][^"']+["']>\s*/gi, '')
    .replace(/<meta name=["']viewport["'][^>]*>\s*/gi, '')
    .replace(/<title>[\s\S]*?<\/title>\s*/gi, '')
    .replace(
      /(<link\b[^>]*rel=["']canonical["'][^>]*href=["'])[^"']*(["'][^>]*>)/i,
      `$1${pageUrl}$2`,
    )
    .replace(
      /(<meta\b[^>]*property=["']og:url["'][^>]*content=["'])[^"']*(["'][^>]*>)/i,
      `$1${pageUrl}$2`,
    )
    .replace(
      /(<link\b[^>]*rel=["']alternate["'][^>]*hreflang=["'](es|en|de|x-default)["'][^>]*href=["'])[^"']*(["'][^>]*>)/gi,
      (_, prefix: string, hreflang: keyof typeof hreflangUrls, suffix: string) =>
        `${prefix}${hreflangUrls[hreflang]}${suffix}`,
    )
    .replace(
      /\b(href|src|content)=["']\/(?!\/)([^"']*)["']/gi,
      (_, attribute: string, value: string) => `${attribute}="${toAbsoluteSiteUrl(`/${value}`)}"`,
    )
    .replace(
      /("(@id|url|contentUrl|thumbnailUrl|urlTemplate)")\s*:\s*"\/(?!\/)([^"]*)"/g,
      (_, keyWithQuotes: string, _key: string, value: string) =>
        `${keyWithQuotes}:"${toAbsoluteSiteUrl(`/${value}`)}"`,
    )
    .replace(
      /("target"\s*:\s*\[\s*")\/(?!\/)([^"]*)("\s*\])/g,
      (_, prefix: string, value: string, suffix: string) =>
        `${prefix}${toAbsoluteSiteUrl(`/${value}`)}${suffix}`,
    );

  if (pagePath !== '/') {
    normalized = normalized
      .replace(
        /("@type":"WebPage","@id":)"https:\/\/www\.tictapcards\.com\/","url":"https:\/\/www\.tictapcards\.com\/"/,
        `$1"${pageUrl}","url":"${pageUrl}"`,
      )
      .replaceAll('https://www.tictapcards.com/#primaryimage', `${pageUrl}#primaryimage`)
      .replaceAll('https://www.tictapcards.com/#breadcrumb', `${pageUrl}#breadcrumb`)
      .replace(
        /("target"\s*:\s*\[\s*")https:\/\/www\.tictapcards\.com\/("\s*\]\}\])/,
        `$1${pageUrl}$2`,
      );
  }

  return normalized.trim();
}

export function listManagedLegacyRoutes(): LegacyRoute[] {
  const routes: LegacyRoute[] = [];

  function walk(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const absolutePath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (entry.name === 'wp-content' || entry.name === 'wp-includes' || entry.name === 'wp-json') {
          continue;
        }
        walk(absolutePath);
        continue;
      }

      if (!entry.isFile() || !entry.name.endsWith('.html')) {
        continue;
      }

      const relativePath = path.relative(sourceRoot, absolutePath).replace(/\\/g, '/');

      if (relativePath === '404.html') {
        continue;
      }

      routes.push({
        relativePath,
        route: toRoute(relativePath),
      });
    }
  }

  walk(sourceRoot);
  routes.sort((left, right) => left.route.localeCompare(right.route));
  return routes;
}

export function loadSourcePage(relativePath: string) {
  const rawHtml = readSourceFile(relativePath);
  const normalized = rewriteToLocal(rawHtml);
  const headInner = mustMatch(normalized, /<head[^>]*>([\s\S]*?)<\/head>/i, 'head');
  const title = decodeHtmlEntities(mustMatch(normalized, /<title>([\s\S]*?)<\/title>/i, 'title').trim());
  const bodyMatch = normalized.match(/<body([^>]*)>([\s\S]*?)<\/body>/i);

  if (!bodyMatch) {
    throw new Error(`Could not extract body from ${relativePath}`);
  }

  const bodyAttributes = bodyMatch[1];
  let bodyInnerHtml = bodyMatch[2];
  const bodyClassMatch = bodyAttributes.match(/\bclass=["']([^"']+)["']/i);
  const bodyItemTypeMatch = bodyAttributes.match(/\bitemtype=["']([^"']+)["']/i);
  const bodyItemscope = /\bitemscope\b/i.test(bodyAttributes);
  const langMatch = normalized.match(/<html[^>]*lang=["']([^"']+)["']/i);

  bodyInnerHtml = replaceHeader(bodyInnerHtml, langFromRelativePath(relativePath));
  bodyInnerHtml = replaceFooter(bodyInnerHtml);

  const headExtraHtml = injectNavCss(normalizeHeadExtraHtml(headInner, relativePath));

  return {
    title,
    lang: langMatch?.[1] ?? 'es-ES',
    headExtraHtml,
    bodyClass: bodyClassMatch?.[1] ?? '',
    bodyItemType: bodyItemTypeMatch?.[1] ?? '',
    bodyItemscope,
    bodyInnerHtml,
  };
}

export function loadSourcePageFromHead(relativePath: string) {
  const rawHtml = readSourceFileFromHead(relativePath);
  const normalized = rewriteToLocal(rawHtml);
  const headInner = mustMatch(normalized, /<head[^>]*>([\s\S]*?)<\/head>/i, 'head');
  const title = decodeHtmlEntities(mustMatch(normalized, /<title>([\s\S]*?)<\/title>/i, 'title').trim());
  const bodyMatch = normalized.match(/<body([^>]*)>([\s\S]*?)<\/body>/i);

  if (!bodyMatch) {
    throw new Error(`Could not extract body from ${relativePath}`);
  }

  const bodyAttributes = bodyMatch[1];
  let bodyInnerHtml = bodyMatch[2];
  const bodyClassMatch = bodyAttributes.match(/\bclass=["']([^"']+)["']/i);
  const bodyItemTypeMatch = bodyAttributes.match(/\bitemtype=["']([^"']+)["']/i);
  const bodyItemscope = /\bitemscope\b/i.test(bodyAttributes);
  const langMatch = normalized.match(/<html[^>]*lang=["']([^"']+)["']/i);

  bodyInnerHtml = replaceHeader(bodyInnerHtml, langFromRelativePath(relativePath));
  bodyInnerHtml = replaceFooter(bodyInnerHtml);

  const headExtraHtml = injectNavCss(normalizeHeadExtraHtml(headInner, relativePath));

  return {
    title,
    lang: langMatch?.[1] ?? 'es-ES',
    headExtraHtml,
    bodyClass: bodyClassMatch?.[1] ?? '',
    bodyItemType: bodyItemTypeMatch?.[1] ?? '',
    bodyItemscope,
    bodyInnerHtml,
  };
}

export function loadSourceStructuredPage(relativePath: string) {
  const rawHtml = readSourceFile(relativePath);
  const normalized = rewriteToLocal(rawHtml);
  const headInner = mustMatch(normalized, /<head[^>]*>([\s\S]*?)<\/head>/i, 'head');
  const title = decodeHtmlEntities(mustMatch(normalized, /<title>([\s\S]*?)<\/title>/i, 'title').trim());
  const bodyMatch = normalized.match(/<body([^>]*)>([\s\S]*?)<\/body>/i);

  if (!bodyMatch) {
    throw new Error(`Could not extract body from ${relativePath}`);
  }

  const bodyAttributes = bodyMatch[1];
  const bodyInnerHtml = bodyMatch[2];
  const langMatch = normalized.match(/<html[^>]*lang=["']([^"']+)["']/i);
  const bodyClassMatch = bodyAttributes.match(/\bclass=["']([^"']+)["']/i);
  const bodyItemTypeMatch = bodyAttributes.match(/\bitemtype=["']([^"']+)["']/i);
  const bodyItemscope = /\bitemscope\b/i.test(bodyAttributes);

  const preHeaderHtml = mustMatch(
    bodyInnerHtml,
    /^([\s\S]*?)<header\b[^>]*data-elementor-type=["']header["']/i,
    'pre-header html',
  );
  const headerHtml = mustMatch(
    bodyInnerHtml,
    /(<header\b[^>]*data-elementor-type=["']header["'][\s\S]*?<\/header>)/i,
    'header html',
  );
  const contentHtml = mustMatch(
    bodyInnerHtml,
    /(<div id=["']content["'] class=["']site-content["'][\s\S]*?<\/div>\s*<!--\s*#content\s*-->)/i,
    'content html',
  );
  const footerHtml = mustMatch(
    bodyInnerHtml,
    /(<footer\b[^>]*data-elementor-type=["']footer["'][\s\S]*?<\/footer>)/i,
    'footer html',
  );
  const afterFooterHtml = mustMatch(
    bodyInnerHtml,
    /<footer\b[^>]*data-elementor-type=["']footer["'][\s\S]*?<\/footer>([\s\S]*)$/i,
    'after-footer html',
  );

  const headExtraHtml = normalizeHeadExtraHtml(headInner, relativePath);

  return {
    title,
    lang: langMatch?.[1] ?? 'es-ES',
    headExtraHtml,
    bodyClass: bodyClassMatch?.[1] ?? '',
    bodyItemType: bodyItemTypeMatch?.[1] ?? '',
    bodyItemscope,
    preHeaderHtml,
    headerHtml,
    contentHtml,
    footerHtml,
    afterFooterHtml,
  };
}

export function splitHomeContent(contentHtml: string) {
  const introStartMarker = '<div class="elementor-element elementor-element-49ac3a4';
  const remainderStartMarker = '<div class="elementor-element elementor-element-372c8c7';
  const introStartIndex = contentHtml.indexOf(introStartMarker);
  const remainderStartIndex = contentHtml.indexOf(remainderStartMarker);

  if (introStartIndex === -1 || remainderStartIndex === -1 || remainderStartIndex <= introStartIndex) {
    throw new Error('Could not split home content into reusable intro and legacy remainder');
  }

  return {
    beforeIntroHtml: contentHtml.slice(0, introStartIndex),
    afterIntroHtml: contentHtml.slice(remainderStartIndex),
  };
}
