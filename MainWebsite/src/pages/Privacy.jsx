import React from "react";
import { motion } from "framer-motion";
import { Lock, ShieldAlert } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-white py-12 px-5 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 border-b border-slate-200 pb-6"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-violet-600 bg-violet-50 px-3 py-1 rounded-full border border-violet-200">
            Privacy Policy
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-3">
            Global Privacy Policy
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Last Updated: January 2026 • GlobalScion Conferences
          </p>
        </motion.div>

        <div className="space-y-6 text-slate-700 text-sm leading-relaxed">
          <section className="bg-slate-50 p-5 rounded-xl border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Lock size={18} className="text-violet-600" />
              1. Information We Collect
            </h2>
            <p>
              We collect delegate information provided during conference registration, abstract submissions, and newsletter signups strictly for event management and communication.
            </p>
          </section>

          <section className="bg-slate-50 p-5 rounded-xl border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
              <ShieldAlert size={18} className="text-violet-600" />
              2. Data Protection & Security
            </h2>
            <p>
              Your personal data is protected with industry-standard encryption. GlobalScion never sells or rents participant personal data to third parties.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
