import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertTriangle, Loader2, Search, TrainFront } from "lucide-react";
import { fetchLiveStatus } from "../lib/api";
import type { LiveStatus as LiveStatusType } from "../lib/types";

const sampleTrains = ["12951", "12301", "12621", "12009"];

export default function LiveStatus() {
  const [params] = useSearchParams();
  const [trainNumber, setTrainNumber] = useState(params.get("trainNumber") || "");
  const [status, setStatus] = useState<LiveStatusType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(e?: React.FormEvent, number?: string) {
    e?.preventDefault();
    const num = number || trainNumber;
    if (!num) return;
    setLoading(true);
    setError("");
    setStatus(null);
    try {
      const result = await fetchLiveStatus(num);
      setStatus(result);
      setTrainNumber(num);
    } catch {
      setError("Train not found. Try 12951, 12301, 12621 or 12009.");
    } finally {
      setLoading(false);
    }
  }

  const currentIndex = status?.route.findIndex((r) => r.status === "CURRENT") ?? -1;
  const progress = status ? ((currentIndex + 0.5) / status.route.length) * 100 : 0;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="flex items-center gap-2">
        <span className="rounded-xl bg-rail-orange/10 p-2 text-rail-orange">
          <TrainFront size={20} />
        </span>
        <h1 className="text-2xl font-bold text-rail-blue">Live Train Status</h1>
      </div>
      <p className="text-gray-500">Track real-time running status and delays</p>

      <form onSubmit={handleSearch} className="mt-6 flex gap-2">
        <input
          value={trainNumber}
          onChange={(e) => setTrainNumber(e.target.value.replace(/\D/g, ""))}
          placeholder="Enter train number"
          className="flex-1 rounded-lg border border-gray-300 px-4 py-3 focus:border-rail-blue focus:outline-none"
        />
        <motion.button whileTap={{ scale: 0.95 }} className="flex items-center gap-2 rounded-lg bg-rail-blue px-5 py-3 font-semibold text-white">
          {loading ? (
            <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
              <Loader2 size={16} />
            </motion.span>
          ) : (
            <Search size={16} />
          )}
          Track
        </motion.button>
      </form>

      <div className="mt-3 flex flex-wrap gap-2">
        {sampleTrains.map((n) => (
          <button
            key={n}
            onClick={() => handleSearch(undefined, n)}
            className="rounded-full border border-gray-300 px-3 py-1 text-xs text-gray-500 hover:border-rail-blue hover:text-rail-blue"
          >
            #{n}
          </button>
        ))}
      </div>

      {error && (
        <p className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          <AlertTriangle size={16} /> {error}
        </p>
      )}

      {status && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <p className="font-semibold text-rail-blue">
              {status.trainName} · #{status.trainNumber}
            </p>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                status.delayMinutes === 0 ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
              }`}
            >
              {status.delayMinutes === 0 ? "On Time" : `Delayed ${status.delayMinutes} min`}
            </span>
          </div>

          <div className="relative mt-8 pl-6">
            <div className="absolute left-[7px] top-2 h-[calc(100%-16px)] w-0.5 bg-gray-200" />
            <motion.div
              className="absolute left-[7px] top-2 w-0.5 bg-rail-orange"
              initial={{ height: 0 }}
              animate={{ height: `calc(${progress}% - 16px)` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
            <motion.div
              className="absolute -left-[7px] flex h-6 w-6 items-center justify-center rounded-full bg-rail-orange text-white shadow-md"
              initial={{ top: 0 }}
              animate={{ top: `calc(${progress}% - 12px)` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <TrainFront size={14} />
            </motion.div>

            <div className="space-y-6">
              {status.route.map((stop, i) => (
                <motion.div
                  key={stop.code}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="relative"
                >
                  <div
                    className={`absolute -left-6 top-1 h-3 w-3 rounded-full border-2 ${
                      stop.status === "CURRENT"
                        ? "border-rail-orange bg-white"
                        : stop.status === "DEPARTED"
                        ? "border-gray-300 bg-gray-300"
                        : "border-gray-300 bg-white"
                    }`}
                  />
                  <p className={`font-semibold ${stop.status === "CURRENT" ? "text-rail-orange" : "text-gray-800"}`}>
                    {stop.name} ({stop.code})
                  </p>
                  <p className="text-xs text-gray-500">
                    {stop.scheduledTime} · {stop.distanceKm} km
                    {stop.platform ? ` · Platform ${stop.platform}` : ""}
                    {stop.status === "CURRENT" ? " · Currently here" : ""}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
