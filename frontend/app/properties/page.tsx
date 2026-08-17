import React, { Suspense } from 'react'
import PropertyPage from "@/components/pages/PropertyPage";
import type { Metadata } from "next";
import Loading from '../loading';

export const metadata: Metadata = {
  title: "James | Personal Brand",
  description: "James — Personal Brand",
};

const page = async () => {
  return (
    <div>
      <Suspense fallback={<div><Loading /></div>}>
        <PropertyPage />
      </Suspense>
    </div>
  )
}

export default page