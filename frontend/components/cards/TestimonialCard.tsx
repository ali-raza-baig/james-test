import Image from "next/image";

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  image: string;
};

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export default function TestimonialCard({
  testimonial,
}: TestimonialCardProps) {
  return (
    <article className="group flex h-full flex-col rounded-[10px] border border-stone bg-ivory p-6 sm:p-7">
      {/* Quote Icon */}
      <div className="flex items-start justify-between">
        <span className="font-heading text-5xl font-semibold leading-none text-orange/70">
          “
        </span>

        {/* Stars */}
        <div
          className="flex gap-1 text-orange"
          aria-label="5 out of 5 stars"
        >
          {Array.from({ length: 5 }).map((_, index) => (
            <svg
              key={index}
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M10 1.5l2.63 5.33 5.88.85-4.25 4.14 1 5.85L10 14.91l-5.26 2.76 1-5.85L1.5 7.68l5.88-.85L10 1.5z" />
            </svg>
          ))}
        </div>
      </div>

      {/* Quote */}
      <blockquote className="mt-3 flex-1">
        <p className="font-body text-base leading-7 text-text/75 sm:text-lg sm:leading-8">
          {testimonial.quote}
        </p>
      </blockquote>

      {/* Divider */}
      <div className="my-6 h-px bg-stone" />

      {/* Author */}
      <div className="flex items-center gap-4">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-stone">
          <Image
            src={testimonial.image}
            alt={testimonial.name}
            fill
            className="object-cover"
          />
        </div>

        <div>
          <p className="font-heading text-sm font-semibold text-charcoal">
            {testimonial.name}
          </p>

          <p className="mt-0.5 font-body text-xs text-text/55">
            {testimonial.role}
          </p>
        </div>
      </div>
    </article>
  );
}