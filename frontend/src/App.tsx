import { Navigate, Route, Routes } from "react-router-dom";
import AuthPage from "@/pages/AuthPage";
import PendingApprovalPage from "@/pages/PendingApprovalPage";
import Dashboard from "@/pages/Dashboard";
import { AuthProvider, useAuth } from "@/lib/auth";

function AuthRoutes() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <main className="min-h-screen grid place-items-center">
        Loading account...
      </main>
    );
  }

  const isPending =
    user?.approval_status !== "approved" && !user?.is_super_admin;
  const authenticatedDestination = user
    ? isPending
      ? "/pending-approval"
      : user.is_super_admin
        ? "/admin"
        : "/dashboard"
    : "/";

  return (
    <Routes>
      <Route
        path="/"
        element={
          user ? (
            <Navigate to={authenticatedDestination} replace />
          ) : (
            <AuthPage />
          )
        }
      />
      <Route
        path="/login"
        element={<Navigate to={authenticatedDestination} replace />}
      />
      <Route
        path="/register"
        element={<Navigate to={authenticatedDestination} replace />}
      />
      <Route
        path="/pending-approval"
        element={
          user ? (
            isPending ? (
              <PendingApprovalPage />
            ) : (
              <Navigate to={authenticatedDestination} replace />
            )
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/dashboard"
        element={
          user && !isPending ? (
            <Dashboard />
          ) : (
            <Navigate to={authenticatedDestination} replace />
          )
        }
      />
      <Route
        path="/admin"
        element={
          user?.is_super_admin ? (
            <Dashboard />
          ) : (
            <Navigate to={authenticatedDestination} replace />
          )
        }
      />
      <Route
        path="*"
        element={<Navigate to={authenticatedDestination} replace />}
      />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AuthRoutes />
      <footer className="border-t border-gray-200 bg-white px-4 py-4 text-center text-sm text-gray-600">
        <span>Developed by Sathish</span>
        <span className="mx-2">·</span>
        <a className="hover:text-emerald-800" href="tel:+919790060943">
          +91 - 97900 60943
        </a>
        <span className="mx-2">·</span>
        <a className="hover:text-emerald-800" href="mailto:contact@satz.co.in">
          contact@satz.co.in
        </a>
      </footer>
    </AuthProvider>
  );
}
