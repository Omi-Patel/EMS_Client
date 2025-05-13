"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    // This would be replaced with your actual auth check
    const checkAuth = () => {
      // Mock authentication check
      const authenticated = localStorage.getItem("token");
      setIsLoggedIn(authenticated !== null);
    };

    checkAuth();
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden pt-32 pb-20 md:pt-36 md:pb-32 bg-background">

      {/* Background Pattern */}

      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left"
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-6 border border-border">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
              {"New: AI-powered event planning"}
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-t from-primary to-accent">
                Streamline Your Events
              </span>
              <br />
              <span className="text-foreground">with EMS Platform</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-xl">
              The all-in-one platform for seamless event management. Plan,
              organize, and execute perfect events with powerful AI assistance.
            </p>

            <div className="flex flex-wrap gap-4">
              {isLoggedIn ? (
                <>
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                  >
                    Go to Dashboard
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-2 border-border"
                  >
                    Create New Event <ArrowRight className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                  >
                    Get Started Free
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-2 border-border"
                  >
                    <Play className="h-4 w-4" /> Watch Demo
                  </Button>
                </>
              )}
            </div>

            <div className="mt-8 flex flex-wrap items-center text-sm text-muted-foreground gap-4">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary mr-2" />
                No credit card required
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary mr-2" />
                14-day free trial
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary mr-2" />
                Cancel anytime
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="relative flex justify-center items-center">
              {/* Main Device Mockup */}
              <div className="relative w-full max-w-[500px] aspect-[16/10] bg-gradient-to-br from-card to-card-foreground rounded-2xl shadow-2xl border border-border flex items-center justify-center overflow-hidden">
                {/* Screen Content */}
                <div className="w-[92%] h-[85%] rounded-xl bg-background overflow-hidden shadow-inner">
                  {/* Dashboard UI */}
                  <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="h-12 bg-primary flex items-center px-4">
                      <div className="w-24 h-4 bg-primary-foreground/30 rounded-full"></div>
                      <div className="ml-auto flex space-x-2">
                        <div className="w-8 h-8 rounded-full bg-primary-foreground/20"></div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-muted/50 p-3 grid grid-cols-3 gap-3">
                      {/* Sidebar */}
                      <div className="col-span-1 bg-background rounded-lg shadow-sm p-3">
                        <div className="w-full h-4 bg-muted rounded mb-3"></div>
                        <div className="w-3/4 h-3 bg-muted rounded mb-4"></div>
                        <div className="space-y-2">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className="flex items-center space-x-2"
                            >
                              <div className="w-3 h-3 rounded-sm bg-primary/20"></div>
                              <div className="w-full h-3 bg-muted rounded"></div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Main Content */}
                      <div className="col-span-2 space-y-3">
                        <div className="bg-background rounded-lg shadow-sm p-3 h-24">
                          <div className="w-1/3 h-4 bg-muted rounded mb-3"></div>
                          <div className="flex space-x-2">
                            <div className="w-16 h-10 bg-primary/10 rounded"></div>
                            <div className="w-16 h-10 bg-accent/10 rounded"></div>
                            <div className="w-16 h-10 bg-secondary/10 rounded"></div>
                          </div>
                        </div>
                        <div className="bg-background rounded-lg shadow-sm p-3 h-32">
                          <div className="w-1/4 h-4 bg-muted rounded mb-3"></div>
                          <div className="h-16 bg-muted rounded-lg"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Screen Reflection */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-background/10 to-transparent pointer-events-none"></div>
              </div>

              {/* Laptop Stand/Base */}
              <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-32 h-3 bg-gradient-to-r from-muted to-muted-foreground rounded-b-xl shadow-md"></div>
            </div>

            {/* Notification Popup */}
            <motion.div
              initial={{ opacity: 0, y: 20, x: 20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute -bottom-6 -right-6 bg-background rounded-lg shadow-xl p-4 border border-border"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Event published!
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Tech Conference 2024
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Calendar Popup */}
            <motion.div
              initial={{ opacity: 0, y: 20, x: -20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ delay: 1.3, duration: 0.5 }}
              className="absolute -top-6 -left-6 bg-background rounded-lg shadow-xl p-3 border border-border"
            >
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <div className="h-4 w-4 rounded-sm bg-primary"></div>
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">
                    3 events today
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Next: 2:00 PM
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 right-0 w-64 h-64 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
    </section>
  );
}
