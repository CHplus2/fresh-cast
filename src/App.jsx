import { lazy, Suspense } from 'react';
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import AuthProvider from './contexts/AuthProvider.jsx';
import UIProvider from './contexts/UIProvider.jsx';
import { useAuth } from './contexts/AuthContext.js';
import { useUI } from './contexts/UIContext.js';
import RequireAuth from './hoc/RequireAuth.jsx';
import GroceryLogin from './components/LoginModal/GroceryLogin.jsx';
import ModalDialog from './components/ModalDialog.jsx';
import PageLoading from './components/PageLoading.jsx';

const PredictiveDashboard = lazy(() => import('./features/predictive/PredictiveDashboard.jsx'));
const kitchenOrigin = new URL(import.meta.env.VITE_KITCHEN_ORIGIN || 'https://preorder-freshness.vercel.app').origin;
const handoffs = {
  '/admin/orders': 'Orders', '/admin/planner': 'Kitchen planner',
  '/admin/inventory': 'Kitchen inventory', '/recover': 'Account recovery',
};

function KitchenHandoff() {
  const { pathname } = useLocation();
  const label = handoffs[pathname];
  return <main id="page-content" className="client-message">
    <h1>{label || 'Page not found'}</h1>
    <p>{label ? 'This page belongs to the connected kitchen application. FreshCast reads its APIs; orders, inventory edits and accounts remain there.' : 'Choose a FreshCast page to continue.'}</p>
    {label && <p><a href={kitchenOrigin + pathname}>Open {label.toLowerCase()} in the kitchen application</a></p>}
    <p><Link to="/admin/ai/decisions">Return to the decision assistant</Link></p>
    {label && <p className="client-muted">You may need to sign in again on the kitchen website.</p>}
  </main>;
}

function ClientShell() {
  const location = useLocation();
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const { showLogin, setShowLogin, showSignup, setShowSignup, alert } = useUI();
  const local = !['live', 'demo'].includes(new URLSearchParams(location.search).get('source'));
  const tabs = [['decisions', 'Decision assistant'], ['forecast', local ? 'Confirmed preorders' : 'Demand forecast'], ['inventory', 'Inventory evidence']];
  return <>
    <a className="skip-link" href="#page-content">Skip to content</a>
    <header className="client-header">
      <Link className="client-brand" to="/admin/ai/decisions">FreshCast<span>KITCHEN DECISION ASSISTANT</span></Link>
      <div className="client-account">
        <a href={kitchenOrigin + '/menu'}>Connected kitchen</a>
        {isAuthenticated === false && <button onClick={() => setShowLogin(true)}>Sign in</button>}
        {isAuthenticated && <button onClick={logout}>Sign out</button>}
      </div>
    </header>
    <nav className="client-nav" aria-label="FreshCast navigation">
      {tabs.map(([view, label]) => <Link key={view} to={`/admin/ai/${view}${location.search}`}
        aria-current={location.pathname === `/admin/ai/${view}` ? 'page' : undefined}>{label}</Link>)}
    </nav>
    {alert.message && <div className={`client-alert ${alert.type}`} role={alert.type === 'error' ? 'alert' : 'status'}>{alert.message}</div>}
    {isAuthenticated && isAdmin === false && <div className="client-message" role="alert">Use a staff account from the connected kitchen to access FreshCast.</div>}
    <div id="page-content" tabIndex={-1}>
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route path="/" element={<Navigate to="/admin/ai/decisions" replace />} />
          {tabs.map(([view]) => <Route key={view} path={`/admin/ai/${view}`} element={
            <RequireAuth message="Admin access required"><PredictiveDashboard view={view} /></RequireAuth>
          } />)}
          <Route path="*" element={<KitchenHandoff />} />
        </Routes>
      </Suspense>
    </div>
    {showLogin && <GroceryLogin />}
    {showSignup && <ModalDialog label="Kitchen accounts" onDismiss={() => setShowSignup(false)}>
      <div className="modal-overlay"><div className="modal-content">
        <button className="close-btn" aria-label="Close account dialog" onClick={() => setShowSignup(false)}>×</button>
        <h2>Kitchen accounts</h2><p>FreshCast uses existing kitchen accounts. A kitchen administrator must grant staff access.</p>
        <p><a href={kitchenOrigin + '/menu'}>Open the connected kitchen</a></p>
      </div></div>
    </ModalDialog>}
  </>;
}

export default function App() {
  return <MotionConfig reducedMotion="user"><UIProvider><AuthProvider><BrowserRouter><ClientShell /></BrowserRouter></AuthProvider></UIProvider></MotionConfig>;
}
