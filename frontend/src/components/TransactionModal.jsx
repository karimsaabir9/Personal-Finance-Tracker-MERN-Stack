import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCategories, useAddTransaction, useUpdateTransaction } from '@/hooks/useTransactions';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const TransactionModal = ({ open, onClose, editData = null }) => {
    const [form, setForm] = useState({
        title: '',
        amount: '',
        type: 'expense',
        category: '',
        date: new Date().toISOString().split('T')[0],
    });

    const { data: categories = [] } = useCategories();
    const addMutation = useAddTransaction();
    const updateMutation = useUpdateTransaction();

    const isEditing = !!editData;
    const isPending = addMutation.isPending || updateMutation.isPending;

    useEffect(() => {
        if (editData) {
            setForm({
                title: editData.title || '',
                amount: Math.abs(editData.amount) || '',
                type: editData.type || 'expense',
                category: editData.category || '',
                date: editData.date ? new Date(editData.date).toISOString().split('T')[0] : '',
            });
        } else {
            setForm({
                title: '',
                amount: '',
                type: 'expense',
                category: '',
                date: new Date().toISOString().split('T')[0],
            });
        }
    }, [editData, open]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.title || !form.amount || !form.category) {
            toast.error('Please fill in all required fields');
            return;
        }

        const payload = {
            ...form,
            amount: Number(form.amount),
        };

        try {
            if (isEditing) {
                await updateMutation.mutateAsync({ id: editData._id, ...payload });
                toast.success('Transaction updated successfully');
            } else {
                await addMutation.mutateAsync(payload);
                toast.success('Transaction added successfully');
            }
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl">
                        {isEditing ? 'Edit Transaction' : 'Add Transaction'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            placeholder="e.g. Grocery shopping"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount ($)</Label>
                            <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                value={form.amount}
                                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Type</Label>
                            <Select
                                value={form.type}
                                onValueChange={(val) => setForm({ ...form, type: val })}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="income">💰 Income</SelectItem>
                                    <SelectItem value="expense">💸 Expense</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Category</Label>
                        <Select
                            value={form.category}
                            onValueChange={(val) => setForm({ ...form, category: val })}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat} value={cat}>
                                        {cat}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input
                            id="date"
                            type="date"
                            value={form.date}
                            onChange={(e) => setForm({ ...form, date: e.target.value })}
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="flex-1 bg-gradient-to-r from-violet-500 to-indigo-600 text-white hover:from-violet-600 hover:to-indigo-700"
                        >
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isEditing ? 'Update' : 'Add Transaction'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default TransactionModal;
