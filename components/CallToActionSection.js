import Image from "next/image";

export default function CallToActionSection() {
  return (
    <section 
      className="relative py-20 text-white text-center"
      style={{
        backgroundImage: "url('/houses.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Opaque overlay */}
      <div 
        className="absolute inset-0" 
        style={{ backgroundColor: "#27598D", opacity: 0.3 }}
      ></div>
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Be the hero your community needs
        </h2>
        
        <p className="text-xl md:text-2xl mb-12 leading-relaxed opacity-90">
          Every report you make helps fix leaks faster, protect homes and save lives. It starts with you, one voice, one action, one safer street.
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200">
            Report a Leak
          </button>
          
          <button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-black border border-white border-opacity-50 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center space-x-2">
            <span>Call Emergency Line</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>
        </div>
        
        {/* Steward/Admin Login Link */}
        <div className="text-center">
          <a href="#" className="text-white text-opacity-80 hover:text-opacity-100 underline text-lg transition-opacity duration-200">
            Steward/Admin? Login here
          </a>
          <div className="mt-2">
            <svg className="w-6 h-6 mx-auto text-white text-opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}