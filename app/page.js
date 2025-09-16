import Image from "next/image";
import Header from "../components/Header";
import Hero from "../components/Hero";
import TabSection from "../components/TabSection";
import FeaturesSection from "../components/FeaturesSection";
import ImpactSection from "../components/ImpactSection";
import CallToActionSection from "../components/CallToActionSection";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="font-sans min-h-screen">
      <Header />
      <Hero />
      <TabSection />
      <FeaturesSection />
      <ImpactSection />
      <CallToActionSection />
      <Footer />
    </div>
  );
}
