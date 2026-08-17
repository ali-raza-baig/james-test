'use client';
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { blogPosts, properties, slides } from "@/public/constant/dummayData";
import PropertyCard from '../cards/PropertyCard';
import { getProperties } from '@/app/assests/action';

const PropertySection = () => {
    const [properties, setProperties] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const fetchPropertise = async () => {
        try {
            setLoading(true)
            const data = await getProperties()
            if (data.success) {
                const properties = data.data.slice(0, 3)
                setProperties(properties)
                setLoading(false)
            }
        } catch (error) {
            console.log(`Error in fetching Properties`)
            setError(error instanceof Error ? error.message : 'Error in fetching Properties')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPropertise()
    }, [])
    return (
        <>
            <section className="bg-charcoal  py-20 sm:py-24 lg:py-32">
                <div className="mx-auto max-w-7xl px-6">

                    {/* Header */}
                    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

                        <div className="max-w-2xl">
                            <p className="mb-4 font-body text-sm font-semibold uppercase tracking-[0.2em] text-orange">
                                Featured Properties
                            </p>

                            <h2 className="font-heading text-4xl font-semibold leading-tight tracking-tight text-white! sm:text-5xl">
                                Find somewhere
                                <br />
                                <span className="text-orange">worth calling home.</span>
                            </h2>

                            <p className="mt-5 max-w-xl font-body text-base leading-7 text-white sm:text-lg">
                                Explore a selection of carefully chosen properties currently
                                available.
                            </p>
                        </div>

                        <Link
                            href="/properties"
                            className="inline-flex shrink-0 items-center gap-2 font-body text-sm font-semibold text-white! transition-colors hover:text-orange"
                        >
                            View All Properties
                            <span>→</span>
                        </Link>
                    </div>

                    {loading && (<div className='test-ivory! text-center'>
                        Loading Properties ...
                    </div>)}

                    {!loading && error && (<div className='text-center text-red-500!'>
                        Error in loading Properties.
                    </div>)}

                    {!loading && !error && properties.length === 0 ? (<div className='text-ivory! text-center'>
                        No Properties yet.
                    </div>) : (<>
                        {/* Property Grid */}
                        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:mt-16 lg:grid-cols-3">
                            {properties.map((property) => (
                                <div key={property._id}>
                                    <PropertyCard
                                        key={property.name}
                                        //@ts-ignore
                                        property={property}
                                    />
                                </div>
                            ))}
                        </div>
                    </>)}

                </div>
            </section>
        </>
    )
}

export default PropertySection