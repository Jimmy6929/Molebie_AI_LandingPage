"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FAQ_ITEMS } from "@/lib/constants";
import { SectionHeading } from "./ui/section-heading";
import { AnimateIn } from "./ui/animate-in";

function FaqItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b-2 border-accent-yellow/20 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left py-5 px-1 flex items-center justify-between gap-4 cursor-pointer"
        aria-expanded={open}
      >
        <span className="font-mono font-bold text-bg-white text-sm md:text-base">
          {question}
        </span>
        <span
          className="text-accent-yellow font-black text-xl flex-shrink-0 transition-transform duration-200"
          style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
        >
          +
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <p className="px-1 pb-5 text-bg-white/60 text-sm md:text-base leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  return (
    <section
      id="faq"
      className="py-24 lg:py-32"
      aria-label="FAQ"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 w-full">
        <AnimateIn>
          <SectionHeading>Frequently Asked Questions</SectionHeading>
        </AnimateIn>

        <AnimateIn delay={0.1}>
          <div className="max-w-3xl">
            {FAQ_ITEMS.map((item) => (
              <FaqItem
                key={item.question}
                question={item.question}
                answer={item.answer}
              />
            ))}
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
