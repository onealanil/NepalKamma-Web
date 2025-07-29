import Hero from '@/components/landing/Hero';
import ValueProps from '@/components/landing/ValueProps';
import HowItWorks from '@/components/landing/HowItWorks';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { getDictionary } from '@/lib/dictionaries';
import HeaderLanding from '@/components/layout/HeaderLanding';

interface PageProps {
  params: Promise<{ locale: 'en' | 'ne' }>;
}

export default async function LandingPage({ params }: PageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <div>
      <HeaderLanding/>
    <main className="relative">
      <Hero dict={dict} />
      <ValueProps dict={dict} />
      <HowItWorks dict={dict} />
    </main>
    </div>
  );
}

export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'ne' }
  ];
}
