"use client";

import { submitEnquiry } from "@/app/assests/action";
import { useState } from "react";

interface EnquiryFormProps {
    onClose?: () => void;
}

// All Arab League member states + their dialing codes
const countries = [
    { name: "UAE", code: "+971" },
    { name: "KSA", code: "+966" },
    { name: "Egypt", code: "+20" },
    { name: "Algeria", code: "+213" },
    { name: "Bahrain", code: "+973" },
    { name: "Comoros", code: "+269" },
    { name: "Djibouti", code: "+253" },
    { name: "Iraq", code: "+964" },
    { name: "Jordan", code: "+962" },
    { name: "Kuwait", code: "+965" },
    { name: "Lebanon", code: "+961" },
    { name: "Libya", code: "+218" },
    { name: "Mauritania", code: "+222" },
    { name: "Morocco", code: "+212" },
    { name: "Oman", code: "+968" },
    { name: "Palestine", code: "+970" },
    { name: "Qatar", code: "+974" },
    { name: "Somalia", code: "+252" },
    { name: "Sudan", code: "+249" },
    { name: "Syria", code: "+963" },
    { name: "Tunisia", code: "+216" },
    { name: "Yemen", code: "+967" },
];

export default function EnquiryForm({ onClose }: EnquiryFormProps) {

    const [submited, setSubmited] = useState(false);

    const [formData, setFormData] = useState<any>({
        fullName: '',
        country: "UAE",
        phoneNumber: "",
        email: "",
        budget: "under-500k",
        propertyType: "residential",

    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };


    // Get the dial code for the currently selected country
    const selectedCountry = countries.find(c => c.name === formData.country);
    const phoneCode = selectedCountry ? selectedCountry.code : "+971";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = await submitEnquiry({ ...formData, countryCode: phoneCode })
            if (data.success) {
                setSubmited(true)
            }
        } catch (error) {
            console.log(`Error in enquiry form submission.`)
        }
    };


    return (
        <div className="relative w-full max-w-md overflow-hidden rounded-[10px] bg-white">

            {submited ? (<>
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
                        Enquiry request received
                    </h3>

                    <p className="mt-3 max-w-md font-body text-sm leading-6 text-text/60">
                        Thank you for getting in touch. We'll review your request
                        and get back to you shortly.
                    </p>
                </div>
            </>) : (<>
                {/* Header */}
                <div className="flex items-start justify-between px-6 pt-5">

                    <h2 className="font-heading text-2xl font-semibold text-charcoal">
                        Submit an Enquiry
                    </h2>

                    {onClose && (
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close"
                            className="text-charcoal/60 transition-colors hover:text-orange"
                        >
                            <svg
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    d="M18 6L6 18M6 6l12 12"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </button>
                    )}

                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-2 px-6 pb-5 pt-4"
                >

                    {/* First + Last Name */}
                    <div className="grid grid-cols-1 gap-2">

                        <input
                            type="text"
                            name="fullName"   // Fixed typo: was "fullNmae"
                            placeholder="Full Name*"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                            className="
                            h-11
                            w-full
                            rounded-[10px]
                            border
                            border-stone
                            bg-white
                            px-3
                            font-body
                            text-sm
                            text-charcoal
                            outline-none
                            placeholder:text-charcoal/45
                            focus:border-orange
                            focus:ring-1
                            focus:ring-orange/20
                        "
                        />

                    </div>

                    {/* Phone */}
                    <div className="grid grid-cols-[97px_1fr] gap-2">

                        <select
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            className="
                            h-11
                            w-full
                            rounded-[10px]
                            border
                            border-stone
                            bg-white
                            px-3
                            font-body
                            text-sm
                            text-charcoal
                            outline-none
                            focus:border-orange
                            focus:ring-1
                            focus:ring-orange/20
                        "
                        >
                            {countries.map((c) => (
                                <option key={c.name} value={c.name}>
                                    {c.name}
                                </option>
                            ))}
                        </select>

                        <div className="flex h-11 overflow-hidden rounded-[10px] border border-stone focus-within:border-orange focus-within:ring-1 focus-within:ring-orange/20">

                            <span className="flex items-center border-r border-stone px-3 font-body text-sm text-charcoal/70">
                                {phoneCode}
                            </span>

                            <input
                                type="tel"
                                name="phoneNumber"
                                placeholder="Your number"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className="
                                min-w-0
                                flex-1
                                bg-white
                                px-3
                                font-body
                                text-sm
                                text-charcoal
                                outline-none
                                placeholder:text-charcoal/45
                            "
                            />

                        </div>

                    </div>

                    {/* Email */}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email*"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="
                        h-11
                        w-full
                        rounded-[10px]
                        border
                        border-stone
                        bg-white
                        px-3
                        font-body
                        text-sm
                        text-charcoal
                        outline-none
                        placeholder:text-charcoal/45
                        focus:border-orange
                        focus:ring-1
                        focus:ring-orange/20
                    "
                    />

                    {/* Budget + Property Type */}
                    <div className="grid grid-cols-2 gap-2">

                        <select
                            name="budget"
                            value={formData.budget}
                            onChange={handleChange}
                            defaultValue='under-500k'
                            className="
                            h-11
                            w-full
                            rounded-[10px]
                            border
                            border-stone
                            bg-white
                            px-3
                            font-body
                            text-sm
                            text-charcoal
                            outline-none
                            focus:border-orange
                            focus:ring-1
                            focus:ring-orange/20
                        "
                        >
                            <option value="under-500k">Under AED 500K</option>
                            <option value="500k-1M">AED 500K - 1M</option>
                            <option value="1m-2M">AED 1M - 2M</option>
                            <option value="2M+">AED 2M+</option>
                        </select>

                        <select
                            name="propertyType"
                            value={formData.propertyType}
                            onChange={handleChange}
                            defaultValue='residential'
                            className="
                            h-11
                            w-full
                            rounded-[10px]
                            border
                            border-stone
                            bg-white
                            px-3
                            font-body
                            text-sm
                            text-charcoal
                            outline-none
                            focus:border-orange
                            focus:ring-1
                            focus:ring-orange/20
                        "
                        >
                            <option value="residential">Residential</option>
                            <option value="commercial">Commercial</option>
                            <option value="villa">Villa</option>
                            <option value="apartment">Apartment</option>
                            <option value="townhouse">Townhouse</option>
                        </select>

                    </div>

                    {/* Description */}
                    <p className="px-1 pt-2 text-center font-body text-xs leading-4 text-text/60">
                        Tell us what you're looking for and James will help you
                        find the right property based on your requirements.
                    </p>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="
                        mt-3
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
                    "
                    >
                        Submit
                    </button>

                </form>
            </>)}


        </div>
    );
}