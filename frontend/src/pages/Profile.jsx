import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Loader2, User, Mail, Lock, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import apiClient from '@/lib/apiClient';
import useAuthStore from '@/stores/authStore';
import { useMonthlySummary } from '@/hooks/useTransactions';

const Profile = () => {
    const { user, setUser } = useAuthStore();
    const { data: summary } = useMonthlySummary();
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
    });

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const handleUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        try {
            const { data } = await apiClient.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setUser({ ...user, profilePic: data.fileUrl });
            toast.success('Profile picture updated!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const updates = {};
        if (form.name && form.name !== user?.name) updates.name = form.name;
        if (form.email && form.email !== user?.email) updates.email = form.email;
        if (form.password) updates.password = form.password;

        if (Object.keys(updates).length === 0) {
            toast.info('No changes to save');
            return;
        }

        setSaving(true);
        try {
            const { data } = await apiClient.put(`/users/${user.id}`, updates);
            setUser({
                ...user,
                name: data.name || user.name,
                email: data.email || user.email,
            });
            setForm({ ...form, password: '' });
            toast.success('Profile updated!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed');
        } finally {
            setSaving(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount || 0);
    };

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">Profile</h1>
                <p className="text-muted-foreground">Manage your account settings</p>
            </div>

            {/* Profile Card */}
            <Card className="border-border/50 overflow-hidden">
                {/* Banner */}
                <div className="h-32 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-600" />

                <CardContent className="-mt-16 space-y-6 p-6">
                    {/* Avatar */}
                    <div className="flex items-end gap-4">
                        <div className="relative">
                            <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                                <AvatarImage src={user?.profilePic} alt={user?.name} />
                                <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-600 text-2xl font-bold text-white">
                                    {getInitials(user?.name)}
                                </AvatarFallback>
                            </Avatar>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-violet-600 text-white shadow-lg transition-transform hover:scale-110"
                            >
                                {uploading ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                    <Camera className="h-3.5 w-3.5" />
                                )}
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleUpload}
                                className="hidden"
                            />
                        </div>
                        <div className="pb-1">
                            <h2 className="text-xl font-bold">{user?.name}</h2>
                            <p className="text-sm text-muted-foreground">{user?.email}</p>
                        </div>
                    </div>

                    {/* Balance Card */}
                    {user?.role !== 'admin' && (
                        <div className="rounded-xl bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-indigo-500/10 p-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg">
                                    <Wallet className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">Current Balance</p>
                                    <p className="text-xl font-bold text-violet-600 dark:text-violet-400">
                                        {formatCurrency(summary?.totalBalance)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <Separator />

                    {/* Edit Form */}
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="flex items-center gap-2">
                                <User className="h-3.5 w-3.5" />
                                Full Name
                            </Label>
                            <Input
                                id="name"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="h-11"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="flex items-center gap-2">
                                <Mail className="h-3.5 w-3.5" />
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="h-11"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="flex items-center gap-2">
                                <Lock className="h-3.5 w-3.5" />
                                New Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Leave empty to keep current"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                className="h-11"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={saving}
                            className="w-full bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/25 transition-all hover:from-violet-600 hover:to-indigo-700"
                        >
                            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Profile;
