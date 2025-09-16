import Image from "next/image";

export default function ImpactSection() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Key Features Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left side - Image */}
          <div className="order-2 lg:order-1">
            <Image
              src="/guy-fixing-tap.png"
              alt="Water technician fixing tap"
              width={500}
              height={400}
              className="w-full h-auto rounded-lg"
            />
          </div>

          {/* Right side - Features */}
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Know more about our key features
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              From real time alerts to zone level tracking, with features that bring speed, transparency and structure to water issue resolution.
            </p>

            {/* Features List */}
            <div className="space-y-6">
              {/* Real-Time Alerts */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-1">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">
                    Real-Time Alerts
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Automatically notifies the right steward or authority when a new water issue is reported. No delays, no confusion.
                  </p>
                </div>
              </div>

              {/* Zone Based Tracking */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-1">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">
                    Zone Based Tracking
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Reports are tagged and traced based on specific zones or wards, making it easier to respond quickly and manage resources effectively.
                  </p>
                </div>
              </div>

              {/* Get Rewarded by Reporting */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-1">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">
                    Get Rewarded by Reporting
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Citizens earn points and badges each time they successfully report verified water issues. The more you contribute to saving community, the more recognition and real world rewards you receive.
                  </p>
                </div>
              </div>
            </div>

            {/* See Full Feature Set Button */}
            <div className="mt-8">
              <button className="bg-blue-100 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-200 transition-colors duration-200 flex items-center space-x-2">
                <span>See Full Feature Set</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Real Impact, Real Results Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Real Impact, Real Results
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of community heroes who are making a difference. See the measurable impact of collective action in flood prevention
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-[#BADAFB] rounded-lg p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-gray-900 mb-2">2,310+</div>
            <div className="text-gray-600 text-sm">Water issues reported</div>
          </div>
          <div className="bg-[#BADAFB] rounded-lg p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-gray-900 mb-2">5</div>
            <div className="text-gray-600 text-sm">Local Zones covered</div>
          </div>
          <div className="bg-[#BADAFB] rounded-lg p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-gray-900 mb-2">98%</div>
            <div className="text-gray-600 text-sm">Steward response rate</div>
          </div>
          <div className="bg-[#BADAFB] rounded-lg p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-gray-900 mb-2">24/7</div>
            <div className="text-gray-600 text-sm">Active support</div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-12">
            What our community says
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Nneka Sarah */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <Image
                  src="/sarah.png"
                  alt="Nneka Sarah"
                  width={60}
                  height={60}
                  className="rounded-full mr-4"
                />
                <div>
                  <h4 className="font-bold text-gray-900">Nneka Sarah</h4>
                  <p className="text-sm text-gray-600">Community Steward, Enugu South</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm italic">
                "Since we started using MMIRI ANYI, it's been easier to respond fast and track every issue. No more confusion just clear reports and clear actions"
              </p>
            </div>

            {/* Ifeoma N. */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <Image
                  src="/ifeoma.png"
                  alt="Ifeoma N."
                  width={60}
                  height={60}
                  className="rounded-full mr-4"
                />
                <div>
                  <h4 className="font-bold text-gray-900">Ifeoma N.</h4>
                  <p className="text-sm text-gray-600">Community Member, Resident, Abakpa</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm italic">
                "I used the platform to report a burst pipe on my street at Abakpa Nike. Within hours, someone was already checking it I felt heard for the first time"
              </p>
            </div>

            {/* Engr. Uche A. */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <Image
                  src="/uche.png"
                  alt="Engr. Uche A."
                  width={60}
                  height={60}
                  className="rounded-full mr-4"
                />
                <div>
                  <h4 className="font-bold text-gray-900">Engr. Uche A.</h4>
                  <p className="text-sm text-gray-600">Local Government Official, Enugu Water Dept.</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm italic">
                "This app helps us manage water issues more efficiently. We can now see what's happening across zones in real time and prioritize better"
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}