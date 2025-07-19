export default function Footer() {
  return (
    <footer className="bg-transparent text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">JobPlatform</h3>
            <p className="text-gray-400">
              Find your dream job, or the perfect candidate.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">For Job Seekers</h4>
            <ul>
              <li><a href="#" className="text-gray-400 hover:text-white">Browse Jobs</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Your Profile</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Job Alerts</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">For Employers</h4>
            <ul>
              <li><a href="#" className="text-gray-400 hover:text-white">Post a Job</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Search Resumes</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-white">LinkedIn</a>
              <a href="#" className="text-gray-400 hover:text-white">Facebook</a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-500">
          &copy; {new Date().getFullYear()} JobPlatform. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
