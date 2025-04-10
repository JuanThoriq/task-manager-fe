"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";

export default function LandingPage() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.1, duration: 0.5 },
    }),
  };

  return (
    <section className="flex items-center justify-center flex-col px-4">
      <motion.div
        className="flex items-center justify-center flex-col"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        custom={0}
      >
        <motion.div
          className="mb-6 flex items-center gap-2 border border-violet-200 shadow-sm p-3 bg-violet-50 text-violet-700 font-medium rounded-full"
          whileHover={{ scale: 1.03 }}
        >
          <CheckCircle className="h-4 w-4 text-violet-600" />
          <span className="uppercase text-sm tracking-wide">
            No 1 task management
          </span>
        </motion.div>

        <h1 className="text-3xl md:text-6xl text-center text-neutral-800 mb-4 font-bold leading-tight">
          Taskify helps team move
        </h1>

        <motion.div
          className="text-3xl md:text-6xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold px-6 py-3 rounded-2xl shadow-md w-fit"
          whileHover={{
            scale: 1.02,
            boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.5)",
          }}
        >
          work forward.
        </motion.div>
      </motion.div>

      <motion.div
        className="text-sm md:text-xl text-neutral-500 mt-8 max-w-xs md:max-w-2xl text-center mx-auto leading-relaxed"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        custom={1}
      >
        Collaborate, manage projects, and reach new productivity peaks. From
        high rises to the home office, the way your team works is unique —
        accomplish it all with Taskify.
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        custom={2}
        className="mt-10"
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
          <Button
            asChild
            className="px-8 py-6 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-medium text-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
          >
            <Link href="/auth/register">
              Get Taskify for free <ArrowRight className="h-5 w-5 ml-1" />
            </Link>
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        custom={3}
        className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl"
      >
        {[
          {
            title: "Organize",
            description: "Keep tasks in order, prioritize work",
          },
          {
            title: "Collaborate",
            description: "Share and discuss with your team",
          },
          {
            title: "Succeed",
            description: "Complete projects on time, every time",
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -5 }}
            className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center mb-4">
              <span className="text-violet-600 font-bold">{index + 1}</span>
            </div>
            <h3 className="text-lg font-bold text-neutral-800 mb-2">
              {item.title}
            </h3>
            <p className="text-neutral-500">{item.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
