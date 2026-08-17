import BlogDetailsPage from '@/components/pages/BlogDetailsPage'
import { Metadata } from 'next';
import React from 'react'

type Props = {
    params: Promise<{ slug: string }>;
};

export const metadata: Metadata = {
    title: "James | Blogs Details - News",
    description: "James — Personal Brand",
};


const page = async ({ params }: Props) => {
    const { slug } = await params;
    return (
        <div>
            <BlogDetailsPage  />
        </div>
    )
}

export default page