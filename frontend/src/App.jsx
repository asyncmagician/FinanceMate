import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './components/Dashboard';
import MonthView from './components/months/MonthView';
import Forecast from './components/Forecast';
import RecurringView from './components/recurring/RecurringView';
import ProfileView from './components/profile/ProfileView';
import { AdministrationView } from './components/admin';
import PrivacyPolicy from './components/legal/PrivacyPolicy';
import TermsOfService from './components/legal/TermsOfService';
import CookieBanner from './components/legal/CookieBanner';
import NotFound from './components/NotFound';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-obsidian-bg">
        <div className="text-obsidian-text-muted">Loading...</div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-obsidian-bg">
        <div className="text-obsidian-text-muted">Loading...</div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <MainLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="month/:year/:month" element={<MonthView />} />
            <Route path="forecast" element={<Forecast />} />
            <Route path="recurring" element={<RecurringView />} />
            <Route path="profile" element={<ProfileView />} />
            <Route 
              path="admin" 
              element={
                <AdminRoute>
                  <AdministrationView />
                </AdminRoute>
              } 
            />
          </Route>
          <Route path="*" element={<NotFound />} />
          </Routes>
          <CookieBanner />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;