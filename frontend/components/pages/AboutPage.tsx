import { ArrowIcon, EmailIcon, FacebookIcon, InstagramIcon, LinkedInIcon, PhoneIcon } from '@/app/assests/Icons';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import { ContactItem, SocialLink } from './HomePage';

const AboutPage = () => {
  return (
    <main>
      <section className="relative min-h-80">
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
        <div className="absolute inset-0 bg-linear-to-r from-charcoal/80 via-charcoal/60 to-charcoal/90" />
        {/* Content */}
        <div className="relative z-10 mx-auto flex min-h-80 max-w-7xl items-center px-6 py-28">
          <h1 className="font-heading text-4xl font-semibold leading-[1.25] tracking-tight text-white! sm:text-5xl lg:text-6xl">
            Where Expertise Meets
            <br />
            <span className="text-orange">Exceptional Living</span>
          </h1>
        </div>

      </section>
      <section className="bg-ivory py-20 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6">

          {/* Intro Statement */}
          <div className="max-w-5xl">
            <p className="mb-6 font-body text-sm font-semibold uppercase tracking-[0.2em] text-orange">
              About James
            </p>

            <h2 className="font-heading text-4xl font-semibold leading-[1.08] tracking-tight text-charcoal sm:text-5xl lg:text-7xl">
              Property is not just about
              <span className="text-orange"> buildings.</span>
              <br />
              It's about what comes next.
            </h2>
          </div>

          {/* Story */}
          <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-12">

            {/* Large Number */}
            <div className="lg:col-span-3">
              <p className="font-heading text-7xl font-semibold leading-none text-stone sm:text-8xl">
                01
              </p>

              <p className="mt-5 max-w-45 font-body text-sm leading-6 text-text/50">
                A personal approach to property and the people behind every
                decision.
              </p>
            </div>

            {/* Content */}
            <div className="lg:col-span-8 lg:col-start-5">
              <p className="font-heading text-2xl font-semibold leading-snug text-charcoal sm:text-3xl">
                I believe finding the right property should feel personal,
                considered, and clear.
              </p>

              <div className="mt-7 grid gap-7 font-body text-base leading-7 text-text/65 sm:grid-cols-2 sm:text-lg sm:leading-8">
                <p>
                  My work is built around understanding what matters to each
                  person I work with. Every client has a different reason for
                  moving, investing, selling, or searching for something new.
                </p>

                <p>
                  Rather than simply showing properties, I focus on creating a
                  straightforward experience where you can make decisions with
                  confidence and clarity.
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          {/* <div className="my-16 h-px bg-stone sm:my-20 lg:my-24" /> */}

        </div>
      </section>

      <section className='bg-charcoal py-20 sm:py-24 lg:py-32'>
        <div className='mx-auto max-w-7xl px-6'>

          {/* Philosophy */}
          <div className="grid gap-12 lg:grid-cols-12 ">

            <div className="lg:col-span-4">
              <p className="font-body text-sm font-semibold uppercase tracking-[0.2em] text-orange">
                My Approach
              </p>

              <h3 className="mt-4 font-heading text-3xl font-semibold leading-tight text-ivory! sm:text-4xl">
                Simple principles.
                <br />
                Meaningful results.
              </h3>
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">

                <Principle
                  number="01"
                  title="Listen First"
                  description="Understanding your goals, priorities, and circumstances comes before recommending a property."
                />

                <Principle
                  number="02"
                  title="Be Transparent"
                  description="Clear communication and honest advice should be part of every property decision."
                />

                <Principle
                  number="03"
                  title="Think Long Term"
                  description="A property decision should make sense not only today, but for where you want to be tomorrow."
                />

                <Principle
                  number="04"
                  title="Build Trust"
                  description="The best relationships are built through consistency, professionalism, and genuine care."
                />

              </div>
            </div>
          </div>

        </div>
      </section>

      <section className="bg-stone/25 py-20 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6">

          {/* Header */}
          <div className="max-w-3xl">
            <p className="mb-5 font-body text-sm font-semibold uppercase tracking-[0.2em] text-orange">
              Vision & Mission
            </p>

            <h2 className="font-heading text-4xl font-semibold leading-tight tracking-tight text-charcoal sm:text-5xl lg:text-6xl">
              A clear direction.
              <br />
              <span className="text-orange">A meaningful purpose.</span>
            </h2>
          </div>

          {/* Panels */}
          <div className="mt-12 grid gap-5 lg:mt-16 lg:grid-cols-2">

            {/* Mission */}
            <article className="relative overflow-hidden rounded-[10px] bg-charcoal p-8 sm:p-10 lg:min-h-[430px] lg:p-12">

              {/* Background Number */}
              <span className="pointer-events-none absolute -right-2 -top-6 font-heading text-[140px] font-semibold leading-none text-white/30">
                01
              </span>

              <div className="relative z-10 flex h-full flex-col">

                <div className="flex items-center justify-between">
                  <span className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-orange">
                    Mission
                  </span>

                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-orange">
                    <ArrowIcon />
                  </span>
                </div>

                <div className="mt-auto pt-16">
                  <h3 className="max-w-xl font-heading text-3xl font-semibold leading-tight text-white! sm:text-4xl">
                    To make property decisions feel simpler, clearer, and more
                    personal.
                  </h3>

                  <p className="mt-5 max-w-xl font-body text-base leading-7 text-white/55">
                    My mission is to guide people through every stage of their
                    property journey with honest advice, thoughtful service, and
                    a genuine understanding of what they want to achieve.
                  </p>
                </div>
              </div>
            </article>

            {/* Vision */}
            <article className="relative overflow-hidden rounded-[10px] border border-stone bg-ivory p-8 sm:p-10 lg:min-h-[430px] lg:p-12">

              {/* Background Number */}
              <span className="pointer-events-none absolute -right-2 -top-6 font-heading text-[140px] font-semibold leading-none text-stone/40">
                02
              </span>

              <div className="relative z-10 flex h-full flex-col">

                <div className="flex items-center justify-between">
                  <span className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-orange">
                    Vision
                  </span>

                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stone text-orange">
                    <ArrowIcon />
                  </span>
                </div>

                <div className="mt-auto pt-16">
                  <h3 className="max-w-xl font-heading text-3xl font-semibold leading-tight text-charcoal sm:text-4xl">
                    To build lasting relationships through better property
                    experiences.
                  </h3>

                  <p className="mt-5 max-w-xl font-body text-base leading-7 text-text/60">
                    I want to create a reputation built not simply on successful
                    transactions, but on trust, long-term relationships, and
                    helping people find opportunities that genuinely fit their
                    lives.
                  </p>
                </div>
              </div>
            </article>

          </div>

          {/* Bottom Statement */}
          <div className="mt-10 border-t border-orange/35 pt-8">
            <p className="max-w-4xl font-heading text-xl font-semibold leading-relaxed text-charcoal sm:text-2xl">
              "The goal isn't simply to find a property. It's to help people
              make a decision they feel confident about."
            </p>
          </div>

        </div>
      </section>

    </main>
  )
}

export default AboutPage


function Principle({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="border-t border-orange/35 pt-5">
      <div className="flex items-center justify-between">
        <span className="font-body text-xs font-semibold tracking-wider text-orange">
          {number}
        </span>

        <span className="h-2 w-2 rounded-full bg-orange" />
      </div>

      <h4 className="mt-5 font-heading text-xl font-semibold text-ivory!">
        {title}
      </h4>

      <p className="mt-3 font-body text-sm leading-6 text-ivory/60 sm:text-base">
        {description}
      </p>
    </div>
  );
}