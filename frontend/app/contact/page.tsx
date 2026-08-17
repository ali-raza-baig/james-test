import React from 'react'
import ContactPage from "@/components/pages/ContactPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "James | Contact Us",
  description: "James — Personal Brand",
};


const page =async () => {
  return (
    <div>
       <ContactPage/>
    </div>
  )
}

export default page