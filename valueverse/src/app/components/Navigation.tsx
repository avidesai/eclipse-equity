// src/app/components/Navigation.tsx

'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../contexts/AuthContext';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActiveLink = (path: string) => pathname === path;
  const links = [
    { href: '/models', label: 'Models' },
    { href: '/account', label: 'Account' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-black/95 backdrop-blur-md shadow-lg' : 'bg-black'
    }`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="text-xl font-bold text-white hover:opacity-90 transition-opacity"
          >
            ValueVerse
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-1 text-white/90 transition-all duration-200
                           hover:text-white group ${
                  isActiveLink(link.href) ? 'font-medium text-white' : ''
                }`}
              >
                {link.label}
                <span className={`absolute left-0 right-0 bottom-0 h-0.5 bg-white
                                transform origin-left transition-transform duration-200 ${
                  isActiveLink(link.href) ? 'scale-x-100' : 'scale-x-0'
                } group-hover:scale-x-100`} />
              </Link>
            ))}

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 text-white/90 hover:text-white rounded-lg
                         hover:bg-white/10 transition-all duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? 
                <Sun className="w-5 h-5" /> : 
                <Moon className="w-5 h-5" />
              }
            </button>

            {/* Authentication Button */}
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="px-4 py-1.5 bg-white text-black rounded-lg
                          hover:bg-zinc-100 transition-all duration-200
                          hover:scale-105 active:scale-95"
              >
                Sign Out
              </button>
            ) : (
              <Link
                href="/auth"
                className="px-4 py-1.5 bg-white text-black rounded-lg
                          hover:bg-zinc-100 transition-all duration-200
                          hover:scale-105 active:scale-95"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-white/90 hover:text-white p-2 
                         hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? 
                <Sun className="w-5 h-5" /> : 
                <Moon className="w-5 h-5" />
              }
            </button>
            <button
              className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${
        isMobileMenuOpen
          ? 'max-h-64 opacity-100'
          : 'max-h-0 opacity-0 pointer-events-none'
      }`}>
        <div className="container mx-auto px-6 pb-4 space-y-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block py-2 text-white/90 transition-colors ${
                isActiveLink(link.href) ? 'text-white font-medium' : ''
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {/* Mobile Authentication Button */}
          {isAuthenticated ? (
            <button
              onClick={() => {
                logout();
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-center px-4 py-2 bg-white text-black rounded-lg
                        hover:bg-zinc-100 transition-all duration-200"
            >
              Sign Out
            </button>
          ) : (
            <Link
              href="/auth"
              className="block w-full text-center px-4 py-2 bg-white text-black rounded-lg
                        hover:bg-zinc-100 transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}