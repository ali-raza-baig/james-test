import React, { Suspense } from 'react'
import HomePage from "@/components/pages/HomePage";
import Loading from './loading';
const page = () => {
  return (
    <div>
      <Suspense fallback={<div><Loading /></div>}>

        <HomePage />
      </Suspense>
    </div>
  )
}

export default page