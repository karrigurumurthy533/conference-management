import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Conferences from "./pages/Conferences";
import Speakers from "./pages/Speakers";
import ConferenceDetails from "./pages/ConferenceDetails";
import PaymentPage from "./pages/PaymentPage";

import Reviews from "./pages/Reviews";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";

import ScrollToTop from "./components/common/ScrollToTop";

import About from "./pages/About";
import DownloadBrochure from "./pages/DownloadBrochure";
import AbstractSubmissionPage from "./pages/AbstractSubmissionPage";
import ContactPage from "./pages/Contact";
import RegisterPage from "./pages/RegisterPage";
import TawkChat from "./components/common/TawkChat";
import ScientificProgram from "./pages/ScientificProgram";
import Toaster from "./components/common/Toaster";

const App = () => {
  return (
    <div className="min-h-screen bg-white">
      <ScrollToTop />
      <Toaster />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route path="/conferences" element={<Conferences />} />

        {/* =====================================================
            CONFERENCE DETAILS
        ====================================================== */}
        <Route path="/conferences/:id" element={<ConferenceDetails />} />

        {/* =====================================================
            REGISTER
        ====================================================== */}
        <Route path="/conferences/:id/register" element={<RegisterPage />} />

        <Route path="/payment/:registrationId" element={<PaymentPage />} />

        {/* =====================================================
            ABSTRACT SUBMISSION
        ====================================================== */}
        <Route
          path="/conferences/:id/abstract-submission"
          element={<AbstractSubmissionPage />}
        />

        <Route
          path="/conferences/:id/scientific-program"
          element={<ScientificProgram />}
        />

        {/* =====================================================
            BROCHURE
        ====================================================== */}
        <Route
          path="/conferences/:id/brochure"
          element={<DownloadBrochure />}
        />

        {/* =====================================================
            SPEAKERS
        ====================================================== */}
        <Route path="/speakers" element={<Speakers />} />

        {/* =====================================================
            REVIEWS
        ====================================================== */}
        <Route path="/reviews" element={<Reviews />} />

        {/* =====================================================
            TERMS & CONDITIONS
        ====================================================== */}
        <Route path="/terms" element={<Terms />} />

        {/* =====================================================
            GLOBAL PRIVACY POLICY
        ====================================================== */}
        <Route path="/privacy" element={<Privacy />} />

        {/* =====================================================
            CONTACT
        ====================================================== */}
        <Route path="/contact" element={<ContactPage />} />
      </Routes>

      <Footer />
      <TawkChat />
    </div>
  );
};

export default App;
