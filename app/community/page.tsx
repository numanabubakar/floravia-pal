'use client';

import { Button } from '@/components/ui/button';
import { Member } from '@/lib/mock-data';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, MapPin, Mail, Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import { HeartLoader } from '@/components/ui/heart-loader';
import { Footer } from '@/components/footer';
import { TypingText } from '@/components/ui/typing-text';

export default function CommunityPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from('members').select('*');
        if (error) throw error;
        if (data) setMembers(data);
      } catch (err) {
        console.error('Error fetching members:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const activeMembers = members.filter((m) => m.status === 'active');

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
            <Link href="/community" className="text-primary font-semibold transition">
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
            <TypingText text="Our Team" />
          </h1>
          <p className="text-xl text-muted-foreground">Meet the passionate people empowering women through menstrual health</p>
        </div>
      </section>

      {/* Community Stats */}
      {loading ? (
        <HeartLoader text="Loading team members..." className="py-24" />
      ) : (
        <>
          <section className="py-12 border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-4 gap-8">
                {[
                  { number: activeMembers.length, label: 'Active Members' },
                  { number: 5200, label: 'Women Empowered' },
                  { number: 850, label: 'Kits Distributed' },
                  { number: 2400, label: 'Volunteer Hours' },
                ].map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">{stat.number}+</div>
                    <p className="text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Members Directory */}
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-foreground mb-12">Members Directory</h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {activeMembers.map((member) => (
                  <div key={member.id} className="p-6 bg-card rounded-xl border border-border hover:border-primary transition">
                    <div className="flex items-center gap-4 mb-4">
                      {member.imageUrl ? (
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border border-border shrink-0">
                          <Image
                            src={member.imageUrl}
                            alt={member.name}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg border border-primary/20 shrink-0">
                          {member.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-foreground leading-tight">{member.name}</h3>
                        <p className="text-xs text-primary capitalize font-medium">{member.role}</p>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>{member.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>Member since {new Date(member.joinDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Join Section */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Users className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-foreground mb-6">Join Our Community</h2>
          <p className="text-xl text-muted-foreground mb-8">
            We&apos;re always looking for passionate people who want to make a difference in their community.
          </p>
          <Link href="/join">
            <Button size="lg">Become a Member</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
