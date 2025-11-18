import Image from "next/image";
import Link from "next/link";

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
        <Image src="/three-drops-left.png" alt="Water drops" width={42} height={42} className="absolute bottom-100 left-1/3" />
        <Image src="/three-drops-2.png" alt="Water drop" width={32} height={32} className="absolute bottom-100 right-1/3" />
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
              Simple, transparent civic reporting built for lasting impact
            </p>
          </div>

          {/* Main heading */}
          <h1 className="text-xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
            Report, track and stay informed
            <br />
            <span className="text-[#000]">about local issues in your community</span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed">
            Community driven civic issues (like water issues, road potholes, street lighting, waste management issues) reporting platform that connects citizens and local authorities, enabling people to detect, report and resolve everyday problems
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/report" className="bg-[#076DD7] hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg">
              Report an issue
            </Link>
            <button className="hover:bg-gray-50 text-black px-8 py-4 rounded-lg  text-lg transition-colors shadow-lg border border-blue-200">
              How it Works
            </button>
          </div>

          {/* Admin login link */}
          <div className="text-center mb-64">
            <a href="#" className="text-gray-500 hover:text-gray-700 font-medium transition-colors">
              Steward/Admin? Login here
            </a>
            <div className="mt-4">
              <Image 
                src="/arrow-down.png" 
                alt="Arrow down" 
                width={16} 
                height={16} 
                className="mx-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom water decoration */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-64 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/water.png)' }}
      ></div>
    </section>
  );
}