// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║                    CONTOH APP TSX - Auto-detected!                        ║
// ╠═══════════════════════════════════════════════════════════════════════════╣
// ║  File ini otomatis terdeteksi dan muncul di Homepage.                     ║
// ║  Header Back & Home OTOMATIS ditambahkan! Tidak perlu import manual.      ║
// ║                                                                           ║
// ║  📌 Cukup export default component saja!                                  ║
// ╚═══════════════════════════════════════════════════════════════════════════╝

import { motion } from 'framer-motion';

// Metadata opsional - jika tidak ada, akan auto-generate dari nama file
export const appMeta = {
  name: 'Hello World',
  description: 'Contoh app TSX yang auto-detected dengan header otomatis',
  category: 'Education' as const,
  icon: '👋',
  featured: true,
};

const HelloWorld = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', duration: 0.8 }}
        className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 text-center shadow-2xl border border-white/20"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-6xl md:text-8xl mb-6"
        >
          👋
        </motion.div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Hello World!
        </h1>
        
        <p className="text-white/80 text-lg md:text-xl mb-6">
          Ini adalah contoh app TSX yang auto-detected
        </p>
        
        <div className="bg-white/10 rounded-xl p-4 text-left space-y-2">
          <p className="text-white/60 text-sm font-mono">
            📁 src/apps/HelloWorld.tsx
          </p>
          <p className="text-white/80 text-sm">
            ✨ Buat file .tsx baru di folder ini, otomatis muncul di Homepage!
          </p>
          <p className="text-white/80 text-sm">
            🎯 Icon akan di-generate otomatis jika tidak ditentukan!
          </p>
          <p className="text-green-300 text-sm font-medium">
            ⬅️ Header Back & Home sudah OTOMATIS ditambahkan!
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default HelloWorld;
