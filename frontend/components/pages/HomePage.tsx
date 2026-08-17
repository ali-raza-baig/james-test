'use client';
import Image from "next/image";
import Link from "next/link";
import { EmailIcon, FacebookIcon, InstagramIcon, LinkedInIcon, PhoneIcon } from "@/app/assests/Icons";
import BookAppointment from "../global/BookAppointment";
import PropertySearch from "../global/PropertySearch";

import AnimatedCounter from "../global/AnimatedCounter";
import { useEffect, useState } from "react";
import BlogSection from "../sections/BlogSection";
import TestimonialSection from "../sections/TestimonialSection";
import PropertySection from "../sections/PropertySection";
import NewsletterSection from "../sections/NewsletterSection";
import { useAbout } from "../context/AboutContext";


export default function HomePage() {

  const { about, loading, error } = useAbout()

  return (
    <main>
      {/* Hero */}
      <section className="relative min-h-[720px] ">
        {/* Background Image */}
        <Image
          src="/images/test2.jpeg"
          alt="Luxury property"
          fill
          priority
          className="object-cover"
        />

        {/* Background Overlay */}
        <div className="absolute inset-0 bg-charcoal/70" />

        {/* Subtle Orange Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/80 via-charcoal/60 to-charcoal/90" />

        {/* Content */}
        <div className="relative z-10 mx-auto flex min-h-[720px] max-w-7xl items-center px-6 py-28">
          <div className="grid w-full items-center gap-12 lg:grid-cols-2 lg:gap-20">

            {/* Left Content */}
            <div className="max-w-2xl ">
              <p className="mb-5 font-body text-sm font-semibold uppercase tracking-[0.2em] text-orange">
                Find Your Place
              </p>

              <h1 className="font-heading text-5xl font-semibold leading-[1.05] tracking-tight text-white! sm:text-6xl lg:text-7xl">
                Find a place
                <br />
                <span className="text-orange">you can call home.</span>
              </h1>

              <p className="mt-7 max-w-xl font-body text-lg leading-8 text-white/75">
                Discover exceptional properties in the locations you love.
                From modern homes to exclusive spaces, find a property that
                fits your lifestyle.
              </p>


              {about && (<>
                <div className="mt-8 flex flex-wrap items-center gap-6">
                  <div>
                    <p className="font-heading text-2xl font-semibold text-white">
                      {/* 500+ */}
                      <AnimatedCounter value={about.totalSoldProperties} suffix="+" />
                    </p>
                    <p className="mt-1 text-sm text-white/60">
                      Properties
                    </p>
                  </div>


                  <div className="h-10 w-px bg-white/20" />

                  <div>
                    <p className="font-heading text-2xl font-semibold text-white">
                      <AnimatedCounter value={about.locations} suffix="+" />
                    </p>
                    <p className="mt-1 text-sm text-white/60">
                      Locations
                    </p>
                  </div>

                  <div className="h-10 w-px bg-white/20" />

                  <div>
                    <p className="font-heading text-2xl font-semibold text-white">
                      <AnimatedCounter value={about.yearsOfExperinces} suffix="+" />
                    </p>
                    <p className="mt-1 text-sm text-white/60">
                      Years Experience
                    </p>
                  </div>
                </div>
              </>)}
            </div>

            <BookAppointment />
          </div>

          <div className="absolute bottom-0 left-1/2 z-10 w-full max-w-4xl -translate-x-1/2 translate-y-1/2 px-4">
            <PropertySearch />
          </div>
        </div>


      </section>


      {/* Who am i */}
      <section className="bg-stone/25 py-20 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6">

          <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">

            {/* Image */}
            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[10px]">
                <Image
                  src="/images/test3.jpeg"
                  alt="James"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Small floating detail */}
              <div className=" absolute -bottom-6 right-5 hidden
    overflow-hidden rounded-[10px]
    bg-charcoal px-6 py-5
    sm:block lg:-right-8

    before:absolute
    before:inset-y-0 before:left-0
    before:-z-0
    before:w-0
    before:bg-orange
    before:transition-all before:duration-500
    hover:before:w-full  ">
                <div className="relative z-10">

                  <p className="font-heading  text-3xl font-semibold text-white ">
                    <AnimatedCounter value={about.yearsOfExperinces} suffix="+" />
                  </p>

                  <p className="mt-1  font-body text-sm text-white/60 ">
                    Years of Experience
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="lg:pl-4">

              <p className="mb-5 font-body text-sm font-semibold uppercase tracking-[0.2em] text-orange">
                Who Am I?
              </p>

              <h2 className="max-w-2xl font-heading text-4xl font-semibold leading-tight tracking-tight text-charcoal sm:text-5xl lg:text-6xl">
                More than a professional.
                <br />
                <span className="text-orange">A person you can trust.</span>
              </h2>

              <div className="mt-7 max-w-2xl space-y-5 font-body text-base leading-7 text-text/70 sm:text-lg sm:leading-8">
                <p>
                  I'm James, a property professional passionate about helping
                  people find spaces that genuinely feel like home.
                </p>

                <p>
                  Over the years, I've built my approach around something simple:
                  understanding people first, then finding the right property
                  for them.
                </p>

                <p>
                  Whether you're looking for your next home, an investment, or
                  the perfect place to build your future, I believe the process
                  should feel straightforward, personal, and trustworthy.
                </p>
              </div>

              {/* Highlights */}
              <div className="mt-9 grid grid-cols-3 gap-x-2 lg:gap-x-8 gap-y-6 border-y border-orange/35 py-7 sm:grid-cols-3">
                <div className="group p-2 relative overflow-hidden flex flex-col items-center justify-center md:py-6 rounded-[10px]  before:absolute
    before:inset-y-0 before:left-0
    before:-z-0
    before:w-0
    before:bg-orange
    before:transition-all before:duration-500
    hover:before:w-full ">
                  <div className="relative z-10">

                    <p className="font-heading text-2xl font-semibold text-charcoal group-hover:text-ivory">
                      {about.totalSoldProperties}+
                    </p>
                    <p className="mt-1 text-sm text-text/60 group-hover:text-ivory">
                      Properties
                    </p>
                  </div>
                </div>

                <div className="group p-2 relative overflow-hidden flex flex-col items-center justify-center md:py-6 rounded-[10px]  before:absolute
    before:inset-y-0 before:left-0
    before:-z-0
    before:w-0
    before:bg-orange
    before:transition-all before:duration-500
    hover:before:w-full">
                  <div className="relative z-10">

                    <p className="font-heading text-2xl font-semibold text-charcoal group-hover:text-ivory">
                      {about.locations}+
                    </p>
                    <p className="mt-1 text-sm text-text/60 group-hover:text-ivory">
                      Locations
                    </p>
                  </div>
                </div>

                <div className="group p-2 relative overflow-hidden  flex flex-col items-center justify-center md:py-6 rounded-[10px]  before:absolute
    before:inset-y-0 before:left-0
    before:-z-0
    before:w-0
    before:bg-orange
    before:transition-all before:duration-500
    hover:before:w-full">
                  <div className="relative z-10">

                    <p className="font-heading text-2xl font-semibold text-charcoal group-hover:text-ivory">
                      {about.yearsOfExperinces}+
                    </p>
                    <p className="mt-1 text-sm text-text/60 group-hover:text-ivory">
                      Years Experience
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-8">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-3 rounded-[10px] bg-orange px-6 py-3.5 font-body text-sm font-semibold text-white transition-colors hover:bg-orange-hover"
                >
                  More About Me

                  <span aria-hidden="true">→</span>
                </Link>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* property cards */}
      <PropertySection />

      <BlogSection />

      <TestimonialSection />

      <NewsletterSection />

    </main >
  );
}




/* --------------------------------
   Contact Item
-------------------------------- */

export function ContactItem({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-5 border-b border-charcol/10 py-7"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] border border-white/10 text-orange">
        {icon}
      </div>

      <div>
        <p className="font-body text-xs font-medium uppercase tracking-wider text-charcoal">
          {label}
        </p>

        <p className="mt-1 font-heading text-lg font-semibold text-charcol transition-colors group-hover:text-orange sm:text-xl">
          {value}
        </p>
      </div>

      <span className="ml-auto text-xl text-charcol/30 transition-transform group-hover:translate-x-1 group-hover:text-orange">
        →
      </span>
    </Link>
  );
}


/* --------------------------------
   Social Link
-------------------------------- */

export function SocialLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-[10px] border border-white/15 bg-charcoal text-white! transition-colors hover:border-orange hover:bg-orange hover:text-white"
    >
      {icon}
    </Link>
  );
}
