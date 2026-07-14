import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2, Plus, Trash2 } from "lucide-react";
import { createBooking, fetchTrain } from "../lib/api";
import type { Passenger, Train } from "../lib/types";
import StepIndicator from "../components/StepIndicator";

const steps = ["Passengers", "Review", "Payment"];

export default function Booking() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const trainNumber = params.get("trainNumber") || "";
  const classCode = params.get("classCode") || "";
  const date = params.get("date") || "";

  const [train, setTrain] = useState<Train | null>(null);
  const [step, setStep] = useState(0);
  const [passengers, setPassengers] = useState<Passenger[]>([{ name: "", age: 25, gender: "M" }]);
  const [contact, setContact] = useState({ name: "", mobile: "" });
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTrain(trainNumber).then(setTrain).catch(() => setError("Train not found"));
  }, [trainNumber]);

  const selectedClass = train?.classes.find((c) => c.code === classCode);
  const totalFare = selectedClass ? selectedClass.fare * passengers.length : 0;

  function updatePassenger(i: number, patch: Partial<Passenger>) {
    setPassengers((prev) => prev.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  }

  function addPassenger() {
    if (passengers.length >= 6) return;
    setPassengers((prev) => [...prev, { name: "", age: 25, gender: "M" }]);
  }

  function removePassenger(i: number) {
    setPassengers((prev) => prev.filter((_, idx) => idx !== i));
  }

  function validatePassengers() {
    if (!passengers.every((p) => p.name.trim().length > 1 && p.age > 0)) {
      setError("Please fill valid name and age for every passenger");
      return false;
    }
    if (!contact.name || !/^\d{10}$/.test(contact.mobile)) {
      setError("Please provide contact name and a valid 10-digit mobile number");
      return false;
    }
    setError("");
    return true;
  }

  async function handlePay() {
    setPaying(true);
    setError("");
    try {
      await new Promise((r) => setTimeout(r, 1400));
      const booking = await createBooking({ trainNumber, classCode, date, passengers, contact });
      navigate(`/confirmation/${booking.pnr}`);
    } catch {
      setError("Payment failed, please try again");
      setPaying(false);
    }
  }

  if (error && !train) {
    return <p className="mx-auto max-w-2xl px-4 py-16 text-center text-red-600">{error}</p>;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 pb-28 sm:pb-8">
      {train && (
        <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm">
          <p className="font-semibold text-rail-blue">
            {train.name} · #{train.number}
          </p>
          <p className="text-sm text-gray-500">
            {train.from} {train.departure} → {train.to} {train.arrival} · {date}
          </p>
          {selectedClass && (
            <p className="mt-1 text-sm">
              Class: <span className="font-semibold">{selectedClass.name}</span> · ₹{selectedClass.fare} / passenger
            </p>
          )}
        </div>
      )}

      <StepIndicator steps={steps} current={step} />

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="passengers"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {passengers.map((p, i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex items-end gap-2">
                  <label className="flex-1">
                    <span className="text-xs font-semibold text-gray-500">Full Name</span>
                    <input
                      value={p.name}
                      onChange={(e) => updatePassenger(i, { name: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                      placeholder="Passenger name"
                    />
                  </label>
                  {passengers.length > 1 && (
                    <button
                      onClick={() => removePassenger(i)}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50"
                      aria-label="Remove passenger"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:flex sm:items-end">
                  <label className="sm:w-20">
                    <span className="text-xs font-semibold text-gray-500">Age</span>
                    <input
                      type="number"
                      min={1}
                      max={120}
                      value={p.age}
                      onChange={(e) => updatePassenger(i, { age: Number(e.target.value) })}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                    />
                  </label>
                  <label className="sm:w-24">
                    <span className="text-xs font-semibold text-gray-500">Gender</span>
                    <select
                      value={p.gender}
                      onChange={(e) => updatePassenger(i, { gender: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                    >
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                      <option value="O">Other</option>
                    </select>
                  </label>
                </div>
              </div>
            ))}

            <button
              onClick={addPassenger}
              className="flex items-center gap-1 text-sm font-semibold text-rail-blue hover:underline"
            >
              <Plus size={16} /> Add passenger
            </button>

            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="mb-2 text-sm font-semibold text-gray-500">Contact details</p>
              <div className="flex flex-wrap gap-3">
                <input
                  value={contact.name}
                  onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))}
                  placeholder="Contact name"
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2"
                />
                <input
                  value={contact.mobile}
                  onChange={(e) => setContact((c) => ({ ...c, mobile: e.target.value.replace(/\D/g, "") }))}
                  placeholder="Mobile number"
                  maxLength={10}
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2"
                />
              </div>
            </div>

            {error && <p className="text-sm font-medium text-red-600">{error}</p>}

            <div className="h-2 sm:hidden" />
            <div
              className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white p-4 sm:static sm:border-0 sm:bg-transparent sm:p-0"
              style={{ paddingBottom: "max(env(safe-area-inset-bottom), 1rem)" }}
            >
              <button
                onClick={() => validatePassengers() && setStep(1)}
                className="mx-auto w-full max-w-2xl rounded-lg bg-rail-blue py-3 font-semibold text-white transition hover:brightness-110"
              >
                Continue to review
              </button>
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="review"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="mb-2 font-semibold text-rail-blue">Passengers</p>
              {passengers.map((p, i) => (
                <div key={i} className="flex justify-between border-b border-gray-100 py-2 text-sm last:border-0">
                  <span>{p.name}</span>
                  <span className="text-gray-500">
                    {p.age} yrs · {p.gender}
                  </span>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="mb-2 font-semibold text-rail-blue">Contact</p>
              <p className="text-sm">{contact.name} · {contact.mobile}</p>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-rail-blue/5 p-4">
              <span className="font-semibold">Total fare</span>
              <span className="text-xl font-bold text-rail-blue">₹{totalFare}</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStep(0)}
                className="flex-1 rounded-lg border border-gray-300 py-3 font-semibold text-gray-600 hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={() => setStep(2)}
                className="flex-1 rounded-lg bg-rail-blue py-3 font-semibold text-white hover:brightness-110"
              >
                Proceed to pay
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="payment"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
              <p className="text-sm text-gray-500">Amount payable</p>
              <p className="text-3xl font-bold text-rail-blue">₹{totalFare}</p>
              <p className="mt-1 text-xs text-gray-400">Simulated payment — no real transaction occurs</p>
            </div>
            {error && <p className="text-sm font-medium text-red-600">{error}</p>}
            <motion.button
              whileTap={{ scale: 0.97 }}
              disabled={paying}
              onClick={handlePay}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-rail-orange py-3 font-semibold text-white disabled:opacity-70"
            >
              {paying ? (
                <>
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                    <Loader2 size={18} />
                  </motion.span>
                  Processing payment...
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} /> Pay & Confirm Booking
                </>
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
