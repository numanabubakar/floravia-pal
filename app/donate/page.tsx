'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Mail } from 'lucide-react';
import { Footer } from '@/components/footer';
import { TypingText } from '@/components/ui/typing-text';
import { Navbar } from '@/components/navbar';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function DonatePage() {
  const [details, setDetails] = useState({
    jazzcashNumber: '03001234567',
    jazzcashTitle: 'Floravia Pal Foundation',
    bankName: 'Meezan Bank Limited',
    bankTitle: 'Floravia Pal Foundation',
    bankIban: 'PK23MEZN0012345678901234',
    whatsappNumber: '923001234567',
    email: 'hello@floravia.com',
  });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('donations')
          .select('*')
          .eq('id', '__donation_settings__')
          .single();
        if (data && data.message) {
          const parsed = JSON.parse(data.message);
          setDetails((prev) => ({ ...prev, ...parsed }));
        }
      } catch (err) {
        console.error('Error fetching payment details:', err);
      }
    };
    fetchDetails();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navbar />

      {/* Header */}
      <section className="bg-secondary/30 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center sm:px-6 lg:px-8">
          <TypingText className="text-4xl md:text-5xl font-bold text-heading mb-4" text="Support Women&apos;s Health" />
          <p className="text-xl text-muted-foreground">Your donation ensures every woman has access to dignified menstrual hygiene products</p>
        </div>
      </section>

      {/* How Your Donation Helps */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-12">How Your Donation Helps</h2>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              { amount: '$25', impact: 'Provides 2 Standard hygiene kits for school girls' },
              { amount: '$50', impact: 'Supports a community hygiene awareness workshop' },
              { amount: '$100', impact: 'Provides 4 Premium hygiene kits for women in need' },
              { amount: '$250', impact: 'Funds menstrual hygiene supplies for a school class for a month' },
              { amount: '$500', impact: 'Funds a community-wide educational awareness program' },
              { amount: '$1000+', impact: 'Helps establish a local distribution & support center' },
            ].map((item, idx) => (
              <div key={idx} className="p-6 bg-card rounded-xl border border-border text-center">
                <div className="text-2xl font-bold text-primary mb-2">{item.amount}</div>
                <p className="text-muted-foreground">{item.impact}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Details */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 bg-card rounded-xl border border-border">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
              Donation Details
            </h2>

            <div className="space-y-6">
              {/* JazzCash Wallet Card */}
              <div className="p-6 rounded-lg bg-primary/5 border border-primary/20 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg text-primary">JazzCash Account</span>
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold uppercase tracking-wider">Mobile Wallet</span>
                </div>
                <div className="space-y-3 text-sm text-foreground">
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Account Name:</span>
                    <span className="font-semibold">{details.jazzcashTitle}</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">JazzCash Number:</span>
                    <span className="font-semibold text-primary select-all">{details.jazzcashNumber}</span>
                  </div>
                  <div className="flex justify-between pb-2">
                    <span className="text-muted-foreground">Reference Note:</span>
                    <span className="font-semibold text-muted-foreground">FLORAVIA-DONATION</span>
                  </div>
                </div>
              </div>

              {/* Alternative Bank Account Card */}
              <div className="p-6 rounded-lg bg-card border border-border space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg text-foreground">Bank Account (Alternative)</span>
                  <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs font-semibold uppercase tracking-wider">Direct Bank</span>
                </div>
                <div className="space-y-3 text-sm text-foreground">
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Bank Name:</span>
                    <span className="font-semibold">{details.bankName}</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Account Title:</span>
                    <span className="font-semibold">{details.bankTitle}</span>
                  </div>
                  <div className="flex justify-between pb-2">
                    <span className="text-muted-foreground">IBAN / Account Number:</span>
                    <span className="font-semibold select-all">{details.bankIban}</span>
                  </div>
                </div>
              </div>

              {/* Instructions Section */}
              <div className="mt-8 pt-8 border-t border-border space-y-6 text-center">
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                  <h3 className="font-bold text-foreground text-lg mb-2">Send Us Your Receipt</h3>
                  <p className="text-sm text-muted-foreground mb-6 text-pretty leading-relaxed">
                    To help us track your contribution and send you an official donation receipt, please forward a screenshot of the transaction details to our <b>WhatsApp</b> number or <b>Email</b>
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <a
                      href={`https://wa.me/${details.whatsappNumber}?text=Hi%20Floravia%20Pal,%20here%20is%20my%20donation%20receipt.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#25D366] hover:bg-[#20ba56] text-white font-bold text-sm transition shadow-sm gap-2"
                    >
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.966a9.9 9.9 0 0 0-6.98-2.879c-5.443 0-9.87 4.37-9.874 9.8-.001 1.765.486 3.486 1.411 5.013l-.997 3.634 3.736-.971zm10.867-6.963c-.302-.15-1.785-.88-2.062-.98-.277-.1-.478-.15-.68.15-.202.3-.779.98-.955 1.18-.177.2-.353.225-.655.075-1.2-.6-1.957-1.11-2.741-2.433-.2-.34.2-.315.572-1.057.062-.125.03-.233-.015-.333-.045-.1-.478-1.15-.655-1.575-.172-.412-.347-.356-.478-.362-.124-.006-.267-.008-.409-.008-.143 0-.376.054-.572.27-.197.216-.752.735-.752 1.79 0 1.057.773 2.08.88 2.23.108.15 1.523 2.324 3.69 3.258.516.222.918.355 1.232.455.518.165.99.141 1.362.086.414-.061 1.785-.73 2.037-1.435.253-.705.253-1.31.177-1.435-.077-.125-.277-.2-.579-.35z" />
                      </svg>
                      Send via WhatsApp
                    </a>
                    <a
                      href={`mailto:${details.email}?subject=Donation%20Receipt&body=Hi%20Floravia%20Pal,%20attached%20is%20my%20donation%20receipt.`}
                      className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary hover:bg-primary/95 text-white font-bold text-sm transition shadow-sm gap-2"
                    >
                      <Mail className="w-5 h-5" />
                      Send via Email
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
