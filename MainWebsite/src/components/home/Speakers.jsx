const speakers = [
  {
    name: "Dr. Sarah Johnson",
    role: "Research Director",
    country: "United States",
  },
  {
    name: "Dr. Michael Anderson",
    role: "Professor & Researcher",
    country: "United Kingdom",
  },
  {
    name: "Dr. Emily Williams",
    role: "Healthcare Specialist",
    country: "Germany",
  },
  {
    name: "Dr. David Wilson",
    role: "Clinical Researcher",
    country: "Australia",
  },
];

const Speakers = () => {
  return (
    <section id="speakers" className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-purple-700">
            Meet Our Experts
          </p>

          <h2 className="mt-3 text-4xl font-bold text-blue-950">
            Featured Speakers
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Learn from experts, researchers, academics, and industry
            professionals from around the world.
          </p>
        </div>

        <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {speakers.map((speaker, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-lg border border-gray-200 bg-white"
            >
              <div className="flex h-56 items-center justify-center bg-gray-100">
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-purple-100 text-5xl">
                  👤
                </div>
              </div>

              <div className="p-5 text-center">
                <h3 className="text-lg font-bold text-blue-950">
                  {speaker.name}
                </h3>

                <p className="mt-2 text-sm text-purple-700">
                  {speaker.role}
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  {speaker.country}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Speakers;