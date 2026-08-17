import React, { Suspense } from 'react'
import AboutPage from "@/components/pages/AboutPage";
import type { Metadata } from "next";
import Loading from '../loading';

export const metadata: Metadata = {
  title: "James | About us",
  description: "James — Personal Brand",
};

const page = async () => {
  return (
    <div>
      <Suspense fallback={<div><Loading /></div>}>

        <AboutPage />
      </Suspense>
    </div>
  )
}

export default page