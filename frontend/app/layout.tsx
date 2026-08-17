import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ContactPopup from "@/components/global/ContactPopup";
import { AboutProvider } from "@/components/context/AboutContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "James | Personal Brand",
  description: "James — Personal Brand",
};


export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AboutProvider>
          <Navbar />
          <main className="">
            {children}
            {/* <ContactPopup /> */}
          </main>
          <Footer />
        </AboutProvider>
      </body>
    </html>
  );
}
