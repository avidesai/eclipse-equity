// src/app/components/FeatureCard.tsx
'use client';
import { FeatureCardProps } from '../types';

export default function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="p-6 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 
                    hover:shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2 dark:text-white">{title}</h3>
      <p className="text-zinc-600 dark:text-zinc-400">{description}</p>
    </div>
  );
}