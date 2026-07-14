import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import QRCode from "react-qr-code";
import { Check, Minus, Plus, Share2, Ticket, Zap } from "lucide-react";
import { bookUtsTicket, fetchStations } from "../lib/api";
import type { Station, UtsTicket } from "../lib/types";

export default function UtsBooking() {
  const [stations, setStations] = useState<Station[]>([]);
  const [ticketType, setTicketType] = useState<"journey" | "platform">("journey");
  const [fromStation, setFromStation] = useState("NDLS");
  const [toStation, setToStation] = useState("PUNE");
  const [passengers, setPassengers] = useState(1);
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState<UtsTicket | null>(null);
  const [error, setError] = useState("");
  const [shared, setShared] = useState(false);

  useEffect(() => {
    fetchStations().then(setStations).catch(() => setError("Could not load stations"));
  }, []);

  async function handleBook() {
    setLoading(true);
    setError("");
    try {
      const result = await bookUtsTicket({
        fromStation,
        toStation: ticketType === "platform" ? fromStation : toStation,
        passengers,
        ticketType,
      });
      setTicket(result);
    } catch {
      setError("Could not book ticket, please try again");
    } finally {
      setLoading(false);
    }
  }

  async function handleShare() {
    if (!ticket) return;
    const text = `RailOne UTS Ticket\nID: ${ticket.ticketId}\n${ticket.fromStation} → ${ticket.toStation}\nPassengers: ${ticket.passengers} · Total Fare: ₹${ticket.totalFare}\nValid: ${ticket.validMinutes} min`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "RailOne UTS Ticket", text });
      } catch {
        // user cancelled share sheet, no action needed
      }
    } else {
      await navigator.clipboard.writeText(text);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  }

  if (ticket) {
    return (
      <div className="mx-auto max-w-md px-4 py-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 16 }}
          className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl"
        >
          <div className="flex items-center justify-between bg-rail-green px-5 py-4 text-white">
            <div>
              <p className="flex items-center gap-2 font-semibold">
                <Ticket size={18} /> UTS {ticket.ticketType === "platform" ? "Platform" : "Unreserved"} Ticket
              </p>
              <p className="text-sm text-white/80">Ticket ID: {ticket.ticketId}</p>
            </div>
            <button
              onClick={handleShare}
              aria-label="Share ticket"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white dark:bg-gray-800/15 hover:bg-white dark:bg-gray-800/25"
            >
              {shared ? <Check size={18} /> : <Share2 size={18} />}
            </button>
          </div>
          <div className="p-5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold">{ticket.fromStation}</span>
              <span className="text-gray-400 dark:text-gray-500">→</span>
              <span className="font-semibold">{ticket.toStation}</span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
              <p>Passengers: {ticket.passengers}</p>
              <p>Distance: {ticket.distanceKm} km</p>
              <p>Fare/person: ₹{ticket.farePerPassenger}</p>
              <p>Valid: {ticket.validMinutes} min</p>
            </div>
            <div className="mt-4 flex items-center justify-between rounded-xl bg-rail-green/10 px-4 py-3">
              <span className="font-semibold">Total Fare</span>
              <span className="text-xl font-bold text-rail-green">₹{ticket.totalFare}</span>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-5 flex flex-col items-center gap-2 border-t border-dashed border-gray-300 dark:border-gray-600 pt-5"
            >
              <QRCode value={JSON.stringify(ticket)} size={140} />
              <p className="text-xs text-gray-400 dark:text-gray-500">Show this QR code to the ticket checker</p>
            </motion.div>
          </div>
        </motion.div>
        {shared && !navigator.share && (
          <p className="mt-2 text-center text-xs font-medium text-rail-green">Ticket details copied to clipboard</p>
        )}
        <button
          onClick={() => setTicket(null)}
          className="mt-4 w-full rounded-lg border border-rail-blue py-3 font-semibold text-rail-blue hover:bg-rail-blue/5"
        >
          Book another UTS ticket
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <div className="flex items-center gap-2">
        <span className="rounded-xl bg-rail-green/10 p-2 text-rail-green">
          <Zap size={20} />
        </span>
        <h1 className="text-2xl font-bold text-rail-blue">UTS Unreserved Ticket</h1>
      </div>
      <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500">Instant, paperless unreserved or platform ticket — no queue, no seat allotment.</p>

      <div className="mt-6 flex gap-2 rounded-xl bg-gray-100 dark:bg-gray-700 p-1">
        {(["journey", "platform"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setTicketType(type)}
            className={`relative flex-1 rounded-lg py-2 text-sm font-semibold transition ${
              ticketType === type ? "text-white" : "text-gray-500 dark:text-gray-400 dark:text-gray-500"
            }`}
          >
            {ticketType === type && (
              <motion.span
                layoutId="uts-toggle"
                className="absolute inset-0 rounded-lg bg-rail-blue"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            <span className="relative z-10">{type === "journey" ? "Unreserved Journey" : "Platform Ticket"}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
        <label className="block">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 dark:text-gray-500">
            {ticketType === "platform" ? "STATION" : "FROM STATION"}
          </span>
          <select
            value={fromStation}
            onChange={(e) => setFromStation(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2"
          >
            {stations.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name} ({s.code})
              </option>
            ))}
          </select>
        </label>

        <AnimatePresence>
          {ticketType === "journey" && (
            <motion.label
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="block overflow-hidden"
            >
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 dark:text-gray-500">TO STATION</span>
              <select
                value={toStation}
                onChange={(e) => setToStation(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2"
              >
                {stations.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </motion.label>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 dark:text-gray-500">PASSENGERS</span>
          <div className="flex items-center gap-4">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setPassengers((n) => Math.max(1, n - 1))}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:bg-gray-700"
              aria-label="Decrease passengers"
            >
              <Minus size={16} />
            </motion.button>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={passengers}
                initial={{ opacity: 0, y: 8, scale: 0.7 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.7 }}
                transition={{ duration: 0.18 }}
                className="w-6 text-center text-lg font-semibold"
              >
                {passengers}
              </motion.span>
            </AnimatePresence>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setPassengers((n) => Math.min(10, n + 1))}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:bg-gray-700"
              aria-label="Increase passengers"
            >
              <Plus size={16} />
            </motion.button>
          </div>
        </div>

        {error && <p className="text-sm font-medium text-red-600">{error}</p>}

        <motion.button
          whileTap={{ scale: 0.97 }}
          disabled={loading}
          onClick={handleBook}
          className="w-full rounded-lg bg-rail-green py-3 font-semibold text-white disabled:opacity-70"
        >
          {loading ? "Generating ticket..." : "Book UTS Ticket"}
        </motion.button>
      </div>
    </div>
  );
}
