import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    ArrowLeftRight,
    User,
    ShieldCheck,
    LogOut,
    X,
    Wallet,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { queryClient } from '@/lib/queryClient';
import useAuthStore from '@/stores/authStore';

const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
    { to: '/profile', icon: User, label: 'Profile' },
];

const adminItems = [
    { to: '/admin', icon: ShieldCheck, label: 'Admin Panel' },
];

const Sidebar = ({ isOpen, onClose }) => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        queryClient.clear(); // Clear all cached data for the previous user
        navigate('/login');
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-card transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Logo */}
                <div className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25">
                            <Wallet className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold tracking-tight">FinTracker</h1>
                            <p className="text-xs text-muted-foreground">Finance Manager</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={onClose}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <Separator />

                {/* Navigation */}
                <nav className="flex-1 space-y-1 p-4">
                    <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {user?.role === 'admin' ? 'Admin Menu' : 'Menu'}
                    </p>

                    {/* Regular User Menu */}
                    {user?.role !== 'admin' && navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={onClose}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                                    isActive
                                        ? 'bg-gradient-to-r from-violet-500/10 to-indigo-500/10 text-violet-600 dark:text-violet-400 shadow-sm'
                                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                                }`
                            }
                        >
                            <item.icon className="h-5 w-5" />
                            {item.label}
                        </NavLink>
                    ))}

                    {/* Admin Menu */}
                    {user?.role === 'admin' && (
                        <>
                            {adminItems.map((item) => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    onClick={onClose}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                                            isActive
                                                ? 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400 shadow-sm'
                                                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                                        }`
                                    }
                                >
                                    <item.icon className="h-5 w-5" />
                                    {item.label}
                                </NavLink>
                            ))}
                            
                            {/* Profile is shared for admin but styled consistently */}
                            <NavLink
                                to="/profile"
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                                        isActive
                                            ? 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400 shadow-sm'
                                            : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                                    }`
                                }
                            >
                                <User className="h-5 w-5" />
                                Profile
                            </NavLink>
                        </>
                    )}
                </nav>

                {/* User section */}
                <div className="border-t border-border p-4">
                    <div className="flex items-center gap-3 rounded-lg p-2">
                        <Avatar className="h-9 w-9 ring-2 ring-violet-500/20">
                            <AvatarImage src={user?.profilePic} alt={user?.name} />
                            <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-600 text-xs font-bold text-white">
                                {getInitials(user?.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 overflow-hidden">
                            <p className="truncate text-sm font-semibold">{user?.name || 'User'}</p>
                            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleLogout}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive cursor-pointer"
                        >
                            <LogOut className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
