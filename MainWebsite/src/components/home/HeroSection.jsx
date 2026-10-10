import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Award } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const fadeUp = {
    hidden: {
      opacity: 0,
      y: 25,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section
      id="home"
      className="relative overflow-hidden w-full min-h-[300px] lg:min-h-[360px] bg-slate-950 flex items-center"
    >
      <div className="absolute inset-0 z-0">
        <img
          src="/images/conference-hero.png"
          alt="GlobalScion Conference Banner"
          className="h-full w-full object-cover object-center"
        />

        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(90deg, rgba(15, 7, 32, 0.92) 0%, rgba(26, 11, 54, 0.82) 48%, rgba(76, 29, 149, 0.45) 100%)",
          }}
        />

        <div
          className="absolute inset-0 z-10 opacity-60 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 20% 50%, rgba(124, 58, 237, 0.35) 0%, transparent 60%)",
          }}
        />
      </div>

      <div className="relative z-20 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-12 sm:py-14 lg:py-16 w-full">
        <div className="max-w-3xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            <motion.div variants={fadeUp} className="mb-4 inline-flex">
              <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/40 bg-violet-950/60 backdrop-blur-md px-4 py-2 text-xs font-semibold tracking-wider text-violet-200 uppercase shadow-lg shadow-violet-950/40">
                <Sparkles size={15} className="text-violet-400 animate-pulse" />
                LEARN / SHARE / GROW
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] drop-shadow-md"
            >
              Where Global Minds Meet,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-purple-300 to-pink-300">
                Innovation Begins.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-5 text-base sm:text-lg text-violet-100/90 leading-relaxed max-w-2xl drop-shadow-sm"
            >
              Connect with world-leading researchers, exchange groundbreaking
              ideas, and discover new opportunities through international
              conferences that inspire collaboration and shape the future of
              science and innovation.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <Link
                to="/conferences"
                className="group inline-flex items-center justify-center gap-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 px-7 py-3.5 text-sm sm:text-base font-bold text-white shadow-xl shadow-violet-950/60 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Explore Conferences</span>
                <ArrowRight
                  size={18}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
