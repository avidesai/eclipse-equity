// src/app/components/Navigation.tsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActiveLink = (path: string) => pathname === path;

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-black/95 backdrop-blur-md' : 'bg-black'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-white">
            ValueVerse
          </Link>
          
          <div className="flex items-center gap-6">
            {[
              { href: '/models', label: 'Models' },
              { href: '/about', label: 'About' }
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-1 text-white/90 transition-colors duration-200 hover:text-white group ${
                  isActiveLink(link.href) ? 'font-medium text-white' : ''
                }`}
              >
                {link.label}
                <span className={`absolute left-0 right-0 bottom-0 h-0.5 bg-white transform origin-left transition-transform duration-200 ${
                  isActiveLink(link.href) ? 'scale-x-100' : 'scale-x-0'
                } group-hover:scale-x-100`} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}