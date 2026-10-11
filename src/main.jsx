import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import App from './App.jsx';
import ClientErrorBoundary from './components/ClientErrorBoundary.jsx';
import './client.css';

axios.defaults.timeout = 30000;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClientErrorBoundary><App /></ClientErrorBoundary>
  </StrictMode>,
);
