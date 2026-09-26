import About from "../components/home/About";
import WhyChooseGlobalScion from "../components/home/WhyChooseGlobalScion";
import ConferencesSection from "../components/home/LatestGlobalSummits";
import SupportServices from "../components/home/SupportServices";
import HeroSection from "../components/home/HeroSection";
import EmpoweringEveryStep from "../components/home/EmpoweringEveryStep";

const Home = () => {
  return (
    <div className="min-h-screen bg-white">

      

      {/* Hero Carousel */}
      <section id="home">
        <HeroSection />
      </section>

      {/* About */}
      <section id="about">
        <About />
      </section>
      {/* Why Choose */}
      <section id="why-us">
        <WhyChooseGlobalScion />
      </section>

      {/* 2026 Conferences */}
      <section id="conferences">
        <ConferencesSection />
      </section>

      {/* Previous Conferences */}
      <section id="empoweringEveryStep.jsx">
        <EmpoweringEveryStep/>
      </section>


      {/* Support Services */}
      <section id="services">
        <SupportServices />
      </section>

    </div>
  );
};

export default Home;