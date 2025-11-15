'use client';

import { useState } from 'react';
import Image from 'next/image';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useRouter } from 'next/navigation';
import CallToActionSection from "../../components/CallToActionSection";


export default function HowItWorksPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const filters = [
    'Water Issues',
    'Road Potholes',
    'Resolved',
    'In Review',
    'Street Lighting',
    'Waste Management Issues',
    'In Progress',
  ];

  const reports = [
    {
      title: 'Broken Street Light on Oak Avenue',
      location: 'Oak Avenue & 5th Street, Downtown District',
      date: 'November 10, 2025 at 2:30 PM',
      description:
        "The street light at the intersection of Oak Avenue and 5th Street has been non-functional for the past week. This poses a safety hazard for pedestrians and drivers during nighttime.",
      images: ['/fixed.png', '/unfixed.png'],
    },
    {
      title: 'Large Potholes Along Presidential Road',
      location: 'Presidential Road by Ogui Junction, Enugu State',
      date: 'November 14, 2025 at 11:45 AM',
      description:
        'These potholes have been growing over the past two weeks and now increasing the risk of accidents. The damaged areas cover a significant portion of the right lane, making navigation difficult.',
      images: ['/pothole.png'],
    },
    {
      title: 'Burst Water Pipe Flooding Ug Bene Street',
      location: 'Ugbene Street by Abakpa Junction, Enugu State',
      date: 'November 14, 2025 at 9:20 AM',
      description:
        'The affected area has become slippery and difficult for pedestrians and motorcycle riders to pass. The leakage started two days ago and is progressively worsening.',
      images: ['/leaking.png', '/guy-fixing-tap.png'],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero */}
        <section className="pt-24 pb-16 bg-black text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold leading-snug mb-4">
                  Report, track and stay informed about local issues in your community
                </h1>
                <p className="text-blue-200 mb-6">
                  (like water issues, road potholes, street lighting, waste management issues)
                </p>
                <div className="flex gap-2 bg-white rounded-lg p-2 w-full max-w-xl">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter your report ID (e.g., RPT-2024-1234)"
                    className="flex-1 px-3 py-2 rounded-md border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => router.push('/track')}
                    className="bg-[#076DD7] text-white px-4 py-2 rounded-md"
                  >
                    Search
                  </button>
                </div>
              </div>
              <div className="rounded-3xl overflow-hidden">
                <Image src="/steward.png" alt="Community issue" width={720} height={480} className="w-full h-auto" />
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="bg-white py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <button className="inline-flex items-center gap-2 px-4 py-2 border rounded-md text-gray-700">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="2" d="M4 6h16M6 12h12M8 18h8"/></svg>
                  Filters
                </button>
                <button className="text-blue-600">Clear all</button>
              </div>
              <div>
                <button className="px-4 py-2 border rounded-md text-gray-700">Sort by ▾</button>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
              {filters.map((f) => (
                <span key={f} className="px-4 py-2 bg-black text-white rounded-full">
                  {f} <span className="ml-2">✕</span>
                </span>
              ))}
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.map((r) => (
                <div key={r.title} className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-blue-800 font-semibold mb-2">Report Details</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Report Title</span>
                      <p className="text-black font-medium">{r.title}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Location</span>
                      <p className="text-black">{r.location}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Date Submitted</span>
                      <p className="text-black">{r.date}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Description</span>
                      <p className="text-black">{r.description}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Attached Image</span>
                      <div className="flex gap-2 mt-2">
                        {r.images.map((img, i) => (
                          <Image key={img + i} src={img} alt="attachment" width={80} height={60} className="rounded-md object-cover" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dashboard */}
        <section className="bg-white pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl border border-blue-600 overflow-hidden">
              <Image src="/chart.png" alt="Dashboard chart" width={1200} height={700} className="w-full h-auto" />
            </div>
          </div>
        </section>
      </main>
              <CallToActionSection />
      <Footer />
    </div>
  );
}