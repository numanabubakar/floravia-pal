'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function AdminSettingsPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState({
    organizationName: 'Floravia Pal',
    organizationEmail: 'info@floravia.com',
    organizationPhone: '(555) 123-4567',
    organizationAddress: 'Office 42, Floor 3, Al-Rahman Plaza, Karachi, Pakistan',
    mission: 'Empowering women and girls through access to dignified menstrual hygiene kits and education.',
    notifications: true,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading && !isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, isLoading, mounted, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as any;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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
            <Button variant="outline" size="sm" className="border-primary-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">Settings</h1>
        <p className="text-muted-foreground mb-12">Manage your organization settings</p>

        <div className="space-y-8">
          {/* Organization Info */}
          <div className="p-8 bg-card rounded-xl border border-border">
            <h2 className="text-2xl font-bold text-foreground mb-6">Organization Info</h2>

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
                  type="tel"
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
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="p-8 bg-card rounded-xl border border-border">
            <h2 className="text-2xl font-bold text-foreground mb-6">Preferences</h2>

            <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg">
              <input
                type="checkbox"
                id="notifications"
                name="notifications"
                checked={settings.notifications}
                onChange={handleChange}
                className="w-4 h-4 rounded border-border"
              />
              <label htmlFor="notifications" className="text-foreground font-medium cursor-pointer">
                Enable email notifications for new join requests
              </label>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center gap-4">
            <Button onClick={handleSave} size="lg">
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
            {saved && <p className="text-green-600 font-medium">Settings saved successfully!</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
