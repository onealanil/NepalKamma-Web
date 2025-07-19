import Hero from '@/components/landing/Hero';
import ValueProps from '@/components/landing/ValueProps';
import HowItWorks from '@/components/landing/HowItWorks';
import Testimonials from '@/components/landing/Testimonials';

export default function LandingPage() {
  return (
    <main>
      <Hero />
      <ValueProps />
      <HowItWorks />
    </main>
  );
}
