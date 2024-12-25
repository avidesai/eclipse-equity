// src/app/components/Navigation.tsx

'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../contexts/AuthContext';
import PremiumButton from './PremiumButton';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();

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

  const isHomePage = pathname === '/';

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-white/90 dark:bg-black/90 backdrop-blur-lg shadow-lg' 
        : isHomePage 
          ? 'bg-transparent' 
          : 'bg-white dark:bg-black'
    }`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className={`text-xl font-bold transition-opacity hover:opacity-80 ${
              isHomePage && !isScrolled 
                ? 'text-white' 
                : 'text-zinc-900 dark:text-white'
            }`}
          >
            ValueVerse
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-1 transition-all duration-200 group ${
                  isHomePage && !isScrolled
                    ? 'text-white hover:text-white/90'
                    : 'text-zinc-800 dark:text-zinc-200 hover:text-black dark:hover:text-white'
                } ${
                  isActiveLink(link.href) ? 'font-medium' : ''
                }`}
              >
                {link.label}
                <span className={`absolute left-0 right-0 bottom-0 h-0.5 
                                transform origin-left transition-transform duration-300 ${
                  isHomePage && !isScrolled
                    ? 'bg-white'
                    : 'bg-zinc-900 dark:bg-white'
                } ${
                  isActiveLink(link.href) ? 'scale-x-100' : 'scale-x-0'
                } group-hover:scale-x-100`} />
              </Link>
            ))}

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isHomePage && !isScrolled
                  ? 'text-white hover:bg-white/10'
                  : 'text-zinc-800 dark:text-zinc-200 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? 
                <Sun className="w-5 h-5" /> : 
                <Moon className="w-5 h-5" />
              }
            </button>

            {/* Premium Button */}
            {isAuthenticated && !user?.isPremium && <PremiumButton />}

            {/* Authentication Button */}
            {isAuthenticated ? (
              <button
                onClick={logout}
                className={`px-4 py-1.5 rounded-lg transition-all duration-300 
                          hover:scale-105 active:scale-95 ${
                  isHomePage && !isScrolled
                    ? 'bg-white text-zinc-900 hover:bg-zinc-100'
                    : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100'
                }`}
              >
                Sign Out
              </button>
            ) : (
              <Link
                href="/auth"
                className={`px-4 py-1.5 rounded-lg transition-all duration-300 
                          hover:scale-105 active:scale-95 ${
                  isHomePage && !isScrolled
                    ? 'bg-white text-zinc-900 hover:bg-zinc-100'
                    : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100'
                }`}
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`p-2 rounded-lg transition-colors ${
                isHomePage && !isScrolled
                  ? 'text-white hover:bg-white/10'
                  : 'text-zinc-800 dark:text-zinc-200 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? 
                <Sun className="w-5 h-5" /> : 
                <Moon className="w-5 h-5" />
              }
            </button>
            <button
              className={`p-2 rounded-lg transition-colors ${
                isHomePage && !isScrolled
                  ? 'text-white hover:bg-white/10'
                  : 'text-zinc-800 dark:text-white hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
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
        <div className={`container mx-auto px-6 pb-4 space-y-4 ${
          isHomePage && !isScrolled
            ? 'bg-black/90 backdrop-blur-lg'
            : 'bg-white dark:bg-black border-t border-zinc-100 dark:border-zinc-800'
        }`}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block py-2 transition-colors ${
                isHomePage && !isScrolled
                  ? 'text-white hover:text-white/90'
                  : 'text-zinc-800 dark:text-zinc-200 hover:text-black dark:hover:text-white'
              } ${
                isActiveLink(link.href) ? 'font-medium' : ''
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {/* Mobile Premium Button */}
          {isAuthenticated && !user?.isPremium && (
            <div className="block">
              <PremiumButton />
            </div>
          )}

          {/* Mobile Authentication Button */}
          {isAuthenticated ? (
            <button
              onClick={() => {
                logout();
                setIsMobileMenuOpen(false);
              }}
              className={`block w-full text-center px-4 py-2 rounded-lg 
                         transition-all duration-300 ${
                isHomePage && !isScrolled
                  ? 'bg-white text-zinc-900 hover:bg-zinc-100'
                  : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100'
              }`}
            >
              Sign Out
            </button>
          ) : (
            <Link
              href="/auth"
              className={`block w-full text-center px-4 py-2 rounded-lg 
                         transition-all duration-300 ${
                isHomePage && !isScrolled
                  ? 'bg-white text-zinc-900 hover:bg-zinc-100'
                  : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100'
              }`}
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
