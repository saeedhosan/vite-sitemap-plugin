import type { PluginOption } from "vite";

export type Changefreq = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

interface Entry {
    path: string;
    lastmod?: string;
    changefreq?: Changefreq;
    priority?: number;
}

export type SitemapEntry = string | Entry;

interface Options extends Omit<Entry, "path"> {
    base?: string; // e.g. https://example.com
    urls?: SitemapEntry[];
    fileName?: string;
    robotsTxt?: boolean | string | null;
}

/**
 * Remove leading and trailing slashes
 */
export const unslash = (str: string): string => str.replace(/^\/|\/$/g, "");

/**
 * Ensure string ends with a slash
 */
export const adslash = (str: string): string => `${unslash(str)}/`;

/**
 * Escape XML characters
 */
const escapeXml = (str: string) =>
    str.replace(
        /[<>&'"]/g,
        (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c] || c)
    );

/**
 * Generate a single sitemap entry
 */
export const sitemapEntry = (base: string, entry: SitemapEntry, options: Options): string => {
    const {
        path,
        lastmod = options.lastmod,
        changefreq = options.changefreq,
        priority = 0.8,
    } = typeof entry === "object" ? entry : { path: entry };

    const url = `${adslash(base)}${unslash(path)}`;
    return `<url>
  <loc>${escapeXml(url)}</loc>
  ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}
  ${changefreq ? `<changefreq>${changefreq}</changefreq>` : ""}
  <priority>${priority.toFixed(1)}</priority>
</url>`;
};

/**
 * Generate sitemap entries
 */
export const sitemapEntries = (base: string, entries: SitemapEntry[], options: Options) =>
    entries.map((entry) => sitemapEntry(base, entry, options)).join("\n");

/**
 * Default robots.txt generator
 */
function defaultRobotsTxt(base: string): string {
    const sitemapUrl = `${adslash(base)}sitemap.xml`;
    return ["User-agent: *", "Allow: /", `Sitemap: ${sitemapUrl}`, ""].join("\n");
}

/**
 * Generate robots.txt file if enabled
 */
export function emitRobotsTxt(
    this: any,
    robotsTxt: string | boolean | null | undefined,
    base: string
) {
    if (robotsTxt === false || robotsTxt === null) return;

    const source = typeof robotsTxt === "string" ? robotsTxt : defaultRobotsTxt(base);

    this.emitFile({
        type: "asset",
        fileName: "robots.txt",
        source,
    });
}

/**
 * Vite plugin to generate sitemap.xml (and optionally robots.txt)
 */
export default function sitemap(options: Options = {}): PluginOption {
    const {
        urls = [],
        base = "/",
        fileName = "sitemap.xml",
        robotsTxt,
        lastmod = new Date().toISOString(),
        changefreq = "daily",
    } = options;

    const sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">

${sitemapEntries(base, urls, { lastmod, changefreq })}
</urlset>`;

    return {
        name: "vite-sitemap",
        generateBundle() {
            this.emitFile({
                type: "asset",
                fileName,
                source: sitemapXML.trim(),
            });

            emitRobotsTxt.call(this, robotsTxt, base);
        },
    };
}
