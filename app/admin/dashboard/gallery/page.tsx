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

export default function AdminProductsPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'standard',
    description: '',
    contents: '',
    imageUrl: '/images/product-standard.png',
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

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

  const fetchProducts = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from('products').select('*');
      if (error) throw error;
      if (data) setItems(data);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoadingItems(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchProducts();
  }, []);

  useEffect(() => {
    if (mounted && !isLoading && !isAuthenticated) {
      router.push('/admin');
    }
  }, [mounted, isLoading, isAuthenticated, router]);

  if (isLoading || !mounted) {
    return <div className="p-8">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleDeleteItem = async (id: string) => {
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
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
        await fetchProducts();
        Swal.fire({
          title: 'Deleted!',
          text: 'Product kit has been deleted.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (err) {
        console.error('Error deleting product kit:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete product kit.',
          confirmButtonColor: '#C2607A'
        });
      }
    }
  };

  const handleEditItem = (product: any) => {
    setFormData({
      name: product.name,
      type: product.type,
      description: product.description,
      contents: Array.isArray(product.contents) ? product.contents.join(', ') : '',
      imageUrl: product.imageUrl,
    });
    setPreviewUrl(product.imageUrl);
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.description) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill in all required fields',
        confirmButtonColor: '#C2607A'
      });
      return;
    }

    setIsSaving(true);
    try {
      const supabase = createClient();
      const contentList = formData.contents
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

      const payload = {
        name: formData.name,
        type: formData.type,
        description: formData.description,
        contents: contentList,
        imageUrl: previewUrl || formData.imageUrl,
      };

      if (editingId) {
        const { error } = await supabase
          .from('products')
          .update(payload)
          .eq('id', editingId);

        if (error) throw error;
        setEditingId(null);
      } else {
        const newProduct = {
          id: crypto.randomUUID(),
          ...payload,
        };
        const { error } = await supabase.from('products').insert([newProduct]);
        if (error) throw error;
      }

      await fetchProducts();
      setFormData({
        name: '',
        type: 'standard',
        description: '',
        contents: '',
        imageUrl: '/images/product-standard.png',
      });
      setPreviewUrl(null);
      setShowForm(false);
      
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Product kit saved successfully.',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err) {
      console.error('Error saving product kit:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to save product kit.',
        confirmButtonColor: '#C2607A'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/dashboard">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
        </Link>
        <h1 className="text-4xl font-bold text-foreground">Manage Kits</h1>
      </div>

      {/* Add New Button */}
      <div className="mb-8">
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Product Kit
        </Button>
      </div>

      {/* Products Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((product) => (
          <div key={product.id} className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary transition flex flex-col justify-between">
            <div>
              <div className="relative h-48 bg-muted">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    product.type === 'standard' 
                      ? 'bg-primary/10 text-primary' 
                      : 'bg-accent/10 text-accent'
                  }`}>
                    {product.type === 'standard' ? 'Standard' : 'Premium'}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{product.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{product.description}</p>
                <div className="mb-4">
                  <p className="text-sm font-semibold text-foreground mb-2">Contains {product.contents?.length || 0} items</p>
                  <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-1">
                    {product.contents?.slice(0, 3).map((c: string, i: number) => (
                      <li key={i}>{c}</li>
                    ))}
                    {product.contents?.length > 3 && <li>and {product.contents.length - 3} more...</li>}
                  </ul>
                </div>
              </div>
            </div>
            <div className="p-6 pt-0 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-1"
                onClick={() => handleEditItem(product)}
              >
                <Edit className="w-4 h-4" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="flex-1 gap-1"
                onClick={() => handleDeleteItem(product.id)}
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="text-center py-12">
          <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">No product kits yet. Add one to get started.</p>
        </div>
      )}

      {/* Add / Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-6">
            <h2 className="text-2xl font-bold text-foreground">
              {editingId ? 'Edit Product Kit' : 'Add Product Kit'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Kit Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Essential Kit"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Kit Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the product kit..."
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Contents (Comma-separated)</label>
                <textarea
                  value={formData.contents}
                  onChange={(e) => setFormData({ ...formData, contents: e.target.value })}
                  placeholder="e.g., Reusable Pad, Soap, Pouch"
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Kit Image</label>
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
                    id="product-image-upload"
                  />
                  <label htmlFor="product-image-upload" className="cursor-pointer flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Click to upload image</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({
                      name: '',
                      type: 'standard',
                      description: '',
                      contents: '',
                      imageUrl: '/images/product-standard.png',
                    });
                    setPreviewUrl(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Kit'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
