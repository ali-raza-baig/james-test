"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

export interface ContentSlide {
    id: string | number;
    label: string;
    title: string;
    rating: number
    name?: string;
    company: string
    comment: string
    business?: string;
    location?: string;
    video?: string;
    backgroundImage?: string;
}

interface ContentSwiperProps {
    slides: ContentSlide[];
}

export default function ContentSwiper({
    slides,
}: ContentSwiperProps) {
    if (!slides.length) return null;

    return (
        <section className="relative">
            <Swiper
                modules={[EffectCoverflow,
                    //  Pagination
                ]}
                effect="coverflow"
                grabCursor
                centeredSlides
                slidesPerView="auto"
                loop
                spaceBetween={60}
                speed={700}
                coverflowEffect={{
                    rotate: 0,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: true,
                }}
                pagination={{
                    clickable: true,
                }}
                className="!w-full !py-[50px]"
            >
                {slides.map((slide) => (
                    <SwiperSlide
                        key={slide.id}
                        className="!h-[400px] !w-[300px] overflow-hidden rounded-[10px]"
                    >
                        <div className="group  relative h-full w-full overflow-hidden rounded-[10px] bg-charcoal shadow-[0_15px_50px_rgba(0,0,0,0.2)]">

                            {/* Video */}
                            {slide.video && (
                                <video
                                    src={slide.video}

                                    controls
                                    className=" h-full w-full object-cover"
                                />
                            )}

                            {/* Testimonial Content */}
                            <div className=" bg-charcoal/95  backdrop-blur-xl">

                                {/* Rating */}
                                {/* <div className="mb-3 flex items-center gap-1">
                                    {Array.from({ length: 5 }).map((_, index) => (
                                        <svg
                                            key={index}
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className={`h-4 w-4 ${index < slide?.rating
                                                ? "text-orange"
                                                : "text-white/20"
                                                }`}
                                        >
                                            <path d="M12 2.5l2.94 5.95 6.56.95-4.75 4.63 1.12 6.54L12 17.48l-5.87 3.09 1.12-6.54L2.5 9.4l6.56-.95L12 2.5z" />
                                        </svg>
                                    ))}
                                </div> */}

                                {/* Testimonial */}
                                {/* <p className="font-body text-sm leading-6 text-white/80">
                                    “{slide.comment}”
                                </p> */}

                                {/* Divider */}
                                {/* <div className="my-5 h-px bg-white/10" /> */}

                                {/* Person */}
                                {/* <div>
                                    <p className="font-heading text-sm font-semibold text-white">
                                        {slide.name}
                                    </p>

                                    <p className="mt-1 font-body text-xs text-white/50">
                                        {slide.company}
                                    </p>
                                </div> */}

                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}