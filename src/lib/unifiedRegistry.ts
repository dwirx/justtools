// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║                      UNIFIED REGISTRY SYSTEM                              ║
// ╠═══════════════════════════════════════════════════════════════════════════╣
// ║  Sistem registry terpadu untuk Tools, TSX Apps, dan HTML Apps.            ║
// ║  Auto-detect semua apps dan tools, tampilkan di satu tempat.              ║
// ║                                                                           ║
// ║  📌 CARA MENAMBAH:                                                        ║
// ║  • Tool    → src/pages/tools/NamaPage.tsx + daftar di toolRegistry.ts    ║
// ║  • TSX App → src/apps/NamaApp.tsx atau src/apps/nama-app/index.tsx       ║
// ║  • HTML    → public/justhtml/nama.html atau nama/index.html              ║
// ║                                                                           ║
// ║  Semuanya OTOMATIS muncul di homepage!                                    ║
// ╚═══════════════════════════════════════════════════════════════════════════╝

import { getToolsMeta, type ToolMeta, type Category as ToolCategory } from './toolRegistry';
import { 
  getAppRegistry, 
  getAppUrl, 
  type AppMeta, 
  type AppCategory 
} from './appRegistry';

// ─────────────────────────────────────────────────────────────────────────────
// UNIFIED TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type ItemType = 'tool' | 'tsx-app' | 'html-app';

export interface UnifiedItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  url: string;
  type: ItemType;
  category: string;
  tags: string[];
  featured: boolean;
  source: 'tool' | 'app';
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SECTIONS untuk Homepage
// ─────────────────────────────────────────────────────────────────────────────

export const SECTIONS = {
  tools: {
    id: 'tools',
    label: '🛠️ Developer Tools',
    description: 'Alat-alat untuk developer',
  },
  apps: {
    id: 'apps', 
    label: '📱 React Apps',
    description: 'Aplikasi React/TSX',
  },
  html: {
    id: 'html',
    label: '🌐 HTML Apps', 
    description: 'Aplikasi HTML statis',
  },
} as const;

export type SectionId = keyof typeof SECTIONS;

// ─────────────────────────────────────────────────────────────────────────────
// CONVERTER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/** Convert ToolMeta ke UnifiedItem */
const toolToUnified = (tool: ToolMeta): UnifiedItem => ({
  id: `tool-${tool.id}`,
  name: tool.name,
  description: tool.description,
  icon: tool.icon,
  url: `/${tool.id}`,
  type: 'tool',
  category: tool.category,
  tags: tool.tags,
  featured: tool.featured || false,
  source: 'tool',
});

/** Convert AppMeta ke UnifiedItem */
const appToUnified = (app: AppMeta): UnifiedItem => {
  // HTML apps use wrapper with Back & Home header
  const isHtml = app.type.startsWith('html');
  const appIdWithoutPrefix = app.id.replace('html-', '').replace('tsx-', '');
  
  return {
    id: app.id,
    name: app.name,
    description: app.description,
    icon: app.icon || '📱',
    // HTML apps → /html-app/:appId (with wrapper header)
    // TSX apps → /apps/:appId
    url: isHtml ? `/html-app/${appIdWithoutPrefix}` : getAppUrl(app),
    type: isHtml ? 'html-app' : 'tsx-app',
    category: app.category,
    tags: [app.category.toLowerCase(), app.type],
    featured: app.featured || false,
    source: 'app',
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// UNIFIED REGISTRY - Gabungkan semua
// ─────────────────────────────────────────────────────────────────────────────

let _unifiedRegistry: UnifiedItem[] | null = null;

const buildUnifiedRegistry = (): UnifiedItem[] => {
  if (_unifiedRegistry) return _unifiedRegistry;

  const tools = getToolsMeta().map(toolToUnified);
  const apps = getAppRegistry().map(appToUnified);

  _unifiedRegistry = [...tools, ...apps].sort((a, b) => 
    a.name.localeCompare(b.name)
  );

  return _unifiedRegistry;
};

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/** Ambil semua items */
export const getAllItems = (): UnifiedItem[] => buildUnifiedRegistry();

/** Ambil items berdasarkan section */
export const getItemsBySection = (section: SectionId): UnifiedItem[] => {
  const items = buildUnifiedRegistry();
  switch (section) {
    case 'tools':
      return items.filter(i => i.type === 'tool');
    case 'apps':
      return items.filter(i => i.type === 'tsx-app');
    case 'html':
      return items.filter(i => i.type === 'html-app');
    default:
      return items;
  }
};

/** Ambil semua tools */
export const getTools = (): UnifiedItem[] => 
  buildUnifiedRegistry().filter(i => i.type === 'tool');

/** Ambil semua TSX apps */  
export const getTsxApps = (): UnifiedItem[] =>
  buildUnifiedRegistry().filter(i => i.type === 'tsx-app');

/** Ambil semua HTML apps */
export const getHtmlApps = (): UnifiedItem[] =>
  buildUnifiedRegistry().filter(i => i.type === 'html-app');

/** Ambil featured items */
export const getFeaturedItems = (): UnifiedItem[] =>
  buildUnifiedRegistry().filter(i => i.featured);

/** Search di semua items */
export const searchAllItems = (query: string): UnifiedItem[] => {
  if (!query.trim()) return buildUnifiedRegistry();
  
  const q = query.toLowerCase().trim();
  return buildUnifiedRegistry().filter(item =>
    item.name.toLowerCase().includes(q) ||
    item.description.toLowerCase().includes(q) ||
    item.category.toLowerCase().includes(q) ||
    item.tags.some(tag => tag.toLowerCase().includes(q))
  );
};

/** Hitung statistik */
export const getStats = () => {
  const items = buildUnifiedRegistry();
  return {
    total: items.length,
    tools: items.filter(i => i.type === 'tool').length,
    tsxApps: items.filter(i => i.type === 'tsx-app').length,
    htmlApps: items.filter(i => i.type === 'html-app').length,
    featured: items.filter(i => i.featured).length,
  };
};

/** Get type badge info */
export const getTypeBadge = (type: ItemType): { label: string; color: string } => {
  switch (type) {
    case 'tool':
      return { label: 'Tool', color: 'bg-blue-500/10 text-blue-500' };
    case 'tsx-app':
      return { label: 'React', color: 'bg-cyan-500/10 text-cyan-500' };
    case 'html-app':
      return { label: 'HTML', color: 'bg-orange-500/10 text-orange-500' };
    default:
      return { label: 'App', color: 'bg-gray-500/10 text-gray-500' };
  }
};

export default buildUnifiedRegistry;
