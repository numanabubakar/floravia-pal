'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { label: 'Mission', href: '/#about' },
    { label: 'Our Kits', href: '/#products' },
    { label: 'Stories', href: '/stories' },
    { label: 'Team', href: '/community' },
    { label: 'Gallery', href: '/gallery' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo and Brand */}
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

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 font-medium">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors duration-200 ${
                  isActive ? 'text-primary' : 'text-foreground hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop CTA & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <Link href="/donate">
              <Button size="sm">Donate</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-card animate-in slide-in-from-top-5 duration-200">
          <div className="px-4 py-3 space-y-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-lg font-medium transition ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground hover:bg-secondary/50 hover:text-primary'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-2 border-t border-border/60">
              <Link href="/donate" onClick={() => setIsOpen(false)}>
                <Button className="w-full justify-center gap-2">
                  <Heart className="w-4 h-4 fill-current" />
                  Donate
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
