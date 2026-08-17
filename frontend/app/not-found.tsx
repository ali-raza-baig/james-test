import Link from "next/link";

export default function NotFound() {
    return (
        <main className="min-h-screen bg-[#FAF8F2] flex items-center justify-center px-6 py-20 sm:py-24 lg:py-28">
            <div className="w-full max-w-4xl text-center">
                {/* 404 */}
                <div className="relative mb-8">
                    <h1 className="text-[clamp(8rem,25vw,18rem)] leading-none font-semibold tracking-[-0.08em] text-[#242424]">
                        404
                    </h1>

                    {/* Accent line */}
                    <div className="absolute left-1/2 bottom-2 h-1 w-20 -translate-x-1/2 bg-[#C96A32]" />
                </div>

                {/* Content */}
                <div className="mx-auto max-w-xl">
                    <p className="mb-3 font-medium uppercase tracking-[0.25em] text-sm text-[#C96A32]">
                        Page Not Found
                    </p>

                    <h2 className="mb-5 font-semibold text-3xl sm:text-4xl md:text-5xl tracking-tight text-[#2B2B2B]">
                        Looks like this property has moved.
                    </h2>

                    <p className="mx-auto max-w-lg text-base sm:text-lg leading-8 text-[#2B2B2B]/70">
                        The page you're looking for doesn't exist or may have been
                        relocated. Let's get you back to exploring exceptional properties.
                    </p>

                    {/* Actions */}
                    <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/"
                            className="inline-flex min-w-44 items-center justify-center rounded-full bg-[#C96A32] px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#242424] hover:-translate-y-0.5"
                        >
                            Back to Home
                        </Link>

                        <Link
                            href="/properties"
                            className="inline-flex min-w-44 items-center justify-center rounded-full border border-[#D8D2C8] bg-white px-7 py-3.5 text-sm font-semibold text-[#242424] transition-all duration-300 hover:border-[#C96A32] hover:text-[#C96A32]"
                        >
                            View Properties
                        </Link>
                    </div>
                </div>

                {/* Decorative element */}
                <div className="mt-16 flex items-center justify-center gap-3">
                    <span className="h-px w-12 bg-[#D8D2C8]" />
                    <span className="h-2 w-2 rounded-full bg-[#C96A32]" />
                    <span className="h-px w-12 bg-[#D8D2C8]" />
                </div>
            </div>
        </main>
    );
}