"use client";
import React, { useEffect, useState } from 'react'
import Link from "next/link";
import BlogCard from '../cards/BlogCard';
// import { blogs } from '@/public/constant/dummayData';
import Image from 'next/image';
import { getBlogsPosts, getBlogsPostsFeatured } from '@/app/assests/action';
import Loading from '@/app/loading';
// import BlogCard from "@/components/blog/BlogCard";

const BlogPage = () => {

  const categories = [
    "All",
    "Buying",
    "Selling",
    "Investment",
    "Market Insights",
    "Lifestyle",
  ];


  const [totalPages, setTotalPages] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [activeCategory, setActiveCategory] = useState("All");
  const [blogs, setBlogs] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [featuredBlogs, setFeaturedBlogs] = useState<any[]>([])
  const featuredBlog = featuredBlogs[0];
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
        setTotalPages(blogs.pagination.totalPages)
        setLoading(false)
      }
    } catch (error) {
      console.log(`Error in fetching blogs`)
    }
  }

  const fetchFeaturedBlogs = async () => {
    setLoading(true)
    try {
      const blogs = await getBlogsPostsFeatured()
      if (blogs.success) {

        const blogswithId = blogs.data.map((blog: any) => ({
          ...blog,
          id: blog._id
        }))
        setFeaturedBlogs(blogswithId)
        setLoading(false)
      }
    } catch (error) {
      console.log(`Error in fetching blogs`)
      setError(error instanceof Error ? error.message : 'Error in fetching blogs')
    }
  }

  useEffect(() => {
    fetchBlogs()
    fetchFeaturedBlogs()
  }, [])

  const filteredBlogs =
    activeCategory === "All"
      ? blogs
      : blogs.filter((blog) => blog.category === activeCategory);



  const gotoPage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage)
  }
  const postsPerPage = 2;

  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  if (loading) {
    return (
      <div>
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
            <h1 className="font-heading text-5xl font-semibold leading-[1.05] tracking-tight text-white! sm:text-6xl lg:text-7xl">
              Insights That Move
              <br />
              <span className="text-orange">You Forward</span>
            </h1>
          </div>

        </section>

        <section className="bg-ivory py-20 sm:py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className='text-center mt-4'>
              Loading Blogs Posts...
            </div>
          </div>
        </section>

      </div>
    )
  }


  if (error) {
    return (
      <div>
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
            <h1 className="font-heading text-5xl font-semibold leading-[1.05] tracking-tight text-white! sm:text-6xl lg:text-7xl">
              Insights That Move
              <br />
              <span className="text-orange">You Forward</span>
            </h1>
          </div>

        </section>

        <section className="bg-ivory py-20 sm:py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className='text-center text-red-500 mt-4'>
              Error in fetching Blogs Posts...
            </div>
          </div>
        </section>

      </div>
    )
  }
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
            Insights That Move
            <br />
            <span className="text-orange">You Forward</span>
          </h1>
        </div>

      </section>

      <section className="bg-ivory py-20 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6">

          {featuredBlogs.length === 0 ? (<div>

          </div>) : (<>
            {/* Featured Article */}
            <div className='group grid md:grid-cols-2 rounded-[10px] border border-stone bg-charcoal'>
              <Link href={`/blog/${featuredBlog?.slug}`} className='relative block aspect-[16/10] lg:aspect-full group'>
                <Image fill src={featuredBlog?.image} alt=""
                  className='object-cover h-full w-full absolute inset-0'
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent" />
                <div className='absolute rounded-[10px] top-5 left-5 bg-orange px-3 py-1.5 text-ivory! '>
                  Featured
                </div>
              </Link>
              <div className='flex flex-col justify-center p-7 sm:p-10 lg:p-14'>
                <div className='flex items-center justify-start gap-2 text-xs font-body font-medium'>
                  <span className=' text-orange '>{featuredBlog?.category}</span>
                  <span className='h-2 w-2 rounded-full bg-orange' />
                  <span className='text-ivory!'>{featuredBlog?.date}</span>
                </div>

                <h3 className='text-3xl mt-3 sm:text-4xl lg:text-5xl font-heading text-ivory! leading-tight hover:text-orange!'>
                  {featuredBlog?.title}
                </h3>
                <p className='text-ivory/50 text-base sm:text-lg leading-6 sm:leading-7'>
                  {featuredBlog?.excerpt}
                </p>
                <Link
                  href={`/blog/${featuredBlog?.slug}`}
                  className="mt-8 inline-flex w-fit items-center gap-2 font-body text-sm font-semibold text-ivory! transition-colors hover:text-orange!"
                >
                  Read Article
                  <span>→</span>
                </Link>
              </div>
            </div>
          </>)}


          {/* Blog Header */}
          <div className="mt-20 flex flex-col gap-7 lg:mt-28 lg:flex-row lg:items-end lg:justify-between">

            <div>
              <p className="mb-4 font-body text-sm font-semibold uppercase tracking-[0.2em] text-orange">
                The Journal
              </p>

              <h2 className="font-heading text-3xl font-semibold text-charcoal sm:text-4xl">
                Insights, ideas & advice
              </h2>
            </div>

            {/* Categories */}
            <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
              {categories.map((category) => {
                const active = activeCategory === category;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`whitespace-nowrap rounded-full border px-4 py-2 font-body text-xs font-semibold transition-colors ${active
                      ? "border-charcoal bg-charcoal text-white"
                      : "border-stone bg-transparent text-text/60 hover:border-charcoal hover:text-charcoal"
                      }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Blog Grid */}
          {filteredBlogs.length > 0 ? (
            <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
              {filteredBlogs.slice(startIndex, endIndex).map((blog) => (
                <BlogCard
                  key={blog.id}
                  // @ts-ignore
                  post={blog}
                />
              ))}
            </div>
          ) : (
            <div className="mt-14 rounded-[10px] border border-stone py-20 text-center">
              <p className="font-heading text-xl font-semibold text-charcoal">
                No articles found
              </p>

              <p className="mt-2 font-body text-sm text-text/50">
                Try selecting another category.
              </p>
            </div>
          )}

          {/* Pagination */}
          <div className="mt-16 flex items-center justify-center gap-2 border-t border-stone pt-10">

            <button
              onClick={() => gotoPage(currentPage - 1)}
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-stone text-text"

            >
              ←
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p, i) => (
              <button
                key={i}
                onClick={() => gotoPage(p)}
                type="button"
                className={`flex h-10 w-10 items-center justify-center rounded-[10px]  font-body text-sm font-semibold  ${currentPage === p ? 'bg-charcoal text-white ' : 'text-charcoal border border-charcoal'}`}
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

        </div>
      </section>

    </main>
  )
}

export default BlogPage