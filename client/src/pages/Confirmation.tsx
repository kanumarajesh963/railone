import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, TrainFront } from "lucide-react";
import { fetchPnr } from "../lib/api";
import type { Booking } from "../lib/types";
import StatusBadge from "../components/StatusBadge";

export default function Confirmation() {
  const { pnr } = useParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!pnr) return;
    fetchPnr(pnr).then(setBooking).catch(() => setError("Booking not found"));
  }, [pnr]);

  if (error) return <p className="mx-auto max-w-xl px-4 py-16 text-center text-red-600">{error}</p>;
  if (!booking) return null;

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 14 }}
        className="flex flex-col items-center text-center"
      >
        <motion.div
          initial={{ rotate: -90 }}
          animate={{ rotate: 0 }}
          transition={{ delay: 0.1, type: "spring" }}
          className="mb-3 rounded-full bg-green-100 p-4 text-green-600"
        >
          <CheckCircle2 size={48} />
        </motion.div>
        <h1 className="text-2xl font-bold text-rail-blue">Booking Confirmed!</h1>
        <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500">Your PNR is</p>
        <p className="mt-1 text-3xl font-extrabold tracking-widest text-rail-orange">{booking.pnr}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm"
      >
        <div className="flex items-center gap-2 text-rail-blue">
          <TrainFront size={18} />
          <p className="font-semibold">
            {booking.trainName} · #{booking.trainNumber}
          </p>
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

      <div className="mt-6 flex gap-3">
        <Link
          to={`/pnr?pnr=${booking.pnr}`}
          className="flex-1 rounded-lg border border-rail-blue py-3 text-center font-semibold text-rail-blue hover:bg-rail-blue/5"
        >
          View PNR Status
        </Link>
        <Link
          to="/"
          className="flex-1 rounded-lg bg-rail-blue py-3 text-center font-semibold text-white hover:brightness-110"
        >
          Book another
        </Link>
      </div>
    </div>
  );
}
