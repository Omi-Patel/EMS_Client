"use client";

import { createFileRoute } from "@tanstack/react-router";

import HeroSection from "@/components/Landing-Page/hero-section";
import StatsSection from "@/components/Landing-Page/stats-section";
import FeaturesSection from "@/components/Landing-Page/features-section";
import TestimonialsSection from "@/components/Landing-Page/testimonials-section";
import CtaSection from "@/components/Landing-Page/cta-section";
import Footer from "@/components/Landing-Page/footer";
import Header from "@/components/Landing-Page/Header";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
