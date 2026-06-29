'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/use-auth';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Heart, ArrowLeft, Plus, Edit, Trash2, Upload } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Swal from 'sweetalert2';

export default function AdminMembersPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fetchMembers = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('joinDate', { ascending: false });
      if (error) throw error;
      if (data) setMembers(data);
    } catch (err) {
      console.error('Error fetching members:', err);
    } finally {
      setLoadingMembers(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchMembers();
  }, []);

  useEffect(() => {
    if (mounted && !isLoading && !isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, isLoading, mounted, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.role) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill in all fields',
        confirmButtonColor: '#C2607A'
      });
      return;
    }

    try {
      const supabase = createClient();
      const roleLower = formData.role.toLowerCase().replace(/\s+/g, '');
      const allowedRoles = ['admin', 'moderator', 'volunteer', 'member'];
      const dbRole = allowedRoles.includes(roleLower) ? roleLower : 'member';

      if (editingId) {
        const { error } = await supabase
          .from('members')
          .update({
            name: formData.name,
            role: dbRole,
            bio: formData.bio,
            imageUrl: previewUrl,
          })
          .eq('id', editingId);

        if (error) throw error;
        setEditingId(null);
      } else {
        const newMember = {
          id: crypto.randomUUID(),
          name: formData.name,
          role: dbRole,
          status: 'active',
          joinDate: new Date().toISOString().split('T')[0],
          email: `${formData.name.toLowerCase().replace(/\s+/g, '.')}@floravia.com`,
          bio: formData.bio,
          imageUrl: previewUrl,
        };

        const { error } = await supabase.from('members').insert([newMember]);
        if (error) throw error;
      }

      await fetchMembers();
      setFormData({ name: '', role: '', bio: '' });
      setPreviewUrl(null);
      setShowForm(false);

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Member saved successfully.',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err: any) {
      console.error('Error saving member:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err?.message || 'Failed to save member.',
        confirmButtonColor: '#C2607A'
      });
    }
  };

  const handleEdit = (member: any) => {
    setFormData({
      name: member.name,
      role: member.role,
      bio: member.bio || '',
    });
    setPreviewUrl(member.imageUrl || null);
    setEditingId(member.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#C2607A',
      cancelButtonColor: '#6B6860',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const supabase = createClient();
        const { error } = await supabase.from('members').delete().eq('id', id);
        if (error) throw error;
        await fetchMembers();
        Swal.fire({
          title: 'Deleted!',
          text: 'Member has been deleted.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (err) {
        console.error('Error deleting member:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete member.',
          confirmButtonColor: '#C2607A'
        });
      }
    }
  };

  const toggleStatus = async (id: string) => {
    const member = members.find((m) => m.id === id);
    if (!member) return;

    try {
      const supabase = createClient();
      const newStatus = member.status === 'active' ? 'inactive' : 'active';
      const { error } = await supabase
        .from('members')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      await fetchMembers();
      Swal.fire({
        icon: 'success',
        title: 'Status Updated',
        text: `Member is now ${newStatus}.`,
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err: any) {
      console.error('Error toggling member status:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err?.message || 'Failed to update member status.',
        confirmButtonColor: '#C2607A'
      });
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', role: '', bio: '' });
    setPreviewUrl(null);
  };

  if (!mounted || isLoading) return null;

  const activeMembers = members.filter((m) => m.status === 'active').length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard">
              <Button variant="outline" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Manage Team Members</h1>
              <p className="text-muted-foreground">{activeMembers} active members</p>
            </div>
          </div>
          <Button onClick={() => setShowForm(true)} disabled={showForm}>
            <Plus className="w-4 h-4 mr-2" /> Add Member
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {showForm && (
          <div className="bg-card rounded-xl border border-border p-8 mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">{editingId ? 'Edit Member' : 'Add New Member'}</h2>
            <form onSubmit={handleAddMember} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Member Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter member name"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Role</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g., Project Lead, Volunteer"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Enter member bio"
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Profile Image (Optional)</label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  {previewUrl ? (
                    <div className="relative w-full h-40 mb-4 rounded-lg overflow-hidden">
                      <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                    </div>
                  ) : null}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Click to upload image</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="flex-1">
                  {editingId ? 'Update Member' : 'Add Member'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel} className="flex-1">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Members Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.length === 0 ? (
            <div className="text-center py-12 col-span-full">
              <p className="text-muted-foreground">No members yet. Add your first member!</p>
            </div>
          ) : (
            members.map((member) => (
              <div key={member.id} className="bg-card rounded-xl border border-border overflow-hidden hover:border-primary transition">
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    {member.imageUrl ? (
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border border-border shrink-0">
                        <Image src={member.imageUrl} alt={member.name} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg border border-primary/20 shrink-0">
                        {member.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-semibold text-foreground leading-tight">{member.name}</h3>
                      <p className="text-sm text-primary font-medium">{member.role}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                  <div className="flex gap-2 pt-4">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(member)}>
                      <Edit className="w-4 h-4 mr-1" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant={member.status === 'active' ? 'default' : 'outline'}
                      onClick={() => toggleStatus(member.id)}
                    >
                      {member.status === 'active' ? 'Active' : 'Inactive'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(member.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
