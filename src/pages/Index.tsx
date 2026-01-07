import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Wrench, Atom, Globe } from 'lucide-react';
import { Header } from '@/components/Header';
import { UnifiedGrid } from '@/components/UnifiedGrid';
import {
  getAllItems,
  getTools,
  getTsxApps,
  getHtmlApps,
  getStats,
  searchAllItems,
  type SectionId,
  SECTIONS,
} from '@/lib/unifiedRegistry';

// ─────────────────────────────────────────────────────────────────────────────
// TABS CONFIG
// ─────────────────────────────────────────────────────────────────────────────

const TABS: { id: SectionId | 'all'; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'Semua', icon: <Globe className="w-4 h-4" /> },
  { id: 'tools', label: 'Tools', icon: <Wrench className="w-4 h-4" /> },
  { id: 'apps', label: 'React Apps', icon: <Atom className="w-4 h-4" /> },
  { id: 'html', label: 'HTML Apps', icon: <Globe className="w-4 h-4" /> },
];

// ─────────────────────────────────────────────────────────────────────────────
// HERO COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const Hero = () => {
  const stats = getStats();

  const statItems = [
    { value: stats.tools, label: 'Tools', icon: '🛠️' },
    { value: stats.tsxApps, label: 'React Apps', icon: '⚛️' },
    { value: stats.htmlApps, label: 'HTML Apps', icon: '🌐' },
    { value: stats.total, label: 'Total', icon: '📦' },
  ];

  return (
    <section className="relative py-6 sm:py-8 md:py-12 px-4 sm:px-6 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="hidden sm:block absolute top-0 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="hidden sm:block absolute bottom-0 right-1/4 w-64 md:w-96 h-64 md:h-96 bg-accent/20 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-2 sm:mb-3">
            <span className="gradient-text">All-in-One</span> Developer Hub
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-4 sm:mb-6 px-2">
            Tools, React Apps, dan HTML Apps — semua auto-detected dan siap pakai.
            <br />
            <span className="text-xs opacity-75">100% lokal, privasi terjamin.</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3"
        >
          {statItems.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="stat-card"
            >
              <span className="text-xl sm:text-2xl mb-1">{stat.icon}</span>
              <span className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">
                {stat.value}
              </span>
              <span className="text-xs sm:text-sm text-muted-foreground">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN INDEX PAGE
// ─────────────────────────────────────────────────────────────────────────────

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SectionId | 'all'>('all');

  const filteredItems = useMemo(() => {
    // Get items based on active tab
    let items = activeTab === 'all' ? getAllItems() :
                activeTab === 'tools' ? getTools() :
                activeTab === 'apps' ? getTsxApps() :
                getHtmlApps();

    // Apply search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(item =>
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }

    return items;
  }, [activeTab, searchQuery]);

  const stats = getStats();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />

      {/* Search & Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="px-4 sm:px-6 mb-6"
      >
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari tools, apps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input pl-10 sm:pl-12 text-sm sm:text-base py-2.5 sm:py-3"
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:justify-center scrollbar-hide">
            {TABS.map((tab) => {
              const count = tab.id === 'all' ? stats.total :
                           tab.id === 'tools' ? stats.tools :
                           tab.id === 'apps' ? stats.tsxApps :
                           stats.htmlApps;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`filter-button whitespace-nowrap text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 flex items-center gap-1.5 ${
                    activeTab === tab.id ? 'active' : ''
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  <span className="text-[10px] opacity-60">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Grid */}
      <UnifiedGrid
        items={filteredItems}
        emptyMessage="Tidak ada item yang cocok dengan pencarian."
      />

      {/* Footer */}
      <footer className="border-t border-border/50 py-6 sm:py-8 px-6">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          <p>Made with ❤️ — Semua berjalan lokal di browser. Tidak ada data yang dikirim ke server.</p>
          <p className="mt-2">
            Total: <span className="text-primary font-medium">{stats.total}</span> items
            ({stats.tools} tools, {stats.tsxApps} react apps, {stats.htmlApps} html apps)
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
