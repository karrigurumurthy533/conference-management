import { Routes, Route } from "react-router-dom";

import Home from "./Pages/Home";
import About from "./Pages/About";
import Conferences from "./pages/Conferences";
import Speakers from "./Pages/Speakers";
import ConferenceDetails from "./pages/ConferenceDetails";
import Contact from "./Pages/Contact";

import Reviews from "./Pages/Reviews";
import Terms from "./Pages/Terms";
import Privacy from "./Pages/Privacy";

import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import RegisterPage from "./Pages/RegisterPage";
import AbstractSubmissionPage from "./Pages/AbstractSubmissionPage";
import DownloadBrochure from "./Pages/DownloadBrochure";

const App = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* About */}
        <Route path="/about" element={<About />} />

        {/* Conferences */}
        <Route path="/conferences" element={<Conferences />} />

        {/* Conference Details */}
        <Route path="/conference/:id" element={<ConferenceDetails />} />
        <Route path="/conferences/:id/register" element={<RegisterPage />} />
        <Route path="/conferences/:id/abstract-submission" element={<AbstractSubmissionPage />} />
        <Route path="/conferences/:id/brochure" element={<DownloadBrochure />} />

        {/* Speakers */}
        <Route path="/speakers" element={<Speakers />} />

        {/* Reviews */}
        <Route path="/reviews" element={<Reviews />} />

        {/* Terms and Conditions */}
        <Route path="/terms" element={<Terms />} />

        {/* Global Privacy Policy */}
        <Route path="/privacy" element={<Privacy />} />

        {/* Contact */}
        <Route path="/contact" element={<Contact />} />
      </Routes>

      <Footer />
    </div>
  );
};

export default App;