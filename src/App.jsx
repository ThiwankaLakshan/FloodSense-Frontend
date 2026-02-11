import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Public Pages
import Home from './pages/public/Home';
import Map from './pages/public/Map';
import LocationRisk from './pages/public/LocationRisk';
import AlertsPage from './pages/public/Alerts';
import History from './pages/public/History';

// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Locations from './pages/admin/Locations';
import Alerts from './pages/admin/Alerts';
import WeatherManager from './pages/admin/WeatherManager';
import RiskManager from './pages/admin/RiskManager';
import Subscriptions from './pages/admin/Subscriptions';
import Logs from './pages/admin/Logs';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import AdminRoute from './components/common/AdminRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="map" element={<Map />} />
          <Route path="risk" element={<LocationRisk />} />
          <Route path="alerts" element={<AlertsPage />} />
          <Route path="history" element={<History />} />
        </Route>

        {/* Admin Login */}
        <Route path="/admin/login" element={<Login />} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="locations" element={<Locations />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route path="logs" element={<Logs />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
