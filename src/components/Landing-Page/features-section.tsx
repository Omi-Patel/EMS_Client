"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  Calendar,
  BarChart3,
  MessageSquare,
  Users,
  Clock,
  Shield,
  ArrowRight,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

export default function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const features = [
    {
      title: "Smart Planning",
      description:
        "Intuitive tools to plan every aspect of your event with AI-powered suggestions and templates.",
      icon: <Calendar className="h-8 w-8 text-primary" />,
    },
    {
      title: "Real-time Analytics",
      description:
        "Track attendance, engagement, and ROI with comprehensive dashboards and reports.",
      icon: <BarChart3 className="h-8 w-8 text-primary" />,
    },
    {
      title: "Seamless Communication",
      description:
        "Keep everyone in sync with integrated messaging, notifications, and updates.",
      icon: <MessageSquare className="h-8 w-8 text-primary" />,
    },
    {
      title: "Attendee Management",
      description:
        "Manage registrations, check-ins, and attendee experiences all in one place.",
      icon: <Users className="h-8 w-8 text-primary" />,
    },
    {
      title: "Time-Saving Automation",
      description:
        "Automate repetitive tasks like reminders, follow-ups, and certificate distribution.",
      icon: <Clock className="h-8 w-8 text-primary" />,
    },
    {
      title: "Enterprise Security",
      description:
        "Bank-level security for your data with advanced encryption and compliance features.",
      icon: <Shield className="h-8 w-8 text-primary" />,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section ref={ref} className="px-4 py-24 bg-white">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful Features for Modern Events
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to create, manage, and analyze successful events
            in one platform.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="p-6 rounded-xl border border-border bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="h-14 w-14 rounded-xl bg-secondary flex items-center justify-center mb-5 group-hover:bg-accent transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground mb-4">{feature.description}</p>
              <Link
                to="/"
                className="text-primary font-medium inline-flex items-center hover:text-primary/80 transition-colors"
              >
                Learn more{" "}
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
