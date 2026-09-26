import {
  Mail,
  Phone,
  Search,
  UserRound,
} from "lucide-react";
import { useState } from "react";

const speakers = [
  {
    name: "Dr. Michael Anderson",
    email: "michael@example.com",
    phone: "+1 987 654 3210",
    specialty: "Cardiology",
  },
  {
    name: "Dr. Sarah Williams",
    email: "sarah@example.com",
    phone: "+1 987 654 3211",
    specialty: "Clinical Medicine",
  },
  {
    name: "Dr. Robert Thomas",
    email: "robert@example.com",
    phone: "+1 987 654 3212",
    specialty: "Heart & Vascular Medicine",
  },
];

function Speakers() {
  const [search, setSearch] = useState("");

  const filteredSpeakers = speakers.filter((speaker) =>
    speaker.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-[calc(100vh-66px)] bg-[#f7f7fb] p-6">
      <div className="mx-auto max-w-[1400px]">
        <h1 className="text-[26px] font-bold text-[#111827]">
          Speakers
        </h1>

        <p className="mt-1 text-[14px] text-[#64748b]">
          Manage conference speakers
        </p>

        <div className="mt-6 flex max-w-md items-center rounded-xl border border-[#dfe3eb] bg-white px-4">
          <Search
            size={17}
            className="text-[#94a3b8]"
          />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search speakers..."
            className="h-11 w-full bg-transparent px-3 text-sm outline-none"
          />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredSpeakers.map((speaker) => (
            <div
              key={speaker.email}
              className="rounded-2xl border border-[#dddfe8] bg-white p-5"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ede9fe]">
                  <UserRound
                    size={22}
                    className="text-violet-600"
                  />
                </div>

                <div>
                  <h2 className="font-semibold text-[#111827]">
                    {speaker.name}
                  </h2>

                  <p className="text-xs text-[#64748b]">
                    {speaker.specialty}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3 text-sm text-[#64748b]">
                <p className="flex items-center gap-2">
                  <Mail size={15} />
                  {speaker.email}
                </p>

                <p className="flex items-center gap-2">
                  <Phone size={15} />
                  {speaker.phone}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Speakers;