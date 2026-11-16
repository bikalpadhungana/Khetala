'use client';
import { useRef } from 'react';

export default function SpotlightCard({ children, className = '' }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--spotlight-x', `${x}px`);
    card.style.setProperty('--spotlight-y', `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`relative overflow-hidden ${className}`}
      style={{
        background: `radial-gradient(300px circle at var(--spotlight-x, -100px) var(--spotlight-y, -100px), rgba(232,93,38,0.06), transparent 70%), var(--card-bg, #FFFFFF)`,
      }}
    >
      {children}
    </div>
  );
}
