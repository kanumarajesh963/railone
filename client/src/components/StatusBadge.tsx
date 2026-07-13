const styles: Record<string, string> = {
  AVAILABLE: "bg-green-100 text-green-700 border-green-300",
  RAC: "bg-amber-100 text-amber-700 border-amber-300",
  WAITLIST: "bg-red-100 text-red-700 border-red-300",
  CNF: "bg-green-100 text-green-700 border-green-300",
  DEPARTED: "bg-gray-100 text-gray-500 border-gray-300",
  CURRENT: "bg-rail-orange/10 text-rail-orange border-rail-orange/40",
  UPCOMING: "bg-blue-50 text-blue-600 border-blue-200",
};

export default function StatusBadge({ status, label }: { status: string; label?: string }) {
  const key = status.split(" ")[0];
  const cls = styles[key] || "bg-gray-100 text-gray-600 border-gray-300";
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
      {label || status}
    </span>
  );
}
