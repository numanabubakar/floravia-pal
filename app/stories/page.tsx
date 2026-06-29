'use client';

import { Button } from '@/components/ui/button';
import { Story } from '@/lib/mock-data';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { HeartLoader } from '@/components/ui/heart-loader';
import { Footer } from '@/components/footer';
import { TypingText } from '@/components/ui/typing-text';

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  const featuredStories = stories.filter((s) => s.featured);
  const otherStories = stories.filter((s) => !s.featured);

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
            <Link href="/stories" className="text-primary font-semibold transition">
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
      <section className="bg-secondary/30 py-12 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-heading mb-4">
            <TypingText text="Women's Stories" />
          </h1>
          <p className="text-xl text-muted-foreground">Hear how menstrual hygiene access has changed women&apos;s lives</p>
        </div>
      </section>

      {/* Featured Stories */}
      {loading ? (
        <HeartLoader text="Loading stories..." className="py-24" />
      ) : (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground mb-12">Featured Stories</h2>
            <div className="grid md:grid-cols-2 gap-12 mb-20">
              {featuredStories.map((story) => (
                <div key={story.id} className="group flex flex-col justify-between">
                  <div>
                    <div className="relative h-80 overflow-hidden rounded-xl mb-6 border border-border">
                      <Image
                        src={story.imageUrl}
                        alt={story.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold text-foreground mb-2">{story.title}</h3>
                        <p className="text-muted-foreground line-clamp-3">{story.content}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
                    <div>
                      <p className="font-semibold text-foreground">{story.author}</p>
                      <p className="text-sm text-muted-foreground">{new Date(story.date).toLocaleDateString()}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setSelectedStory(story)}>
                      Read Full Story
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Other Stories */}
            {otherStories.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-12">More Stories</h2>
                <div className="space-y-12">
                  {otherStories.map((story) => (
                    <div key={story.id} className="grid md:grid-cols-3 gap-8 items-start pb-12 border-b border-border">
                      <div className="relative h-48 overflow-hidden rounded-xl md:col-span-1 border border-border">
                        <Image
                          src={story.imageUrl}
                          alt={story.title}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-4">
                        <h3 className="text-xl font-bold text-foreground">{story.title}</h3>
                        <p className="text-muted-foreground line-clamp-3">{story.content}</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-foreground">{story.author}</p>
                            <p className="text-sm text-muted-foreground">{new Date(story.date).toLocaleDateString()}</p>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => setSelectedStory(story)}>
                            Read Story
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Story Modal */}
      {selectedStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="bg-card border border-border w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image header if exists */}
            {selectedStory.imageUrl && (
              <div className="relative h-64 w-full border-b border-border">
                <Image
                  src={selectedStory.imageUrl}
                  alt={selectedStory.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="p-8 overflow-y-auto space-y-6 flex-1">
              <div>
                <h3 className="text-3xl font-bold text-foreground mb-2">{selectedStory.title}</h3>
                <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-b border-border pb-4">
                  <span>By <strong className="text-foreground">{selectedStory.author}</strong></span>
                  <span>{new Date(selectedStory.date).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="text-foreground/90 leading-relaxed whitespace-pre-line text-lg">
                {selectedStory.content}
              </div>
            </div>

            <div className="p-4 bg-secondary/20 border-t border-border flex justify-end">
              <Button onClick={() => setSelectedStory(null)}>
                Close
              </Button>
            </div>
          </div>
          <div className="absolute inset-0 -z-10" onClick={() => setSelectedStory(null)} />
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}

