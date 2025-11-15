import Image from "next/image";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Stat from "../../components/Stat";
import CallToActionSection from "../../components/CallToActionSection";


export default function AboutPage() {
  const steps = [
    {
      title: "Spot and Report",
      desc: "Identify any civic issue in your neighborhood and report it quickly.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M12 3a9 9 0 019 9c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9zm0 4a5 5 0 100 10 5 5 0 000-10z" />
        </svg>
      ),
    },
    {
      title: "Describe the Issue",
      desc: "Provide clear details of the problem when you submit the form.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M5 4a2 2 0 00-2 2v12a2 2 0 002 2h8l6-6V6a2 2 0 00-2-2H5zm8 12v4l4-4h-4z" />
        </svg>
      ),
    },
    {
      title: "Get a Tracking ID",
      desc: "Receive a unique tracking ID to follow the progress of your report.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M12 2a5 5 0 015 5v2h3a1 1 0 011 1v9a1 1 0 01-1 1H4a1 1 0 01-1-1V10a1 1 0 011-1h3V7a5 5 0 015-5zm-3 7h6V7a3 3 0 10-6 0v2z" />
        </svg>
      ),
    },
    {
      title: "Expert Response",
      desc: "Authorities review your report, take action, and keep you updated.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M12 12a5 5 0 10.001-10.001A5 5 0 0012 12zm-9 9a9 9 0 1118 0H3z" />
        </svg>
      ),
    },
  ];

  const mission = [
    {
      title: "Safety",
      desc: "Creating secure environments where every citizen feels protected and heard.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
          <path d="M12 2l8 4v6c0 5-3.5 9.5-8 10-4.5-.5-8-5-8-10V6l8-4z" />
        </svg>
      ),
    },
    {
      title: "Cleanliness",
      desc: "Promoting clean, sustainable communities through active citizen participation.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
          <path d="M12 3a9 9 0 100 18 9 9 0 000-18zm4 5l-6 6-2-2-2 2 4 4 8-8-2-2z" />
        </svg>
      ),
    },
    {
      title: "Transparency",
      desc: "Building trust through open communication and accountable governance.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
          <path d="M12 4a8 8 0 018 8c-2.5 4.5-6 6-8 6s-5.5-1.5-8-6a8 8 0 018-8zm0 4a4 4 0 100 8 4 4 0 000-8z" />
        </svg>
      ),
    },
    {
      title: "Community Empowerment",
      desc: "Giving citizens the tools to shape their neighborhoods.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
          <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm-9 9a9 9 0 1118 0H3z" />
        </svg>
      ),
    },
  ];

  const recent = [
    {
      title: "Broken Streetlight on Maple Street",
      location: "Zone 3, Abakpa Nike Enugu State",
      time: "02:39 am today",
      status: "In Progress",
      img: "/street-light.png",
    },
    {
      title: "Overflowing Waste Bins",
      location: "Near Holy Ghost Park Enugu",
      time: "06:09 am today",
      status: "In Progress",
      img: "/wastebins.png",
    },
    {
      title: "Burst Pipe Damaging Sidewalk",
      location: "Central Market Ikpa, Nsukka",
      time: "08:39 am today",
      status: "In Progress",
      img: "/women.png",
    },
    {
      title: "Potholes Causing Traffic",
      location: "Unity road, Eziama Nsukka, Enugu State",
      time: "02:39 pm today",
      status: "In Review",
      img: "/potholes.png",
    },
    {
      title: "Leaking Water Pipe",
      location: "Harmony road, Nkwo Nike road",
      time: "24hrs ago",
      status: "Resolved",
      img: "/leaking.png",
    },
  ];

  return (
    <div className="font-sans min-h-screen">
      <Header />

      <section className="bg-gradient-to-b from-blue-50 to-white pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Connecting Citizens, Empowering Communities</h1>
              <p className="text-gray-700 mb-8 max-w-xl">COMMUNIFI is a civic engagement platform that bridges the gap between citizens and local authorities. Report issues, track progress, and contribute to building safer, cleaner, and more transparent communities.</p>
              <div className="flex flex-wrap gap-4">
                <a href="/report" className="bg-[#076DD7] hover:bg-blue-700 text-white px-5 py-3 rounded-md font-medium">Report an Issue</a>
                <a href="tel:+2348131944801" className="border border-gray-300 text-gray-800 hover:bg-gray-100 px-5 py-3 rounded-md font-medium flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.68l1.5 4.49a1 1 0 01-.5 1.21l-2.26 1.13a11.04 11.04 0 005.52 5.52l1.13-2.26a1 1 0 011.21-.5l4.49 1.5a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z"/></svg>
                  Call Emergency Line
                </a>
              </div>
            </div>
            <div className="rounded-3xl overflow-hidden bg-white">
              <Image src="/citizens.png" alt="Community engagement" width={720} height={480} className="w-full h-auto" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Our Mission</h2>
            <p className="text-gray-600 text-lg">We're committed to transforming civic engagement by making it accessible, efficient, and impactful for everyone.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mission.map((m) => (
              <div key={m.title} className="bg-blue-50 rounded-2xl p-6">
                <div className="w-14 h-14 bg-[#076DD7] text-white rounded-full flex items-center justify-center mb-4 mx-auto">
                  {m.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 text-center mb-2">{m.title}</h3>
                <p className="text-gray-600 text-sm text-center">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#0B0F2C] to-[#0E1440] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-3 lg:px-8">
          <div className="bg-[#076DD7]  p-6 text-white">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">How to report a problem</h2>
              <p className="text-blue-200">Quickly report any civic issue in your community and receive an immediate response from our team</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="space-y-6">
                {steps.map((s, idx) => (
                  <div key={s.title} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                      {s.icon}
                    </div>
                    <div>
                      <div className="text-sm text-blue-200">{String(idx + 1).padStart(2, "0")}</div>
                      <h4 className="text-lg font-semibold text-white">{s.title}</h4>
                      <p className="text-blue-200 text-sm">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-2">
                <div className="bg-white p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Recently reported problems</h3>
                  <div className="space-y-5">
                    {recent.map((r) => (
                      <div key={r.title} className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{r.title}</div>
                          <div className="text-sm text-gray-600">📍 {r.location}</div>
                          <div className="text-xs text-gray-500">{r.time}</div>
                        </div>
                        <Image src={r.img} alt={r.title} width={120} height={80} className="rounded-lg w-[120px] h-[80px] object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Stat />
      <CallToActionSection />
      
      <Footer />
    </div>
  );
}