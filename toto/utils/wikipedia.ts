import type { WikipediaExtract } from "@/types";

const WIKIPEDIA_API_BASE = "https://en.wikipedia.org/w/api.php";

/**
 * Extract article title from Wikipedia URL
 */
export function extractTitleFromUrl(url: string): string | null {
  const patterns = [
    /wikipedia\.org\/wiki\/([^#?]+)/,
    /wikipedia\.org\/w\/index\.php\?title=([^&]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return decodeURIComponent(match[1].replace(/_/g, " "));
    }
  }

  return null;
}

/**
 * Validate that a URL is a Wikipedia article
 */
export function isValidWikipediaUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      parsed.hostname.endsWith("wikipedia.org") &&
      (parsed.pathname.startsWith("/wiki/") ||
        parsed.pathname.includes("/w/index.php"))
    );
  } catch {
    return false;
  }
}

/**
 * Fetch article content from Wikipedia API
 */
export async function fetchWikipediaArticle(
  title: string
): Promise<WikipediaExtract | null> {
  const params = new URLSearchParams({
    action: "query",
    titles: title,
    prop: "extracts",
    explaintext: "true",
    format: "json",
    origin: "*",
  });

  try {
    const response = await fetch(`${WIKIPEDIA_API_BASE}?${params}`);
    const data = await response.json();

    const pages = data.query?.pages;
    if (!pages) return null;

    const pageId = Object.keys(pages)[0];
    if (pageId === "-1") return null; // Page not found

    const page = pages[pageId];

    return {
      title: page.title,
      content: page.extract,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title.replace(/ /g, "_"))}`,
    };
  } catch (error) {
    console.error("Wikipedia API error:", error);
    return null;
  }
}

/**
 * Truncate content to approximate token limit
 * Rough estimate: 1 token ≈ 4 characters
 */
export function truncateContent(content: string, maxTokens: number): string {
  const maxChars = maxTokens * 4;
  if (content.length <= maxChars) return content;

  // Truncate at sentence boundary if possible
  const truncated = content.slice(0, maxChars);
  const lastPeriod = truncated.lastIndexOf(".");

  if (lastPeriod > maxChars * 0.8) {
    return truncated.slice(0, lastPeriod + 1);
  }

  return truncated + "...";
}
