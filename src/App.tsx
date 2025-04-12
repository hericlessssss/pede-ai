import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider, RequireAuth } from './lib/auth';
import { Navigation } from './components/Navigation';
import Menu from './pages/Menu';
import Admin from './pages/Admin';
import Kitchen from './pages/Kitchen';
import Delivery from './pages/Delivery';
import Login from './pages/Login';

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<Menu />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <RequireAuth>
                <Admin />
              </RequireAuth>
            }
          />
          <Route
            path="/kitchen"
            element={
              <RequireAuth>
                <Kitchen />
              </RequireAuth>
            }
          />
          <Route
            path="/delivery"
            element={
              <RequireAuth>
                <Delivery />
              </RequireAuth>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
  );
}