import { FaTwitter, FaLinkedin, FaFacebook, FaInstagram } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-green-400">NepalKamma</h3>
            <p className="text-gray-400 text-sm">
              Connecting talent with opportunities, locally.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">For Job Seekers</h4>
            <ul>
              <li className="mb-2"><a href="#" className="text-gray-400 hover:text-green-400 transition duration-300">Browse Jobs</a></li>
              <li className="mb-2"><a href="#" className="text-gray-400 hover:text-green-400 transition duration-300">Your Profile</a></li>
              <li className="mb-2"><a href="#" className="text-gray-400 hover:text-green-400 transition duration-300">Job Alerts</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">For Employers</h4>
            <ul>
              <li className="mb-2"><a href="#" className="text-gray-400 hover:text-green-400 transition duration-300">Post a Job</a></li>
              <li className="mb-2"><a href="#" className="text-gray-400 hover:text-green-400 transition duration-300">Search Resumes</a></li>
              <li className="mb-2"><a href="#" className="text-gray-400 hover:text-green-400 transition duration-300">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">Connect With Us</h4>
            <div className="flex space-x-4 text-2xl">
              <a href="#" className="text-gray-400 hover:text-green-400 transition duration-300"><FaTwitter /></a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition duration-300"><FaLinkedin /></a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition duration-300"><FaFacebook /></a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition duration-300"><FaInstagram /></a>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} NepalKamma. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
