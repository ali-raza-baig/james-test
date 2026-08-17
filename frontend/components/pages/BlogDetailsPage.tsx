'use client';

import { getBlogsPostSingle } from '@/app/assests/action';
import Loading from '@/app/loading';
import { useParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';

// Types for blog post
interface BlogPost {
    id?: string;
    title: string;
    category: string;
    date: string;
    image: string;
    content: string;
    author?: string;
}

const BlogDetailsPage: React.FC = () => {
    const params = useParams();
    const slug = params?.slug as string | undefined;

    const [blog, setBlog] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBlogs = useCallback(async () => {
        if (!slug) {
            setError('Invalid blog identifier');
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await getBlogsPostSingle(slug);
            if (response.success && response.data) {
                setBlog(response.data);
            } else {
                setError('Post not found');
            }
        } catch (err) {
            console.error('Error fetching blog post:', err);
            setError('An error occurred while loading the post');
        } finally {
            setLoading(false);
        }
    }, [slug]);

    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]);

    if (loading) {
        return (
            <>
                <Navbar />
                <Loading />
                <Footer />
            </>
        );
    }

    if (error || !blog) {
        return (
            <main className="bg-ivory min-h-screen flex items-center justify-center">
                <p className="text-center text-text/70">{error || 'Post not found'}</p>
            </main>
        );
    }

    // Basic sanitization note: For production, consider using DOMPurify or a similar library.
    // Here we trust the CMS content but it's still a potential risk.
    const createMarkup = (html: string) => ({ __html: html });

    return (
        <main className="bg-ivory">
            {/* Article Header */}
            <section className="pt-20 sm:pt-24 lg:pt-32">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="w-full lg:w-[50vw] mx-auto">
                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-3 font-body text-xs font-semibold uppercase tracking-[0.15em] mt-2 lg:mt-0">
                            <span className="text-orange">{blog.category}</span>
                            <span className="h-1 w-1 rounded-full bg-stone" />
                            <span className="text-text/45">{blog.date}</span>
                        </div>

                        {/* Title */}
                        <h1 className="mt-6 max-w-5xl font-heading text-3xl font-semibold leading-[1.08] tracking-tight text-charcoal sm:text-4xl lg:text-5xl">
                            {blog.title}
                        </h1>
                    </div>

                    {/* Featured Image */}
                    <div className="flex items-center justify-center">
                        <div className="relative mt-12 aspect-[16/9] w-full lg:h-[50vh] lg:w-[50vw] overflow-hidden rounded-[10px] bg-stone sm:mt-16">
                            <img
                                src={blog.image}
                                alt={blog.title}
                                loading="lazy"
                                className="absolute inset-0 w-full h-full md:h-[50vh] md:w-[50vw] lg:h-[50vh] lg:w-[50vw] object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Article Content */}
            <section className="py-16 sm:py-20 lg:py-24">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="grid lg:grid-cols-12 lg:gap-16">
                        <article className="lg:col-span-8 lg:col-start-3">
                            <div
                                className="blog-content font-body text-base leading-8 text-text/70 sm:text-lg sm:leading-9"
                                dangerouslySetInnerHTML={createMarkup(blog.content)}
                            />
                        </article>
                    </div>
                </div>
            </section>

            {/* Article Footer */}
            <section className="border-t border-orange/35 bg-stone/20 py-16 sm:py-20">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="font-body text-xs font-semibold uppercase tracking-[0.15em] text-orange">
                                Written by
                            </p>
                            <h3 className="mt-2 font-heading text-2xl font-semibold text-charcoal">
                                {'James'}
                            </h3>
                        </div>

                        <a
                            href="/blog"
                            className="inline-flex w-fit items-center gap-2 rounded-[10px] border border-charcoal px-5 py-3 font-body text-sm font-semibold text-charcoal transition-colors hover:bg-charcoal hover:text-white"
                        >
                            ← Back to Journal
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default BlogDetailsPage;