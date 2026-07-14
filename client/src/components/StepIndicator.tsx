import { motion } from "framer-motion";

export default function StepIndicator({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="mb-8 flex items-center">
      {steps.map((step, i) => (
        <div key={step} className="flex flex-1 items-center last:flex-none">
          <div className="flex flex-col items-center gap-1">
            <motion.div
              animate={{
                backgroundColor: i <= current ? "var(--color-rail-orange)" : "#e5e7eb",
                color: i <= current ? "#fff" : "#6b7280",
                scale: i === current ? 1.1 : 1,
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold"
            >
              {i + 1}
            </motion.div>
            <span
              className={`max-w-[4.5rem] text-center text-[11px] leading-tight sm:text-xs ${
                i <= current ? "font-semibold text-rail-blue" : "text-gray-400 dark:text-gray-500"
              }`}
            >
              {step}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className="mx-2 h-1 flex-1 overflow-hidden rounded-full bg-gray-200">
              <motion.div
                className="h-full bg-rail-orange"
                initial={{ width: 0 }}
                animate={{ width: i < current ? "100%" : "0%" }}
                transition={{ duration: 0.4 }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
