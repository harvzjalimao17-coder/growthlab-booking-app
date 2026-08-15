import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-background">
      <div className="container flex flex-col gap-8 py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 font-display text-lg tracking-tight text-foreground">
              <Image src="/growthlab-logo.png" alt="" width={22} height={22} />
              GROWTHLAB
            </div>
            <p className="max-w-xs text-sm text-muted-foreground">
              AI powered automation systems for growing businesses.
            </p>
          </div>

          <nav className="flex flex-col gap-2 text-sm text-muted-foreground sm:items-end">
            <Link href="/#capabilities" className="hover:text-foreground">
              What We Automate
            </Link>
            <Link href="/#process" className="hover:text-foreground">
              How It Works
            </Link>
            <Link href="/#demo" className="hover:text-foreground">
              Live Demo
            </Link>
            <Link href="/#about" className="hover:text-foreground">
              About
            </Link>
            <Link href="/book" className="hover:text-foreground">
              Book a Consultation
            </Link>
          </nav>
        </div>

        <p className="border-t border-border/70 pt-6 text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} GrowthLab. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
