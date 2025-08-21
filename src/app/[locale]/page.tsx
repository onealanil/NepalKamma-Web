import Hero from '@/components/landing/Hero';
import ValueProps from '@/components/landing/ValueProps';
import HowItWorks from '@/components/landing/HowItWorks';
import { getDictionary } from '@/lib/dictionaries';
import HeaderLanding from '@/components/layout/HeaderLanding';
import Footer from '@/components/layout/Footer';
import FAQSection from '@/components/landing/faq';

interface PageProps {
  params: Promise<{ locale: 'en' | 'ne' }>;
}

export default async function LandingPage({ params }: PageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <div>
      <HeaderLanding />
      <main className="relative">
        <Hero dict={dict} />
        <FAQSection dict={dict}/>
        <ValueProps dict={dict} />
        <HowItWorks dict={dict} />
      </main>
      <Footer dict={dict} />
    </div>
  );
}

export async function generateStaticParams() {
  return [
    { locale: 'ne' },
    { locale: 'en' }
  ];
}
