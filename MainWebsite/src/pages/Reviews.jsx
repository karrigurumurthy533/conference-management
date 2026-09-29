import React from "react";
import { motion } from "framer-motion";
import {
  Star,
  ArrowLeft,
  ArrowRight,
  UserRound,
  Quote,
} from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "Orien Tulp",
    role: "Speaker",
    image:
      "https://globalscion.com/wp-content/uploads/2025/05/speaker2.jpg",
    comment:
      "This virtual conference created a meaningful space for sharing knowledge across borders. The format was efficient, and the discussions were impactful.",
  },
  {
    id: 2,
    name: "Magnusson Magnus",
    role: "Speaker",
    image:
      "https://globalscion.com/wp-content/uploads/2025/05/speaker1.jpg",
    comment:
      "I was impressed by the level of global participation. Despite being online, the interaction felt dynamic, and the audience engagement during my talk was excellent.",
  },
  {
    id: 3,
    name: "Kenichi-Ohtsubo",
    role: "Speaker",
    image:
      "https://globalscion.com/wp-content/uploads/2025/05/speaker4.jpg",
    comment:
      "It was a pleasure to contribute to a global dialogue through this webinar. The audience was well-informed, and the questions reflected genuine interest in the topic.",
  },
  {
    id: 4,
    name: "Rosa Lelyana",
    role: "Speaker",
    image:
      "https://globalscion.com/wp-content/uploads/2025/05/speaker3.jpg",
    comment:
      "The webinar was well-structured, with a clear schedule and strong communication from the organizers. I felt supported every step of the way as a speaker.",
  },
  {
    id: 5,
    name: "Taranenko-VI",
    role: "Speaker",
    image:
      "https://globalscion.com/wp-content/uploads/2025/05/speaker5.jpg",
    comment:
    "A very well-coordinated event—clear communication, timely reminders, and a responsive team made my role as a speaker completely hassle-free."
  },
  {
    id: 6,
    name: "Huang Wei Ling",
    role: "Speaker",
    image:
      "https://globalscion.com/wp-content/uploads/2025/05/speaker.jpg",
    comment:
    "Speaking at this webinar was a smooth and professional experience. The virtual platform was user-friendly, and the technical support team ensured everything ran seamlessly"
  },
  {
    id: 7,
    name: "Zahra-Al-Kharousi",
    role: "Speaker",
    image:
      "https://globalscion.com/wp-content/uploads/2025/05/speaker6.jpg",
    comment:
      "The feedback I received was truly motivating. I appreciated the diverse audience and the opportunity to share practical insights in an inclusive, virtual environment.",
  },
  {
    id: 8,
    name: "Federica-Mastrolonardo",
    role: "Speaker",
    image:
      "https://globalscion.com/wp-content/uploads/2025/05/speaker7.jpg",
    comment:
      "The technical support and smooth organization made the webinar experience excellent. I felt completely comfortable and engaged throughout.",
  },
  {
    id: 9,
    name: "Francis-Thaise-A-Cimene,",
    role: "Speaker",
    image:
      "https://globalscion.com/wp-content/uploads/2025/05/speaker8.jpg",
    comment:
"From the registration process to the live session, everything was smoothly executed. I would gladly participate again in future editions of this webinar." 
 },
];

const Reviews = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white">

      {/* =====================================================
          DECORATIVE TOP LEFT
      ===================================================== */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full border-[45px] border-violet-100 opacity-80" />

      <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full border border-violet-300/60" />

      {/* =====================================================
          DECORATIVE BOTTOM RIGHT
      ===================================================== */}
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full border-[55px] border-violet-50" />

      <div className="pointer-events-none absolute -bottom-28 -right-28 h-72 w-72 rounded-full border border-violet-300/50" />

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}
      <section className="relative mx-auto max-w-[1450px] px-5 py-14 sm:px-8 lg:px-12 lg:py-16">

        {/* ===================================================
            HEADER
        =================================================== */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">

          {/* LEFT */}
          <div className="max-w-3xl">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-violet-300 bg-violet-50 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-violet-700">
                <Star
                  size={14}
                  fill="currentColor"
                />
                Delegate Feedback
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.1,
              }}
              className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-[#11133F] sm:text-5xl lg:text-[52px]"
            >
              What Delegates & Speakers{" "}
              <span className="bg-gradient-to-r from-violet-500 to-purple-600 bg-clip-text text-transparent">
                Say
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.2,
              }}
              className="mt-4 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base"
            >
              Read testimonials from researchers, keynote speakers,
              and industry pioneers who attended GlobalScion Conferences.
            </motion.p>

          </div>

          {/* =================================================
              ARROWS
          ================================================= */}
          <div className="flex items-center gap-5 lg:pb-2">

            <button
              type="button"
              className="group flex h-12 w-12 items-center justify-center rounded-full border border-violet-300 bg-white text-violet-600 transition-all duration-300 hover:bg-violet-600 hover:text-white hover:shadow-lg hover:shadow-violet-200"
              aria-label="Previous reviews"
            >
              <ArrowLeft
                size={20}
                className="transition-transform duration-300 group-hover:-translate-x-0.5"
              />
            </button>

            {/* Slider Indicator */}
            <div className="flex items-center gap-2">
              <span className="h-1 w-10 rounded-full bg-violet-600" />
              <span className="h-1 w-10 rounded-full bg-violet-200" />
            </div>

            <button
              type="button"
              className="group flex h-12 w-12 items-center justify-center rounded-full border border-violet-300 bg-white text-violet-600 transition-all duration-300 hover:bg-violet-600 hover:text-white hover:shadow-lg hover:shadow-violet-200"
              aria-label="Next reviews"
            >
              <ArrowRight
                size={20}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </button>

          </div>

        </div>

        {/* ===================================================
            REVIEWS GRID
        =================================================== */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {reviews.map((review, index) => (
            <motion.article
              key={review.id}
              initial={{
                opacity: 0,
                y: 25,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.1,
              }}
              transition={{
                duration: 0.45,
                delay: index * 0.06,
              }}
              whileHover={{
                y: -5,
              }}
              className="group relative flex min-h-[290px] flex-col overflow-hidden rounded-xl border border-violet-100 bg-white p-5 shadow-sm transition-all duration-300 hover:border-violet-300 hover:shadow-xl hover:shadow-violet-100/60"
            >

              {/* TOP ACCENT */}
              <div className="absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-violet-400 via-purple-600 to-violet-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              {/* =================================================
                  QUOTE + IMAGE
              ================================================= */}
              <div className="flex items-start justify-between">

                {/* Quote */}
                <div className="text-5xl font-black leading-none text-violet-300">
                  “
                </div>

                {/* Speaker Image */}
                <div className="h-[94px] w-[94px] overflow-hidden rounded-2xl border border-violet-100 bg-violet-50">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

              </div>

              {/* =================================================
                  COMMENT
              ================================================= */}
              <p className="mt-2 min-h-[105px] text-[13px] leading-[1.65] text-slate-600">
                {review.comment}
              </p>

              {/* =================================================
                  STARS
              ================================================= */}
              <div className="mt-4 flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={15}
                    fill="currentColor"
                    className="text-violet-500"
                  />
                ))}
              </div>

              {/* =================================================
                  SPEAKER
              ================================================= */}
              <div className="mt-5 flex items-center gap-3">

                {/* User Icon */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-600">
                  <UserRound size={17} />
                </div>

                {/* Details */}
                <div className="min-w-0">

                  <h3 className="truncate text-sm font-bold text-violet-600">
                    {review.name}
                  </h3>

                  <p className="mt-0.5 text-[11px] text-slate-400">
                    {review.role}
                  </p>

                </div>

              </div>

            </motion.article>
          ))}

        </div>

      </section>
    </div>
  );
};

export default Reviews;