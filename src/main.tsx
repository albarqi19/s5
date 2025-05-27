import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './styles/animations.css';
import './styles/print.css';
import './styles/display.css';
import './styles/print-fix.css';

const container = document.getElementById('root');
if (!container) throw new Error('لم يتم العثور على عنصر الجذر');

const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);