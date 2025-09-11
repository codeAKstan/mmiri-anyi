import Image from "next/image";
import Header from "../components/Header";
import Hero from "../components/Hero";
import TabSection from "../components/TabSection";

export default function Home() {
  return (
    <div className="font-sans min-h-screen">
      <Header />
      <Hero />
      <TabSection />
    </div>
  );
}
