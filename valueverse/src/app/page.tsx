// src/app/page.tsx
'use client';
import Navigation from './components/Navigation';
import FeatureCard from './components/FeatureCard';
import { FeatureCardProps } from './types';

const features: FeatureCardProps[] = [
  {
    title: "Interactive Models",
    description: "View and interact with DCF models directly in your browser",
    icon: "📊"
  },
  {
    title: "Secure Access",
    description: "Create an account to access all available financial models",
    icon: "🔒"
  },
  {
    title: "Easy Downloads",
    description: "Download models for offline use and customization",
    icon: "⬇️"
  }
];

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 dark:from-black dark:to-zinc-900 text-white">
          <div className="container mx-auto px-4 pt-32 pb-24">
            <div className="max-w-3xl animate-fade-in">
              <h1 className="text-5xl font-bold mb-6">
                Professional DCF Models
              </h1>
              <p className="text-xl text-zinc-300 mb-8">
                Access a curated collection of detailed discounted cash flow models. 
                View, analyze, and download professional-grade financial models.
              </p>
              <div className="flex gap-4">
                <button className="px-6 py-3 bg-white text-black rounded-lg hover:bg-zinc-100 
                                 transition-all duration-300 hover:scale-102 active:scale-98 flex items-center">
                  Get Started
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
                <button className="px-6 py-3 border border-white text-white rounded-lg hover:bg-white/10 
                                 transition-all duration-300 hover:scale-102 active:scale-98">
                  View Models
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="container mx-auto px-4 py-24">
          <h2 className="text-3xl font-bold text-center mb-16 dark:text-white animate-fade-in">
            Everything you need to analyze stocks
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
                <FeatureCard {...feature} />
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-zinc-50 dark:bg-zinc-900">
          <div className="container mx-auto px-4 py-24">
            <div className="text-center max-w-2xl mx-auto animate-fade-in">
              <h2 className="text-3xl font-bold mb-4 dark:text-white">
                Ready to explore our models?
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-8">
                Create an account to get instant access to all financial models.
                No credit card required.
              </p>
              <button className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg 
                               hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all duration-300 
                               hover:scale-102 active:scale-98">
                Create Free Account
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}