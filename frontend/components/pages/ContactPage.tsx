"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useAbout } from "../context/AboutContext";

interface Country {
  name: string;
  code: string;
}

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FormMessage {
  type: "success" | "error";
  text: string;
}

const countries: Country[] = [
  { name: "UAE", code: "+971" },
  { name: "Pakistan", code: "+92" },
  { name: "UK", code: "+44" },
  { name: "USA", code: "+1" },
  { name: "KSA", code: "+966" },
  { name: "Canada", code: "+1" },
  { name: "Australia", code: "+61" },
  { name: "India", code: "+91" },
  { name: "Germany", code: "+49" },
  { name: "France", code: "+33" },
  { name: "Italy", code: "+39" },
];

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND;

function ContactPage() {

  const { contact } = useAbout()

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [selectedCountry, setSelectedCountry] = useState<Country>(
    countries[0]
  );

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [formMessage, setFormMessage] = useState<FormMessage | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    setFormMessage(null);

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.message
    ) {
      setFormMessage({
        type: "error",
        text: "Please fill all required fields.",
      });

      setIsSubmitting(false);
      return;
    }

    try {
      const contactData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        countryCode: selectedCountry.code,
        countryName: selectedCountry.name,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
      };

      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      });

      const result = await response.json();

      if (result.success) {
        setFormMessage({
          type: "success",
          text: result.message,
        });

        setIsSubmitted(true); // ✅ Show the success screen

        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });

        setSelectedCountry(countries[0]);
      } else {
        setFormMessage({
          type: "error",
          text:
            result.message ||
            "Failed to send message. Please try again.",
        });
      }
    } catch (error) {
      console.error("Contact form submission error:", error);

      setFormMessage({
        type: "error",
        text: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);

      setTimeout(() => {
        setFormMessage(null);
      }, 5000);
    }
  };

  return (
    <main>
      <section className="relative min-h-[320px]">
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
        <div className="relative z-10 mx-auto flex min-h-[320px] max-w-7xl items-center px-6 py-28">
          <h1 className="font-heading text-4xl font-semibold leading-[1.25] tracking-tight text-white! sm:text-5xl lg:text-6xl">
            Let’s Start a
            <br />
            <span className="text-orange">Conversation</span>
          </h1>
        </div>
      </section>
      {/* Content and form section */}
      <section className=" py-20 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            {/* Left Content */}
            <div className="lg:sticky lg:top-32 lg:self-start">
              <p className="mb-5 font-body text-sm font-semibold uppercase tracking-[0.2em] text-orange">
                Book an Appointment
              </p>

              <h2 className="font-heading text-4xl font-semibold leading-tight tracking-tight text-charcoal sm:text-5xl">
                Let's find the
                <br />
                <span className="text-orange">right time to talk.</span>
              </h2>

              <p className="mt-6 max-w-md font-body text-base leading-7 text-text/65 sm:text-lg sm:leading-8">
                Whether you're looking to buy, sell, invest, or simply want to
                discuss your property goals, book a time that works for you.
              </p>

              <div className="mt-8 border-t border-stone pt-7">
                <p className="font-body text-sm font-medium text-text/50">
                  Prefer to contact us directly?
                </p>

                <a
                  href={`mailto:${contact.email}`}
                  className="mt-2 inline-block font-heading text-lg font-semibold text-charcoal transition-colors hover:text-orange"
                >
                  {contact.email}
                </a>

                <a
                  href={`tel:${contact.phone}`}
                  className="mt-1 block font-body text-sm text-text/60 transition-colors hover:text-orange"
                >
                  {contact.phone}
                </a>
              </div>
            </div>

            {/* Form */}
            <div className="rounded-[10px] border border-stone bg-white p-6 sm:p-8 lg:p-10">
              {isSubmitted ? (
                <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m5 12 4 4L19 6"
                      />
                    </svg>
                  </div>

                  <h3 className="mt-5 font-heading text-2xl font-semibold text-charcoal">
                    Appointment request received
                  </h3>

                  <p className="mt-3 max-w-md font-body text-sm leading-6 text-text/60">
                    Thank you for getting in touch. We'll review your request
                    and get back to you shortly.
                  </p>
                </div>
              ) : (
                <>
                  <div className="">
                    <div className="mb-8">
                      <h3 className="font-heading text-2xl font-semibold text-charcoal">
                        Get in touch
                      </h3>

                      <p className="mt-2 font-body text-sm text-text/60">
                        Tell us a little about yourself and how we can help.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      {/* First + Last Name */}
                      <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                          <label
                            htmlFor="firstName"
                            className="mb-2 block font-body text-sm font-semibold text-charcoal"
                          >
                            First Name
                          </label>

                          <input
                            id="firstName"
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="Your first name"
                            disabled={isSubmitting}
                            required
                            className="h-12 w-full rounded-[10px] border border-stone bg-white px-4 font-body text-sm text-text outline-none transition-colors placeholder:text-text/40 focus:border-orange focus:ring-1 focus:ring-orange"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="lastName"
                            className="mb-2 block font-body text-sm font-semibold text-charcoal"
                          >
                            Last Name
                          </label>

                          <input
                            id="lastName"
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Your last name"
                            disabled={isSubmitting}
                            required
                            className="h-12 w-full rounded-[10px] border border-stone bg-white px-4 font-body text-sm text-text outline-none transition-colors placeholder:text-text/40 focus:border-orange focus:ring-1 focus:ring-orange"
                          />
                        </div>
                      </div>

                      {/* Phone */}
                      <div>
                        <label
                          htmlFor="phone"
                          className="mb-2 block font-body text-sm font-semibold text-charcoal"
                        >
                          Phone Number
                        </label>

                        <div className="flex gap-2">
                          {/* Country */}
                          <div
                            ref={dropdownRef}
                            className="relative shrink-0"
                          >
                            <button
                              type="button"
                              onClick={() => setIsDropdownOpen((prev) => !prev)}
                              disabled={isSubmitting}
                              className="flex h-12 items-center gap-3 rounded-[10px] border border-stone bg-white px-4 font-body text-sm text-charcoal outline-none transition-colors hover:border-orange focus:border-orange"
                            >
                              <span>{selectedCountry.name}</span>

                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path
                                  d="m6 9 6 6 6-6"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>

                            {isDropdownOpen && (
                              <ul className="absolute left-0 top-[calc(100%+4px)] z-20 max-h-56 w-52 overflow-y-auto rounded-[10px] border border-stone bg-white py-1 shadow-lg">
                                {countries.map((country) => (
                                  <li key={country.name}>
                                    <button
                                      type="button"
                                      onClick={() => handleCountrySelect(country)}
                                      className="w-full px-4 py-2.5 text-left font-body text-sm text-charcoal transition-colors hover:bg-ivory"
                                    >
                                      {country.name}{" "}
                                      <span className="text-text/50">
                                        ({country.code})
                                      </span>
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>

                          {/* Phone Number */}
                          <div className="flex h-12 min-w-0 flex-1 items-center rounded-[10px] border border-stone bg-white focus-within:border-orange focus-within:ring-1 focus-within:ring-orange">
                            <span className="border-r border-stone px-3 font-body text-sm text-text/60">
                              {selectedCountry.code}
                            </span>

                            <input
                              id="phone"
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              disabled={isSubmitting}
                              placeholder="Phone number"
                              className="min-w-0 flex-1 bg-transparent px-3 font-body text-sm text-text outline-none placeholder:text-text/40"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label
                          htmlFor="email"
                          className="mb-2 block font-body text-sm font-semibold text-charcoal"
                        >
                          Email Address
                        </label>

                        <input
                          id="email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          disabled={isSubmitting}
                          required
                          className="h-12 w-full rounded-[10px] border border-stone bg-white px-4 font-body text-sm text-text outline-none transition-colors placeholder:text-text/40 focus:border-orange focus:ring-1 focus:ring-orange"
                        />
                      </div>

                      {/* Subject */}
                      <div>
                        <label
                          htmlFor="subject"
                          className="mb-2 block font-body text-sm font-semibold text-charcoal"
                        >
                          Subject
                        </label>

                        <input
                          id="subject"
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="How can we help?"
                          disabled={isSubmitting}
                          className="h-12 w-full rounded-[10px] border border-stone bg-white px-4 font-body text-sm text-text outline-none transition-colors placeholder:text-text/40 focus:border-orange focus:ring-1 focus:ring-orange"
                        />
                      </div>

                      {/* Message */}
                      <div>
                        <label
                          htmlFor="message"
                          className="mb-2 block font-body text-sm font-semibold text-charcoal"
                        >
                          Message
                        </label>

                        <textarea
                          id="message"
                          name="message"
                          rows={5}
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Tell us a little about what you're looking for..."
                          disabled={isSubmitting}
                          required
                          className="w-full resize-none rounded-[10px] border border-stone bg-white px-4 py-3 font-body text-sm text-text outline-none transition-colors placeholder:text-text/40 focus:border-orange focus:ring-1 focus:ring-orange"
                        />
                      </div>

                      {/* Feedback */}
                      {formMessage && (
                        <p
                          className={`text-center font-body text-sm ${formMessage.type === "success"
                            ? "text-success"
                            : "text-error"
                            }`}
                        >
                          {formMessage.text}
                        </p>
                      )}

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex h-13 w-full items-center justify-center rounded-[10px] bg-orange px-6 font-body text-sm font-semibold text-white transition-colors hover:bg-orange-hover disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </button>

                      <p className="text-center font-body text-xs leading-5 text-text/45">
                        We'll get back to you as soon as possible.
                      </p>
                    </form>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      {/* Map section */}
      <section>
        <div className="relative w-full h-[450px] overflow-hidden max-w-7xl mx-auto">
          <iframe
            title="Dubai Map"
            src={`https://www.google.com/maps?q=${encodeURIComponent(contact.location)}&output=embed`}
            width="100%"
            height="450"
            className="w-full h-full border-0"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </main>
  );
}

export default ContactPage;