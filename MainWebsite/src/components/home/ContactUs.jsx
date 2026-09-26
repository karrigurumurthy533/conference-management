const ContactUs = () => {
  return (
    <section id="contact" className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-purple-700">
              Get In Touch
            </p>

            <h2 className="mt-3 text-4xl font-bold text-blue-950">
              Contact Us
            </h2>

            <p className="mt-5 max-w-xl leading-7 text-gray-600">
              Have questions about our conferences, registration,
              speaking opportunities, or publications? Contact the
              GlobalScion team.
            </p>

            <div className="mt-8 space-y-6">
              <div>
                <h3 className="font-bold text-blue-950">
                  Email
                </h3>
                <p className="mt-1 text-gray-600">
                  info@globalscion.com
                </p>
              </div>

              <div>
                <h3 className="font-bold text-blue-950">
                  Phone
                </h3>
                <p className="mt-1 text-gray-600">
                  +00 123 456 7890
                </p>
              </div>

              <div>
                <h3 className="font-bold text-blue-950">
                  Address
                </h3>
                <p className="mt-1 text-gray-600">
                  GlobalScion Conferences
                  <br />
                  International Conference Office
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-8">
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Full Name
              </label>

              <input
                type="text"
                placeholder="Your Name"
                className="mt-2 w-full rounded-md border border-gray-300 px-4 py-3 outline-none"
              />
            </div>

            <div className="mt-5">
              <label className="text-sm font-semibold text-gray-700">
                Email
              </label>

              <input
                type="email"
                placeholder="Your Email"
                className="mt-2 w-full rounded-md border border-gray-300 px-4 py-3 outline-none"
              />
            </div>

            <div className="mt-5">
              <label className="text-sm font-semibold text-gray-700">
                Phone
              </label>

              <input
                type="text"
                placeholder="Your Phone"
                className="mt-2 w-full rounded-md border border-gray-300 px-4 py-3 outline-none"
              />
            </div>

            <div className="mt-5">
              <label className="text-sm font-semibold text-gray-700">
                Message
              </label>

              <textarea
                rows="5"
                placeholder="Your Message"
                className="mt-2 w-full rounded-md border border-gray-300 px-4 py-3 outline-none"
              ></textarea>
            </div>

            <button className="mt-6 w-full rounded-md bg-purple-700 px-6 py-3 font-semibold text-white">
              Send Message
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;