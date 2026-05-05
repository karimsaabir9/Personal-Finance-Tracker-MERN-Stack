import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';

// Get all transactions
export const useTransactions = () => {
    return useQuery({
        queryKey: ['transactions'],
        queryFn: async () => {
            const { data } = await apiClient.get('/transactions');
            return data;
        },
    });
};

// Get monthly summary
export const useMonthlySummary = () => {
    return useQuery({
        queryKey: ['monthly-summary'],
        queryFn: async () => {
            const { data } = await apiClient.get('/transactions/monthly-summary');
            return data;
        },
    });
};

// Get categories
export const useCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const { data } = await apiClient.get('/categories');
            return data;
        },
        staleTime: Infinity,
    });
};

// Add transaction
export const useAddTransaction = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newTransaction) => {
            const { data } = await apiClient.post('/transactions', newTransaction);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['monthly-summary'] });
        },
    });
};

// Update transaction
export const useUpdateTransaction = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...updates }) => {
            const { data } = await apiClient.put(`/transactions/${id}`, updates);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['monthly-summary'] });
        },
    });
};

// Delete transaction
export const useDeleteTransaction = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            const { data } = await apiClient.delete(`/transactions/${id}`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['monthly-summary'] });
        },
    });
};
