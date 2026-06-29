'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/use-auth';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Swal from 'sweetalert2';

export default function AdminRequestsPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);

  const fetchRequests = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('join_requests')
        .select('*')
        .order('requestDate', { ascending: false });
      if (error) throw error;
      if (data) setRequests(data);
    } catch (err) {
      console.error('Error fetching requests:', err);
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchRequests();
  }, []);

  useEffect(() => {
    if (mounted && !isLoading && !isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, isLoading, mounted, router]);

  const handleApprove = async (id: string) => {
    const request = requests.find((req) => req.id === id);
    if (!request) return;

    // Prompt for role assignment first
    const roleResult = await Swal.fire({
      title: 'Assign Role & Approve',
      text: `Select a role to assign to ${request.name} before approval:`,
      input: 'select',
      inputOptions: {
        'volunteer': 'Volunteer',
        'member': 'Member',
        'moderator': 'Moderator',
        'admin': 'Admin'
      },
      inputValue: 'member', // Default value
      showCancelButton: true,
      confirmButtonColor: '#C2607A',
      cancelButtonColor: '#6B6860',
      confirmButtonText: 'Approve & Add',
      inputValidator: (value) => {
        if (!value) {
          return 'You must select a role!';
        }
      }
    });

    if (roleResult.isConfirmed && roleResult.value) {
      const selectedRole = roleResult.value;

      try {
        const supabase = createClient();
        
        // 1. Add to members table
        const { error: memberError } = await supabase
          .from('members')
          .insert([{
            id: crypto.randomUUID(),
            name: request.name,
            email: request.email,
            joinDate: new Date().toISOString().split('T')[0],
            role: selectedRole,
            status: 'active'
          }]);

        if (memberError) {
          // If email already exists, we might want to continue or show warning
          console.warn('Could not add to members (likely duplicate email):', memberError);
        }

        // 2. Update status in join_requests table
        const { error: requestError } = await supabase
          .from('join_requests')
          .update({ status: 'approved' })
          .eq('id', id);

        if (requestError) throw requestError;
        
        await fetchRequests();
        Swal.fire({
          title: 'Approved!',
          text: `Request approved and ${request.name} added as a ${selectedRole}.`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (err) {
        console.error('Error approving request:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to approve request.',
          confirmButtonColor: '#C2607A'
        });
      }
    }
  };

  const handleReject = async (id: string) => {
    const request = requests.find((req) => req.id === id);
    if (!request) return;

    const result = await Swal.fire({
      title: 'Reject Request?',
      text: `Are you sure you want to reject ${request.name}'s request?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#8B1A2A',
      cancelButtonColor: '#6B6860',
      confirmButtonText: 'Yes, reject it!'
    });

    if (result.isConfirmed) {
      try {
        const supabase = createClient();
        const { error } = await supabase
          .from('join_requests')
          .update({ status: 'rejected' })
          .eq('id', id);
        if (error) throw error;
        await fetchRequests();
        Swal.fire({
          title: 'Rejected!',
          text: 'Request status updated to rejected.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (err) {
        console.error('Error rejecting request:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to reject request.',
          confirmButtonColor: '#C2607A'
        });
      }
    }
  };

  const pendingRequests = requests.filter((req) => req.status === 'pending');
  const processedRequests = requests.filter((req) => req.status !== 'pending');

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
        <div>
          <h1 className="text-4xl font-bold text-foreground">Join Requests</h1>
          <p className="text-muted-foreground mt-2">Review and approve new member requests</p>
        </div>

        {/* Pending Requests */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Pending Requests ({pendingRequests.length})</h2>

          {pendingRequests.length === 0 ? (
            <div className="p-12 bg-card rounded-xl border border-border text-center">
              <p className="text-muted-foreground">No pending requests</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div key={request.id} className="p-6 bg-card rounded-xl border border-border">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground">{request.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{request.email}</p>
                      <p className="text-muted-foreground">{request.message}</p>
                      <p className="text-xs text-muted-foreground mt-4">
                        Requested: {new Date(request.requestDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(request.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleReject(request.id)}>
                        <X className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Processed Requests */}
        {processedRequests.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-foreground mb-6">Processed Requests</h2>

            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processedRequests.map((request) => (
                      <tr key={request.id} className="border-b border-border">
                        <td className="px-6 py-4 text-foreground font-medium">{request.name}</td>
                        <td className="px-6 py-4 text-muted-foreground">{request.email}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-sm font-semibold px-3 py-1 rounded-full capitalize ${
                              request.status === 'approved'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {request.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {new Date(request.requestDate).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
