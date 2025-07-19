import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative min-h-screen pt-24 flex items-center justify-center">
      <div className='container mx-auto p-4'>
        {/* Main rounded container with border and shadow */}
        <div className="bg-white rounded-3xl shadow-2xl max-w-7xlxl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Text Content */}
            <div className="flex-1 p-8 md:px-16 md:pr-0 md:pl-20 text-center lg:text-left lg:flex-[2]">
              <h1 className="floating-animation text-2xl md:text-5xl font-extrabold mb-6 leading-tight text-black">
                In Every <span className="text-primary">Skill</span>, We Find a <span className='text-primary'>Unique Story</span>
                , and in Every Story, We Find <span className='text-primary'>Purpose</span>
              </h1>
              <p className="textmd- md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
                Nepal's first local gig marketplace. Find quick jobs near you or hire skilled locals for everyday tasks. From fan repairs to home services - earn extra income or get things done with trusted neighbors.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button className="bg-primary cursor-pointer hover:bg-accent text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Get Started
                </button>
                <button className="border-2 cursor-pointer border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300">
                  Learn More
                </button>
              </div>
              <div className="mt-8 flex items-center justify-center lg:justify-start gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Local Skills, Real Jobs</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span>Trusted Neighbors</span>
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
