"use client";

const features = [
  {
    title: "Location-Based Job Discovery",
    description: "Find gig opportunities in your neighborhood or discover hidden talent near you. Connect with skilled professionals within walking distance.",
    icon: "📍"
  },
  {
    title: "Skill-Based Matching",
    description: "Whether you repair fans, fix plumbing, or teach music - showcase your skills and get matched with relevant local jobs. We link you with talented professionals.",
    icon: "🔧"
  },
  {
    title: "Instant Earnings & Quick Solutions",
    description: "Complete tasks and get paid immediately. Perfect for students seeking extra income or homeowners needing quick fixes from trusted local experts.",
    icon: "💰"
  },
];

export default function ValueProps() {
  return (
    <section id="features" className=" bg-transparent text-white">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Large top spacing + Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Why Choose Our Platform?</h2>
          <p className="text-black text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed">
            Nepal&apos;s first local gig marketplace connecting skilled neighbors with quick jobs and linking talented professionals with those who need them.
          </p>
        </div>


        {/* Centered Features Grid - Slightly narrower boxes */}
        <div className="flex justify-center mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-black backdrop-blur-sm p-8 rounded-2xl cursor-pointer text-center shadow-xl border border-gray-700/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-primary/30 max-w-sm mx-auto"
              >
                {/* Illustration placeholder */}
                <div className="text-6xl mb-6">{feature.icon}</div>

                <h3 className="text-2xl font-semibold mb-4 text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed text-base">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
