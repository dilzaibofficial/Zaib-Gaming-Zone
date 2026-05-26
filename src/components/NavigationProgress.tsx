'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function NavigationProgress() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);
  const timerRef = useRef<NodeJS.Timeout[]>([]);

  const clearTimers = () => {
    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];
  };

  useEffect(() => {
    clearTimers();
    setVisible(true);
    setWidth(20);

    const t1 = setTimeout(() => setWidth(60), 80);
    const t2 = setTimeout(() => setWidth(85), 250);
    const t3 = setTimeout(() => setWidth(100), 500);
    const t4 = setTimeout(() => {
      setVisible(false);
      setWidth(0);
    }, 750);

    timerRef.current = [t1, t2, t3, t4];
    return clearTimers;
  }, [pathname]);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none"
      style={{ height: '2px' }}
    >
      <div
        style={{
          height: '100%',
          width: `${width}%`,
          opacity: visible ? 1 : 0,
          background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #00ff88)',
          transition: width === 100 ? 'width 0.15s ease-out, opacity 0.2s ease 0.15s' : 'width 0.3s ease-out',
          boxShadow: '0 0 8px rgba(99,102,241,0.8)',
        }}
      />
    </div>
  );
}
