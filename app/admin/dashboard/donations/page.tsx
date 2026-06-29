'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/use-auth';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Swal from 'sweetalert2';

export default function AdminDonationsPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [donations, setDonations] = useState<any[]>([]);
  const [loadingDonations, setLoadingDonations] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [donorName, setDonorName] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('completed');
  const [isSaving, setIsSaving] = useState(false);

  const fetchDonations = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .order('date', { ascending: false });
      if (error) throw error;
      if (data) {
        setDonations(data.filter((d: any) => d.id !== '__donation_settings__'));
      }
    } catch (err) {
      console.error('Error fetching donations:', err);
    } finally {
      setLoadingDonations(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchDonations();
  }, []);

  useEffect(() => {
    if (mounted && !isLoading && !isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, isLoading, mounted, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Amount',
        text: 'Please enter a valid donation amount.',
        confirmButtonColor: '#C2607A'
      });
      return;
    }

    setIsSaving(true);
    try {
      const supabase = createClient();
      const newDonation = {
        id: crypto.randomUUID(),
        donorName: donorName.trim() || 'Anonymous',
        amount: parseFloat(amount),
        date: new Date().toISOString().split('T')[0],
        message: message.trim(),
        status: status
      };

      const { error } = await supabase.from('donations').insert([newDonation]);
      if (error) throw error;

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Donation recorded successfully!',
        timer: 1500,
        showConfirmButton: false
      });

      setDonorName('');
      setAmount('');
      setMessage('');
      setStatus('completed');
      setShowForm(false);

      await fetchDonations();
    } catch (err: any) {
      console.error('Error saving donation:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message || 'Failed to add donation.',
        confirmButtonColor: '#C2607A'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this record!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#C2607A',
      cancelButtonColor: '#6B6860',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const supabase = createClient();
        const { error } = await supabase.from('donations').delete().eq('id', id);
        if (error) throw error;
        await fetchDonations();
        Swal.fire({
          title: 'Deleted!',
          text: 'Donation record has been deleted.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (err) {
        console.error('Error deleting donation:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete donation record.',
          confirmButtonColor: '#C2607A'
        });
      }
    }
  };

  const handleMarkComplete = async (id: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('donations')
        .update({ status: 'completed' })
        .eq('id', id);
      if (error) throw error;
      await fetchDonations();
      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Donation marked as completed.',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err) {
      console.error('Error updating donation:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update donation status.',
        confirmButtonColor: '#C2607A'
      });
    }
  };

  const totalDonations = donations.reduce((sum, d) => sum + (d.status === 'completed' ? Number(d.amount) : 0), 0);
  const completedCount = donations.filter((d) => d.status === 'completed').length;
  const pendingCount = donations.filter((d) => d.status === 'pending').length;

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Donations Management</h1>
            <p className="text-muted-foreground mt-2">Track and manage community donations</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Add Donation Manually'}
          </Button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="mt-8 p-6 bg-card rounded-xl border border-border space-y-4 max-w-xl animate-in slide-in-from-top duration-200">
            <h2 className="text-xl font-bold text-foreground mb-4">Add Manual Donation</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1">Donor Name</label>
                <input
                  type="text"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="Anonymous"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-1">Amount ($)</label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="50"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              >
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1">Message (Optional)</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Support note..."
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Donation'}
              </Button>
            </div>
          </form>
        )}

        {/* Stats */}
        <div className="mt-12 grid md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 bg-card rounded-xl border border-border text-center">
            <div className="text-3xl font-bold text-primary mb-2">${totalDonations}</div>
            <p className="text-muted-foreground">Total Donations</p>
          </div>
          <div className="p-6 bg-card rounded-xl border border-border text-center">
            <div className="text-3xl font-bold text-primary mb-2">{completedCount}</div>
            <p className="text-muted-foreground">Completed</p>
          </div>
          <div className="p-6 bg-card rounded-xl border border-border text-center">
            <div className="text-3xl font-bold text-primary mb-2">{pendingCount}</div>
            <p className="text-muted-foreground">Pending</p>
          </div>
        </div>

        {/* Donations Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {donations.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">No donations yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Donor Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Message</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((donation) => (
                    <tr key={donation.id} className="border-b border-border hover:bg-secondary/30 transition">
                      <td className="px-6 py-4 text-foreground font-medium">{donation.donorName}</td>
                      <td className="px-6 py-4 text-foreground font-semibold">${donation.amount}</td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {new Date(donation.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-sm font-semibold px-3 py-1 rounded-full capitalize ${donation.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                            }`}
                        >
                          {donation.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground max-w-xs truncate">
                        {donation.message || '—'}
                      </td>
                      <td className="px-6 py-4 space-x-2">
                        {donation.status === 'pending' && (
                          <Button size="sm" variant="outline" onClick={() => handleMarkComplete(donation.id)}>
                            Mark Done
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(donation.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
