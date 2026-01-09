// Profanity filter with common bypass detection
// This catches common letter substitutions and spacing tricks

const PROFANITY_LIST = [
  // Common profanities (base forms)
  'fuck', 'shit', 'bitch', 'ass', 'damn', 'cunt', 'dick', 'cock', 'pussy',
  'bastard', 'whore', 'slut', 'fag', 'nigger', 'nigga', 'retard', 'kys',
  'kill yourself', 'kms', 'rape', 'faggot', 'tranny', 'chink', 'spic',
  'wetback', 'beaner', 'cracker', 'honky', 'gook', 'kike', 'dyke', 'coon'
];

// Common letter substitutions used to bypass filters
const SUBSTITUTIONS: Record<string, string[]> = {
  'a': ['@', '4', 'α', 'а', 'ạ', 'ả', 'ā', 'ă', 'â', 'à', 'á'],
  'b': ['8', 'ß', 'в', 'ḅ'],
  'c': ['(', '<', 'ç', 'с', 'ć'],
  'd': ['đ', 'ď'],
  'e': ['3', '€', 'є', 'е', 'ē', 'ė', 'ę', 'è', 'é', 'ê', 'ë'],
  'f': ['ph'],
  'g': ['9', '6', 'ğ'],
  'h': ['#'],
  'i': ['1', '!', '|', 'l', 'í', 'ì', 'î', 'ï', 'і', 'ī', 'ĩ'],
  'k': ['|<'],
  'l': ['1', '|', 'ł'],
  'n': ['и', 'ñ', 'ń'],
  'o': ['0', 'ø', 'о', 'ō', 'ọ', 'ỏ', 'ô', 'ò', 'ó', 'õ'],
  'p': ['ρ', 'р'],
  'r': ['я', 'ř'],
  's': ['$', '5', 'ś', 'š', 'ş'],
  't': ['+', '7', 'ť', 'т'],
  'u': ['υ', 'ū', 'ũ', 'ù', 'ú', 'û', 'ü'],
  'v': ['\\/', 'ν'],
  'w': ['vv', 'ω', 'ш', 'щ'],
  'x': ['×', '%'],
  'y': ['ý', 'ÿ', 'у'],
  'z': ['2', 'ź', 'ż', 'ž']
};

// Build regex pattern for each character with its substitutions
function buildPattern(word: string): RegExp {
  let pattern = '';
  
  for (const char of word.toLowerCase()) {
    const subs = SUBSTITUTIONS[char];
    if (subs) {
      // Match the char or any of its substitutions, with optional spacing/separators between
      const escaped = [char, ...subs].map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
      pattern += `(?:${escaped})[\\s._\\-*]*`;
    } else {
      pattern += char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[\\s._\\-*]*';
    }
  }
  
  // Remove trailing separator pattern
  pattern = pattern.replace(/\[\\s\._\\-\*\]\*$/, '');
  
  return new RegExp(pattern, 'gi');
}

// Pre-build patterns for all profanity words
const PROFANITY_PATTERNS = PROFANITY_LIST.map(word => ({
  word,
  pattern: buildPattern(word)
}));

export interface ProfanityResult {
  isClean: boolean;
  cleaned: string;
  matches: string[];
}

/**
 * Check text for profanity and common bypasses
 */
export function checkProfanity(text: string): ProfanityResult {
  const matches: string[] = [];
  let cleaned = text;
  
  // Normalize the text - remove zero-width characters and normalize unicode
  let normalized = text
    .normalize('NFKD')
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // Remove zero-width chars
    .replace(/[\u0300-\u036f]/g, ''); // Remove combining diacritical marks
  
  for (const { word, pattern } of PROFANITY_PATTERNS) {
    const found = normalized.match(pattern);
    if (found) {
      matches.push(...found);
      // Replace in cleaned string with asterisks
      cleaned = cleaned.replace(pattern, match => '*'.repeat(match.length));
    }
  }
  
  // Also check for repeated characters trying to bypass (e.g., "fuuuuck")
  const repeatedPattern = /(.)\1{3,}/g;
  const collapsed = normalized.replace(repeatedPattern, '$1$1');
  
  for (const { word, pattern } of PROFANITY_PATTERNS) {
    if (!matches.length && pattern.test(collapsed)) {
      matches.push(word);
      cleaned = cleaned.replace(pattern, match => '*'.repeat(match.length));
    }
  }
  
  return {
    isClean: matches.length === 0,
    cleaned,
    matches: [...new Set(matches)] // Deduplicate
  };
}

/**
 * Simple check if text contains profanity
 */
export function containsProfanity(text: string): boolean {
  return !checkProfanity(text).isClean;
}

/**
 * Clean text by replacing profanity with asterisks
 */
export function cleanProfanity(text: string): string {
  return checkProfanity(text).cleaned;
}
