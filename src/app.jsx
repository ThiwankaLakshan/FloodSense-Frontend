import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';
import Login from './components/auth/Login';
import Dashboard from "./components/dashboard/Dashboard";
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import './app.css'; 

const Layout = ({ children }) => {
    return (
        <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
    );
};

function App() {
    return (
        <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              iconTheme: {
                primary: '#22C55E',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#DC2626',
                secondary: '#fff',
              },
            },
          }}
        />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/monitoring"
            element={
              <PrivateRoute>
                <Layout>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-900">Data Monitoring</h1>
                    <p className="text-gray-600 mt-2">Monitor real-time weather and location data</p>
                    <div className="mt-8 bg-white rounded-lg border border-gray-200 p-8 text-center">
                      <p className="text-gray-500">Select a location from the dashboard to view details</p>
                    </div>
                  </div>
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/monitoring/:id"
            element={
              <PrivateRoute>
                <Layout>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-900">Location Details</h1>
                    <p className="text-gray-600 mt-2">Detailed monitoring information</p>
                    <div className="mt-8 bg-white rounded-lg border border-gray-200 p-8 text-center">
                      <p className="text-gray-500">Location detail view coming soon</p>
                    </div>
                  </div>
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/alerts"
            element={
              <PrivateRoute>
                <Layout>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-900">Alert Management</h1>
                    <p className="text-gray-600 mt-2">Configure and view flood alerts</p>
                    <div className="mt-8 bg-white rounded-lg border border-gray-200 p-8 text-center">
                      <p className="text-gray-500">Alert management features coming soon</p>
                    </div>
                  </div>
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/risk"
            element={
              <PrivateRoute>
                <Layout>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-900">Risk Assessment</h1>
                    <p className="text-gray-600 mt-2">Analyze flood risk factors</p>
                    <div className="mt-8 bg-white rounded-lg border border-gray-200 p-8 text-center">
                      <p className="text-gray-500">Risk assessment tools coming soon</p>
                    </div>
                  </div>
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/logs"
            element={
              <PrivateRoute>
                <Layout>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-900">System Logs</h1>
                    <p className="text-gray-600 mt-2">View system activity and history</p>
                    <div className="mt-8 bg-white rounded-lg border border-gray-200 p-8 text-center">
                      <p className="text-gray-500">System logs view coming soon</p>
                    </div>
                  </div>
                </Layout>
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    );
}

export default App;