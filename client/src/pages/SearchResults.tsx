import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, TrainFront } from "lucide-react";
import { fetchTrains } from "../lib/api";
import type { Train } from "../lib/types";
import TrainCard from "../components/TrainCard";

export default function SearchResults() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const from = params.get("from") || "";
  const to = params.get("to") || "";
  const date = params.get("date") || "";

  const [trains, setTrains] = useState<Train[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchTrains(from, to, date)
      .then(setTrains)
      .catch(() => setError("Could not load trains right now"))
      .finally(() => setLoading(false));
  }, [from, to, date]);

  function handleSelect(train: Train, classCode: string) {
    navigate(
      `/booking?trainNumber=${train.number}&classCode=${classCode}&date=${date}&from=${from}&to=${to}`
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
        <span className="rounded-xl bg-rail-blue/10 p-2 text-rail-blue">
          <TrainFront />
        </span>
        <div>
          <p className="font-semibold">
            {from} <span className="text-gray-400">→</span> {to}
          </p>
          <p className="text-sm text-gray-500">{date}</p>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-gray-500">
          <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
            <Loader2 />
          </motion.span>
          Searching trains...
        </div>
      )}

      {!loading && error && <p className="rounded-xl bg-red-50 p-4 text-red-600">{error}</p>}

      {!loading && !error && trains.length === 0 && (
        <p className="rounded-xl bg-white p-8 text-center text-gray-500 shadow-sm">
          No trains found for this route on this date.
        </p>
      )}

      <div className="space-y-4">
        {trains.map((train, i) => (
          <TrainCard key={train.number} train={train} index={i} onSelect={(cls) => handleSelect(train, cls)} />
        ))}
      </div>
    </div>
  );
}
