/**
 * Text Utility Functions
 * Handle HTML stripping and text cleaning for WordPress content
 */

/**
 * Strip all HTML tags from a string
 * @param html - String containing HTML markup
 * @returns Plain text without HTML tags
 */
export function stripHtml(html: string): string {
  if (!html) return '';

  // Remove HTML tags
  let text = html.replace(/<[^>]*>/g, '');

  // Decode HTML entities
  text = decodeHtmlEntities(text);

  // Clean up extra whitespace
  text = text.replace(/\s+/g, ' ').trim();

  return text;
}

/**
 * Decode HTML entities like &amp; to &
 * @param text - String containing HTML entities
 * @returns String with decoded entities
 */
export function decodeHtmlEntities(text: string): string {
  if (!text) return '';

  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'",
    '&#8217;': "'",
    '&#8216;': "'",
    '&#8220;': '"',
    '&#8221;': '"',
    '&nbsp;': ' ',
    '&mdash;': '—',
    '&ndash;': '–',
    '&hellip;': '…',
  };

  let decoded = text;
  for (const [entity, char] of Object.entries(entities)) {
    decoded = decoded.replace(new RegExp(entity, 'g'), char);
  }

  // Decode numeric entities
  decoded = decoded.replace(/&#(\d+);/g, (_, dec) =>
    String.fromCharCode(parseInt(dec, 10))
  );

  // Decode hex entities
  decoded = decoded.replace(/&#x([0-9a-f]+);/gi, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  );

  return decoded;
}

/**
 * Clean WordPress excerpt by removing HTML and decoding entities
 * @param excerpt - Raw WordPress excerpt (may contain HTML)
 * @returns Clean plain text excerpt
 */
export function cleanExcerpt(excerpt: string | null | undefined): string {
  if (!excerpt) return '';

  // WordPress excerpts often come wrapped in <p> tags
  let cleaned = stripHtml(excerpt);

  // Remove "Continue reading" links that WordPress sometimes adds
  cleaned = cleaned.replace(/Continue reading.*/i, '');

  // Remove [...] that WordPress adds to auto-generated excerpts
  cleaned = cleaned.replace(/\[\.\.\.\]$/, '…');

  return cleaned.trim();
}

/**
 * Truncate text to a specific length, adding ellipsis if needed
 * @param text - Text to truncate
 * @param maxLength - Maximum length (default: 150)
 * @param suffix - Suffix to add when truncated (default: '…')
 * @returns Truncated text
 */
export function truncate(
  text: string,
  maxLength: number = 150,
  suffix: string = '…'
): string {
  if (!text || text.length <= maxLength) return text;

  // Find the last space before maxLength to avoid cutting words
  const truncateAt = text.lastIndexOf(' ', maxLength);
  const cutPoint = truncateAt > 0 ? truncateAt : maxLength;

  return text.substring(0, cutPoint).trim() + suffix;
}

/**
 * Calculate reading time in minutes
 * @param content - Post content (HTML or plain text)
 * @param wordsPerMinute - Reading speed (default: 200)
 * @returns Reading time in minutes
 */
export function calculateReadingTime(
  content: string,
  wordsPerMinute: number = 200
): number {
  if (!content) return 0;

  // Strip HTML if present
  const plainText = stripHtml(content);

  // Count words
  const wordCount = plainText.split(/\s+/).filter(word => word.length > 0).length;

  // Calculate reading time (minimum 1 minute)
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

/**
 * Format a date string in a human-readable format
 * @param dateString - ISO date string from WordPress
 * @param format - Format type ('full' | 'short' | 'relative')
 * @returns Formatted date string
 */
export function formatDate(
  dateString: string,
  format: 'full' | 'short' | 'relative' = 'full'
): string {
  const date = new Date(dateString);

  if (format === 'full') {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  if (format === 'short') {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }

  // Relative format (e.g., "2 days ago")
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;

  return `${Math.floor(diffDays / 365)} years ago`;
}
