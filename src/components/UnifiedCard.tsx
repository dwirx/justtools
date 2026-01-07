import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ArrowRight } from 'lucide-react';
import { UnifiedItem, getTypeBadge } from '@/lib/unifiedRegistry';

interface UnifiedCardProps {
  item: UnifiedItem;
  index: number;
}

export const UnifiedCard = ({ item, index }: UnifiedCardProps) => {
  const badge = getTypeBadge(item.type);

  const CardContent = () => (
    <>
      <div className="flex items-start justify-between mb-2 sm:mb-3">
        <span className="text-2xl sm:text-3xl">{item.icon}</span>
        <div className="flex items-center gap-1 sm:gap-2">
          {item.featured && (
            <span className="flex items-center gap-1 text-[10px] sm:text-xs text-primary">
              <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-primary" />
              <span className="hidden sm:inline">Featured</span>
            </span>
          )}
          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 group-hover:text-primary transition-colors line-clamp-1">
        {item.name}
      </h3>

      <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-2">
        {item.description}
      </p>

      <div className="flex items-center justify-between gap-2">
        <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${badge.color}`}>
          {badge.label}
        </span>
        <span className="text-[10px] sm:text-xs text-muted-foreground capitalize truncate">
          {item.category}
        </span>
      </div>
    </>
  );

  // Semua items sekarang menggunakan Link internal
  // HTML apps sudah punya wrapper dengan header Back & Home
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 + index * 0.02 }}
    >
      <Link
        to={item.url}
        className="tool-card group block h-full p-4 sm:p-5"
      >
        <CardContent />
      </Link>
    </motion.div>
  );
};
