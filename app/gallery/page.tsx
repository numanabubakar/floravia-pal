'use client';

import { Button } from '@/components/ui/button';
import { Product } from '@/lib/mock-data';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { HeartLoader } from '@/components/ui/heart-loader';
import { Footer } from '@/components/footer';

export default function GalleryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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



  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition">
            <Image
              src="/floravia.png"
              alt="Floravia Pal Logo"
              width={32}
              height={32}
              className="w-8 h-8 object-cover rounded-full"
            />
            <span className="text-2xl font-bold text-primary">Floravia Pal</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/#about" className="text-foreground hover:text-primary transition">
              Mission
            </Link>
            <Link href="/#products" className="text-foreground hover:text-primary transition">
              Our Kits
            </Link>
            <Link href="/stories" className="text-foreground hover:text-primary transition">
              Stories
            </Link>
            <Link href="/community" className="text-foreground hover:text-primary transition">
              Team
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/donate">
              <Button size="sm">Donate</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="bg-secondary/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Our Menstrual Hygiene Kits</h1>
          <p className="text-xl text-muted-foreground">Sustainable, affordable, dignified period management solutions</p>
        </div>
      </section>

      {/* Products Grid */}
      {loading ? (
        <HeartLoader text="Loading product gallery..." className="py-24" />
      ) : (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              {products.map((product) => (
                <div key={product.id} className="group">
                  <div className="relative h-96 overflow-hidden rounded-xl mb-6 border border-border">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                        product.type === 'standard' 
                          ? 'bg-primary/10 text-primary' 
                          : 'bg-accent/10 text-accent'
                      }`}>
                        {product.type === 'standard' ? 'Standard' : 'Premium'}
                      </span>
                    </div>
                    <h3 className="text-2xl font-semibold text-foreground">{product.name}</h3>
                    <p className="text-muted-foreground">{product.description}</p>
                    <div className="pt-4">
                      <h4 className="font-semibold text-foreground mb-3">Includes:</h4>
                      <ul className="space-y-2">
                        {product.contents.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-muted-foreground text-sm">
                            <span className="text-primary mt-1">✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
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
