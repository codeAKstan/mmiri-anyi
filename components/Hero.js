import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-gradient-to-b from-[#F3FBFF] via-[#FFFFFF] to-[#F3FBFF] overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        {/* Water drops scattered around */}
        {/* <Image src="/three-drops.png" alt="Water drops" width={32} height={32} className="absolute top-20 left-10" /> */}
        {/* <Image src="/dropy.png" alt="Water drop" width={16} height={16} className="absolute top-32 right-20" /> */}
        {/* <Image src="/dropy.png" alt="Water drop" width={24} height={24} className="absolute top-40 left-1/4" /> */}
        <Image src="/three-drops.png" alt="Water drops" width={42} height={42} className="absolute top-45 right-1/3 " />
        {/* <Image src="/dropy.png" alt="Water drop" width={16} height={16} className="absolute top-80 left-1/2" /> */}
        <Image src="/three-drops-left.png" alt="Water drops" width={42} height={42} className="absolute bottom-40 left-1/3" />
        <Image src="/three-drops-2.png" alt="Water drop" width={32} height={32} className="absolute bottom-40 right-1/3" />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="text-center">
          {/* Tagline with water drop icon */}
          <div className="flex items-center justify-center mb-8 bg-gradient-to-r from-[#EDF7FF] to-[#F3FBFF] py-1 px-2 rounded-full max-w-lg mx-auto">
            <Image
              src="/droplet.png"
              alt="Water droplet"
              width={64}
              height={64}
              className="mr-2"
            />
            <p className="text-[#000000] font-medium text-sm">
              Secure, transparent water tracking built for lasting impact
            </p>
          </div>

          {/* Main heading */}
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
            Empowering People of Enugu
            <br />
            <span className="text-[#000]">Protecting Every Drop of water</span>
          </h1>

          {/* Description */}
          <p className="text-2xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed">
            A community driven smart water monitoring system for Enugu state,
            reduces waste and brings the government closer to the communities
            it serves, working together to detect, report and resolve water issues
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button className="bg-[#076DD7] hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg">
              Report a Leak
            </button>
            <button className="hover:bg-gray-50 text-black px-8 py-4 rounded-lg  text-lg transition-colors shadow-lg border border-blue-200">
              How it Works
            </button>
          </div>

          {/* Admin login link */}
          <div className="text-center">
            <a href="#" className="text-gray-500 hover:text-gray-700 font-medium transition-colors">
              Steward/Admin? Login here
            </a>
            <div className="mt-4">
              <svg className="w-6 h-6 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-24" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z" fill="#3B82F6" fillOpacity="0.8"></path>
        </svg>
      </div>
    </section>
  );
}