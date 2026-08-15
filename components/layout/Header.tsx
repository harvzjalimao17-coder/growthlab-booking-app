"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_SECTIONS = [
  { id: "capabilities", label: "What We Automate" },
  { id: "process", label: "How It Works" },
  { id: "demo", label: "Live Demo" },
  { id: "about", label: "About" },
];

export function Header() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    // Scroll-spy only applies on the landing page, where these sections
    // actually exist. On /book (and any other route) there is nothing to
    // observe, so this simply stays a no-op there.
    if (pathname !== "/") {
      setActiveSection(null);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to the top of the viewport among those
        // currently intersecting, so only one section is ever "active".
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -60% 0px", threshold: 0 }
    );

    const elements = NAV_SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null
    );
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-xl tracking-tight">
          <Image src="/growthlab-logo.png" alt="" width={26} height={26} />
          GrowthLab
        </Link>
        <nav className="hidden items-center gap-8 text-sm sm:flex">
          {NAV_SECTIONS.map((section) => (
            <Link
              key={section.id}
              href={`/#${section.id}`}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "transition-colors",
                activeSection === section.id
                  ? "text-amber"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {section.label}
            </Link>
          ))}
        </nav>
        <Button asChild size="sm" variant="accent">
          <Link href="/book">Book a Free Consultation</Link>
        </Button>
      </div>
    </header>
  );
}
