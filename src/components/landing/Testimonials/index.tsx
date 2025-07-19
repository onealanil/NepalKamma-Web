const testimonials = [
  {
    quote: "This platform helped me find my dream job in just two weeks. The process was seamless and efficient.",
    name: "Sarah Johnson",
    title: "Software Engineer at TechCorp",
  },
  {
    quote: "As an employer, I was impressed with the quality of candidates. We found the perfect fit for our team.",
    name: "Michael Chen",
    title: "Hiring Manager at Innovate Inc.",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 bg-transparent text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white">What Our Users Say</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-gray-800 bg-opacity-50 p-8 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:bg-opacity-70 border border-gray-700"
            >
              <p className="text-lg italic mb-4 text-gray-300">&quot;{testimonial.quote}&quot;</p>
              <p className="font-semibold text-white">{testimonial.name}</p>
              <p className="text-gray-400 text-sm">{testimonial.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
