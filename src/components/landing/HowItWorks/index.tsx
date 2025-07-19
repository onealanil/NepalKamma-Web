const steps = [
  { title: "Create Your Profile", description: "Sign up and build your professional profile in minutes." },
  { title: "Discover Job Matches", description: "Browse personalized job recommendations based on your profile." },
  { title: "Apply and Get Hired", description: "Apply with a single click and connect with your future employer." },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-transparent text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold">How It Works</h2>
          <p className="text-gray-400 mt-2">A simple process to your dream job.</p>
        </div>
        <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-8">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className="flex items-center justify-center w-16 h-16 bg-green-500 text-white rounded-full text-2xl font-bold">
                {index + 1}
              </div>
              <div className="ml-6">
                <h3 className="text-2xl font-semibold">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
