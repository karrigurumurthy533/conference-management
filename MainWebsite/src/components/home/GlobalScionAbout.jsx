import {
  CalendarDays,
  Copy,
  Hourglass,
  Bookmark,
} from "lucide-react";

const points = [
  {
    icon: CalendarDays,
    text: "Scholars present and publish high-quality research.",
  },
  {
    icon: Copy,
    text: "Industry experts share practical insights and innovations.",
  },
  {
    icon: Hourglass,
    text: "Institutions and organizations partner to co-host impactful events.",
  },
  {
    icon: Bookmark,
    text: "Learners and emerging researchers gain exposure to global standards.",
  },
];

const GlobalScionAbout = () => {
  return (
    <section className="w-full bg-white px-6 py-16 md:px-12 lg:px-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">

        {/* =========================
            LEFT CONTENT
        ========================== */}
        <div className="flex flex-col justify-center">

          <h2 className="mb-8 text-4xl font-bold tracking-tight text-[#8138A2] md:text-5xl">
            What is GlobalScion?
          </h2>

          <div className="max-w-xl space-y-6 text-[17px] leading-8 text-gray-900">

            <p>
              GlobalScion is more than just a conference organizer—it’s a
              gateway to global collaboration.
            </p>

            <p>
              We serve as a comprehensive platform where:
            </p>

            <p>
              We combine the power of physical gatherings and digital
              connectivity to ensure that no matter where you are, you can
              engage with the best minds and cutting-edge research.
            </p>

          </div>
        </div>

        {/* =========================
            RIGHT CONTENT
        ========================== */}
        <div className="flex w-full flex-col justify-center">

          {points.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="
                  flex
                  w-full
                  items-start
                  gap-5
                  border-b
                  border-gray-200
                  py-6
                  first:pt-0
                  last:border-b-0
                "
              >

                {/* Icon */}
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-purple-50">
                  <Icon
                    size={21}
                    strokeWidth={1.8}
                    className="text-[#8138A2]"
                  />
                </div>

                {/* Text */}
                <p className="flex-1 pt-1 text-[16px] leading-7 text-gray-900">
                  {item.text}
                </p>

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
};

export default GlobalScionAbout;