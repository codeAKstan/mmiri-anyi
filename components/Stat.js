import Image from "next/image";

export default function Stat() {
  return (
    <section className="bg-gray-50 py-16">

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
                "Since we started using Communifi, it's been easier to respond fast and track every issue. No more confusion just clear reports and clear actions"
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
    </section>
  );
}