'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';

export default function JoinPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const supabase = createClient();
      const newRequest = {
        id: crypto.randomUUID(),
        name: formData.name,
        email: formData.email,
        message: formData.message,
        requestDate: new Date().toISOString().split('T')[0],
        status: 'pending'
      };
      
      const { error } = await supabase.from('join_requests').insert([newRequest]);
      if (error) throw error;
      
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (err) {
      console.error('Error submitting join request:', err);
      alert('Failed to submit join request. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navbar />

      {/* Header */}
      <section className="bg-secondary/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Join Floravia Pal</h1>
          <p className="text-xl text-muted-foreground">Become part of our growing community</p>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-12">Why Join Us?</h2>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {[
              {
                title: 'Make a Real Impact',
                description: "Contribute to women's health and dignity, creating lasting change in their lives.",
              },
              {
                title: 'Learn & Grow',
                description: 'Develop new skills in health education, advocacy, and community engagement.',
              },
              {
                title: 'Join a Community',
                description: 'Connect with like-minded individuals passionate about making a difference.',
              },
            ].map((reason, idx) => (
              <div
                key={idx}
                className="p-8 bg-card rounded-xl border border-border hover:border-primary transition"
              >
                <CheckCircle className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-3">{reason.title}</h3>
                <p className="text-muted-foreground">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Form Section */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Tell Us About Yourself</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Tell Us Why You Want to Join</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Share your passion for menstrual health advocacy and community building..."
              />
            </div>

            <Button type="submit" size="lg" className="w-full">
              Submit Join Request
            </Button>
          </form>

          {submitted && (
            <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <p className="text-green-800 font-semibold">Thank you for your interest!</p>
              <p className="text-green-700">We&apos;ll review your application and get back to you soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
