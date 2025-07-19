const features = [
  {
    title: "Personalized Job Matches",
    description: "Our smart algorithm connects you with jobs that match your skills and experience.",
  },
  {
    title: "Effortless Application Process",
    description: "Apply to jobs with a single click and track your applications all in one place.",
  },
  {
    title: "Connect with Top Employers",
    description: "Get discovered by leading companies in your field.",
  },
];

export default function ValueProps() {
  return (
    <section id="features" className="py-20 bg-transparent text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold">Why Choose Us?</h2>
          <p className="text-gray-400 mt-2">The features that make us the best choice for your career.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-800 bg-opacity-50 p-8 rounded-lg text-center">
              <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
