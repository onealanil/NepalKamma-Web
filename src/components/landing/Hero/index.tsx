"use client";

import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface HeroProps {
  dict: any;
}

/**
 * @function Hero
 * @returns The hero section of the landing page. It includes a floating animation for the title, a call to action, and a unique image.
 */
export default function Hero({ dict }: HeroProps) {
  const router = useRouter();

  // Function to render title with colored keywords
  const renderTitle = (title: string) => {
    // For English
    if (title.includes('Skill') && title.includes('Purpose')) {
      return title.split(' ').map((word, index) => {
        if (word === 'Skill,') {
          return <span key={index} className="text-primary">{word} </span>;
        }
         if (word === 'Unique') {
          return <span key={index} className="text-primary">{word} </span>;
        }
        if (word === 'Story,') {
          return <span key={index} className="text-accent">{word} </span>;
        }
        if (word === 'Purpose') {
          return <span key={index} className="text-primary">{word}</span>;
        }
        return <span key={index}>{word} </span>;
      });
    }
    
    // For Nepali - highlight key words
    if (title.includes('सीपमा') && title.includes('उद्देश्य')) {
      return title.split(' ').map((word, index) => {
        if (word === 'सीपमा,') {
          return <span key={index} className="text-primary">{word} </span>;
        }
        if (word === 'कथा') {
          return <span key={index} className="text-accent">{word} </span>;
        }
        if (word === 'उद्देश्य') {
          return <span key={index} className="text-primary">{word}</span>;
        }
        return <span key={index}>{word} </span>;
      });
    }

    // Fallback for any other text
    return title;
  };

  return (
    <section className="relative min-h-screen pt-24 flex items-center justify-center">
      <div className='container mx-auto p-4'>
        {/* Main rounded container with border and shadow */}
        <div className="bg-white rounded-3xl shadow-2xl max-w-7xlxl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Text Content */}
            <div className="flex-1 p-8 md:px-16 md:pr-0 md:pl-20 text-center lg:text-left lg:flex-[2]">
              <h1 className="floating-animation pt-8 md:0 text-2xl md:text-5xl font-extrabold mb-6 leading-tight text-black">
                {renderTitle(dict.landing.hero.title)}
              </h1>
              <p className="textmd- md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
                {dict.landing.hero.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button 
                  onClick={() => router.push('/auth/signin')} 
                  className="bg-primary cursor-pointer hover:bg-primary text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg"
                >
                  {dict.landing.hero.getStarted}
                </button>
                <button className="border-2 cursor-pointer border-primary text-primary hover:text-black px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300">
                  {dict.landing.hero.learnMore}
                </button>
              </div>
              <div className="mt-8 flex items-center justify-center lg:justify-start gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>{dict.landing.hero.localSkills}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span>{dict.landing.hero.trustedNeighbors}</span>
                </div>
              </div>
            </div>

            {/* Image Content */}
            <div className="flex-1 flex justify-center lg:justify-end">
              <div className="relative">
                <Image
                  src="/images/onBoarding.png"
                  alt="Onboarding"
                  width={500}
                  height={300}
                  className="rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
