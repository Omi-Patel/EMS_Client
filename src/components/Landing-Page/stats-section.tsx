"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export default function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const stats = [
    { value: "10K+", label: "Events Managed" },
    { value: "2.5M+", label: "Attendees" },
    { value: "98%", label: "Customer Satisfaction" },
    { value: "50%", label: "Time Saved" },
  ];

  return (
    <section ref={ref} className="py-16 bg-background border-y border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <CountUp
                value={stat.value}
                className="text-4xl md:text-5xl font-bold text-primary mb-2"
              />
              <p className="text-muted-foreground font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CountUp({ value, className }: { value: string; className: string }) {
  // For non-numeric values like "10K+", we just display them directly
  return <p className={className}>{value}</p>;
}
