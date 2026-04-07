import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthLayout } from "../layouts/AuthLayout";
import { AdminProtectedRoute } from "./AdminProtectedRoute";
import { CustomerProtectedRoute } from "./CustomerProtectedRoute";
import ScrollToTop from "../../components/ScrollToTop";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { MarketingThemeProvider } from "../../components/theme/MarketingThemeProvider";
import { AdminThemeProvider } from "../../components/theme/AdminThemeProvider";
import { CustomerThemeProvider } from "../../components/theme/CustomerThemeProvider";

import Login from "../../pages/auth/Login";
import AdminLogin from "../../pages/auth/AdminLogin";
import Dashboard from "../../pages/dashboard/Dashboard";
import ResellerOnly from "../../pages/dashboard/ResellerOnly";
import Placeholder from "../../pages/dashboard/Placeholder";

import AdminPage from "../../pages/admin/AdminPage";
import AdminUsersPage from "../../pages/admin/AdminUsersPage";
import AdminRolesPage from "../../pages/admin/AdminRolesPage";
import AdminActivityPage from "../../pages/admin/AdminActivityPage";
import AdminSettingsPage from "../../pages/admin/AdminSettingsPage";

// Marketing (public)
import MarketingLayout from "../../pages/marketing/shared/MarketingLayout";
import HomePage from "../../pages/marketing/Home/HomePage";
import ContactPage from "../../pages/marketing/Contact/ContactPage";
import SolutionsPage from "../../pages/marketing/Solutions/SolutionsPage";
import CompanyPage from "../../pages/marketing/Company/CompanyPage";

// Roles (public marketing pages)
import EnterprisePage from "../../pages/marketing/Roles/Enterprise/EnterprisePage";
import DeveloperPage from "../../pages/marketing/Roles/Developer/DeveloperPage";
import ResellerPage from "../../pages/marketing/Roles/Reseller/ResellerPage";


export function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public marketing site (accessible always) */}
        <Route element={<MarketingThemeProvider />}>
          <Route element={<MarketingLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/solutions" element={<SolutionsPage />} />
            <Route path="/company" element={<CompanyPage />} />

            {/* Roles */}
            <Route path="/roles/enterprise" element={<EnterprisePage />} />
            <Route path="/roles/developer" element={<DeveloperPage />} />
            <Route path="/roles/reseller" element={<ResellerPage />} />
            
            {/* later */}
            {/* <Route path="/roles/reseller" element={<ResellerPage />} /> */}
          </Route>
        </Route>

        {/* Customer Auth */}
        <Route element={<CustomerThemeProvider />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
          </Route>
        </Route>

        {/* Admin Auth */}
        <Route element={<AdminThemeProvider />}>
          <Route element={<AuthLayout />}>
            <Route path="/admin/login" element={<AdminLogin />} />
          </Route>
        </Route>

        {/* Admin */}
        <Route element={<AdminThemeProvider />}>
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <DashboardLayout portal="admin" />
              </AdminProtectedRoute>
            }
          >
            <Route index element={<AdminPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="roles" element={<AdminRolesPage />} />
            <Route path="activity" element={<AdminActivityPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>
        </Route>

        {/* Protected app */}
        <Route element={<CustomerThemeProvider />}>
          <Route
            path="/app"
            element={
              <CustomerProtectedRoute>
                <DashboardLayout portal="customer" />
              </CustomerProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />

            <Route path="reseller" element={<ResellerOnly />} />
            <Route path="api-keys" element={<Placeholder />} />
            <Route path="sms" element={<Placeholder />} />
            <Route path="billing" element={<Placeholder />} />
            <Route path="reports" element={<Placeholder />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
