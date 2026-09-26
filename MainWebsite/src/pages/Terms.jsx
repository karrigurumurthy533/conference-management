import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, FileText } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-white py-12 px-5 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 border-b border-slate-200 pb-6"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-violet-600 bg-violet-50 px-3 py-1 rounded-full border border-violet-200">
            Legal Terms
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-3">
            Terms & Conditions
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Last Updated: January 2026 • GlobalScion Conferences
          </p>
        </motion.div>

        <div className="space-y-6 text-slate-700 text-sm leading-relaxed">
          <section className="bg-slate-50 p-5 rounded-xl border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
              <FileText size={18} className="text-violet-600" />
              1. Acceptance of Terms
            </h2>
            <p>
              By registering for, attending, or submitting research to any event organized by GlobalScion Conferences, delegates and speakers agree to abide by these terms and conditions.
            </p>
          </section>

          <section className="bg-slate-50 p-5 rounded-xl border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
              <ShieldCheck size={18} className="text-violet-600" />
              2. Registration & Payments
            </h2>
            <p>
              All conference fees must be paid in full prior to event entry. Confirmed registrations grant access to designated keynotes, workshops, and official conference proceedings.
            </p>
          </section>

          <section className="bg-slate-50 p-5 rounded-xl border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
              <FileText size={18} className="text-violet-600" />
              3. Abstract & Publication Guidelines
            </h2>
            <p>
              Submissions must be original work. Accepted abstracts and papers undergo double-blind peer review before publication in indexed proceedings.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
