'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/use-auth';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Heart, ArrowLeft, Plus, Edit, Trash2, Image, Upload } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import NextImage from 'next/image';
import Swal from 'sweetalert2';

export default function AdminStoriesPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [stories, setStories] = useState<any[]>([]);
  const [loadingStories, setLoadingStories] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    featured: false,
    imageUrl: '/images/story-1.png',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fetchStories = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .order('date', { ascending: false });
      if (error) throw error;
      if (data) setStories(data);
    } catch (err) {
      console.error('Error fetching stories:', err);
    } finally {
      setLoadingStories(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchStories();
  }, []);

  useEffect(() => {
    if (mounted && !isLoading && !isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, isLoading, mounted, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.author) {
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
      const imageUrl = previewUrl || formData.imageUrl;

      if (editingId) {
        const { error } = await supabase
          .from('stories')
          .update({
            title: formData.title,
            content: formData.content,
            author: formData.author,
            featured: formData.featured,
            imageUrl,
          })
          .eq('id', editingId);

        if (error) throw error;
        setEditingId(null);
      } else {
        const newStory = {
          id: crypto.randomUUID(),
          title: formData.title,
          content: formData.content,
          author: formData.author,
          featured: formData.featured,
          imageUrl,
          date: new Date().toISOString().split('T')[0],
        };

        const { error } = await supabase.from('stories').insert([newStory]);
        if (error) throw error;
      }

      await fetchStories();
      setFormData({ title: '', content: '', author: '', featured: false, imageUrl: '/images/story-1.png' });
      setImageFile(null);
      setPreviewUrl(null);
      setShowForm(false);
      
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Story saved successfully.',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err) {
      console.error('Error saving story:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to save story.',
        confirmButtonColor: '#C2607A'
      });
    }
  };

  const handleEdit = (story: any) => {
    setFormData({
      title: story.title,
      content: story.content,
      author: story.author,
      featured: story.featured,
      imageUrl: story.imageUrl,
    });
    setPreviewUrl(story.imageUrl);
    setEditingId(story.id);
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
        const { error } = await supabase.from('stories').delete().eq('id', id);
        if (error) throw error;
        await fetchStories();
        Swal.fire({
          title: 'Deleted!',
          text: 'Story has been deleted.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (err) {
        console.error('Error deleting story:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete story.',
          confirmButtonColor: '#C2607A'
        });
      }
    }
  };

  const toggleFeatured = async (id: string) => {
    const story = stories.find((s) => s.id === id);
    if (!story) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('stories')
        .update({ featured: !story.featured })
        .eq('id', id);

      if (error) throw error;
      await fetchStories();
    } catch (err) {
      console.error('Error toggling featured status:', err);
      alert('Failed to update featured status.');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ title: '', content: '', author: '', featured: false, imageUrl: '/images/story-1.png' });
    setPreviewUrl(null);
    setImageFile(null);
  };

  if (!mounted || isLoading) return null;

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
              <h1 className="text-3xl font-bold text-foreground">Manage Stories</h1>
              <p className="text-muted-foreground">{stories.length} stories in total</p>
            </div>
          </div>
          <Button onClick={() => setShowForm(true)} disabled={showForm}>
            <Plus className="w-4 h-4 mr-2" /> Add Story
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {showForm && (
          <div className="bg-card rounded-xl border border-border p-8 mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">{editingId ? 'Edit Story' : 'Add New Story'}</h2>
            <form onSubmit={handleAddStory} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Story Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter story title"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Author Name</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Enter author name"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Story Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter story content"
                  rows={6}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Story Image</label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  {previewUrl ? (
                    <div className="relative w-full h-40 mb-4 rounded-lg overflow-hidden">
                      <NextImage src={previewUrl} alt="Preview" fill className="object-cover" />
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
                    <span className="text-sm text-muted-foreground">Click to upload or drag and drop</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 rounded border-border"
                />
                <label htmlFor="featured" className="text-sm font-medium text-foreground cursor-pointer">
                  Mark as featured story
                </label>
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="flex-1">
                  {editingId ? 'Update Story' : 'Add Story'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel} className="flex-1">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Stories List */}
        <div className="space-y-4">
          {stories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No stories yet. Add your first story!</p>
            </div>
          ) : (
            stories.map((story) => (
              <div key={story.id} className="bg-card rounded-xl border border-border p-6 hover:border-primary transition">
                <div className="flex gap-6">
                  {story.imageUrl && (
                    <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden border border-border">
                      <NextImage src={story.imageUrl} alt={story.title} fill className="object-cover" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">{story.title}</h3>
                        <p className="text-sm text-muted-foreground">By {story.author}</p>
                      </div>
                      {story.featured && <span className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">Featured</span>}
                    </div>
                    <p className="text-muted-foreground line-clamp-2 mb-4">{story.content}</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(story)}>
                        <Edit className="w-4 h-4 mr-1" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant={story.featured ? 'default' : 'outline'}
                        onClick={() => toggleFeatured(story.id)}
                      >
                        {story.featured ? 'Unfeature' : 'Feature'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(story.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                      </Button>
                    </div>
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
