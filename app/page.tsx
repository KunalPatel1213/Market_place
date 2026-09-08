import Categories from "@/components/Categories";
import CTABanner from "@/components/CTABanner";
import Footer from "@/components/Footer";
import FeaturedProducts from "@/components/FeaturedProducts";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Navbar from "@/components/Navbar";
import Testimonials from "@/components/Testimonials";
import TrustBadges from "@/components/TrustBadges";
import WhyTrustUs from "@/components/WhyTrustUs";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustBadges />
        <FeaturedProducts />
        <HowItWorks />
        <Categories />
        <WhyTrustUs />
        <Testimonials />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
