import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Conferences from "./pages/Conferences";
import Speakers from "./pages/Speakers";
import ConferenceDetails from "./pages/ConferenceDetails";

import Reviews from "./pages/Reviews";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import Chatbot from "./components/common/Chatbot";
import ScrollToTop from "./components/common/ScrollToTop";

import About from "./pages/About";
import DownloadBrochure from "./pages/DownloadBrochure";
import AbstractSubmissionPage from "./pages/AbstractSubmissionPage";
import ContactPage from "./pages/Contact";
import RegisterPage from "./pages/RegisterPage";

const App = () => {
  return (
    <div className="min-h-screen bg-white">
      <ScrollToTop />
      <Navbar />

      <Routes>
        {/* =====================================================
            HOME
        ====================================================== */}
        <Route path="/" element={<Home />} />

        {/* =====================================================
            ABOUT
        ====================================================== */}
        <Route path="/about" element={<About />} />

        {/* =====================================================
            CONFERENCES
        ====================================================== */}
        <Route
          path="/conferences"
          element={<Conferences />}
        />

        {/* =====================================================
            CONFERENCE DETAILS
        ====================================================== */}
        <Route
          path="/conference/:id"
          element={<ConferenceDetails />}
        />

        {/* =====================================================
            REGISTER
        ====================================================== */}
        <Route
          path="/conferences/:id/register"
          element={<RegisterPage />}
        />

        {/* =====================================================
            ABSTRACT SUBMISSION
        ====================================================== */}
        <Route
          path="/conferences/:id/abstract-submission"
          element={<AbstractSubmissionPage />}
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
        <Route
          path="/speakers"
          element={<Speakers />}
        />

        {/* =====================================================
            REVIEWS
        ====================================================== */}
        <Route
          path="/reviews"
          element={<Reviews />}
        />

        {/* =====================================================
            TERMS & CONDITIONS
        ====================================================== */}
        <Route
          path="/terms"
          element={<Terms />}
        />

        {/* =====================================================
            GLOBAL PRIVACY POLICY
        ====================================================== */}
        <Route
          path="/privacy"
          element={<Privacy />}
        />

        {/* =====================================================
            CONTACT
        ====================================================== */}
        <Route
          path="/contact"
          element={<ContactPage />}
        />
      </Routes>

      <Footer />

      {/* =====================================================
          GLOBAL FLOATING CHATBOT

          This is outside Routes, so it appears on
          every page automatically.
      ====================================================== */}
      <Chatbot />
    </div>
  );
};

export default App;