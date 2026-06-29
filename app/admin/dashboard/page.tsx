'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/use-auth';
import { useRouter } from 'next/navigation';
import {
  Heart,
  LogOut,
  Images,
  BookOpen,
  Users,
  FileText,
  Settings,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image';

import { createClient } from '@/utils/supabase/client';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export default function AdminDashboard() {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({
    gallery: 0,
    stories: 0,
    members: 0,
    donations: 0,
    requests: 0,
  });

  const fetchStats = async () => {
    try {
      const supabase = createClient();
      const { count: galleryCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
      const { count: storiesCount } = await supabase.from('stories').select('*', { count: 'exact', head: true });
      const { count: membersCount } = await supabase.from('members').select('*', { count: 'exact', head: true });
      const { data: donationsData } = await supabase.from('donations').select('amount, status');
      const donationsSum = donationsData?.reduce((sum, d) => sum + (d.status === 'completed' ? Number(d.amount) : 0), 0) || 0;
      const { count: pendingRequestsCount } = await supabase
        .from('join_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      setStats({
        gallery: galleryCount || 0,
        stories: storiesCount || 0,
        members: membersCount || 0,
        donations: donationsSum,
        requests: pendingRequestsCount || 0,
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchStats();
  }, []);

  useEffect(() => {
    if (mounted && !isLoading && !isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, isLoading, mounted, router]);

  const handleLogout = () => {
    logout();
    router.push('/admin');
  };

  if (isLoading || !mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Heart className="w-8 h-8 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const navItems: NavItem[] = [
    {
      label: 'Gallery',
      href: '/admin/dashboard/gallery',
      icon: <Images className="w-5 h-5" />,
    },
    {
      label: 'Stories',
      href: '/admin/dashboard/stories',
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      label: 'Members',
      href: '/admin/dashboard/members',
      icon: <Users className="w-5 h-5" />,
    },
    {
      label: 'Join Requests',
      href: '/admin/dashboard/requests',
      icon: <FileText className="w-5 h-5" />,
    },
    {
      label: 'Donations',
      href: '/admin/dashboard/donations',
      icon: <Heart className="w-5 h-5" />,
    },
    {
      label: 'Settings',
      href: '/admin/dashboard/settings',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-accent text-accent-foreground border-b border-accent/20">
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

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3">
              <span className="text-sm">{user?.email}</span>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm" className="border-primary-foreground">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">Dashboard</h1>
        <p className="text-muted-foreground mb-12">Manage your Floravia Pal community</p>

        {/* Dashboard Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div className="p-6 bg-card rounded-xl border border-border hover:border-primary transition group cursor-pointer h-full flex flex-col items-start justify-between">
                <div className="flex items-center gap-4 mb-4 w-full">
                  <div className="relative p-3 bg-primary/10 rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition">
                    {item.icon}
                    {item.label === 'Join Requests' && stats.requests > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition flex items-center gap-2">
                    {item.label}
                    {item.label === 'Join Requests' && stats.requests > 0 && (
                      <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                        {stats.requests}
                      </span>
                    )}
                  </h2>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition self-end" />
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-20 grid md:grid-cols-4 gap-6">
          {[
            { label: 'Gallery Items', value: String(stats.gallery) },
            { label: 'Stories', value: String(stats.stories) },
            { label: 'Members', value: String(stats.members) },
            { label: 'Donations', value: `$${stats.donations}` },
          ].map((stat, idx) => (
            <div key={idx} className="p-6 bg-card rounded-xl border border-border text-center">
              <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
              <p className="text-muted-foreground text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
