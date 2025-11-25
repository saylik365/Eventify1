import React from "react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center mt-20 text-center">
      <motion.h1
        className="text-5xl font-extrabold text-blue-700"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Welcome to Eventify 🎉
      </motion.h1>
      <p className="mt-4 text-lg text-gray-700 max-w-xl">
        Plan, manage, and RSVP to events with smart recommendations — all in one place.
      </p>
    </div>
  );
}
