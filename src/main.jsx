import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import AdminDashboard from './AdminDashboard'

// Check multiple ways to detect admin route
const pathname = window.location.pathname;
const hash = window.location.hash;
const globalFlag = window.__PRETTY_PETALS_ADMIN__;

const isAdmin = globalFlag || 
                pathname.startsWith('/admin') || 
                hash === '#admin' || 
                hash.startsWith('#admin');

console.log('Routing - pathname:', pathname, 'hash:', hash, 'globalFlag:', globalFlag, 'isAdmin:', isAdmin);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isAdmin ? <AdminDashboard /> : <App />}
  </React.StrictMode>
)
