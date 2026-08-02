import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { LearningProvider } from './contexts/LearningContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LearningProvider>
      <App />
    </LearningProvider>
  </StrictMode>,
);
