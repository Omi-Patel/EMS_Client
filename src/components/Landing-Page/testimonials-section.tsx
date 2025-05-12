"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Star } from "lucide-react";

export default function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const testimonials = [
    {
      quote:
        "EMS transformed how we manage our corporate events. The platform is intuitive and powerful, saving us countless hours of work.",
      author: "Sarah Johnson",
      role: "Event Director, TechCorp",
      avatar: "SJ",
      rating: 5,
    },
    {
      quote:
        "We've increased attendance by 40% and reduced planning time by half since switching to EMS. The analytics tools are game-changing.",
      author: "Michael Chen",
      role: "Conference Organizer, GlobalSummit",
      avatar: "MC",
      rating: 5,
    },
    {
      quote:
        "The analytics alone are worth it. We finally understand what works and what doesn't. Our events have never been more successful.",
      author: "Priya Patel",
      role: "Marketing Lead, Innovate Inc",
      avatar: "PP",
      rating: 5,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section ref={ref} className="px-4 py-24 bg-muted/50">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Trusted by Event Professionals
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See what our customers have to say about their experience with EMS.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-background p-8 rounded-2xl shadow-lg border border-border relative"
            >
              {/* Quote mark */}
              <div className="absolute -top-5 -left-5 h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-primary text-xl font-serif">
                "
              </div>

              <div className="mb-4 flex">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-primary fill-primary"
                  />
                ))}
              </div>

              <p className="text-muted-foreground mb-6 italic leading-relaxed">
                "{testimonial.quote}"
              </p>

              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mr-4 text-primary font-medium">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Logos Section */}
        
      </div>
    </section>
  );
}
