import { useState } from 'react';
import { motion } from 'framer-motion';
import CounterDisplay from './components/CounterDisplay';
import CounterControls from './components/CounterControls';
import CounterHistory from './components/CounterHistory';

export const appMeta = {
  name: 'Counter App',
  description: 'A simple counter with history tracking - demonstrates TSX project folder structure',
  category: 'Tools' as const,
  icon: '🔢',
  featured: true,
};

export default function CounterApp() {
  const [count, setCount] = useState(0);
  const [history, setHistory] = useState<{ value: number; action: string; time: Date }[]>([]);

  const handleIncrement = () => {
    setCount(prev => prev + 1);
    setHistory(prev => [...prev, { value: count + 1, action: 'increment', time: new Date() }]);
  };

  const handleDecrement = () => {
    setCount(prev => prev - 1);
    setHistory(prev => [...prev, { value: count - 1, action: 'decrement', time: new Date() }]);
  };

  const handleReset = () => {
    setCount(0);
    setHistory(prev => [...prev, { value: 0, action: 'reset', time: new Date() }]);
  };

  // Header Back & Home sudah OTOMATIS ditambahkan oleh wrapper!
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-card rounded-2xl shadow-xl border p-6 md:p-8 space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground">Counter App</h1>
            <p className="text-muted-foreground mt-2">TSX Project with Multiple Components</p>
          </div>

          <CounterDisplay count={count} />
          
          <CounterControls
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            onReset={handleReset}
          />

          <CounterHistory history={history} />
        </div>
      </motion.div>
    </div>
  );
}
