'use client'
import React, { useState } from 'react'

const NewsletterSection = () => {
    const [newsletterData, setNewsletterData] = useState({
        name: "",
        email: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newsletterMessage, setNewsletterMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);


    const handleNewsletterChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;

        setNewsletterData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleNewsletterSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        setIsSubmitting(true);
        setNewsletterMessage(null);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND}/newsletter/subscribe`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: newsletterData.name,
                        email: newsletterData.email,
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Unable to subscribe. Please try again."
                );
            }

            setNewsletterMessage({
                type: "success",
                text: result.message || "You have successfully subscribed!",
            });

            setNewsletterData({
                name: "",
                email: "",
            });
        } catch (error) {
            console.error("Newsletter subscription error:", error);

            setNewsletterMessage({
                type: "error",
                text:
                    error instanceof Error
                        ? error.message
                        : "Something went wrong. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <section className="bg-stone/25 py-20 sm:py-24 lg:py-28">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="grid gap-12 lg:grid-cols-2 lg:gap-24">

                        {/* Left */}
                        <div>
                            <p className="mb-5 font-body text-sm font-semibold uppercase tracking-[0.2em] text-orange">
                                Stay Informed
                            </p>

                            <h2 className="max-w-xl font-heading text-4xl font-semibold leading-[1.1] tracking-tight text-charcoal sm:text-5xl lg:text-6xl">
                                Property insights,
                                <br />
                                <span className="text-orange">straight to your inbox.</span>
                            </h2>

                            <p className="mt-6 max-w-lg font-body text-base leading-7 text-charcoal/70 sm:text-lg sm:leading-8">
                                Get the latest property opportunities, market insights, investment
                                updates, and carefully selected listings delivered directly to your
                                inbox.
                            </p>

                            {/* Newsletter benefits */}
                            <div className="mt-8 space-y-3">

                                <div className="flex items-center gap-3">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange/10 text-orange">
                                        ✓
                                    </span>

                                    <p className="font-body text-sm text-charcoal">
                                        Latest property opportunities
                                    </p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange/10 text-orange">
                                        ✓
                                    </span>

                                    <p className="font-body text-sm text-charcoal">
                                        Property market insights
                                    </p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange/10 text-orange">
                                        ✓
                                    </span>

                                    <p className="font-body text-sm text-charcoal">
                                        Investment tips and updates
                                    </p>
                                </div>

                            </div>
                        </div>

                        {/* Right */}
                        <div className="flex flex-col justify-center">

                            <div className="rounded-[10px] border border-stone bg-white p-6 sm:p-8 lg:p-10">

                                <div className="mb-7">
                                    <h3 className="font-heading text-2xl font-semibold text-charcoal">
                                        Join the newsletter
                                    </h3>

                                    <p className="mt-2 font-body text-sm leading-6 text-charcoal/60">
                                        Be the first to know about new properties and important market
                                        updates.
                                    </p>
                                </div>

                                <form
                                    onSubmit={handleNewsletterSubmit}
                                    className="space-y-4"
                                >
                                    {/* Name */}
                                    <div>
                                        <label
                                            htmlFor="newsletter-name"
                                            className="mb-2 block font-body text-sm font-semibold text-charcoal"
                                        >
                                            Your Name
                                        </label>

                                        <input
                                            id="newsletter-name"
                                            name="name"
                                            type="text"
                                            value={newsletterData.name}
                                            onChange={handleNewsletterChange}
                                            placeholder="Enter your name"
                                            required
                                            disabled={isSubmitting}
                                            className="
        h-12
        w-full
        rounded-[10px]
        border
        border-stone
        bg-white
        px-4
        font-body
        text-sm
        text-charcoal
        outline-none
        transition-colors
        placeholder:text-charcoal/40
        focus:border-orange
        focus:ring-1
        focus:ring-orange/20
        disabled:cursor-not-allowed
        disabled:opacity-60
      "
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label
                                            htmlFor="newsletter-email"
                                            className="mb-2 block font-body text-sm font-semibold text-charcoal"
                                        >
                                            Email Address
                                        </label>

                                        <input
                                            id="newsletter-email"
                                            name="email"
                                            type="email"
                                            value={newsletterData.email}
                                            onChange={handleNewsletterChange}
                                            placeholder="you@example.com"
                                            required
                                            disabled={isSubmitting}
                                            className="
        h-12
        w-full
        rounded-[10px]
        border
        border-stone
        bg-white
        px-4
        font-body
        text-sm
        text-charcoal
        outline-none
        transition-colors
        placeholder:text-charcoal/40
        focus:border-orange
        focus:ring-1
        focus:ring-orange/20
        disabled:cursor-not-allowed
        disabled:opacity-60
      "
                                        />
                                    </div>

                                    {/* Message */}
                                    {newsletterMessage && (
                                        <p
                                            className={`text-sm font-body ${newsletterMessage.type === "success"
                                                ? "text-success"
                                                : "text-error"
                                                }`}
                                        >
                                            {newsletterMessage.text}
                                        </p>
                                    )}

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="
      flex
      h-12
      w-full
      items-center
      justify-center
      rounded-[10px]
      bg-orange
      px-6
      font-body
      text-sm
      font-semibold
      text-white
      transition-colors
      hover:bg-orange-hover
      disabled:cursor-not-allowed
      disabled:opacity-60
    "
                                    >
                                        {isSubmitting ? (
                                            "Subscribing..."
                                        ) : (
                                            <>
                                                Subscribe to Newsletter
                                                <span className="ml-3">→</span>
                                            </>
                                        )}
                                    </button>

                                    <p className="text-center font-body text-xs leading-5 text-charcoal/45">
                                        No spam. Just useful property insights and opportunities.
                                    </p>
                                </form>

                            </div>

                        </div>

                    </div>
                </div>
            </section>
        </>
    )
}

export default NewsletterSection