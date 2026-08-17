import React from 'react'
import BlogPage from "@/components/pages/BlogPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "James | Blogs - News",
  description: "James — Personal Brand",
};

const page = async () => {
  return (
    <div>
        <BlogPage/>
    </div>
  )
}

export default page