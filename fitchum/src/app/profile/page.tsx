'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';

export default function Profile() {
    const { theme, setTheme } = useTheme();
    const { user, profile, updateProfile, signOut, loading: authLoading } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        profile_pic_url: '',
        theme_preference: (theme as 'light' | 'dark') || 'light',
        subscription_plan: 'free' as 'free' | 'pro'
    });

    const supabase = createClient();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (user && profile) {
            setFormData({
                username: profile.username || '',
                email: user.email || '',
                profile_pic_url: profile.profile_pic_url || '',
                theme_preference: profile.theme_preference || 'light',
                subscription_plan: profile.subscription_plan || 'free'
            });
        }
    }, [user, profile]);

    // Show loading state while auth is initializing
    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="text-neutral-dark/70 dark:text-neutral-light/70">Loading profile...</p>
                </div>
            </div>
        );
    }

    // Redirect if no user
    if (!user) {
        router.push('/auth/login');
        return null;
    }

    const handleThemeToggle = async () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);

        if (profile) {
            await updateProfile({ theme_preference: newTheme as 'light' | 'dark' });
        }
    };

    const handleProfilePicChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !user) return;

        setLoading(true);
        setError('');

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}/profile.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('profile-pictures')
                .upload(fileName, file, { upsert: true });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('profile-pictures')
                .getPublicUrl(fileName);

            setFormData(prev => ({ ...prev, profile_pic_url: publicUrl }));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            setError(`Fehler beim Upload des Profilbildes: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!profile) return;

        setSaving(true);
        setError('');
        setMessage('');

        try {
            const { error } = await updateProfile({
                username: formData.username,
                profile_pic_url: formData.profile_pic_url,
                theme_preference: formData.theme_preference
            });

            if (error) {
                setError('Fehler beim Speichern des Profils');
            } else {
                setMessage('Profil erfolgreich gespeichert!');
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (err) {
            setError('Ein unerwarteter Fehler ist aufgetreten');
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        try {
            await signOut();
            router.push('/auth/login');
        } catch (error) {
            console.error('Logout error:', error);
            setError('Fehler beim Abmelden');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!showDeleteConfirm) {
            setShowDeleteConfirm(true);
            return;
        }

        setDeleting(true);
        try {
            // Delete profile first
            if (profile) {
                await supabase
                    .from('profiles')
                    .delete()
                    .eq('user_id', user.id);
            }

            // Delete user account
            await supabase.auth.admin.deleteUser(user.id);

            router.push('/auth/login');
        } catch (error) {
            console.error('Delete account error:', error);
            setError('Fehler beim Löschen des Kontos');
            setShowDeleteConfirm(false);
        } finally {
            setDeleting(false);
        }
    };

    if (!mounted) {
        return null;
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-neutral-dark dark:text-neutral-light mb-2">
                    Profil
                </h1>
                <p className="text-neutral-dark/70 dark:text-neutral-light/70">
                    Verwalte deine persönlichen Einstellungen
                </p>
            </div>

            <Card>
                <div className="space-y-6">
                    {/* Profile Picture */}
                    <div className="text-center">
                        <div className="relative inline-block">
                            <div className="w-24 h-24 rounded-full overflow-hidden bg-neutral-dark/10 dark:bg-neutral-light/10">
                                {formData.profile_pic_url ? (
                                    <Image
                                        src={formData.profile_pic_url}
                                        alt="Profile"
                                        width={96}
                                        height={96}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-neutral-dark/50 dark:text-neutral-light/50">
                                        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleProfilePicChange}
                                    className="hidden"
                                    disabled={loading}
                                />
                            </label>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-dark dark:text-neutral-light mb-2">
                                Benutzername
                            </label>
                            <input
                                type="text"
                                value={formData.username}
                                onChange={(e) => handleInputChange('username', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border-2 border-neutral-dark/20 dark:border-neutral-light/20 bg-transparent text-neutral-dark dark:text-neutral-light focus:border-primary focus:outline-none transition-colors"
                                placeholder="Dein Benutzername"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-dark dark:text-neutral-light mb-2">
                                E-Mail
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                disabled
                                className="w-full px-4 py-3 rounded-xl border-2 border-neutral-dark/20 dark:border-neutral-light/20 bg-neutral-dark/5 dark:bg-neutral-light/5 text-neutral-dark/50 dark:text-neutral-light/50 cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-dark dark:text-neutral-light mb-2">
                                Abonnement
                            </label>
                            <div className="flex items-center gap-2">
                                <span className="px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium">
                                    {formData.subscription_plan === 'pro' ? 'Pro' : 'Free'}
                                </span>
                                {formData.subscription_plan === 'free' && (
                                    <Button
                                        onClick={() => router.push('/pricing')}
                                        variant="outline"
                                        size="sm"
                                    >
                                        Upgrade
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Theme Toggle */}
                    <div className="flex items-center justify-between p-4 bg-neutral-dark/5 dark:bg-neutral-light/5 rounded-xl">
                        <div>
                            <h3 className="font-medium text-neutral-dark dark:text-neutral-light">
                                Dark Mode
                            </h3>
                            <p className="text-sm text-neutral-dark/70 dark:text-neutral-light/70">
                                Wechsle zwischen hellem und dunklem Design
                            </p>
                        </div>
                        <button
                            onClick={handleThemeToggle}
                            className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            style={{
                                backgroundColor: theme === 'dark' ? '#4CAF50' : '#e5e7eb'
                            }}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                        </button>
                    </div>

                    {/* Messages */}
                    {message && (
                        <div className="p-4 rounded-xl bg-primary/10 text-primary text-sm text-center">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="p-4 rounded-xl bg-red-500/10 text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex-1"
                        >
                            {saving ? 'Speichern...' : 'Speichern'}
                        </Button>
                        <Button
                            onClick={handleLogout}
                            variant="outline"
                            disabled={loading}
                        >
                            {loading ? 'Abmelden...' : 'Abmelden'}
                        </Button>
                    </div>

                    {/* Delete Account */}
                    <div className="border-t border-neutral-dark/10 dark:border-neutral-light/10 pt-6">
                        <div className="text-center space-y-3">
                            <h3 className="text-lg font-medium text-neutral-dark dark:text-neutral-light">
                                Gefährliche Zone
                            </h3>
                            <p className="text-sm text-neutral-dark/70 dark:text-neutral-light/70">
                                Diese Aktion kann nicht rückgängig gemacht werden
                            </p>
                            <Button
                                onClick={handleDeleteAccount}
                                variant="outline"
                                className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                                disabled={deleting}
                            >
                                {showDeleteConfirm ? 'Konto wirklich löschen?' : 'Konto löschen'}
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}