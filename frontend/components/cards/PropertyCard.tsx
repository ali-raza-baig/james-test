import Image from "next/image";
import Link from "next/link";

export type Property = {
  id: string;
  _id?: string
  slug: string;
  title: string;
  location: string;
  price: string;
  coverImage: string;
  type: string;
  status: "For Sale" | "For Rent";
  dld?: string;
  paymentInstalment: string;
  area: string;
};

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({
  property,
}: PropertyCardProps) {

  return (
    <article className="group overflow-hidden rounded-[10px] border border-stone bg-ivory">

      {/* Image */}
      <Link
        href={`/properties/${property.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-stone"
      >
        <Image
          src={property.coverImage}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />

        {/* Image Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent" />

        {/* Status */}
        {/* <span className="absolute left-4 top-4 rounded-[10px] bg-orange px-3 py-1.5 font-body text-xs font-semibold text-white">
          {property.status}
        </span> */}
        {property.paymentInstalment && (<>
          <span className="absolute left-4 top-4 rounded-[10px] bg-charcoal px-3 py-1.5 font-body text-xs font-semibold text-ivory backdrop-blur-sm">
            {property.paymentInstalment}
          </span>
        </>)}

        {/* Property Type */}
        {property.dld && (
          <span className="absolute left-4 bottom-4 rounded-[10px] bg-ivory/95 px-3 py-1.5 font-body text-xs font-semibold text-charcoal backdrop-blur-sm">
            {property.dld}
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="p-5 sm:p-6">

        {/* Price */}
        <p className="line-clamp-1 font-body text-sm text-text/60">
          Starting From
        </p>
        <div className="flex items-center  gap-1">
          <img src="/images/UAE_Dirham_Symbol.svg"
            className="w-5 h-5"
            alt="" />
          <p className="font-heading text-2xl font-semibold text-charcoal">
            {property.price}
          </p>
        </div>

        {/* Title */}
        <Link href={`/properties/${property.slug}`}>
          <h3 className="mt-2 line-clamp-1 font-heading text-lg font-semibold text-charcoal transition-colors group-hover:text-orange">
            {property.title}
          </h3>
        </Link>

        {/* Location */}
        <div className="mt-2 flex items-start gap-2">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="mt-0.5 h-4 w-4 shrink-0 text-orange"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 21s7-5.2 7-11a7 7 0 10-14 0c0 5.8 7 11 7 11z"
            />
            <circle cx="12" cy="10" r="2.2" />
          </svg>

          <p className="line-clamp-1 font-body text-sm text-text/60">
            {property.location}
          </p>
        </div>

        {/* Details */}
        <div className="mt-5 flex items-center gap-5 border-t border-stone pt-5">


          <PropertyDetail
            icon="area"
            value={property.area}
            label=""
          />
        </div>

        {/* CTA */}
        <Link
          href={`/properties/${property.slug}`}
          className="mt-5 flex w-full items-center justify-center rounded-[10px] border border-charcoal px-5 py-3 font-body text-sm font-semibold text-charcoal transition-colors hover:bg-charcoal hover:text-white"
        >
          View Property
        </Link>
      </div>
    </article>
  );
}

function PropertyDetail({
  icon,
  value,
  label,
}: {
  icon: "bed" | "bath" | "area";
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center justify-center gap-2">
      {icon === "bed" && (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-4 w-4 text-text/50"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 18v-7a3 3 0 013-3h10a3 3 0 013 3v7M4 14h16M7 11h3M14 11h3M4 18h16"
          />
        </svg>
      )}

      {icon === "bath" && (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-4 w-4 text-text/50"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 12h16M5 12v3a4 4 0 004 4h6a4 4 0 004-4v-3M7 12V6a2 2 0 014 0v2"
          />
        </svg>
      )}

      {icon === "area" && (
        <div className="flex gap-2">
          <p className="line-clamp-1 font-body text-sm text-text/60">
            Starting From
          </p>
          {/* <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-4 w-4 text-text/50"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4"
            />
          </svg> */}
        </div>
      )}

      <div className="font-body text-xs">
        <span className="font-semibold text-text">{value}</span>
        {label && (
          <span className="ml-1 text-text/50">{label}</span>
        )}
      </div>
    </div>
  );
}