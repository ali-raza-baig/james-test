export default function Loading() {
    return (
        <main className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center bg-ivory">
            <div className="flex w-full max-w-xs flex-col items-center px-6">

                {/* Brand */}
                <div className="text-center">
                    <h1 className="font-heading text-3xl font-semibold tracking-tight text-charcoal">
                        James
                    </h1>

                    <p className="mt-1 font-body text-[10px] font-medium uppercase tracking-[0.3em] text-text/40">
                        Property Consultant
                    </p>
                </div>

                {/* Loader */}
                <div className="mt-10 h-px w-full overflow-hidden bg-stone">
                    <div className="h-full w-1/3 animate-[loading_1.4s_ease-in-out_infinite] bg-orange" />
                </div>

                {/* Loading text */}
                <p className="mt-4 font-body text-xs text-text/40">
                    Loading...
                </p>

            </div>
        </main>
    );
}