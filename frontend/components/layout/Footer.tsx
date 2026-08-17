'use client';
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
  FaTwitter,
} from "react-icons/fa";
import { useAbout } from "../context/AboutContext";

const socialLinks = [
  {
    name: "Facebook",
    href: "#",
    icon: FaFacebookF,
  },
  {
    name: "TikTok",
    href: "#",
    icon: FaTiktok,
  },
  {
    name: "Twitter",
    href: "#",
    icon: FaTwitter,
  },
  {
    name: "LinkedIn",
    href: "#",
    icon: FaLinkedinIn,
  },
  {
    name: "Instagram",
    href: "#",
    icon: FaInstagram,
  },
];
const footerLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Properties", href: "/properties" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  const { contact } = useAbout()
  return (
    <footer className="bg-charcoal text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="font-heading text-2xl font-semibold tracking-tight"
            >
              <img
                src="/images/logo3.png"
                alt="James"
                className="h-24 w-auto object-contain sm:h-44"
              />
            </Link>


            <p className="mt-5 max-w-md font-body text-sm leading-7 text-white/60">
              Building meaningful ideas, creating lasting impact, and
              connecting people with opportunities that matter.
            </p>

            <Link
              href="/contact"
              className="mt-7 inline-flex rounded-[10px] bg-orange px-5 py-3 font-body text-sm font-semibold text-white transition-colors hover:bg-orange-hover"
            >
              Let's Work Together
            </Link>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">
              Navigation
            </h3>

            <ul className="mt-5 space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-white/60 transition-colors hover:text-orange"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">
              Connect
            </h3>

            <div className="mt-5 space-y-3 font-body text-sm text-white/60">
              {/* Email */}
              <a
                href={`mailto:${contact.email}`}
                className="block transition-colors hover:text-orange"
              >
                {contact.email}
              </a>

              {/* Social Links */}
              <div className="flex items-center gap-4 pt-2">
                {socialLinks.map((social) => {
                  const Icon = social.icon;

                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/60 transition-all duration-300 hover:border-orange hover:bg-orange hover:text-white"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 border-t border-white/10 pt-6">
          <div className="flex flex-col gap-4 text-sm text-white/40 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} James. All rights reserved.
            </p>

            <div className="flex gap-6">
              <Link
                href="https://smbdigitalzone.com/"
                className="transition-colors hover:text-white"
              >
                Maintained & Developed by SMB DigitalZone
              </Link>
              {/* 
              <Link
                href="/terms"
                className="transition-colors hover:text-white"
              >
                Terms
              </Link> */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}