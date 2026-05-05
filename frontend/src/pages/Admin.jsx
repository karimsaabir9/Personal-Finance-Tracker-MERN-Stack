import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Users,
    TrendingDown,
    ArrowUpRight,
    ArrowDownRight,
    Trophy,
    Activity,
} from 'lucide-react';
import { useState } from 'react';
import apiClient from '@/lib/apiClient';
import UsersModal from '@/components/UsersModal';

const Admin = () => {
    const [isUsersModalOpen, setIsUsersModalOpen] = useState(false);

    const { data, isLoading } = useQuery({
        queryKey: ['admin-overview'],
        queryFn: async () => {
            const { data } = await apiClient.get('/admin/overview');
            return data.data;
        },
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-8 w-48" />
                <div className="grid gap-4 md:grid-cols-2">
                    <Skeleton className="h-36 rounded-xl" />
                    <Skeleton className="h-36 rounded-xl" />
                </div>
                <Skeleton className="h-64 rounded-xl" />
                <Skeleton className="h-96 rounded-xl" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">Admin Panel</h1>
                <p className="text-muted-foreground">Platform overview and management</p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-1 mb-6">
                <Card 
                    className="group relative overflow-hidden border-border/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
                    onClick={() => setIsUsersModalOpen(true)}
                >
                    <div className="absolute inset-0 bg-blue-400/10 opacity-0 transition-opacity group-hover:opacity-100" />
                    <CardContent className="relative p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Users (Click to Manage)</p>
                                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                    {data?.totalUsers || 0}
                                </p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg shadow-blue-500/20">
                                <Users className="h-6 w-6 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Top Categories Grid */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Top Spending Categories */}
                <Card className="border-border/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Trophy className="h-5 w-5 text-amber-500" />
                            Top Spending Categories
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {(!data?.topSpendingCategories || data.topSpendingCategories.length === 0) ? (
                            <p className="py-8 text-center text-sm text-muted-foreground">No spending data yet</p>
                        ) : (
                            <div className="space-y-3">
                                {data.topSpendingCategories.map((cat, i) => {
                                    const maxAmount = data.topSpendingCategories[0]?.totalSpent || 1;
                                    const percentage = (cat.totalSpent / maxAmount) * 100;
                                    const colors = [
                                        'from-rose-500 to-pink-500',
                                        'from-orange-500 to-amber-500',
                                        'from-violet-500 to-indigo-500',
                                        'from-blue-500 to-cyan-500',
                                        'from-slate-500 to-gray-500',
                                    ];
                                    return (
                                        <div key={cat._id} className="space-y-1.5">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="font-medium">{cat._id}</span>
                                                <span className="font-semibold text-muted-foreground">
                                                    {formatCurrency(cat.totalSpent)}
                                                </span>
                                            </div>
                                            <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                                                <div
                                                    className={`h-full rounded-full bg-gradient-to-r ${colors[i % colors.length]} transition-all duration-700`}
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Top Income Categories */}
                <Card className="border-border/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Trophy className="h-5 w-5 text-emerald-500" />
                            Top Income Categories
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {(!data?.topIncomeCategories || data.topIncomeCategories.length === 0) ? (
                            <p className="py-8 text-center text-sm text-muted-foreground">No income data yet</p>
                        ) : (
                            <div className="space-y-3">
                                {data.topIncomeCategories.map((cat, i) => {
                                    const maxAmount = data.topIncomeCategories[0]?.totalEarned || 1;
                                    const percentage = (cat.totalEarned / maxAmount) * 100;
                                    const colors = [
                                        'from-emerald-500 to-green-500',
                                        'from-teal-500 to-emerald-500',
                                        'from-cyan-500 to-blue-500',
                                        'from-indigo-500 to-violet-500',
                                        'from-slate-500 to-gray-500',
                                    ];
                                    return (
                                        <div key={cat._id} className="space-y-1.5">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="font-medium">{cat._id}</span>
                                                <span className="font-semibold text-muted-foreground">
                                                    {formatCurrency(cat.totalEarned)}
                                                </span>
                                            </div>
                                            <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                                                <div
                                                    className={`h-full rounded-full bg-gradient-to-r ${colors[i % colors.length]} transition-all duration-700`}
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Recent Transactions (All Users) */}
            <Card className="border-border/50">
                <CardHeader>
                    <CardTitle className="text-lg">Recent Transactions (All Users)</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {(!data?.recentTransactions || data.recentTransactions.length === 0) ? (
                        <p className="py-8 text-center text-sm text-muted-foreground">No transactions yet</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.recentTransactions.map((t) => (
                                        <TableRow key={t._id}>
                                            <TableCell>
                                                <div>
                                                    <p className="text-sm font-medium">{t.user?.name || 'Unknown'}</p>
                                                    <p className="text-xs text-muted-foreground">{t.user?.email}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium">{t.title}</TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="text-xs">{t.category}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={`text-xs ${
                                                        t.type === 'income'
                                                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                            : 'bg-rose-100 text-rose-700 hover:bg-rose-100 dark:bg-rose-900/30 dark:text-rose-400'
                                                    }`}
                                                >
                                                    {t.type === 'income' ? (
                                                        <ArrowUpRight className="mr-1 h-3 w-3" />
                                                    ) : (
                                                        <ArrowDownRight className="mr-1 h-3 w-3" />
                                                    )}
                                                    {t.type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className={`text-right font-semibold ${
                                                t.type === 'income'
                                                    ? 'text-emerald-600 dark:text-emerald-400'
                                                    : 'text-rose-600 dark:text-rose-400'
                                            }`}>
                                                {formatCurrency(t.amount)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            <UsersModal 
                open={isUsersModalOpen} 
                onClose={() => setIsUsersModalOpen(false)} 
            />
        </div>
    );
};

export default Admin;
