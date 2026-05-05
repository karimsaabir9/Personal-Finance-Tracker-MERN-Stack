import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    TrendingUp,
    TrendingDown,
    Wallet,
    Plus,
    ArrowUpRight,
    ArrowDownRight,
} from 'lucide-react';
import { useMonthlySummary } from '@/hooks/useTransactions';
import TransactionModal from '@/components/TransactionModal';

const Dashboard = () => {
    const { data: summary, isLoading } = useMonthlySummary();
    const [modalOpen, setModalOpen] = useState(false);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const summaryCards = [
        {
            title: 'Total Income',
            value: summary?.totalIncome || 0,
            icon: TrendingUp,
            gradient: 'from-emerald-500 to-green-600',
            shadowColor: 'shadow-emerald-500/20',
            bgGlow: 'bg-emerald-400/10',
            textColor: 'text-emerald-600 dark:text-emerald-400',
        },
        {
            title: 'Total Expenses',
            value: summary?.totalExpense || 0,
            icon: TrendingDown,
            gradient: 'from-rose-500 to-red-600',
            shadowColor: 'shadow-rose-500/20',
            bgGlow: 'bg-rose-400/10',
            textColor: 'text-rose-600 dark:text-rose-400',
        },
        {
            title: 'Net Balance',
            value: summary?.totalBalance || 0,
            icon: Wallet,
            gradient: 'from-violet-500 to-indigo-600',
            shadowColor: 'shadow-violet-500/20',
            bgGlow: 'bg-violet-400/10',
            textColor: 'text-violet-600 dark:text-violet-400',
        },
    ];

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-40" />
                    <Skeleton className="h-10 w-36" />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-36 rounded-xl" />
                    ))}
                </div>
                <Skeleton className="h-96 rounded-xl" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">Dashboard</h1>
                    <p className="text-muted-foreground">Your financial overview at a glance</p>
                </div>
                <Button
                    onClick={() => setModalOpen(true)}
                    className="bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/25 transition-all hover:from-violet-600 hover:to-indigo-700 hover:shadow-violet-500/40"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Transaction
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                {summaryCards.map((card) => (
                    <Card
                        key={card.title}
                        className="group relative overflow-hidden border-border/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                    >
                        <div className={`absolute inset-0 ${card.bgGlow} opacity-0 transition-opacity group-hover:opacity-100`} />
                        <CardContent className="relative p-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        {card.title}
                                    </p>
                                    <p className={`text-2xl font-bold tracking-tight lg:text-3xl ${card.textColor}`}>
                                        {formatCurrency(card.value)}
                                    </p>
                                </div>
                                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${card.gradient} shadow-lg ${card.shadowColor}`}>
                                    <card.icon className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Transactions */}
            <Card className="border-border/50">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Recent Transactions</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                        {summary?.transactions?.length || 0} total
                    </Badge>
                </CardHeader>
                <CardContent>
                    {(!summary?.transactions || summary.transactions.length === 0) ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                                <Wallet className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <p className="mt-4 text-sm font-medium text-muted-foreground">
                                No transactions yet
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Add your first transaction to get started
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {summary.transactions.slice(0, 8).map((t) => (
                                <div
                                    key={t._id}
                                    className="flex items-center justify-between rounded-lg border border-border/50 p-3 transition-colors hover:bg-accent/50"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                                            t.type === 'income'
                                                ? 'bg-emerald-100 dark:bg-emerald-900/30'
                                                : 'bg-rose-100 dark:bg-rose-900/30'
                                        }`}>
                                            {t.type === 'income' ? (
                                                <ArrowUpRight className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                            ) : (
                                                <ArrowDownRight className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{t.title}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {t.category} • {new Date(t.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`text-sm font-semibold ${
                                        t.amount >= 0
                                            ? 'text-emerald-600 dark:text-emerald-400'
                                            : 'text-rose-600 dark:text-rose-400'
                                    }`}>
                                        {t.amount >= 0 ? '+' : ''}{formatCurrency(t.amount)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <TransactionModal open={modalOpen} onClose={() => setModalOpen(false)} />
        </div>
    );
};

export default Dashboard;
