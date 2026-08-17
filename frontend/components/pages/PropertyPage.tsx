'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import PropertySearch from '../global/PropertySearch'
import { useRouter, useSearchParams } from 'next/navigation'
import { properties } from '@/public/constant/dummayData'
import PropertyCard from '../cards/PropertyCard'
import { getProperties } from '@/app/assests/action'

const PropertyPage = () => {
  const [totalPages, setTotalPages] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const searchParams = useSearchParams()
  const router = useRouter()
  const params = new URLSearchParams(searchParams.toString()).toString()

  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPropertise = async () => {
    try {
      setLoading(true)
      const data = await getProperties(params.toString())
      if (data.success) {
        // Removed slice(0,3) to show all properties from the backend (12 per page by default)
        setProperties(data.data)
        setTotalPages(data.pagination.totalPages)
        setCurrentPage(data.pagination.currentPage)
        setLoading(false)
      }
    } catch (error) {
      console.log(`Error in fetching Properties`)
      setError(error instanceof Error ? error.message : 'Error in fetching Properties')
    } finally {
      setLoading(false)
    }
  }

  const gotoPage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    // Update URL with the new page parameter; this will trigger the useEffect below
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', newPage.toString())
    router.push(`/properties?${params.toString()}`)
  }

  useEffect(() => {
    fetchPropertise()
  }, [searchParams])

  // Count active filters (including new subtype)
  const activeFilterCount =
    (searchParams.get('location') ? 1 : 0) +
    (searchParams.get('price') ? 1 : 0) +
    (searchParams.get('propertyType') ? 1 : 0) +
    (searchParams.get('subtype') ? 1 : 0)

  const resetAllFilters = () => {
    router.push('/properties')
  }

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
            Discover Your
            <br />
            <span className="text-orange">Dream Property</span>
          </h1>
        </div>

        <div className="absolute bottom-0 left-1/2 z-10 w-full max-w-4xl -translate-x-1/2 translate-y-1/2 px-4">
          <div className="w-full max-w-4xl">

            <PropertySearch />
          </div>
        </div>

      </section>

      {loading && (
        <section className="bg-ivory py-20 sm:py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className='text-center mt-4'>
              Loading Properties...
            </div>
          </div>
        </section>
      )}

      {!loading && error && (
        <section className="bg-ivory py-20 sm:py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className='text-center mt-4'>
              Error in fetching Properties.
            </div>
          </div>
        </section>
      )}

      {!loading && !error && properties.length === 0 ? (
        <section className="bg-ivory py-20 sm:py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className='text-center mt-4'>
              No Properties Yet.
            </div>
          </div>
        </section>
      ) : (
        <section className="py-20 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <div className='text-end'>
              {activeFilterCount > 0 && (
                <button
                  onClick={resetAllFilters}
                  className="text-sm text-gray-500 underline underline-offset-4 hover:text-gray-700"
                >
                  Clear all filters ({activeFilterCount})
                </button>
              )}
            </div>
            {/* Property Grid */}
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:mt-10 lg:grid-cols-3">
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  //@ts-ignore
                  property={property}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages >= 1 && (
              <div className="mt-16 flex items-center justify-center gap-2 border-t border-stone pt-10">
                <button
                  onClick={() => gotoPage(currentPage - 1)}
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-stone text-text"
                >
                  ←
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => gotoPage(p)}
                    type="button"
                    className={`flex h-10 w-10 items-center justify-center rounded-[10px] font-body text-sm font-semibold ${currentPage === p
                      ? 'bg-charcoal text-white'
                      : 'text-charcoal border border-charcoal'
                      }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => gotoPage(currentPage + 1)}
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-stone text-text transition-colors hover:border-charcoal"
                >
                  →
                </button>
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  )
}

export default PropertyPage