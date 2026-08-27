import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { initSmoothScroll } from './lib/smooth-scroll';
import './index.css';

// Lenis jednou globálně pro celou stránku (uvnitř se sám vypne
// při prefers-reduced-motion).
void initSmoothScroll();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
