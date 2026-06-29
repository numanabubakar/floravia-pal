'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Lock, Info, Landmark, PhoneCall } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Swal from 'sweetalert2';

export default function AdminSettingsPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const [settings, setSettings] = useState({
    organizationName: 'Floravia Pal',
    organizationEmail: 'info@floravia.com',
    organizationPhone: '(555) 123-4567',
    organizationAddress: 'Office 42, Floor 3, Al-Rahman Plaza, Karachi, Pakistan',
    mission: 'Empowering women and girls through access to dignified menstrual hygiene kits and education.',
    notifications: true,
  });

  const [donationDetails, setDonationDetails] = useState({
    jazzcashNumber: '03001234567',
    jazzcashTitle: 'Floravia Pal Foundation',
    bankName: 'Meezan Bank Limited',
    bankTitle: 'Floravia Pal Foundation',
    bankIban: 'PK23MEZN0012345678901234',
    whatsappNumber: '923001234567',
    email: 'hello@floravia.com',
  });

  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading && !isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, isLoading, mounted, router]);

  useEffect(() => {
    if (mounted && isAuthenticated) {
      const fetchDonationDetails = async () => {
        try {
          const { createClient } = await import('@/utils/supabase/client');
          const supabase = createClient();
          const { data, error } = await supabase
            .from('donations')
            .select('*')
            .eq('id', '__donation_settings__')
            .single();

          if (data && data.message) {
            const parsed = JSON.parse(data.message);
            setDonationDetails((prev) => ({ ...prev, ...parsed }));
          }
        } catch (err) {
          console.error('Error fetching donation details:', err);
        }
      };

      // Load local settings from localStorage if present
      const localSettings = localStorage.getItem('floravia_settings');
      if (localSettings) {
        try {
          setSettings(JSON.parse(localSettings));
        } catch (e) {
          console.error(e);
        }
      }

      fetchDonationDetails();
    }
  }, [mounted, isAuthenticated]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as any;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleDonationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDonationDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const { createClient } = await import('@/utils/supabase/client');
      const supabase = createClient();
      const { error } = await supabase
        .from('donations')
        .upsert({
          id: '__donation_settings__',
          donorName: 'settings',
          amount: 0,
          date: new Date().toISOString().split('T')[0],
          message: JSON.stringify(donationDetails),
          status: 'completed',
        });

      if (error) throw error;

      localStorage.setItem('floravia_settings', JSON.stringify(settings));

      Swal.fire({
        icon: 'success',
        title: 'Settings Saved',
        text: 'Organization and donation details have been updated successfully.',
        confirmButtonColor: '#C2607A',
      });
    } catch (err: any) {
      console.error('Error saving settings:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err?.message || 'Failed to save settings to the database.',
        confirmButtonColor: '#C2607A',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordData.newPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please enter a new password.',
        confirmButtonColor: '#C2607A',
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Passwords do not match.',
        confirmButtonColor: '#C2607A',
      });
      return;
    }

    if (!user) return;

    setIsSavingPassword(true);
    try {
      const { createClient } = await import('@/utils/supabase/client');
      const supabase = createClient();

      if (user.id === 'super-admin') {
        // Find if admin@floravia.com exists in members
        const { data: existingAdmin } = await supabase
          .from('members')
          .select('*')
          .eq('email', 'admin@floravia.com')
          .single();

        if (existingAdmin) {
          const { error } = await supabase
            .from('members')
            .update({ bio: passwordData.newPassword })
            .eq('id', existingAdmin.id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('members')
            .insert({
              id: crypto.randomUUID(),
              name: 'Super Admin',
              email: 'admin@floravia.com',
              role: 'admin',
              status: 'active',
              joinDate: new Date().toISOString().split('T')[0],
              bio: passwordData.newPassword,
            });
          if (error) throw error;
        }
      } else {
        const { error } = await supabase
          .from('members')
          .update({ bio: passwordData.newPassword })
          .eq('id', user.id);
        if (error) throw error;
      }

      setPasswordData({ newPassword: '', confirmPassword: '' });

      Swal.fire({
        icon: 'success',
        title: 'Password Updated',
        text: 'Your login password has been changed successfully.',
        confirmButtonColor: '#C2607A',
      });
    } catch (err: any) {
      console.error('Error changing password:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err?.message || 'Failed to update password.',
        confirmButtonColor: '#C2607A',
      });
    } finally {
      setIsSavingPassword(false);
    }
  };

  if (isLoading || !mounted) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary text-primary-foreground border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-2 hover:opacity-80 transition">
            <Image
              src="/floravia.png"
              alt="Floravia Pal Logo"
              width={32}
              height={32}
              className="w-8 h-8 object-cover rounded-full bg-background p-0.5"
            />
            <span className="text-xl font-bold">Floravia Pal Admin</span>
          </Link>
          <Link href="/admin/dashboard">
            <Button variant="outline" size="sm" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">Settings</h1>
        <p className="text-muted-foreground mb-12">Manage your organization configurations, donation instructions, and account passwords.</p>

        <div className="space-y-12">
          {/* Organization Info */}
          <div className="p-8 bg-card rounded-xl border border-border">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Info className="w-6 h-6 text-primary" />
              Organization Info
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Organization Name</label>
                <input
                  type="text"
                  name="organizationName"
                  value={settings.organizationName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input
                  type="email"
                  name="organizationEmail"
                  value={settings.organizationEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                <input
                  type="text"
                  name="organizationPhone"
                  value={settings.organizationPhone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Address</label>
                <input
                  type="text"
                  name="organizationAddress"
                  value={settings.organizationAddress}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Mission Statement</label>
                <textarea
                  name="mission"
                  value={settings.mission}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
            </div>
          </div>

          {/* Donation Payment Details */}
          <div className="p-8 bg-card rounded-xl border border-border">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Landmark className="w-6 h-6 text-primary" />
              Donation Payment Details
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Update payment instructions shown on the public donation page for JazzCash, Bank Transfers, and receipt verification.
            </p>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">JazzCash Account Number</label>
                  <input
                    type="text"
                    name="jazzcashNumber"
                    value={donationDetails.jazzcashNumber}
                    onChange={handleDonationChange}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">JazzCash Account Title</label>
                  <input
                    type="text"
                    name="jazzcashTitle"
                    value={donationDetails.jazzcashTitle}
                    onChange={handleDonationChange}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Bank Name</label>
                  <input
                    type="text"
                    name="bankName"
                    value={donationDetails.bankName}
                    onChange={handleDonationChange}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Bank Account Title</label>
                  <input
                    type="text"
                    name="bankTitle"
                    value={donationDetails.bankTitle}
                    onChange={handleDonationChange}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">IBAN / Account Number</label>
                  <input
                    type="text"
                    name="bankIban"
                    value={donationDetails.bankIban}
                    onChange={handleDonationChange}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">WhatsApp Contact (for receipt submission)</label>
                  <input
                    type="text"
                    name="whatsappNumber"
                    value={donationDetails.whatsappNumber}
                    onChange={handleDonationChange}
                    placeholder="e.g. 923001234567"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Receipt Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={donationDetails.email}
                    onChange={handleDonationChange}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-8">
              <Button onClick={handleSaveSettings} disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </div>

          {/* Change Password */}
          <div className="p-8 bg-card rounded-xl border border-border">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Lock className="w-6 h-6 text-primary" />
              Update Account Password
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Change the password you use to log in as <b>{user.email}</b>.
            </p>

            <form onSubmit={handleChangePassword} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    placeholder="Enter new password"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    placeholder="Confirm new password"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <Button type="submit" disabled={isSavingPassword}>
                <Lock className="w-4 h-4 mr-2" />
                {isSavingPassword ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
