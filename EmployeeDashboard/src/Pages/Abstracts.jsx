import {
  CheckCircle2,
  Clock3,
  FileText,
  XCircle,
} from "lucide-react";

const abstracts = [
  {
    title: "Advances in Cardiovascular Medicine",
    author: "Dr. James Wilson",
    status: "Approved",
  },
  {
    title: "Modern Approaches to Heart Disease",
    author: "Dr. Emily Carter",
    status: "Pending",
  },
  {
    title: "Digital Transformation in Cardiology",
    author: "Dr. David Miller",
    status: "Rejected",
  },
];

function Abstracts() {
  return (
    <div className="min-h-[calc(100vh-66px)] bg-[#f7f7fb] p-6">
      <div className="mx-auto max-w-[1400px]">
        <h1 className="text-[26px] font-bold text-[#111827]">
          Abstracts
        </h1>

        <p className="mt-1 text-[14px] text-[#64748b]">
          Review and manage conference abstracts
        </p>

        <div className="mt-6 overflow-hidden rounded-2xl border border-[#dddfe8] bg-white">
          {abstracts.map((abstract) => (
            <div
              key={abstract.title}
              className="flex flex-col gap-4 border-b border-[#eeeef3] p-5 last:border-b-0 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50">
                  <FileText
                    size={19}
                    className="text-violet-600"
                  />
                </div>

                <div>
                  <h2 className="font-semibold text-[#111827]">
                    {abstract.title}
                  </h2>

                  <p className="mt-1 text-sm text-[#64748b]">
                    Submitted by {abstract.author}
                  </p>
                </div>
              </div>

              {abstract.status === "Approved" && (
                <span className="flex w-fit items-center gap-1 rounded-full bg-[#d9f6ec] px-3 py-1 text-xs font-medium text-[#10b981]">
                  <CheckCircle2 size={13} />
                  Approved
                </span>
              )}

              {abstract.status === "Pending" && (
                <span className="flex w-fit items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-600">
                  <Clock3 size={13} />
                  Pending
                </span>
              )}

              {abstract.status === "Rejected" && (
                <span className="flex w-fit items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-500">
                  <XCircle size={13} />
                  Rejected
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Abstracts;