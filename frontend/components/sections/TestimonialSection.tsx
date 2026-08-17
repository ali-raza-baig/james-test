'use client';
import React, { useEffect, useState } from 'react'
import VideoSwiper from "../global/VideoSwiper";
import { slides } from "@/public/constant/dummayData";
import Link from "next/link";

const TestimonialSection = () => {
    const [testimonial, setTestimonial] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const fetchTestimonial = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/testimonials/active`, {
                method: "GET"
            })
            const data = await res.json()
            if (data.success) {
                setLoading(false)
                setTestimonial(data.data)
            }
        } catch (error) {
            console.log(`Error in fetching testimonial`)
            setError(error instanceof Error ? error.message : 'Error in fetching testimonial')
        }
    }

    useEffect(() => {
        fetchTestimonial()
    }, [])
    return (
        <>
            {/* Testimonial section */}
            <section className="bg-charcoal py-20 sm:py-24 lg:py-32">
                <div className="mx-auto max-w-7xl px-6">

                    {/* Header */}
                    <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
                        <div className="max-w-2xl">
                            <p className="mb-4 font-body text-sm font-semibold uppercase tracking-[0.2em] text-orange">
                                Client Stories
                            </p>

                            <h2 className="font-heading text-4xl font-semibold leading-tight tracking-tight text-ivory! sm:text-5xl">
                                Trusted by the people
                                <br className="hidden sm:block" />
                                <span className="text-orange"> I work with.</span>
                            </h2>

                            <p className="mt-5 max-w-xl font-body text-base leading-7 text-ivory sm:text-lg">
                                Every property journey is different. Here is what some of my
                                clients have to say about working together.
                            </p>
                        </div>

                        <Link
                            href="/testimonials"
                            className="inline-flex items-center gap-2 font-body text-sm font-semibold text-ivory transition-colors hover:text-orange"
                        >
                            View All Testimonials
                            <span>→</span>
                        </Link>
                    </div>

                    {loading && (<div className='text-center mt-12'>
                        Loading Testimonials
                    </div>)}

                    {!loading && !error && testimonial.length === 0 ? (<div className='text-center mt-12'>
                        No testimonial yet
                    </div>) : (<>
                        {/* Testimonials */}
                        <div className="mt-12 ">
                            <VideoSwiper slides={testimonial} />
                        </div>
                    </>)}

                </div>
            </section>
        </>
    )
}

export default TestimonialSection