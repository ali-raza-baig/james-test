"use client";

import { useState } from "react";
import FormField from "./FormField";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND;

function BookAppointment() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/contact`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ firstName: formData.name, email: formData.email, phone: formData.phone }),
            });

            const result = await response.json();

            if (result.success) {
                setIsSubmitted(true); // ✅ Show the success screen
            }
        } catch (error) {
            console.log(`Error in sending form`)
        }
    };

    return (

        <div className="">

            {/* Form */}
            <div className="w-full max-w-md justify-self-end rounded-[10px] bg-ivory p-6 shadow-2xl sm:p-8">
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
                        <div className="mb-8">
                            <h3 className="font-heading text-2xl font-semibold text-charcoal">
                                Book your appointment
                            </h3>

                            <p className="mt-2 font-body text-sm text-text/60">
                                Fill in your details and we'll be in touch to confirm your
                                appointment.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* Name + Email */}
                            <div className="grid gap-5 ">
                                <FormField
                                    value={formData.name}
                                    onChange={handleChange}
                                    label="Full Name"
                                    name="name"
                                    type="text"
                                    placeholder="Your name"
                                    required
                                />
                            </div>
                            <div className="grid gap-5 ">

                                <FormField
                                    value={formData.email}
                                    onChange={handleChange}
                                    label="Email Address"
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>

                            {/* Phone + Appointment Type */}
                            <div className="grid gap-5 ">
                                <FormField
                                    value={formData.phone}
                                    onChange={handleChange}
                                    label="Phone Number"
                                    name="phone"
                                    type="tel"
                                    placeholder="+44 20 1234 5678"

                                />

                            </div>



                            {/* Submit */}
                            <button
                                type="submit"
                                className="flex h-13 w-full items-center justify-center rounded-[10px] bg-orange px-6 font-body text-sm font-semibold text-white transition-colors hover:bg-orange-hover"
                            >
                                Book Appointment
                            </button>

                        </form>
                    </>
                )}
            </div>
        </div>

    );
}

export default BookAppointment;