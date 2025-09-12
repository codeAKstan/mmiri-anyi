'use client';
import Image from "next/image";
import { useState } from 'react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-gradient-to-r from-[#076DD700] to-[#076DD700] border-b border-blue-200/30">
      {/* Left Cloud */}
      <div 
        className="absolute left-0 top-0 w-48 h-24 bg-no-repeat bg-cover opacity-80"
        style={{ backgroundImage: 'url(/left-cloud.png)' }}
      ></div>
      
      {/* Right Cloud */}
      <div 
        className="absolute right-0 top-[-10] w-45 h-24 bg-no-repeat bg-cover opacity-80"
        style={{ backgroundImage: 'url(/right-cloud.png)' }}
      ></div>
      
      {/* Main Header Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Logo */}
          <div className="flex items-center ml-0 md:-ml-32">
            <Image
              src="/mmiri-logo.png"
              alt="MMIRI ANYI"
              width={128}
              height={128}
              className="mr-32"
            />
          </div>
          
          {/* Spacer to push content right */}
          <div className="flex-1"></div>
          
          {/* Navigation Menu */}
          <nav className="hidden md:flex space-x-8 mr-8">
            <a href="#" className="text-blue-800 hover:text-blue-600 font-medium transition-colors">
              Home
            </a>
            <a href="#" className="text-blue-800 hover:text-blue-600 font-medium transition-colors">
              About
            </a>
            <a href="#" className="text-blue-800 hover:text-blue-600 font-medium transition-colors">
              How it works
            </a>
            <a href="#" className="text-blue-800 hover:text-blue-600 font-medium transition-colors">
              Track Report
            </a>
            <a href="#" className="text-blue-800 hover:text-blue-600 font-medium transition-colors">
              Contact us
            </a>
          </nav>
          
          {/* Report a Leak Button - Hidden on mobile */}
          <div className="hidden md:flex items-center -mr-32">
            <button className="bg-[#076DD7] hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors">
              Report a Leak
            </button>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden mr-4">
            <button 
              onClick={toggleMobileMenu}
              className="text-blue-800 hover:text-blue-600 p-2"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-sm border-t border-blue-200/30">
            <div className="px-4 py-4 space-y-3">
              <a href="#" className="block text-blue-800 hover:text-blue-600 font-medium py-2 transition-colors">
                Home
              </a>
              <a href="#" className="block text-blue-800 hover:text-blue-600 font-medium py-2 transition-colors">
                About
              </a>
              <a href="#" className="block text-blue-800 hover:text-blue-600 font-medium py-2 transition-colors">
                How it works
              </a>
              <a href="#" className="block text-blue-800 hover:text-blue-600 font-medium py-2 transition-colors">
                Track Report
              </a>
              <a href="#" className="block text-blue-800 hover:text-blue-600 font-medium py-2 transition-colors">
                Contact us
              </a>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-md font-medium transition-colors mt-4">
                Report a Leak
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}