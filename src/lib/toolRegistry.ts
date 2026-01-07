import { lazy, ComponentType } from 'react';

// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║                           TOOL REGISTRY                                   ║
// ╠═══════════════════════════════════════════════════════════════════════════╣
// ║  Pusat registrasi semua tools di website ini.                             ║
// ║                                                                           ║
// ║  📌 CARA MENAMBAH TOOL BARU:                                              ║
// ║  1. Buat file: src/pages/tools/NamaToolPage.tsx                          ║
// ║  2. Tambahkan entry baru di TOOLS_DATA di bawah                          ║
// ║  3. Selesai! Tool otomatis muncul di homepage & routing                  ║
// ╚═══════════════════════════════════════════════════════════════════════════╝

// ─────────────────────────────────────────────────────────────────────────────
// TYPES & INTERFACES
// ─────────────────────────────────────────────────────────────────────────────

/** Kategori tool yang tersedia */
export const CATEGORIES = {
  converter: { label: 'Format Converter', icon: '🔄' },
  developer: { label: 'Developer Tools', icon: '👨‍💻' },
  text: { label: 'Text Processing', icon: '📝' },
  image: { label: 'Image Tools', icon: '🖼️' },
  utility: { label: 'Utilities', icon: '🧰' },
} as const;

export type Category = keyof typeof CATEGORIES;

export interface ToolMeta {
  id: string;
  name: string;
  description: string;
  category: Category;
  icon: string;
  tags: string[];
  featured?: boolean;
}

export interface ToolEntry extends ToolMeta {
  component: ComponentType;
}

// ─────────────────────────────────────────────────────────────────────────────
// TOOLS DATA - Tambahkan tool baru di sini!
// ─────────────────────────────────────────────────────────────────────────────

const TOOLS_DATA: ToolEntry[] = [
  // ┌─────────────────────────────────────────────────────────────────────────┐
  // │ 🔄 FORMAT CONVERTERS                                                    │
  // └─────────────────────────────────────────────────────────────────────────┘
  {
    id: 'base64-encoder',
    name: 'Base64 Encoder/Decoder',
    description: 'Encode text to Base64 or decode Base64 to text',
    category: 'converter',
    icon: '🔐',
    tags: ['base64', 'encode', 'decode'],
    component: lazy(() => import('@/pages/tools/Base64EncoderPage')),
  },
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Format and beautify JSON data with syntax highlighting',
    category: 'converter',
    icon: '📋',
    tags: ['json', 'format', 'beautify'],
    featured: true,
    component: lazy(() => import('@/pages/tools/JsonFormatterPage')),
  },
  {
    id: 'url-encoder',
    name: 'URL Encoder/Decoder',
    description: 'Encode or decode URL components safely',
    category: 'converter',
    icon: '🔗',
    tags: ['url', 'encode', 'decode'],
    component: lazy(() => import('@/pages/tools/UrlEncoderPage')),
  },

  // ┌─────────────────────────────────────────────────────────────────────────┐
  // │ 👨‍💻 DEVELOPER TOOLS                                                      │
  // └─────────────────────────────────────────────────────────────────────────┘
  {
    id: 'color-converter',
    name: 'Color Converter',
    description: 'Convert between HEX, RGB, HSL color formats',
    category: 'developer',
    icon: '🎨',
    tags: ['color', 'hex', 'rgb', 'hsl'],
    featured: true,
    component: lazy(() => import('@/pages/tools/ColorConverterPage')),
  },
  {
    id: 'hash-generator',
    name: 'Hash Generator',
    description: 'Generate MD5, SHA-1, SHA-256 hashes',
    category: 'developer',
    icon: '#️⃣',
    tags: ['hash', 'md5', 'sha'],
    component: lazy(() => import('@/pages/tools/HashGeneratorPage')),
  },
  {
    id: 'purple-cipher',
    name: 'Purple Cipher',
    description: 'PURPLE cipher encryption/decryption simulator',
    category: 'developer',
    icon: '🟣',
    tags: ['cipher', 'encrypt', 'decrypt', 'purple', 'cryptography'],
    featured: true,
    component: lazy(() => import('@/pages/tools/PurpleCipherPage')),
  },
  {
    id: 'timestamp-converter',
    name: 'Unix Timestamp',
    description: 'Convert between Unix timestamps and dates',
    category: 'developer',
    icon: '⏰',
    tags: ['timestamp', 'unix', 'date'],
    component: lazy(() => import('@/pages/tools/TimestampConverterPage')),
  },
  {
    id: 'uuid-generator',
    name: 'UUID Generator',
    description: 'Generate random UUID v4 identifiers',
    category: 'developer',
    icon: '🆔',
    tags: ['uuid', 'id', 'random'],
    featured: true,
    component: lazy(() => import('@/pages/tools/UuidGeneratorPage')),
  },

  // ┌─────────────────────────────────────────────────────────────────────────┐
  // │ 📝 TEXT PROCESSING                                                      │
  // └─────────────────────────────────────────────────────────────────────────┘
  {
    id: 'lorem-generator',
    name: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text for your designs',
    category: 'text',
    icon: '📝',
    tags: ['lorem', 'placeholder', 'text'],
    component: lazy(() => import('@/pages/tools/LoremGeneratorPage')),
  },
  {
    id: 'text-case',
    name: 'Text Case Converter',
    description: 'Convert text between different cases',
    category: 'text',
    icon: 'Aa',
    tags: ['case', 'upper', 'lower', 'title'],
    component: lazy(() => import('@/pages/tools/TextCasePage')),
  },
  {
    id: 'text-counter',
    name: 'Word Counter',
    description: 'Count words, characters, sentences, and paragraphs',
    category: 'text',
    icon: '📊',
    tags: ['word', 'count', 'character'],
    component: lazy(() => import('@/pages/tools/WordCounterPage')),
  },

  // ┌─────────────────────────────────────────────────────────────────────────┐
  // │ 🧰 UTILITIES                                                            │
  // └─────────────────────────────────────────────────────────────────────────┘
  {
    id: 'number-base',
    name: 'Number Base Converter',
    description: 'Convert between binary, octal, decimal, and hex',
    category: 'utility',
    icon: '🔢',
    tags: ['number', 'binary', 'hex', 'convert'],
    component: lazy(() => import('@/pages/tools/NumberBasePage')),
  },
  {
    id: 'password-generator',
    name: 'Password Generator',
    description: 'Generate secure random passwords',
    category: 'utility',
    icon: '🔒',
    tags: ['password', 'secure', 'random'],
    component: lazy(() => import('@/pages/tools/PasswordGeneratorPage')),
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL: Sorted registry (diurutkan A-Z berdasarkan nama)
// ─────────────────────────────────────────────────────────────────────────────

const toolRegistry: ToolEntry[] = [...TOOLS_DATA].sort((a, b) =>
  a.name.localeCompare(b.name)
);

// ─────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/** Ambil semua tools */
export const getToolRegistry = (): ToolEntry[] => toolRegistry;

/** Cari tool berdasarkan ID */
export const getToolById = (id: string): ToolEntry | undefined =>
  toolRegistry.find((t) => t.id === id);

/** Filter tools berdasarkan kategori */
export const getToolsByCategory = (category: Category): ToolEntry[] =>
  toolRegistry.filter((t) => t.category === category);

/** Ambil tools yang featured */
export const getFeaturedTools = (): ToolEntry[] =>
  toolRegistry.filter((t) => t.featured);

/** Hitung jumlah tools per kategori */
export const getToolCountByCategory = (): Record<Category, number> => {
  const counts = {} as Record<Category, number>;
  for (const cat of Object.keys(CATEGORIES) as Category[]) {
    counts[cat] = toolRegistry.filter((t) => t.category === cat).length;
  }
  return counts;
};

/** Total jumlah tools */
export const getTotalToolCount = (): number => toolRegistry.length;

/** Search tools berdasarkan query (nama, deskripsi, atau tags) */
export const searchTools = (query: string): ToolEntry[] => {
  if (!query.trim()) return toolRegistry;

  const q = query.toLowerCase().trim();
  return toolRegistry.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.toLowerCase().includes(q))
  );
};

/** Ambil metadata tools saja (tanpa component) */
export const getToolsMeta = (): ToolMeta[] =>
  toolRegistry.map(({ component: _, ...meta }) => meta);

/** Ambil semua tags unik */
export const getAllTags = (): string[] => {
  const tagSet = new Set<string>();
  toolRegistry.forEach((t) => t.tags.forEach((tag) => tagSet.add(tag)));
  return Array.from(tagSet).sort();
};

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORIES EXPORT (untuk backward compatibility)
// ─────────────────────────────────────────────────────────────────────────────

export const categories = Object.entries(CATEGORIES).map(([id, data]) => ({
  id: id as Category,
  ...data,
}));

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export default toolRegistry;
