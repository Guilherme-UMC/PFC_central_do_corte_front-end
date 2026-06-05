import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';

import './styles/components/navbar.css';
import './styles/components/footer.css';

import './styles/components/status-badge.css';
import './styles/components/loader.css';
import './styles/components/password-input.css';
import './styles/pages/auth.css'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);