import Image from "next/image";

export default function FeaturesSection() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Simple Steps. Real Impact.
          </h2>
          <p className="text-xl text-blue-500 font-medium">
            Verified reports. Transparent fixes
          </p>
        </div>

        {/* Main content */}
        <div className="space-y-8">
          {/* Top section - Dashboard and Spot & Report */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left side - Dashboard card */}
             <div className="lg:col-span-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">
                Real-Time Dashboard for Fast Action
              </h3>
              <p className="text-blue-100 mb-8 leading-relaxed">
                Get a glimpse of the live system our stewards and admins use to
                track, manage, and resolve water issues across communities.
              </p>
              
              {/* Dashboard preview */}
              <div className="bg-white rounded-2xl p-6">
                <Image
                  src="/dashboard.png"
                  alt="Dashboard preview"
                  width={500}
                  height={300}
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>

            {/* Right side - Spot and Report card */}
             <div className="lg:col-span-1 bg-blue-50 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-[#076DD7] rounded-full flex items-center justify-center mx-auto mb-4">
                <Image
                  src="/eye.png"
                  alt="Eye icon"
                  width={24}
                  height={24}
                  className="filter brightness-0 invert"
                />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                Spot and Report
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Submit a leak, pipe burst, or water shortage through the web or USSD.
              </p>
              <div className="mt-4 bg-white rounded-lg p-4">
                <Image
                  src="/paper-sheet.png"
                  alt="Report form"
                  width={200}
                  height={150}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>

          {/* Bottom section - Three feature cards in a row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Immediate Alert */}
            <div className="bg-blue-50 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Image
                  src="/alert.png"
                  alt="Notification icon"
                  width={24}
                  height={24}
                  className="filter brightness-0 invert"
                />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                Immediate Alert
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Our stewards is instantly notified with the exact location and details of your report.
              </p>
              <div className="mt-4">
                <Image
                  src="/notification.png"
                  alt="Notification"
                  width={60}
                  height={40}
                  className="mx-auto"
                />
              </div>
            </div>

            {/* Expert Response */}
            <div className="bg-blue-50 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Image
                  src="/car-icon.png"
                  alt="Car icon"
                  width={24}
                  height={24}
                  className="filter brightness-0 invert"
                />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                Expert Response
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Trained water stewards inspect, verify and takes action until it's fully resolved.
              </p>
              <div className="mt-4">
                <div className="bg-blue-200 rounded-lg p-4">
                  <Image
                    src="/car.png"
                    alt="Service vehicle"
                    width={60}
                    height={40}
                    className="mx-auto"
                  />
                </div>
              </div>
            </div>

            {/* Get Updates */}
            <div className="bg-blue-50 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Image
                  src="/update-icon.png"
                  alt="Update icon"
                  width={24}
                  height={24}
                  className="filter brightness-0 invert"
                />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                Get Updates
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Get real time updates on every report from when it's received, to when it's finally resolved
              </p>
              <div className="mt-4">
                <Image
                  src="/update-img.png"
                  alt="Update image"
                  width={60}
                  height={40}
                  className="mx-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}