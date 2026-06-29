'use client';

import { Button } from '@/components/ui/button';
import { Product } from '@/lib/mock-data';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { HeartLoader } from '@/components/ui/heart-loader';
import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { TypingText } from '@/components/ui/typing-text';
import Swal from 'sweetalert2';
import { MapPin, Calendar, ZoomIn } from 'lucide-react';

interface NonKitGalleryItem {
  id: string;
  name: string;
  type: 'seminar' | 'interview' | 'workshop';
  description: string;
  imageUrl: string;
  date: string;
  location?: string;
}

const mockGalleryItems: NonKitGalleryItem[] = [
  {
    id: 'sem-1',
    name: 'Menstrual Hygiene Awareness Seminar',
    type: 'seminar',
    description: 'A comprehensive session held at a local girls\' school in Lahore, educating students on hygienic practices and breaking myths around menstruation.',
    imageUrl: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800',
    date: '2024-05-10',
    location: 'Lahore'
  },
  {
    id: 'sem-2',
    name: 'Community Hygiene Workshop',
    type: 'workshop',
    description: 'Empowering women in rural communities with awareness workshops, guiding them on safe use of reusable pads and sustainable period management.',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800',
    date: '2024-04-18',
    location: 'Faisalabad'
  },
  {
    id: 'sem-3',
    name: 'Kit Distribution Campaign',
    type: 'workshop',
    description: 'Distribution drive where our volunteers handed out Standard and Premium kits to over 200 young women in need.',
    imageUrl: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=800',
    date: '2024-06-02',
    location: 'Karachi'
  },
  {
    id: 'int-1',
    name: 'Medical Expert Interview',
    type: 'interview',
    description: 'Dr. Hina Malik discussing the physiological aspects of menstrual health, addressing common concerns and proper medical practices.',
    imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800',
    date: '2024-03-22',
    location: 'Online'
  },
  {
    id: 'int-2',
    name: 'Stigma & Mental Well-being Panel',
    type: 'interview',
    description: 'An open panel interview with social activists and psychologists on mental health impacts of menstrual stigma in society.',
    imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=800',
    date: '2024-05-28',
    location: 'Islamabad'
  },
  {
    id: 'int-3',
    name: 'Community Leader Podcast',
    type: 'interview',
    description: 'A candid conversation with community influencers about bringing menstrual hygiene education into public policy and local government initiatives.',
    imageUrl: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&q=80&w=800',
    date: '2024-06-15',
    location: 'Rawalpindi'
  }
];

export default function GalleryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'kits' | 'seminars' | 'interviews'>('all');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from('products').select('*');
        if (error) throw error;
        if (data) setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handlePhotoClick = (item: any, isKit: boolean) => {
    if (isKit) {
      Swal.fire({
        title: item.name,
        html: `
          <div class="text-left space-y-4 font-sans px-2">
            <div class="relative w-full h-64 mb-4 rounded-xl overflow-hidden bg-muted">
              <img src="${item.imageUrl}" alt="${item.name}" class="w-full h-full object-cover" />
            </div>
            <p class="text-muted-foreground text-sm leading-relaxed mb-4">${item.description}</p>
            <h4 class="font-bold text-foreground text-base mb-2">What's inside this kit:</h4>
            <ul class="list-disc pl-5 space-y-2 text-foreground/80 text-sm">
              ${item.contents.map((val: string) => `<li>${val}</li>`).join('')}
            </ul>
          </div>
        `,
        confirmButtonText: 'Close',
        confirmButtonColor: '#C76F86',
        customClass: {
          popup: 'rounded-2xl border border-border bg-card max-w-lg',
          title: 'text-2xl font-bold text-heading font-sans',
        }
      });
    } else {
      Swal.fire({
        title: item.name,
        html: `
          <div class="text-left space-y-4 font-sans px-2">
            <div class="relative w-full h-64 mb-4 rounded-xl overflow-hidden bg-muted">
              <img src="${item.imageUrl}" alt="${item.name}" class="w-full h-full object-cover" />
            </div>
            <div class="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>Date: ${new Date(item.date).toLocaleDateString()}</span>
              ${item.location ? `<span>Location: ${item.location}</span>` : ''}
            </div>
            <p class="text-muted-foreground text-sm leading-relaxed">${item.description}</p>
          </div>
        `,
        confirmButtonText: 'Close',
        confirmButtonColor: '#C76F86',
        customClass: {
          popup: 'rounded-2xl border border-border bg-card max-w-lg',
          title: 'text-2xl font-bold text-heading font-sans',
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="bg-secondary/30 py-16 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-heading mb-4">
            <TypingText text="Gallery" />
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our educational drives, panel discussions, expert interviews, and sustainable menstrual hygiene kits.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-8 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center flex-wrap gap-2 sm:gap-4">
          {[
            { id: 'all', label: 'All Media' },
            { id: 'kits', label: 'Menstrual Kits' },
            { id: 'seminars', label: 'Seminars & Workshops' },
            { id: 'interviews', label: 'Interviews & Panels' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-background hover:bg-secondary text-muted-foreground hover:text-foreground border border-border'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Media Grid */}
      {loading ? (
        <HeartLoader text="Loading gallery..." className="py-24" />
      ) : (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Render Kits */}
              {(activeTab === 'all' || activeTab === 'kits') &&
                products.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handlePhotoClick(product, true)}
                    className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary transition cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-64 overflow-hidden bg-muted">
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition duration-300">
                          <ZoomIn className="w-8 h-8 text-white animate-pulse" />
                        </div>
                        <div className="absolute top-4 left-4">
                          <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase shadow">
                            Kit
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition">
                          {product.name}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {product.description}
                        </p>
                      </div>
                    </div>
                    <div className="px-6 pb-6 pt-2">
                      <span className="text-xs text-primary font-bold group-hover:underline">
                        View Kit Contents &rarr;
                      </span>
                    </div>
                  </div>
                ))}

              {/* Render Seminars & Workshops / Interviews */}
              {mockGalleryItems
                .filter((item) => {
                  if (activeTab === 'all') return true;
                  if (activeTab === 'seminars' && (item.type === 'seminar' || item.type === 'workshop')) return true;
                  if (activeTab === 'interviews' && item.type === 'interview') return true;
                  return false;
                })
                .map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handlePhotoClick(item, false)}
                    className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary transition cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-64 overflow-hidden bg-muted">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition duration-300">
                          <ZoomIn className="w-8 h-8 text-white animate-pulse" />
                        </div>
                        <div className="absolute top-4 left-4">
                          <span className="bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full uppercase shadow">
                            {item.type}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition">
                          {item.name}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <div className="px-6 pb-6 pt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(item.date).toLocaleDateString()}
                      </span>
                      {item.location && (
                        <span className="flex items-center gap-0.5">
                          <MapPin className="w-3.5 h-3.5" />
                          {item.location}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
