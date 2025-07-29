"use client";

import LandingAnimation from "@/components/animation/LandingAnimation";

interface HowItWorksProps {
  dict: any;
}

export default function HowItWorks({ dict }: HowItWorksProps) {
  const steps = [
    {
      title: dict.landing.howItWorks.steps.profile.title,
      description: dict.landing.howItWorks.steps.profile.description,
      icon: "👤",
      color: "from-[var(--primary)] to-[var(--accent)]"
    },
    {
      title: dict.landing.howItWorks.steps.browse.title,
      description: dict.landing.howItWorks.steps.browse.description,
      icon: "🌍",
      color: "from-[var(--primary)] to-[var(--accent)]"
    },
    {
      title: dict.landing.howItWorks.steps.complete.title,
      description: dict.landing.howItWorks.steps.complete.description,
      icon: "💰",
      color: "from-[var(--primary)] to-[var(--accent)]"
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--background)] via-transparent to-[var(--background)] opacity-90 z-0"></div>

      {/* Main content container */}
      <div className="container mx-auto px-4 max-w-7xl relative z-10">

        <div className="flex flex-col lg:flex-row items-center justify-between gap-5 mb-10 md:mb-32">

          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-4xl md:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
              {dict.landing.howItWorks.title}
            </h2>
            <p className="text-gray-300 text-xl md:text-2xl mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {dict.landing.howItWorks.subtitle}
            </p>
            <div className="flex items-center justify-center lg:justify-start gap-4">
              {/* Pulsing dot for attention, using primary color */}
              <div className="w-3 h-3 bg-[var(--primary)] rounded-full animate-pulse shadow-lg"></div>
              <span className="text-lg text-gray-200">{dict.landing.howItWorks.getStarted}</span>
            </div>
          </div>

          {/* Rocket Animation */}
          <div className="flex-1 flex justify-center lg:justify-end">
            <div className="relative">
              {/* Subtle blur for depth, using primary color */}
              <div className="absolute inset-0 bg-[var(--primary)]/30 rounded-full blur-3xl scale-150 animate-pulse-light"></div>
              <LandingAnimation />
            </div>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group cursor-pointer relative bg-[var(--card)]/60 backdrop-blur-md p-8 lg:p-10 rounded-3xl shadow-2xl border border-gray-700/50
                         transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl hover:border-[var(--primary)]/30
                         flex flex-col items-center text-center"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 to-[var(--accent)]/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className={`relative flex items-center justify-center w-20 h-20 bg-gradient-to-r ${step.color} text-white rounded-2xl text-2xl font-bold mb-8 mx-auto shadow-lg
                                group-hover:scale-110 transition-transform duration-300 ease-out transform-gpu
                                overflow-hidden`}>
                <span className="relative z-10">{index + 1}</span>
                <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <div className="text-5xl mb-6 text-center group-hover:scale-110 transition-transform duration-300 ease-out">
                {step.icon}
              </div>

              <h3 className="text-2xl lg:text-3xl font-bold text-white text-center mb-6 group-hover:text-[var(--primary)] transition-colors duration-300">
                {step.title}
              </h3>
              <p className="text-gray-400 text-center leading-relaxed text-lg group-hover:text-gray-300 transition-colors duration-300">
                {step.description}
              </p>

              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-6 lg:-right-12 w-6 lg:w-12 h-0.5 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] opacity-30"></div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-20 md:mt-24">
          <button className="bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] hover:from-[var(--accent)] hover:to-[var(--primary)] text-white px-12 py-4 rounded-2xl font-bold text-xl
                             transition-all duration-300 transform hover:scale-105 shadow-2xl border border-[var(--primary)]/30 hover:border-[var(--accent)]/50
                             focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/50 active:scale-95">
            Start Your Journey
          </button>
        </div>
      </div>
    </section>
  );
}
