"use client";

import Hero from '@/components/landing/Hero';
import ValueProps from '@/components/landing/ValueProps';
import HowItWorks from '@/components/landing/HowItWorks';

export default function LandingPage() {
  return (
    <main>
      <Hero />
      <ValueProps />
      <HowItWorks />
    </main>
  );
}
