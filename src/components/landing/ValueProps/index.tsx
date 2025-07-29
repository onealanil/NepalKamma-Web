"use client";

interface ValuePropsProps {
  dict: any;
}

export default function ValueProps({ dict }: ValuePropsProps) {
  const features = [
    {
      title: dict.landing.valueProps.features.location.title,
      description: dict.landing.valueProps.features.location.description,
      icon: "📍"
    },
    {
      title: dict.landing.valueProps.features.skill.title,
      description: dict.landing.valueProps.features.skill.description,
      icon: "🔧"
    },
    {
      title: dict.landing.valueProps.features.earnings.title,
      description: dict.landing.valueProps.features.earnings.description,
      icon: "💰"
    },
  ];

  return (
    <section id="features" className=" bg-transparent text-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            {dict.landing.valueProps.title}
          </h2>
          <p className="text-black text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed">
            {dict.landing.valueProps.subtitle}
          </p>
        </div>

        <div className="flex justify-center mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-black backdrop-blur-sm p-8 rounded-2xl cursor-pointer text-center shadow-xl border border-gray-700/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-primary/30 max-w-sm mx-auto"
              >
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
