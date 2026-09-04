import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/ui/Toast';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { PurchaseProvider } from './context/PurchaseContext';
import { AppShell } from './components/layout/AppShell';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { ScrollToTopButton } from './components/layout/ScrollToTopButton';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { DesignSystemReviewPage } from './pages/DesignSystemReviewPage';
import { PurchasesPage } from './pages/PurchasesPage';
import { AddPurchasePage } from './pages/AddPurchasePage';
import { PurchaseDetailsPage } from './pages/PurchaseDetailsPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { ReturnsPage } from './pages/ReturnsPage';
import { RefundsPage } from './pages/RefundsPage';
import { WarrantiesPage } from './pages/WarrantiesPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';

export function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <PurchaseProvider>
            <BrowserRouter>
              <ScrollToTop />
              <ScrollToTopButton />
              <Routes>
              {/* 1. Public Marketing / SaaS Landing Page */}
              <Route path="/" element={<LandingPage />} />

              {/* 2. Authentication Pages */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              {/* 3. Company, Legal & Support Pages */}
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />

              {/* 4. Authenticated SaaS App Shell */}
              <Route path="/app" element={<AppShell />}>
                <Route index element={<Navigate to="/app/dashboard" replace />} />
                
                {/* Real SaaS Dashboard */}
                <Route path="dashboard" element={<DashboardPage />} />
                
                {/* Design System Reference */}
                <Route path="design-system" element={<DesignSystemReviewPage />} />
                
                {/* Post-Purchase Sub-Pages */}
                <Route path="purchases" element={<PurchasesPage />} />
                <Route path="purchases/new" element={<AddPurchasePage />} />
                <Route path="purchases/:id" element={<PurchaseDetailsPage />} />
                
                <Route path="returns" element={<ReturnsPage />} />
                <Route path="refunds" element={<RefundsPage />} />
                <Route path="warranties" element={<WarrantiesPage />} />
                <Route path="documents" element={<DocumentsPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              {/* 5. Fallback Redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </PurchaseProvider>
      </AuthProvider>
    </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
