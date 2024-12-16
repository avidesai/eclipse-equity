// /src/app/page.tsx

'use client';
import { ArrowRight } from 'lucide-react';
import Navigation from './components/Navigation';
import FeatureCard from './components/FeatureCard';
import { FeatureCardProps } from './types';

const features: FeatureCardProps[] = [
  {
    title: "Exclusive Access",
    description: "Sign up to unlock our growing database of financial models.",
    icon: "🔐"
  },
  {
    title: "Interactive Financial Models",
    description: "Access discounted cash flow models with real-time data and analyst forecasts.",
    icon: "📊"
  },
  {
    title: "Seamless Downloads",
    description: "Easily download models for offline customization. Compatible with Excel and Google Sheets.",
    icon: "⬇️"
  }
];

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-zinc-900 to-zinc-800 
                      dark:from-black dark:to-zinc-900 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] 
                         bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          <div className="container mx-auto px-6 pt-36 pb-24 relative">
            <div className="max-w-3xl ml-0 md:ml-8 lg:ml-12 animate-fadeIn">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Financial Models for Investors
              </h1>
              <p className="text-lg md:text-xl text-zinc-300 mb-8 leading-relaxed max-w-2xl">
                Access a curated collection of discounted cash flow models for your investment research.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-6 py-3 bg-white text-black rounded-lg 
                                 hover:bg-zinc-100 transition-all duration-300 
                                 hover:translate-y-[-2px] active:translate-y-0
                                 flex items-center justify-center group">
                  Get Started
                  <ArrowRight className="ml-2 w-4 h-4 transform transition-transform 
                                       group-hover:translate-x-1" />
                </button>
                <button className="px-6 py-3 border-2 border-white text-white rounded-lg 
                                 hover:bg-white/10 transition-all duration-300
                                 hover:translate-y-[-2px] active:translate-y-0">
                  View Models
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="container mx-auto px-6 py-24 bg-white dark:bg-zinc-900">
          <h2 className="text-3xl font-bold text-center mb-16 dark:text-white animate-fadeIn">
            Everything you need to analyze stocks
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} 
                   className="animate-fadeIn" 
                   style={{ animationDelay: `${index * 150}ms` }}>
                <FeatureCard {...feature} />
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section with distinct styling */}
        <div className="relative py-24 overflow-hidden">
          {/* Background with subtle pattern */}
          <div className="absolute inset-0 bg-zinc-50 dark:bg-zinc-800">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000009_1px,transparent_1px),linear-gradient(to_bottom,#00000009_1px,transparent_1px)] 
                           dark:bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)]
                           bg-[size:20px_20px]" />
          </div>
          
          <div className="container mx-auto px-6 relative">
            <div className="text-center max-w-2xl mx-auto animate-fadeIn">
              <div className="relative bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm 
                            rounded-2xl p-8 shadow-lg border border-zinc-100 dark:border-zinc-700">
                <h2 className="text-3xl font-bold mb-4 dark:text-white">
                  Ready to explore our models?
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 mb-8">
                  Create an account to get instant access to all financial models.
                </p>
                <button className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black 
                                 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-100 
                                 transition-all duration-300 hover:translate-y-[-2px] 
                                 active:translate-y-0 shadow-sm">
                  Create Free Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}