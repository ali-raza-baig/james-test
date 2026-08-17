"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Properties", href: "/properties" },
  { label: "Blogs", href: "/blog" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname()

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="mx-auto max-w-7xl px-4 pt-1 sm:px-6">
        <div className="rounded-[10px] border border-stone/70 bg-[#F7ECE8] px-5 py-3 shadow-sm backdrop-blur-md">
          <div className="flex h-18 items-center justify-between">

            {/* Logo */}
            {/* <Link
              href="/"
              className="font-heading text-xl font-semibold tracking-tight text-charcoal"
            >
              James<span className="text-orange">.</span>
            </Link> */}

            <Link href="/" className="flex shrink-0 items-center">
              <img
                src="/images/logo-james.png"
                alt="James"
                className="h-24 w-auto object-contain sm:h-24"
              />
            </Link>


            {/* Desktop Navigation */}
            <div className="hidden items-center gap-8 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative font-body text-sm font-medium text-text transition-colors duration-200 hover:text-orange ${pathname === link.href ? 'border-b border-orange px-0.5 text-orange!' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <Link
              href="/contact"
              className="hidden rounded-[10px] bg-orange px-5 py-2.5 font-body text-sm font-semibold text-white transition-colors duration-200 hover:bg-orange-hover md:inline-flex"
            >
              Let's Talk
            </Link>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              className="flex h-10 w-10 items-center justify-center rounded-[10px] text-charcoal transition-colors hover:bg-stone/50 md:hidden"
            >
              <div className="flex w-5 flex-col gap-1.5">
                <span
                  className={`h-0.5 w-full bg-charcoal transition-transform ${isOpen ? "translate-y-2 rotate-45" : ""
                    }`}
                />
                <span
                  className={`h-0.5 w-full bg-charcoal transition-opacity ${isOpen ? "opacity-0" : ""
                    }`}
                />
                <span
                  className={`h-0.5 w-full bg-charcoal transition-transform ${isOpen ? "-translate-y-2 -rotate-45" : ""
                    }`}
                />
              </div>
            </button>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="border-t border-stone/70 py-4 md:hidden">
              <div className="flex flex-col">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="border-b border-stone/40 py-3 font-body text-sm font-medium text-text transition-colors hover:text-orange"
                  >
                    {link.label}
                  </Link>
                ))}

                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className="mt-4 inline-flex items-center justify-center rounded-[10px] bg-orange px-5 py-3 font-body text-sm font-semibold text-white hover:bg-orange-hover"
                >
                  Let's Talk
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}