import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { queryClient } from '@/lib/queryClient';
import useAuthStore from '@/stores/authStore';

import DashboardLayout from '@/components/layout/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminRoute from '@/components/AdminRoute';

import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import Transactions from '@/pages/Transactions';
import Profile from '@/pages/Profile';
import Admin from '@/pages/Admin';

const RootRedirect = () => {
    const { user, isAuthenticated } = useAuthStore();
    
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (user?.role === 'admin') return <Navigate to="/admin" replace />;
    
    return <Navigate to="/dashboard" replace />;
};

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
                <TooltipProvider>
                    <BrowserRouter>
                        <Routes>
                            {/* Public routes */}
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />

                            {/* Protected routes */}
                            <Route
                                element={
                                    <ProtectedRoute>
                                        <DashboardLayout />
                                    </ProtectedRoute>
                                }
                            >
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/transactions" element={<Transactions />} />
                                <Route path="/profile" element={<Profile />} />
                                <Route
                                    path="/admin"
                                    element={
                                        <AdminRoute>
                                            <Admin />
                                        </AdminRoute>
                                    }
                                />
                            </Route>

                            {/* Default redirect */}
                            <Route path="/" element={<RootRedirect />} />
                            <Route path="*" element={<RootRedirect />} />
                        </Routes>
                    </BrowserRouter>

                    <Toaster
                        position="top-right"
                        richColors
                        closeButton
                        toastOptions={{
                            style: {
                                background: 'var(--color-card)',
                                border: '1px solid var(--color-border)',
                                color: 'var(--color-foreground)',
                            },
                        }}
                    />
                </TooltipProvider>
            </ThemeProvider>
        </QueryClientProvider>
    );
}

export default App;
