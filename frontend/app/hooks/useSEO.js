'use client';

import { useEffect } from 'react';

/**
 * Custom hook to set document title and meta description dynamically
 * Note: In Next.js App Router, prefer using the exported `metadata` object
 * in page.jsx. Use this hook only when title needs to be set dynamically on the client
 * (e.g., based on state or context).
 * 
 * @param {string} title - The page title
 * @param {string} [description] - The meta description
 */
export function useSEO(title, description) {
  useEffect(() => {
    document.title = `${title} | Think Tank Freelancing Hub`;
    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'description';
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', description);
    }
  }, [title, description]);
}
