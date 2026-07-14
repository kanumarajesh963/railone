import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import type { Train } from "../lib/types";
import StatusBadge from "./StatusBadge";

export default function TrainCard({
  train,
  index,
  onSelect,
}: {
  train: Train;
  index: number;
  onSelect: (classCode: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -3 }}
      className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm transition-shadow hover:shadow-lg"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-rail-blue">{train.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">#{train.number}</p>
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
          <Clock size={14} />
          {train.duration}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="text-center">
          <p className="text-xl font-bold">{train.departure}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">{train.from}</p>
        </div>
        <div className="relative flex-1">
          <div className="h-0.5 w-full bg-gray-200" />
          <motion.div
            initial={{ left: "0%" }}
            animate={{ left: "100%" }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1.5 h-3 w-3 rounded-full bg-rail-orange"
          />
        </div>
        <div className="text-center">
          <p className="text-xl font-bold">{train.arrival}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">{train.to}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {train.classes.map((cls) => (
          <button
            key={cls.code}
            onClick={() => onSelect(cls.code)}
            className="flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2 text-left transition hover:border-rail-blue hover:bg-rail-blue/5"
          >
            <div>
              <p className="text-sm font-semibold">{cls.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">₹{cls.fare}</p>
            </div>
            <StatusBadge
              status={cls.status}
              label={cls.status === "AVAILABLE" ? `${cls.availability} AVL` : `${cls.status} ${cls.availability}`}
            />
          </button>
        ))}
      </div>
    </motion.div>
  );
}
