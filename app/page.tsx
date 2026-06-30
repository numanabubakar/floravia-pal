'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Heart, Users, BookOpen, Package } from 'lucide-react';
import { Product } from '@/lib/mock-data';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { HeartLoader } from '@/components/ui/heart-loader';
import { Footer } from '@/components/footer';
import { TypingText } from '@/components/ui/typing-text';
import Swal from 'sweetalert2';
import { Navbar } from '@/components/navbar';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from('products').select('*');
        if (error) throw error;
        if (data) {
          const kitsOnly = data.filter((item: any) => Array.isArray(item.contents));
          setProducts(kitsOnly);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleLearnMore = (product: Product) => {
    Swal.fire({
      title: product.name,
      html: `
        <div class="text-left space-y-4 font-sans px-2">
          <p class="text-muted-foreground text-sm leading-relaxed mb-4">${product.description}</p>
          <h4 class="font-bold text-foreground text-base mb-2">What's inside this kit:</h4>
          <ul class="list-disc pl-5 space-y-2 text-foreground/80 text-sm">
            ${product.contents.map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>
      `,
      confirmButtonText: 'Great, Thanks!',
      confirmButtonColor: '#C76F86',
      customClass: {
        popup: 'rounded-2xl border border-border bg-card',
        title: 'text-2xl font-bold text-heading font-sans',
      }
    });
  };
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-heading mb-6 text-balance min-h-[140px] md:min-h-[180px]">
                <TypingText text="Empowering Women Through Dignified Period Management" />
              </h1>
              <p className="text-lg text-muted-foreground mb-8 text-pretty">
                Floravia Pal provides menstrual hygiene management kits designed with care for women and girls in Pakistan. Our mission: ensure every woman has access to dignified, affordable period products.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="#products">
                  <Button size="lg" className="w-full sm:w-auto">
                    Explore Our Kits
                  </Button>
                </Link>
                <Link href="/donate">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Support Our Mission
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-96 md:h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-3xl"></div>
              <div className="relative h-full bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl border border-border flex items-center justify-center">
                <Heart className="w-32 h-32 text-primary opacity-40" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Kits Section */}
      <section id="products" className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-foreground mb-4">Our Menstrual Hygiene Kits</h2>
          <p className="text-center text-muted-foreground text-lg mb-16 max-w-2xl mx-auto">
            Thoughtfully designed kits with organic, sustainable products and comprehensive health education.
          </p>

          {loading ? (
            <HeartLoader text="Loading product kits..." className="py-20" />
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {products.map((product) => (
                <div key={product.id} className="p-8 bg-card rounded-xl border border-border hover:border-primary transition overflow-hidden">
                  <div className="relative h-64 mb-6 bg-muted rounded-lg overflow-hidden">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground mb-3">{product.name}</h3>
                  <p className="text-muted-foreground mb-6">{product.description}</p>
                  <div className="mb-6">
                    <h4 className="font-semibold text-foreground mb-3">Kit Includes:</h4>
                    <ul className="space-y-2">
                      {product.contents.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                          <span className="text-primary mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button className="w-full" variant="default" onClick={() => handleLearnMore(product)}>
                    Learn More
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Impact Section */}
      <section id="about" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-foreground mb-4">Our Impact</h2>
          <p className="text-center text-muted-foreground text-lg mb-16 max-w-2xl mx-auto">
            We believe that access to menstrual products is fundamental to women&apos;s health, dignity, and equality.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: 'Education & Awareness',
                description: 'Breaking stigma through comprehensive health education and open conversations about menstruation.',
              },
              {
                icon: Users,
                title: 'Community Empowerment',
                description: 'Enabling girls to attend school, work, and participate fully in society without shame.',
              },
              {
                icon: Heart,
                title: 'Dignified Access',
                description: 'Providing sustainable, affordable, high-quality menstrual products to those who need them most.',
              },
            ].map((item, idx) => (
              <div key={idx} className="p-8 bg-card rounded-xl border border-border hover:border-primary transition">
                <item.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6 text-white" style={{ color: '#ffffff' }}>Join Our Mission</h2>
          <p className="text-lg mb-8 opacity-90">
            Every girl deserves access to menstrual products without shame. Support our work today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/donate">
              <Button size="lg" variant="secondary">
                Make a Donation
              </Button>
            </Link>
            <Link href="/community">
              <Button size="lg" variant="outline" className="border-primary-foreground  hover:bg-primary-foreground hover:text-primary">
                Meet Our Team
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
