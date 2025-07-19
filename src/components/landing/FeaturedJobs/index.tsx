const jobs = [
  { title: "Senior Frontend Developer", company: "TechCorp", location: "Remote" },
  { title: "UX/UI Designer", company: "DesignHub", location: "New York, NY" },
  { title: "Product Manager", company: "Innovate Inc.", location: "San Francisco, CA" },
  { title: "Data Scientist", company: "DataMinds", location: "London, UK" },
];

export default function FeaturedJobs() {
  return (
    <section className="py-20 bg-transparent text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold">Featured Jobs</h2>
          <p className="text-gray-400 mt-2">Explore some of the best opportunities available right now.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {jobs.map((job, index) => (
            <div key={index} className="bg-gray-800 bg-opacity-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
              <p className="text-gray-400 mb-1">{job.company}</p>
              <p className="text-gray-500">{job.location}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
