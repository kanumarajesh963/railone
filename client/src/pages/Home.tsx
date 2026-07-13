import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeftRight, CalendarDays, MapPin, Search, Ticket, TrainFront, Zap } from "lucide-react";
import { fetchStations } from "../lib/api";
import type { Station } from "../lib/types";

const today = () => new Date().toISOString().slice(0, 10);

const quickLinks = [
  { to: "/uts", label: "UTS Unreserved Ticket", icon: Ticket, desc: "Instant paperless ticket, no queue" },
  { to: "/pnr", label: "PNR Status", icon: TrainFront, desc: "Check your booking status" },
  { to: "/live", label: "Live Train Status", icon: Zap, desc: "Real-time running status" },
];

export default function Home() {
  const navigate = useNavigate();
  const [stations, setStations] = useState<Station[]>([]);
  const [from, setFrom] = useState("NDLS");
  const [to, setTo] = useState("BCT");
  const [date, setDate] = useState(today());
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStations().then(setStations).catch(() => setError("Could not load stations"));
  }, []);

  function swap() {
    setFrom(to);
    setTo(from);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (from === to) {
      setError("Source and destination cannot be the same");
      return;
    }
    setError("");
    navigate(`/search?from=${from}&to=${to}&date=${date}`);
  }

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-rail-blue via-rail-blue-dark to-black py-16 text-white">
        <motion.div
          className="pointer-events-none absolute -right-20 top-10 text-white/10"
          animate={{ x: [0, 20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <TrainFront size={220} />
        </motion.div>

        <div className="relative mx-auto max-w-6xl px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold sm:text-4xl"
          >
            Book train tickets, unreserved travel &amp; track journeys — all in one place
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-2 max-w-2xl text-white/70"
          >
            Reserved bookings, UTS unreserved tickets, PNR status and live running status combined into a single fast experience.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="mt-8 rounded-2xl bg-white p-4 text-gray-800 shadow-2xl sm:p-6"
          >
            <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr_1fr_auto]">
              <label className="block">
                <span className="mb-1 flex items-center gap-1 text-xs font-semibold text-gray-500">
                  <MapPin size={12} /> FROM
                </span>
                <select
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-rail-blue focus:outline-none"
                >
                  {stations.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </label>

              <div className="flex items-end justify-center pb-2 sm:pb-0">
                <button
                  type="button"
                  onClick={swap}
                  className="rounded-full border border-gray-300 p-2 text-gray-500 transition hover:rotate-180 hover:border-rail-blue hover:text-rail-blue"
                  aria-label="Swap stations"
                >
                  <ArrowLeftRight size={16} />
                </button>
              </div>

              <label className="block">
                <span className="mb-1 flex items-center gap-1 text-xs font-semibold text-gray-500">
                  <MapPin size={12} /> TO
                </span>
                <select
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-rail-blue focus:outline-none"
                >
                  {stations.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1 flex items-center gap-1 text-xs font-semibold text-gray-500">
                  <CalendarDays size={12} /> DATE
                </span>
                <input
                  type="date"
                  min={today()}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-rail-blue focus:outline-none"
                />
              </label>

              <div className="flex items-end">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-rail-orange px-5 py-2.5 font-semibold text-white shadow-md transition hover:brightness-110 sm:w-auto"
                >
                  <Search size={16} /> Search
                </motion.button>
              </div>
            </div>
            {error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}
          </motion.form>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-xl font-bold text-rail-blue">Quick access</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {quickLinks.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.to}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4, scale: 1.01 }}
                onClick={() => navigate(item.to)}
                className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:shadow-lg"
              >
                <span className="rounded-xl bg-rail-blue/10 p-3 text-rail-blue">
                  <Icon size={22} />
                </span>
                <span>
                  <p className="font-semibold">{item.label}</p>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </span>
              </motion.button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
