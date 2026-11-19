import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/Login";
// import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import PlaceholderPage from "./pages/PlaceholderPage";
import AdminLayout from "./components/AdminLayout";
import BlogsPage from "./pages/BlogsPage";
import CategoriesPage from "./pages/CategoriesPage";
import CommentsPage from "./pages/CommentsPage";
import UsersPage from "./pages/UsersPage";

function NotFound() {
  return <div className="grid min-h-screen place-items-center text-slate-600">Page not found.</div>;
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
  {/* //  <Route path="/forgot-password" element={<ForgotPasswordPage />} /> */}

        {/* Pages that share the sidebar layout */}
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/blogs" element={<BlogsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/comments" element={<CommentsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  );
}