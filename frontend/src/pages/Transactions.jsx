import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    ArrowUpRight,
    ArrowDownRight,
    Filter,
    Loader2,
} from 'lucide-react';
import { useTransactions, useDeleteTransaction } from '@/hooks/useTransactions';
import TransactionModal from '@/components/TransactionModal';
import { toast } from 'sonner';

const Transactions = () => {
    const { data: transactions = [], isLoading } = useTransactions();
    const deleteMutation = useDeleteTransaction();
    const [modalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [deleteDialog, setDeleteDialog] = useState(null);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const filtered = transactions.filter((t) => {
        const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
            t.category.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'all' || t.type === filter;
        return matchesSearch && matchesFilter;
    });

    const handleEdit = (transaction) => {
        setEditData(transaction);
        setModalOpen(true);
    };

    const handleDelete = async () => {
        if (!deleteDialog) return;
        try {
            await deleteMutation.mutateAsync(deleteDialog._id);
            toast.success('Transaction deleted');
            setDeleteDialog(null);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete');
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditData(null);
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-96 w-full rounded-xl" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">Transactions</h1>
                    <p className="text-muted-foreground">Manage your income and expenses</p>
                </div>
                <Button
                    onClick={() => setModalOpen(true)}
                    className="bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/25 transition-all hover:from-violet-600 hover:to-indigo-700"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Transaction
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search transactions..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <div className="flex gap-2">
                    {['all', 'income', 'expense'].map((f) => (
                        <Button
                            key={f}
                            variant={filter === f ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFilter(f)}
                            className={filter === f ? 'bg-gradient-to-r from-violet-500 to-indigo-600 text-white' : ''}
                        >
                            {f === 'all' && <Filter className="mr-1.5 h-3.5 w-3.5" />}
                            {f === 'income' && <ArrowUpRight className="mr-1.5 h-3.5 w-3.5" />}
                            {f === 'expense' && <ArrowDownRight className="mr-1.5 h-3.5 w-3.5" />}
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Transactions Table */}
            <Card className="border-border/50">
                <CardContent className="p-0">
                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <p className="text-sm text-muted-foreground">No transactions found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filtered.map((t) => (
                                        <TableRow key={t._id} className="group">
                                            <TableCell className="font-medium">{t.title}</TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="text-xs">
                                                    {t.category}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {new Date(t.date).toLocaleDateString()}
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
                                                t.amount >= 0
                                                    ? 'text-emerald-600 dark:text-emerald-400'
                                                    : 'text-rose-600 dark:text-rose-400'
                                            }`}>
                                                {t.amount >= 0 ? '+' : ''}{formatCurrency(t.amount)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 cursor-pointer"
                                                        onClick={() => handleEdit(t)}
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-destructive hover:text-destructive cursor-pointer"
                                                        onClick={() => setDeleteDialog(t)}
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Transaction Modal */}
            <TransactionModal
                open={modalOpen}
                onClose={handleCloseModal}
                editData={editData}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Delete Transaction</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete &quot;{deleteDialog?.title}&quot;? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex gap-3 pt-2">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setDeleteDialog(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            className="flex-1"
                            onClick={handleDelete}
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Transactions;
