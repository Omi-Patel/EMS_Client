import type React from "react";
import { Facebook, Twitter, Instagram, Github } from "lucide-react";
import { Link } from "@tanstack/react-router";

export default function Footer() {
  return (
    <footer className="bg-card text-card-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">E</span>
              </div>
              <span className="text-xl font-bold text-card-foreground">EMS</span>
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              The all-in-one platform for seamless event management. Plan,
              organize, and execute perfect events with ease.
            </p>
            <div className="flex space-x-4">
              <SocialLink href="#" icon={<Facebook className="h-5 w-5" />} />
              <SocialLink href="#" icon={<Twitter className="h-5 w-5" />} />
              <SocialLink href="#" icon={<Instagram className="h-5 w-5" />} />
              <SocialLink href="#" icon={<Github className="h-5 w-5" />} />
            </div>
          </div>

          <div>
            <h3 className="text-card-foreground font-semibold mb-6 text-lg">Product</h3>
            <ul className="space-y-4">
              <FooterLink href="#">Features</FooterLink>
              <FooterLink href="#">Pricing</FooterLink>
              <FooterLink href="#">Integrations</FooterLink>
              <FooterLink href="#">Enterprise</FooterLink>
              <FooterLink href="#">Security</FooterLink>
            </ul>
          </div>

          <div>
            <h3 className="text-card-foreground font-semibold mb-6 text-lg">Resources</h3>
            <ul className="space-y-4">
              <FooterLink href="#">Documentation</FooterLink>
              <FooterLink href="#">Guides</FooterLink>
              <FooterLink href="#">API Reference</FooterLink>
              <FooterLink href="#">Blog</FooterLink>
              <FooterLink href="#">Community</FooterLink>
            </ul>
          </div>

          <div>
            <h3 className="text-card-foreground font-semibold mb-6 text-lg">Company</h3>
            <ul className="space-y-4">
              <FooterLink href="#">About</FooterLink>
              <FooterLink href="#">Careers</FooterLink>
              <FooterLink href="#">Contact</FooterLink>
              <FooterLink href="#">Partners</FooterLink>
              <FooterLink href="#">Legal</FooterLink>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Event Management System. All rights
            reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              to="/"
              className="text-muted-foreground hover:text-card-foreground transition-colors text-sm"
            >
              Privacy Policy
            </Link>
            <Link
              to="/"
              className="text-muted-foreground hover:text-card-foreground transition-colors text-sm"
            >
              Terms of Service
            </Link>
            <Link
              to="/"
              className="text-muted-foreground hover:text-card-foreground transition-colors text-sm"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
    >
      {icon}
    </a>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        to={href}
        className="text-muted-foreground hover:text-card-foreground transition-colors"
      >
        {children}
      </Link>
    </li>
  );
}
