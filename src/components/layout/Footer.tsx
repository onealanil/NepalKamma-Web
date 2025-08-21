"use client";

import { Dictionary } from '@/types/dictionary/dictionary';
import { FaTwitter, FaLinkedin, FaFacebook, FaInstagram } from 'react-icons/fa';

interface FooterProps {
  dict: Dictionary;
}

export default function Footer({ dict }: FooterProps) {
  return (
    <footer className="bg-black text-white py-12 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-green-400">{dict.landing.footer.brand.title}</h3>
            <div className="text-gray-400 text-sm">
              {dict.landing.footer.brand.description1}
              <p>{dict.landing.footer.brand.description2}</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">{dict.landing.footer.jobSeekers.title}</h4>
            <ul>
              <li className="mb-2 cursor-pointer"><span className="text-gray-400 hover:text-green-400 transition duration-300">{dict.landing.footer.jobSeekers.links.browseJobs}</span></li>
              <li className="mb-2 cursor-pointer"><span className="text-gray-400 hover:text-green-400 transition duration-300">{dict.landing.footer.jobSeekers.links.advancedSearch}</span></li>
              <li className="mb-2 cursor-pointer"><span className="text-gray-400 hover:text-green-400 transition duration-300">{dict.landing.footer.jobSeekers.links.nearbyJobs}</span></li>
              <li className="mb-2 cursor-pointer"><span className="text-gray-400 hover:text-green-400 transition duration-300">{dict.landing.footer.jobSeekers.links.jobRecommendation}</span></li>
              <li className="mb-2 cursor-pointer"><span className="text-gray-400 hover:text-green-400 transition duration-300">{dict.landing.footer.jobSeekers.links.skillsShowcase}</span></li>
              <li className="mb-2 cursor-pointer"><span className="text-gray-400 hover:text-green-400 transition duration-300">{dict.landing.footer.jobSeekers.links.viewOnMap}</span></li>
              <li className="mb-2 cursor-pointer"><span className="text-gray-400 hover:text-green-400 transition duration-300">{dict.landing.footer.jobSeekers.links.directConnection}</span></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">{dict.landing.footer.jobProviders.title}</h4>
            <ul>
              <li className="mb-2 cursor-pointer"><span className="text-gray-400 hover:text-green-400 transition duration-300">{dict.landing.footer.jobProviders.links.postJob}</span></li>
              <li className="mb-2 cursor-pointer"><span className="text-gray-400 hover:text-green-400 transition duration-300">{dict.landing.footer.jobProviders.links.advancedSearch}</span></li>
              <li className="mb-2 cursor-pointer"><span className="text-gray-400 hover:text-green-400 transition duration-300">{dict.landing.footer.jobProviders.links.viewOnMap}</span></li>
              <li className="mb-2 cursor-pointer"><span className="text-gray-400 hover:text-green-400 transition duration-300">{dict.landing.footer.jobProviders.links.rateReview}</span></li>
              <li className="mb-2 cursor-pointer"><span className="text-gray-400 hover:text-green-400 transition duration-300">{dict.landing.footer.jobProviders.links.directConnection}</span></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">{dict.landing.footer.connect.title}</h4>
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
