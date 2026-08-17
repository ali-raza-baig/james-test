'use client'
import { getBlogsPosts } from '@/app/assests/action'
import React, { useEffect, useState } from 'react'
import Link from "next/link";
import BlogCard from '../cards/BlogCard';


const BlogSection = () => {
    const [blogs, setBlogs] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    const fetchBlogs = async () => {
        setLoading(true)
        try {
            const blogs = await getBlogsPosts()
            if (blogs.success) {

                const blogswithId = blogs.data.slice(0, 3).map((blog: any) => ({
                    ...blog,
                    id: blog._id
                }))
                setBlogs(blogswithId)
                setLoading(false)
            }
        } catch (error) {
            console.log(`Error in fetching blogs`)
            setError(error instanceof Error ? error.message : 'Error in fetcching blogs')
        }
    }

    useEffect(() => {
        fetchBlogs()
    }, [])


    return (
        <>

            {/* Blog section */}
            <section className="bg-stone/25 py-20 sm:py-24 lg:py-32">
                <div className="mx-auto max-w-7xl px-6">

                    {/* Section Header */}
                    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                        <div className="max-w-2xl">
                            <p className="mb-4 font-body text-sm font-semibold uppercase tracking-[0.2em] text-orange">
                                Insights & Ideas
                            </p>

                            <h2 className="font-heading text-4xl font-semibold leading-tight tracking-tight text-charcoal sm:text-5xl">
                                From the journal
                            </h2>

                            <p className="mt-4 max-w-xl font-body text-base leading-7 text-text/65 sm:text-lg">
                                Thoughts, advice, and insights to help you make better property
                                decisions.
                            </p>
                        </div>

                        <Link
                            href="/blog"
                            className="inline-flex shrink-0 items-center gap-2 font-body text-sm font-semibold text-charcoal transition-colors hover:text-orange"
                        >
                            View All Articles
                            <span>→</span>
                        </Link>
                    </div>

                    {loading && (<div className='text-center mt-12'>
                        Loding Blogs ...
                    </div>)}

                    {error && (<div className='text-center text-red-500 mt-12'>
                        Error in fetching blogs.
                    </div>)}

                    {!loading && !error && blogs.length === 0 ? (<div className="text-center mt-12">
                        No Blogs Post yet.
                    </div>) : (
                        <>
                            <div className="mt-12 grid gap-x-7 gap-y-12 md:grid-cols-2 lg:grid-cols-3 lg:mt-16">
                                {blogs.map((post) => (
                                    <BlogCard key={post.slug} post={post} />
                                ))}
                            </div>
                        </>
                    )}

                </div>
            </section>
        </>

    )
}

export default BlogSection