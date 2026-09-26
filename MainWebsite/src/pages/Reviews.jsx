import React from "react";
import { motion } from "framer-motion";
import { Star, Quote, UserCheck } from "lucide-react";

const reviews = [
  {
    name: "Dr. Aris Thorne",
    role: "Professor of Neurobiology, Oxford",
    comment: "GlobalScion summits bring together top researchers from around the globe. The discussions were profoundly insightful and well-organized.",
    rating: 5,
  },
  {
    name: "Elena Rostova",
    role: "Lead AI Researcher, Zurich",
    comment: "An exceptional platform for multidisciplinary collaboration. Presenting our paper here opened doors to international research grants.",
    rating: 5,
  },
  {
    name: "Rajesh Kumar",
    role: "Director of Clinical Innovation, Bangalore",
    comment: "High-level keynote sessions, flawless hybrid event setup, and tremendous networking opportunities with global industry leaders.",
    rating: 5,
  },
];

const Reviews = () => {
  return (
    <div className="min-h-screen bg-white py-12 px-5 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-violet-600 bg-violet-50 px-3 py-1 rounded-full border border-violet-200">
            Delegate Feedback
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
            What Delegates & Speakers Say
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-xl mx-auto">
            Read testimonials from researchers, keynote speakers, and industry pioneers who attended GlobalScion Conferences.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((review, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-violet-300 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <Quote className="text-violet-400 mb-2 w-8 h-8 opacity-40" />
                <p className="text-slate-700 text-sm leading-relaxed mb-6 font-normal">
                  "{review.comment}"
                </p>
              </div>

              <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
                <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-sm">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{review.name}</h4>
                  <p className="text-xs text-slate-500">{review.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
