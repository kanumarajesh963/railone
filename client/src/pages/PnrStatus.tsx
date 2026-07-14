import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Search, TrainFront } from "lucide-react";
import { fetchPnr } from "../lib/api";
import type { Booking } from "../lib/types";
import StatusBadge from "../components/StatusBadge";

export default function PnrStatus() {
  const [params] = useSearchParams();
  const [pnr, setPnr] = useState(params.get("pnr") || "");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\d{6,}$/.test(pnr)) {
      setError("Enter a valid PNR number");
      return;
    }
    setLoading(true);
    setError("");
    setBooking(null);
    try {
      const result = await fetchPnr(pnr);
      setBooking(result);
    } catch {
      setError("No booking found for this PNR");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-2xl font-bold text-rail-blue">PNR Status</h1>
      <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500">Enter your 10-digit PNR number to check booking status</p>

      <form onSubmit={handleSearch} className="mt-6 flex gap-2">
        <input
          value={pnr}
          onChange={(e) => setPnr(e.target.value.replace(/\D/g, ""))}
          placeholder="e.g. 4267198001"
          maxLength={12}
          className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 focus:border-rail-blue focus:outline-none"
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 rounded-lg bg-rail-blue px-5 py-3 font-semibold text-white hover:brightness-110"
        >
          {loading ? (
            <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
              <Loader2 size={16} />
            </motion.span>
          ) : (
            <Search size={16} />
          )}
          Check
        </motion.button>
      </form>

      {error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}

      <AnimatePresence>
        {booking && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rail-blue">
                <TrainFront size={18} />
                <p className="font-semibold">
                  {booking.trainName} · #{booking.trainNumber}
                </p>
              </div>
              <StatusBadge
                status={booking.chartPrepared ? "CNF" : "UPCOMING"}
                label={booking.chartPrepared ? "Chart Prepared" : "Chart Not Prepared"}
              />
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
              {booking.from} → {booking.to} · {booking.date} · Class {booking.classCode}
            </p>
            <div className="mt-4 divide-y divide-gray-100">
              {booking.passengers.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
                      {p.age} yrs · {p.gender} {p.seat ? `· Seat ${p.seat}` : ""}
                    </p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
