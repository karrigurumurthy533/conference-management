import About from "../components/home/About";
import WhyChooseGlobalScion from "../components/home/WhyChooseGlobalScion";
import ConferencesSection from "../components/home/LatestGlobalSummits";
import SupportServices from "../components/home/SupportServices";
import HeroSection from "../components/home/HeroSection";
import EmpoweringEveryStep from "../components/home/EmpoweringEveryStep";
import SEO from "../components/common/SEO";

const Home = () => {
  return (
    <div className="min-h-screen bg-white">

      {/* =====================================================
          SEO
      ====================================================== */}
      <SEO
        title="GlobalScion Conferences | International Medical & Healthcare Conferences"
        description="GlobalScion Conferences organizes international conferences, scientific meetings, and academic events in healthcare, medicine, AI, mental health, autism, oncology, diabetes, nutrition, and cardiology."
        keywords="international conferences, medical conferences, healthcare conferences, scientific conferences, academic conferences, upcoming conferences, global conferences, international medical conferences"
        canonical="/"
      />

      {/* =====================================================
          HERO
      ====================================================== */}
      <section id="home">
        <HeroSection />
      </section>

      {/* =====================================================
          ABOUT
      ====================================================== */}
      <section id="about">
        <About />
      </section>

      {/* =====================================================
          WHY CHOOSE GLOBALSCION
      ====================================================== */}
      <section id="why-us">
        <WhyChooseGlobalScion />
      </section>

      {/* =====================================================
          UPCOMING CONFERENCES
      ====================================================== */}
      <section id="conferences">
        <ConferencesSection />
      </section>

      {/* =====================================================
          PREVIOUS CONFERENCES
      ====================================================== */}
      <section id="empoweringEveryStep">
        <EmpoweringEveryStep />
      </section>

      {/* =====================================================
          SUPPORT SERVICES
      ====================================================== */}
      <section id="services">
        <SupportServices />
      </section>

    </div>
  );
};

export default Home;