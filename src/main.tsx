import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { installChunkReloadGuard } from './lib/chunkReload';
import './index.css';

installChunkReloadGuard();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
