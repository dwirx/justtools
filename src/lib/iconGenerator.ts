// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║                         RANDOM ICON GENERATOR                             ║
// ╠═══════════════════════════════════════════════════════════════════════════╣
// ║  Generate random icons yang menarik dan konsisten berdasarkan string.     ║
// ║  Icon yang sama untuk nama yang sama (deterministic random).              ║
// ╚═══════════════════════════════════════════════════════════════════════════╝

// ─────────────────────────────────────────────────────────────────────────────
// ICON COLLECTIONS
// ─────────────────────────────────────────────────────────────────────────────

/** Icons untuk apps/games */
export const APP_ICONS = [
  '🎮', '🕹️', '🎲', '🎯', '🏆', '⭐', '🌟', '✨', '💫', '🔥',
  '⚡', '💎', '🎪', '🎨', '🎭', '🎬', '🎤', '🎧', '🎵', '🎶',
  '🎹', '🎸', '🥁', '🎺', '🎻', '🪗', '🎰', '🎳', '🎱', '🏀',
  '⚽', '🏈', '🎾', '🏐', '🎿', '🛹', '🛼', '🏋️', '🤸', '🧘',
];

/** Icons untuk tools/utilities */
export const TOOL_ICONS = [
  '🔧', '🔨', '⚙️', '🛠️', '🔩', '⛏️', '🪛', '🪚', '📐', '📏',
  '✂️', '📎', '🖇️', '📌', '📍', '🗂️', '📁', '📂', '🗃️', '📋',
  '📝', '✏️', '🖊️', '🖋️', '✒️', '📑', '🏷️', '📊', '📈', '📉',
];

/** Icons untuk productivity */
export const PRODUCTIVITY_ICONS = [
  '📅', '📆', '🗓️', '📇', '🗒️', '🗓️', '⏰', '⏱️', '⏲️', '🕐',
  '📒', '📓', '📔', '📕', '📖', '📗', '📘', '📙', '📚', '📰',
  '✅', '☑️', '✔️', '❎', '🔲', '🔳', '▫️', '◻️', '◼️', '⬛',
];

/** Icons untuk education */
export const EDUCATION_ICONS = [
  '📚', '📖', '📝', '✏️', '🎓', '🏫', '📐', '🔬', '🔭', '🧪',
  '🧬', '🧲', '⚗️', '💡', '🔍', '🔎', '🌍', '🌎', '🌏', '🗺️',
  '🧮', '➕', '➖', '✖️', '➗', '💯', '🔢', '🔤', '🔡', '🔠',
];

/** Icons untuk entertainment */
export const ENTERTAINMENT_ICONS = [
  '🎬', '🎥', '📽️', '🎞️', '📺', '📻', '🎙️', '🎚️', '🎛️', '📱',
  '💻', '🖥️', '🖨️', '⌨️', '🖱️', '🕹️', '💾', '💿', '📀', '🔌',
  '🌈', '🎠', '🎡', '🎢', '🎪', '🎭', '🎨', '🖼️', '🎰', '🃏',
];

/** Icons umum/other */
export const OTHER_ICONS = [
  '🚀', '🛸', '🌙', '⭐', '🌟', '💫', '✨', '🔮', '🎁', '🎀',
  '🎈', '🎉', '🎊', '🎋', '🎍', '🎎', '🎏', '🎐', '🏮', '🪔',
  '💝', '💖', '💗', '💓', '💞', '💕', '❤️', '🧡', '💛', '💚',
  '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💌', '💤', '💢',
];

/** Semua icons digabung */
export const ALL_ICONS = [
  ...APP_ICONS,
  ...TOOL_ICONS,
  ...PRODUCTIVITY_ICONS,
  ...EDUCATION_ICONS,
  ...ENTERTAINMENT_ICONS,
  ...OTHER_ICONS,
];

// ─────────────────────────────────────────────────────────────────────────────
// HASH FUNCTION - untuk deterministic random
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Simple hash function untuk string
 * Menghasilkan angka yang konsisten untuk string yang sama
 */
const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

// ─────────────────────────────────────────────────────────────────────────────
// ICON GENERATOR FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate random icon berdasarkan nama (deterministic)
 * Nama yang sama akan selalu menghasilkan icon yang sama
 */
export const getRandomIcon = (name: string): string => {
  const hash = hashString(name);
  return ALL_ICONS[hash % ALL_ICONS.length];
};

/**
 * Generate icon berdasarkan kategori
 */
export const getIconByCategory = (name: string, category: string): string => {
  const hash = hashString(name);
  const lowerCat = category.toLowerCase();
  
  let iconSet = ALL_ICONS;
  
  if (lowerCat.includes('game') || lowerCat.includes('app')) {
    iconSet = APP_ICONS;
  } else if (lowerCat.includes('tool') || lowerCat.includes('util')) {
    iconSet = TOOL_ICONS;
  } else if (lowerCat.includes('prod')) {
    iconSet = PRODUCTIVITY_ICONS;
  } else if (lowerCat.includes('edu')) {
    iconSet = EDUCATION_ICONS;
  } else if (lowerCat.includes('entertain')) {
    iconSet = ENTERTAINMENT_ICONS;
  }
  
  return iconSet[hash % iconSet.length];
};

/**
 * Generate icon untuk app baru berdasarkan path file
 */
export const getIconForApp = (path: string, category?: string): string => {
  // Extract nama dari path
  const parts = path.split('/');
  const filename = parts[parts.length - 1]
    .replace('.tsx', '')
    .replace('.html', '')
    .replace('index', parts[parts.length - 2] || 'app');
  
  if (category) {
    return getIconByCategory(filename, category);
  }
  
  return getRandomIcon(filename);
};

/**
 * Generate gradient color berdasarkan nama (untuk backgrounds)
 */
export const getRandomGradient = (name: string): string => {
  const gradients = [
    'from-violet-500 via-purple-500 to-fuchsia-500',
    'from-blue-500 via-cyan-500 to-teal-500',
    'from-orange-500 via-red-500 to-pink-500',
    'from-green-500 via-emerald-500 to-teal-500',
    'from-indigo-500 via-purple-500 to-pink-500',
    'from-yellow-500 via-orange-500 to-red-500',
    'from-cyan-500 via-blue-500 to-indigo-500',
    'from-rose-500 via-pink-500 to-fuchsia-500',
    'from-lime-500 via-green-500 to-emerald-500',
    'from-amber-500 via-yellow-500 to-orange-500',
  ];
  
  const hash = hashString(name);
  return gradients[hash % gradients.length];
};

export default getRandomIcon;
