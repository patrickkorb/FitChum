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
                theme_preference: formData.theme_preference as 'light' | 'dark',
                subscription_plan: formData.subscription_plan as 'free' | 'pro'
            });

            if (error) {
                setError(`Fehler beim Speichern: ${error}`);
            } else {
                setMessage('Profil erfolgreich aktualisiert! ✅');
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            setError(`Ein Fehler ist aufgetreten: ${errorMessage}`);
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut();
            router.push('/auth/login');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            setError(`Fehler beim Abmelden: ${errorMessage}`);
        }
    };

    const handleDeleteAccount = async () => {
        if (!user) return;

        setDeleting(true);
        setError('');

        try {
            if (formData.profile_pic_url) {
                await supabase.storage
                    .from('profile-pictures')
                    .remove([`${user.id}/profile.jpg`, `${user.id}/profile.png`, `${user.id}/profile.jpeg`]);
            }

            const { error } = await supabase.auth.admin.deleteUser(user.id);
            if (error) throw error;

            router.push('/auth/login');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            setError(`Fehler beim Löschen des Accounts: ${errorMessage}`);
            setDeleting(false);
        }
    };

    if (authLoading || !mounted) {
        return (
            <div className="col-span-4 space-y-6">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-neutral-dark/10 dark:bg-neutral-light/10 rounded"></div>
                    <div className="h-64 bg-neutral-dark/10 dark:bg-neutral-light/10 rounded-2xl"></div>
                    <div className="h-48 bg-neutral-dark/10 dark:bg-neutral-light/10 rounded-2xl"></div>
                </div>
            </div>
        );
    }

    if (!user) {
        router.push('/auth/login');
        return null;
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto py-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-neutral-dark dark:text-neutral-light mb-2">Profile Settings</h1>
                <p className="text-neutral-dark/70 dark:text-neutral-light/70">Manage your account settings and preferences</p>
            </div>

            <Card className="space-y-6">
                <h2 className="text-xl font-semibold text-neutral-dark dark:text-neutral-light mb-4">Account Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                        <label className="block text-sm font-medium text-neutral-dark dark:text-neutral-light mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            disabled
                            className="w-full px-4 py-3 rounded-xl border-2 border-neutral-dark/20 dark:border-neutral-light/20 bg-neutral-dark/5 dark:bg-neutral-light/5 text-neutral-dark dark:text-neutral-light cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-dark dark:text-neutral-light mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => handleInputChange('username', e.target.value)}
                            placeholder="Dein Benutzername"
                            className="w-full px-4 py-3 rounded-xl border-2 border-neutral-dark/20 dark:border-neutral-light/20 bg-transparent text-neutral-dark dark:text-neutral-light focus:border-primary focus:outline-none transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-dark dark:text-neutral-light mb-2">
                            Passwort
                        </label>
                        <div className="px-4 py-3 rounded-xl border-2 border-neutral-dark/20 dark:border-neutral-light/20 bg-neutral-dark/5 dark:bg-neutral-light/5 text-neutral-dark/70 dark:text-neutral-light/70">
                            Passwort wird über Google/Magic Link verwaltet
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-dark dark:text-neutral-light mb-2">
                            Subscription Plan
                        </label>
                        <div className="px-4 py-3 rounded-xl border-2 border-neutral-dark/20 dark:border-neutral-light/20 bg-neutral-dark/5 dark:bg-neutral-light/5 text-neutral-dark dark:text-neutral-light capitalize">
                            {formData.subscription_plan} Plan
                        </div>
                    </div>
                </div>
            </Card>

            <Card className="space-y-6">
                <h2 className="text-xl font-semibold text-neutral-dark dark:text-neutral-light mb-4">Profile Picture</h2>

                <div className="flex flex-col sm:flex-row items-center sm:space-x-6 space-y-4 sm:space-y-0">
                    <div className="w-24 h-24 rounded-full bg-neutral-dark/10 dark:bg-neutral-light/10 flex items-center justify-center overflow-hidden">
                        {formData.profile_pic_url ? (
                            <Image src={formData.profile_pic_url} alt="Profile" width={96} height={96} className="w-full h-full object-cover" />
                        ) : (
                            <svg className="w-12 h-12 text-neutral-dark/50 dark:text-neutral-light/50" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                        )}
                    </div>

                    <div>
                        <input
                            type="file"
                            id="profilePic"
                            accept="image/*"
                            onChange={handleProfilePicChange}
                            className="hidden"
                        />
                        <label htmlFor="profilePic" className="cursor-pointer">
                            <div className={`inline-block font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 px-6 py-3 text-base border-2 border-neutral-dark/20 dark:border-neutral-light/20 text-neutral-dark dark:text-neutral-light hover:bg-neutral-dark/5 dark:hover:bg-neutral-light/5 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}>
                                {loading ? 'Lädt...' : 'Foto ändern'}
                            </div>
                        </label>
                    </div>
                </div>
            </Card>

            <Card className="space-y-6">
                <h2 className="text-xl font-semibold text-neutral-dark dark:text-neutral-light mb-4">Preferences</h2>

                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-medium text-neutral-dark dark:text-neutral-light">Theme</h3>
                        <p className="text-sm text-neutral-dark/70 dark:text-neutral-light/70">
                            Choose between light and dark mode
                        </p>
                    </div>

                    {!mounted ? (
                        <div className="w-11 h-6 bg-neutral-dark/10 dark:bg-neutral-light/10 rounded-full animate-pulse"></div>
                    ) : (
                        <button
                            onClick={handleThemeToggle}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                                theme === 'dark' ? 'bg-primary' : 'bg-neutral-dark/20 dark:bg-neutral-light/20'
                            }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                        </button>
                    )}
                </div>
            </Card>

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

            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
                <Button 
                    variant="outline"
                    onClick={() => window.location.reload()}
                    disabled={saving}
                >
                    Zurücksetzen
                </Button>
                <Button 
                    variant="primary"
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? 'Wird gespeichert...' : 'Änderungen speichern'}
                </Button>
            </div>

            {/* Divider */}
            <div className="border-t border-neutral-dark/20 dark:border-neutral-light/20"></div>

            {/* Account Actions */}
            {showDeleteConfirm ? (
                <div className="space-y-4 mb-8">
                    <p className="text-sm text-red-500 text-start">
                        Account wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden!
                    </p>
                    <div className="flex justify-start space-x-4">
                        <Button 
                            variant="outline"
                            onClick={() => setShowDeleteConfirm(false)}
                            disabled={deleting}
                        >
                            Abbrechen
                        </Button>
                        <Button 
                            variant="primary"
                            onClick={handleDeleteAccount}
                            className="bg-red-500 hover:bg-red-600"
                            disabled={deleting}
                        >
                            {deleting ? 'Wird gelöscht...' : 'Ja, löschen'}
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col sm:flex-row justify-start gap-3 sm:gap-4 mb-8">
                    <Button 
                        variant="outline"
                        onClick={handleLogout}
                        className="text-neutral-dark/70 dark:text-neutral-light/70"
                    >
                        Abmelden
                    </Button>
                    <Button 
                        variant="outline"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="text-red-500 border-red-500/20 hover:bg-red-500/5"
                    >
                        Account löschen
                    </Button>
                </div>
            )}
        </div>
    )
}