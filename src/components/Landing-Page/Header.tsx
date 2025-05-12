"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, User, LayoutDashboard, LogOut, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { isAuthenticated, getUser, removeToken } from "@/lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "@tanstack/react-router";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{
    email: string;
    isAdmin: boolean;
    name?: string;
    avatar?: string | null;
  } | null>(null);
  const [activeLink, setActiveLink] = useState("/");

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsLoggedIn(authenticated);

      if (authenticated) {
        const userData = getUser();
        setUser(userData);
      } else {
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    removeToken();
  };

  const navLinks = [
    { name: "Features", path: "/features" },
    { name: "Pricing", path: "/pricing" },
    { name: "Resources", path: "/resources" },
    { name: "About", path: "/about" },
  ];

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (user?.name) {
      return user.name
        .split(" ")
        .map((name) => name[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    }

    if (user?.email) {
      return user.email[0].toUpperCase();
    }

    return "U";
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "py-3 bg-background/95 backdrop-blur-md shadow-sm dark:bg-background/95"
          : "py-5 bg-gradient-to-r from-secondary/80 to-background/80 backdrop-blur-md dark:from-secondary/80 dark:to-background/80"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 group"
            onClick={() => setActiveLink("/")}
          >
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md transition-all duration-300 group-hover:shadow-primary/50 group-hover:scale-105">
              <span className="text-primary-foreground font-bold text-xl">
                E
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold transition-colors text-foreground">
                EMS
              </span>
              <span className="text-xs text-muted-foreground -mt-1">
                Event Management
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center">
            <div className="flex bg-background/50 backdrop-blur-md rounded-full shadow-sm p-1 border border-border">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  href={link.path}
                  isScrolled={isScrolled}
                  isActive={activeLink === link.path}
                  onClick={() => setActiveLink(link.path)}
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isLoggedIn ? (
              <>
                {user?.isAdmin && (
                  <Link to="/app/admin-portal">
                    <Button
                      size="sm"
                      className=" text-primary-foreground shadow-md hover:shadow-lg transition-all duration-300 rounded-full px-6"
                    >
                      <div className="flex gap-2 justify-center items-center">
                        <Plus className="h-4 w-4" />
                        <span>New Event</span>
                      </div>
                    </Button>
                  </Link>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="relative h-10 w-10 rounded-full p-0 overflow-hidden border-2 border-secondary hover:border-secondary/80 transition-all"
                    >
                      <Avatar className="h-full w-full">
                        {user?.avatar && <AvatarImage src={user.avatar} />}
                        <AvatarFallback className="bg-gradient-to-br from-secondary to-accent text-primary font-semibold">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-56 rounded-xl p-2 shadow-xl border border-border"
                    align="end"
                    forceMount
                  >
                    <DropdownMenuLabel className="font-normal px-3 py-2 rounded-lg">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none text-foreground">
                          {user?.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        to="/"
                        className="cursor-pointer flex items-center rounded-lg px-3 py-2 hover:bg-accent/50 transition-colors"
                      >
                        <User className="mr-2 h-4 w-4 text-primary" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    {user?.isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link
                          to="/app/admin-portal"
                          className="cursor-pointer flex items-center rounded-lg px-3 py-2 hover:bg-accent/50 transition-colors"
                        >
                          <LayoutDashboard className="mr-2 h-4 w-4 text-primary" />
                          <span>Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer rounded-lg px-3 py-2 hover:bg-destructive/10 text-destructive transition-colors"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/auth/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="font-medium rounded-full border-secondary text-primary hover:bg-secondary/50 transition-all duration-300"
                  >
                    Log in
                  </Button>
                </Link>
                <Link to="/auth/register">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-300 rounded-full px-6"
                  >
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center space-x-2">
            {isLoggedIn && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative h-10 w-10 rounded-full p-0 overflow-hidden border-2 border-secondary hover:border-secondary/80 transition-all"
                  >
                    <Avatar className="h-full w-full">
                      {user?.avatar && <AvatarImage src={user.avatar} />}
                      <AvatarFallback className="bg-gradient-to-br from-secondary to-accent text-primary font-semibold">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 rounded-xl p-2 shadow-xl border border-border"
                  align="end"
                  forceMount
                >
                  <DropdownMenuLabel className="font-normal px-3 py-2 rounded-lg">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-foreground">
                        {user?.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      to="/"
                      className="cursor-pointer flex items-center rounded-lg px-3 py-2 hover:bg-accent/50 transition-colors"
                    >
                      <User className="mr-2 h-4 w-4 text-primary" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  {user?.isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link
                        to="/app/admin-portal"
                        className="cursor-pointer flex items-center rounded-lg px-3 py-2 hover:bg-accent/50 transition-colors"
                      >
                        <LayoutDashboard className="mr-2 h-4 w-4 text-primary" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer rounded-lg px-3 py-2 hover:bg-destructive/10 text-destructive transition-colors"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <motion.button
              className="p-2 rounded-full text-primary bg-secondary hover:bg-secondary/80 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-background border-t mt-1 shadow-lg border-border"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col space-y-1">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.path}
                    className={cn(
                      "px-4 py-3 flex items-center justify-between text-foreground hover:bg-accent/50 hover:text-primary rounded-xl transition-colors",
                      activeLink === link.path &&
                        "bg-accent/50 text-primary font-medium"
                    )}
                    onClick={() => {
                      setActiveLink(link.path);
                      setMobileMenuOpen(false);
                    }}
                  >
                    <span>{link.name}</span>
                  </Link>
                </motion.div>
              ))}

              {!isLoggedIn && (
                <div className="pt-4 border-t border-border flex flex-col space-y-3 mt-3">
                  <Link to="/auth/login" className="w-full">
                    <Button
                      variant="outline"
                      className="w-full justify-center rounded-xl border-secondary text-primary hover:bg-secondary/50"
                    >
                      Log in
                    </Button>
                  </Link>
                  <Link to="/auth/register" className="w-full">
                    <Button className="w-full justify-center rounded-xl bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground">
                      Sign up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function NavLink({
  href,
  children,
  isActive,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  isScrolled: boolean;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <Link
      to={href}
      className={cn(
        "px-4 py-2 rounded-full font-medium transition-all duration-300 relative group flex items-center",
        isActive
          ? "bg-background text-primary shadow-sm"
          : "text-foreground hover:text-primary"
      )}
      onClick={onClick}
    >
      <div className="flex items-center">{children}</div>

      {!isActive && (
        <motion.span
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </Link>
  );
}
