import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-accent text-accent-foreground py-16 border-t border-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image
                src="/floravia.png"
                alt="Floravia Pal Logo"
                width={32}
                height={32}
                className="w-8 h-8 object-cover rounded-full bg-background p-0.5"
              />
              <span className="font-bold text-xl tracking-tight">Floravia Pal</span>
            </div>
            <p className="text-sm opacity-90 leading-relaxed text-pretty">
              Empowering women and girls in Pakistan through dignified menstrual hygiene management, affordable products, and education.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-white">Quick Links</h4>
            <ul className="space-y-3 text-sm opacity-90">
              <li>
                <Link href="/#products" className="hover:text-white hover:underline transition">
                  Our Kits
                </Link>
              </li>
              <li>
                <Link href="/stories" className="hover:text-white hover:underline transition">
                  Stories
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-white hover:underline transition">
                  Team
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-white hover:underline transition">
                  Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Get Involved */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-white">Get Involved</h4>
            <ul className="space-y-3 text-sm opacity-90">
              <li>
                <Link href="/donate" className="hover:text-white hover:underline transition">
                  Donate Now
                </Link>
              </li>
              <li>
                <Link href="/join" className="hover:text-white hover:underline transition">
                  Join the Team
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white hover:underline transition">
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-white">Contact Us</h4>
            <div className="space-y-3 text-sm opacity-90">
              <p>
                <span className="font-medium text-white">Email:</span> hello@floravia.com
              </p>
              <p>
                <span className="font-medium text-white">Location:</span> Pakistan
              </p>
            </div>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="border-t border-accent-foreground/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-90">
          <p>&copy; {new Date().getFullYear()} Floravia Pal. All rights reserved.</p>
          <p className="text-xs opacity-75">Empowering women globally with dignity.</p>
        </div>
      </div>
    </footer>
  );
}
