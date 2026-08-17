'use client'
import { properties } from "@/public/constant/dummayData";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import PropertyCard from "../cards/PropertyCard";
import { useParams, usePathname } from "next/navigation";
import ModalBox from "../cards/ModalBox";
import { BuildingIcon, CheckIcon, ChevronIcon, FloorPlanIcon, LocationIcon } from "@/app/assests/Icons";
import { getSimilarProperties, getSingleProperty } from "@/app/assests/action";
import { useAbout } from "../context/AboutContext";
import NotFound from "@/app/not-found";

type PropertyUnit = {
    type: string;
    area: string;
    price: string;
    floorPlan?: string;
};

type PropertyGroup = {
    bedrooms: string;
    units: PropertyUnit[];
};

type PaymentMilestone = {
    name: string;
    percentage: number;
};

type PlanName = string;

export default function PropertyDetailsPage() {

    const { contact } = useAbout()

    const [imageIndex, setImageIndex] = useState<number>(0);
    const [activePlan, setActivePlan] = useState<string>("");
    const pathname = usePathname();
    const params = useParams();
    const [isOpen, setIsOpen] = useState(false);
    const [openGroup, setOpenGroup] = useState<string | null>(null);
    const [similarPropertise, setSimilarPropertise] = useState<any[]>([])

    const [property, setProperty] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const isVideo = (src: string) => {
        return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(src);
    };

    const fetchPropertyBySlug = async () => {
        setLoading(true);
        try {
            const data = await getSingleProperty(params.slug as string);
            if (data.success) {
                setProperty(data.data);
                setLoading(false);
            }
        } catch (error) {
            console.log(`Error in fetching property`, error);
            setError(error instanceof Error ? error.message : 'Error in fetching property');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPropertyBySlug();
    }, [params.slug]);
    const fetchSimilarProperties = async () => {
        try {
            const data = await getSimilarProperties(property._id, property.type)
            setSimilarPropertise(data.data)
        } catch (error) {
            console.log(`Error in fetching similar Propertise`)
        }
    }

    useEffect(() => {
        fetchSimilarProperties()
    }, [params.slug])

    if (loading) {
        return (
            <div className="mt-12 py-30 text-center">
                Loading Property..
            </div>
        );
    }

    if (error) {
        return (
            <div className="">
                <NotFound />
            </div>
        );
    }

    if (!property) {
        return null;
    }


    // 1. propertyGroups: API has propertGroups (or propertyGroups)
    const rawGroups = property.propertGroups || property.propertyGroups || [];
    const propertyGroups: PropertyGroup[] = rawGroups.map((group: any) => ({
        bedrooms: group.name, // e.g., "3 Bed"
        units: group.units.map((unit: any) => ({
            type: unit.type,
            area: unit.area.toString(),
            price: unit.price ? `${unit.price.toLocaleString()}` : "-", // assuming price in millions
            floorPlan: unit.floreImage || undefined,
        })),
    }));

    // 2. paymentPlans: API returns array of { planName, parts: [{ partName, percentage }] }
    const rawPaymentPlans = property.paymentPlans || [];
    const paymentPlans: Record<string, PaymentMilestone[]> = {};
    rawPaymentPlans.forEach((plan: any) => {
        paymentPlans[plan.planName] = plan.parts.map((part: any) => ({
            name: part.partName,
            percentage: part.percentage,
        }));
    });

    // Set default active plan to first if any
    const planNames = Object.keys(paymentPlans);
    if (planNames.length > 0 && !activePlan) {
        setActivePlan(planNames[0]);
    }
    const milestones = paymentPlans[activePlan] || [];

    // 3. features: use amenities as features (map to names)
    const features = (property.amenities || []).map((a: any) => a.name);

    // 4. Other fields
    const title = property.title;
    const location = property.location;
    // Price: display as formatted string (e.g., "2.59M" or full number)
    const priceDisplay = property.price ? `${property.price.toLocaleString()}` : "-";
    const handOver = property.handOver || "Q4 2028"; // fallback if not in API
    const areaDisplay = property.area || "-";
    const createMarkup = (html: string) => ({ __html: html });




    return (
        <main>
            <section className="pt-26 sm:pt-30 lg:pt-32">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="xl:w-[70%] lg:w-[80%] mx-auto flex md:gap-4 md:flex-row flex-col-reverse">
                        {/* Thumbnails */}
                        <div
                            className="
        mt-1
        flex
        flex-row
        gap-2
        overflow-y-auto
        [scrollbar-width:none]
        [-ms-overflow-style:none]
        [&::-webkit-scrollbar]:hidden

        md:max-h-[470px]
        md:w-40
        md:flex-col
        md:items-center
    "
                        >
                            {(property.images || []).map((media: string, index: any) => (
                                <button
                                    key={`${media}-${index}`}
                                    type="button"
                                    onClick={() => setImageIndex(index)}
                                    className={`
                relative
                aspect-[4/3]
                w-24
                shrink-0
                cursor-pointer
                overflow-hidden
                rounded-lg
                border-2
                transition-all
                md:w-full

                ${index === imageIndex
                                            ? "border-orange"
                                            : "border-transparent hover:border-stone"
                                        }
            `}
                                >
                                    {isVideo(media) ? (
                                        <>
                                            <video
                                                src={media}
                                                muted
                                                playsInline
                                                preload="metadata"
                                                className="h-full w-full object-cover"
                                            />
                                            <span className="absolute inset-0 bg-charcoal/20" />
                                            <span className="absolute inset-0 flex items-center justify-center">
                                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm">
                                                    <svg
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                        className="ml-0.5 h-3.5 w-3.5 text-charcoal"
                                                    >
                                                        <path d="M8 5v14l11-7z" />
                                                    </svg>
                                                </span>
                                            </span>
                                            <span className="absolute bottom-1.5 left-1.5 rounded bg-charcoal/80 px-1.5 py-0.5 font-body text-[8px] font-medium uppercase tracking-wide text-white">
                                                Video
                                            </span>
                                        </>
                                    ) : (
                                        <Image
                                            src={media}
                                            alt={`Property thumbnail ${index + 1}`}
                                            fill
                                            sizes="(max-width: 768px) 96px, 160px"
                                            className="object-cover"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                        {/* Main Media */}
                        <div className="relative mt-2 mb-4 aspect-[4/3] w-full overflow-hidden rounded-xl md:mt-0">
                            {property.images && property.images[imageIndex] && isVideo(property.images[imageIndex]) ? (
                                <video
                                    key={property.images[imageIndex]}
                                    src={property.images[imageIndex]}
                                    controls
                                    playsInline
                                    className="h-full w-full rounded-xl object-cover"
                                />
                            ) : (
                                <Image
                                    src={property.images?.[imageIndex] || "/fallback.jpg"}
                                    alt={`${title} - ${location}`}
                                    fill
                                    className="rounded-xl object-cover"
                                    priority
                                />
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-12 sm:py-16">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-20">
                        {/* Main Info */}
                        <div>
                            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <h1 className="mt-3 font-heading text-2xl font-semibold leading-tight tracking-tight text-charcoal sm:text-3xl lg:text-4xl">
                                        {title}
                                    </h1>
                                    <div className="mt-4 flex items-center gap-2 font-body text-sm text-text/55">
                                        <LocationIcon />
                                        {location}
                                    </div>
                                </div>
                            </div>

                            {/* Property Stats */}
                            <div className="mt-10 grid grid-cols-2 gap-2 md:grid-cols-4 border-y border-orange/35 py-6 sm:max-w-2xl">
                                <PropertyStat
                                    label="Starting Price"
                                    value={priceDisplay}
                                    price={property.price}
                                    link={propertyGroups.length > 0 ? `${pathname}#group` : ""}
                                    linkLabel="View Unit Types"
                                />
                                <PropertyStat
                                    label="Payment Plan"
                                    value={property.paymentInstalment ? property.paymentInstalment : "—"}
                                    link={planNames.length > 0 ? `${pathname}#paymentplan` : ""}
                                    linkLabel="View Complete Plans"
                                />
                                <PropertyStat label="Hand Over" value={handOver} />
                                <PropertyStat label="Starting From" value={areaDisplay} />
                            </div>

                            {/* Description */}
                            {property.description && (
                                <div className="mt-12 max-w-3xl">
                                    <p className="mb-4 font-body text-xs font-semibold uppercase tracking-[0.2em] text-orange">
                                        Property Overview
                                    </p>
                                    <h2 className="font-heading text-3xl font-semibold text-charcoal sm:text-4xl">
                                        A place designed for living.
                                    </h2>
                                    <div className="mt-6 space-y-5 font-body text-base leading-8 text-text/65 sm:text-lg" dangerouslySetInnerHTML={createMarkup(property.description)}>

                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Contact Card */}
                        <aside>
                            <div className="sticky top-28 rounded-[10px] bg-charcoal p-7 sm:p-8">
                                <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-orange">
                                    Interested in this property?
                                </p>
                                <h3 className="mt-4 font-heading text-2xl font-semibold leading-tight text-white">
                                    Let's arrange a viewing.
                                </h3>
                                <p className="mt-4 font-body text-sm leading-6 text-white/55">
                                    Get in touch to arrange a private viewing or ask any
                                    questions about this property.
                                </p>
                                <Link
                                    href="/contact"
                                    className="mt-7 flex h-12 items-center justify-center rounded-[10px] bg-orange px-5 font-body text-sm font-semibold text-white transition-colors hover:bg-orange-hover"
                                >
                                    Book a Viewing
                                </Link>
                                <a
                                    href={`tel:${contact?.phone}`}
                                    className="mt-3 flex h-12 items-center justify-center rounded-[10px] border border-white/15 px-5 font-body text-sm font-semibold text-white transition-colors hover:border-orange hover:text-orange"
                                >
                                    Call James
                                </a>
                                <div className="mt-7 border-t border-white/10 pt-6">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                                            <span className="font-heading text-sm font-semibold text-orange">
                                                J
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-body text-sm font-semibold text-white">
                                                James
                                            </p>
                                            <p className="font-body text-xs text-white/40">
                                                Property Consultant
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>

            <section className="bg-charcoal py-20 sm:py-24">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="max-w-2xl">
                        <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-orange">
                            Property Features
                        </p>
                        <h2 className="mt-4 font-heading text-3xl font-semibold text-ivory! sm:text-4xl">
                            Everything you need to know.
                        </h2>
                    </div>
                    <div className="mt-10 grid gap-x-8 gap-y-0 sm:grid-cols-2 lg:grid-cols-4">
                        {features.length > 0 ? (
                            features.map((feature: any) => (
                                <div
                                    key={feature}
                                    className="flex items-center gap-3 border-t border-orange/35 py-5"
                                >
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange/10 text-orange">
                                        <CheckIcon />
                                    </span>
                                    <span className="font-body text-sm text-ivory!">
                                        {feature}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-ivory/50 text-center py-4">
                                No features listed
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {planNames.length > 0 && (
                <section id="paymentplan" className="bg-ivory pt-20 sm:py-24 lg:py-28">
                    <div className="mx-auto max-w-7xl px-6">
                        <div>
                            <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-orange">
                                Payment Plan
                            </p>
                            <h2 className="mt-3 font-heading text-3xl font-semibold text-charcoal sm:text-4xl">
                                A clear path to ownership.
                            </h2>
                        </div>

                        <div className="mt-7 flex gap-2">
                            {planNames.map((plan) => {
                                const active = activePlan === plan;
                                return (
                                    <button
                                        key={plan}
                                        type="button"
                                        onClick={() => setActivePlan(plan)}
                                        className={`rounded-[10px] border px-5 py-2.5 font-body text-sm font-medium transition-colors ${active
                                            ? "border-orange bg-orange/5 text-orange"
                                            : "border-stone bg-transparent text-charcoal hover:border-orange hover:text-orange"
                                            }`}
                                    >
                                        {plan}
                                    </button>
                                );
                            })}
                        </div>

                        {milestones.length > 0 && (
                            <div className="mt-8">
                                <div className="grid grid-cols-[1fr_160px] gap-4 px-4 pb-4 sm:grid-cols-[1fr_240px] sm:px-12">
                                    <p className="font-body text-[11px] font-semibold uppercase tracking-[0.08em] text-charcoal">
                                        Milestone
                                    </p>
                                    <p className="font-body text-[11px] font-semibold uppercase tracking-[0.08em] text-charcoal">
                                        % of Property Value
                                    </p>
                                </div>
                                <div className="relative">
                                    {milestones.length > 1 && (
                                        <div className="absolute bottom-8 left-[16px] top-8 w-px bg-stone sm:left-[18px]" />
                                    )}
                                    <div className="space-y-2">
                                        {milestones.map((milestone) => (
                                            <div
                                                key={milestone.name}
                                                className="relative grid grid-cols-[32px_1fr_160px] items-center gap-2 sm:grid-cols-[36px_1fr_240px] sm:gap-4"
                                            >
                                                <div className="relative z-10 flex justify-center">
                                                    <span className="h-3 w-3 rounded-full border-2 border-ivory bg-orange ring-1 ring-orange/30" />
                                                </div>
                                                <div className="rounded-[10px] bg-white px-4 py-4 sm:px-5">
                                                    <p className="font-body text-sm font-medium text-charcoal sm:text-base">
                                                        {milestone.name}
                                                    </p>
                                                </div>
                                                <div className="px-2">
                                                    <p className="font-body text-sm font-semibold text-charcoal sm:text-base">
                                                        {milestone.percentage}%
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {propertyGroups.length > 0 && (
                <section id="group" className="bg-ivory pt-10 pb-20 sm:pb-24 lg:pb-28">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="overflow-hidden rounded-[10px] border border-stone bg-white shadow-[0_8px_30px_rgba(36,36,36,0.04)]">
                            {/* Header */}
                            <div className="flex flex-col gap-5 border-b border-stone px-5 py-5 sm:px-8 sm:py-6 lg:flex-row lg:items-center lg:justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange/10 text-orange">
                                        <BuildingIcon />
                                    </div>
                                    <div>
                                        <p className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-orange">
                                            Property Collection
                                        </p>
                                        <h2 className="mt-1 font-heading text-xl font-semibold tracking-tight text-charcoal">
                                            Residential
                                        </h2>
                                    </div>
                                </div>
                                <div className="lg:text-right">
                                    <p className="font-body text-[10px] font-medium uppercase tracking-[0.15em] text-text/40">
                                        Starting From
                                    </p>
                                    <p className="mt-1 font-heading text-lg font-semibold text-charcoal">
                                        AED {priceDisplay}
                                    </p>
                                </div>
                            </div>

                            {/* Desktop Table */}
                            <div className="hidden lg:block">
                                <div className="px-6 pb-6 sm:px-8">
                                    <div className="grid grid-cols-[140px_1fr_130px_140px_90px] items-center gap-4 border-b border-orange/35 px-4 py-5">
                                        <div />
                                        <p className="font-body text-[10px] font-semibold uppercase tracking-[0.15em] text-text/45">
                                            Type
                                        </p>
                                        <p className="font-body text-[10px] font-semibold uppercase tracking-[0.15em] text-text/45">
                                            Area (SQFT)
                                        </p>
                                        <p className="font-body text-[10px] font-semibold uppercase tracking-[0.15em] text-text/45">
                                            Price (AED)
                                        </p>
                                        {/* <p className="font-body text-[10px] font-semibold uppercase tracking-[0.15em] text-text/45">
                                            Floor Plan
                                        </p> */}
                                    </div>
                                    <div>
                                        {propertyGroups.map((group, groupIndex) => (
                                            <div
                                                key={group.bedrooms}
                                                className={
                                                    groupIndex !== 0
                                                        ? "border-t border-orange/35 pt-5"
                                                        : "pt-3"
                                                }
                                            >
                                                <div className="grid grid-cols-[140px_1fr] gap-4">
                                                    <div className="flex items-start px-4 pt-5">
                                                        <div>
                                                            <p className="font-heading text-base font-semibold text-charcoal">
                                                                {group.bedrooms}
                                                            </p>
                                                            <p className="mt-1 font-body text-[10px] uppercase tracking-[0.12em] text-text/40">

                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {group.units.map((unit) => (
                                                            <div
                                                                key={unit.type}
                                                                className="
                                                    grid
                                                    grid-cols-[1fr_130px_140px_90px]
                                                    items-center
                                                    gap-4
                                                    rounded-[10px]
                                                    border
                                                    border-transparent
                                                    px-4
                                                    py-4
                                                    transition-colors
                                                    hover:border-stone
                                                    hover:bg-stone/15
                                                "
                                                            >
                                                                <p className="font-body text-sm font-medium text-charcoal">
                                                                    {unit.type}
                                                                </p>
                                                                <p className="font-body text-sm text-text/70">
                                                                    {unit.area}
                                                                </p>
                                                                <p
                                                                    className={`font-body text-sm ${unit.price !== "-"
                                                                        ? "font-semibold text-charcoal"
                                                                        : "text-text/35"
                                                                        }`}
                                                                >
                                                                    {unit.price}
                                                                </p>
                                                                {/* <button
                                                                    onClick={() => setIsOpen(true)}
                                                                    type="button"
                                                                    aria-label={`View floor plan for ${unit.type}`}
                                                                    className="
                                                        flex
                                                        h-9
                                                        w-9
                                                        items-center
                                                        justify-center
                                                        rounded-full
                                                        border
                                                        border-stone
                                                        text-orange
                                                        transition-all
                                                        hover:border-orange
                                                        hover:bg-orange
                                                        hover:text-white
                                                    "
                                                                >
                                                                    <FloorPlanIcon />
                                                                </button> */}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Accordion */}
                            <div className="block lg:hidden">
                                <div className="divide-y divide-stone">
                                    {propertyGroups.map((group) => {
                                        const isOpen = openGroup === group.bedrooms;
                                        return (
                                            <div key={group.bedrooms}>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setOpenGroup(
                                                            isOpen ? null : group.bedrooms
                                                        )
                                                    }
                                                    className="flex w-full items-center justify-between px-5 py-5 text-left"
                                                >
                                                    <div>
                                                        <p className="font-heading text-base font-semibold text-charcoal">
                                                            {group.bedrooms}
                                                        </p>
                                                        <p className="mt-1 font-body text-[10px] uppercase tracking-[0.12em] text-text/40">
                                                            {group.units.length} Unit Types
                                                        </p>
                                                    </div>
                                                    <span
                                                        className={`flex h-8 w-8 items-center justify-center rounded-full border border-stone text-text/50 transition-transform ${isOpen
                                                            ? "rotate-180 border-orange text-orange"
                                                            : ""
                                                            }`}
                                                    >
                                                        <ChevronIcon />
                                                    </span>
                                                </button>
                                                {isOpen && (
                                                    <div className="space-y-3 bg-stone/10 px-5 pb-5">
                                                        {group.units.map((unit) => (
                                                            <div
                                                                key={unit.type}
                                                                className="rounded-[10px] border border-stone bg-white p-4"
                                                            >
                                                                <div className="flex items-center justify-between">
                                                                    <p className="font-heading text-sm font-semibold text-charcoal">
                                                                        {unit.type}
                                                                    </p>
                                                                    <button
                                                                        onClick={() =>
                                                                            setIsOpen(true)
                                                                        }
                                                                        type="button"
                                                                        aria-label={`View floor plan for ${unit.type}`}
                                                                        className="
                                                            flex
                                                            h-9
                                                            w-9
                                                            items-center
                                                            justify-center
                                                            rounded-full
                                                            border
                                                            border-stone
                                                            text-orange
                                                            transition-colors
                                                            hover:border-orange
                                                            hover:bg-orange
                                                            hover:text-white
                                                        "
                                                                    >
                                                                        {/* <FloorPlanIcon /> */}
                                                                    </button>
                                                                </div>
                                                                <div className="mt-4 grid grid-cols-2 gap-4 border-t border-stone pt-4">
                                                                    <div>
                                                                        <p className="font-body text-[10px] font-medium uppercase tracking-[0.1em] text-text/40">
                                                                            Area
                                                                        </p>
                                                                        <p className="mt-1 font-body text-sm font-medium text-charcoal">
                                                                            {unit.area} sqft
                                                                        </p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-body text-[10px] font-medium uppercase tracking-[0.1em] text-text/40">
                                                                            Price
                                                                        </p>
                                                                        <p
                                                                            className={`mt-1 font-body text-sm ${unit.price !== "-"
                                                                                ? "font-semibold text-charcoal"
                                                                                : "text-text/35"
                                                                                }`}
                                                                        >
                                                                            {unit.price === "-"
                                                                                ? "Price on request"
                                                                                : `AED ${unit.price}`}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            <section className="bg-charcoal py-20 sm:py-24">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-20">
                        <div>
                            <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-orange">
                                Location
                            </p>
                            <h2 className="mt-4 font-heading text-3xl font-semibold leading-tight text-ivory! sm:text-4xl">
                                Located in
                                <br />
                                {location}
                            </h2>
                            <p className="mt-5 max-w-md font-body text-base leading-7 text-ivory">
                                A desirable location offering convenient access to local
                                amenities, transport links, schools, and everything you need
                                for everyday living.
                            </p>
                        </div>
                        <div className="relative flex aspect-[16/9] items-center justify-center overflow-hidden rounded-[10px] bg-stone">
                            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[10px] bg-stone">
                                <iframe
                                    src={`https://www.google.com/maps?q=${encodeURIComponent(location)}&output=embed`}
                                    className="absolute inset-0 h-full w-full border-0"
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Property location map"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-stone/25 py-20 sm:py-24 lg:py-28">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-orange">
                                You May Also Like
                            </p>
                            <h2 className="mt-4 font-heading text-3xl font-semibold text-charcoal sm:text-4xl">
                                Similar properties
                            </h2>
                        </div>
                        <Link
                            href="/properties"
                            className="hidden font-body text-sm font-semibold text-charcoal transition-colors hover:text-orange sm:block"
                        >
                            View All →
                        </Link>
                    </div>
                    {similarPropertise.length === 0 ? (<div className="mt-6 text-center">
                        No Similar Propertise yet.
                    </div>) : (<div>
                        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {properties.map((property) => (
                                <div key={property.slug}>
                                    <PropertyCard
                                        key={property.id}
                                        //@ts-ignore
                                        property={property}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>)}
                </div>
            </section>

            {isOpen && (
                <ModalBox
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    title=""
                >
                    <img src="/images/flore1.webp" alt="Floor plan" />
                </ModalBox>
            )}
        </main>
    );
}

/* =========================================
   PROPERTY STAT (unchanged)
========================================= */

function PropertyStat({
    value,
    label,
    border = false,
    price,
    link,
    linkLabel
}: {
    value: string | number;
    label: string;
    border?: boolean;
    price?: string | number
    link?: string
    linkLabel?: string
}) {
    return (
        <div className="group p-2 relative overflow-hidden flex flex-col items-center justify-center md:py-2 rounded-[10px] before:absolute
    before:inset-y-0 before:left-0
    before:-z-0
    before:w-0
    before:bg-orange
    before:transition-all before:duration-500
    hover:before:w-full">
            <div
                className={`relative z-10 px-4 first:pl-0  ${border ? "" : ""
                    }`}
            >
                <div className="flex items-center  gap-1">
                    {price && (
                        <img src="/images/UAE_Dirham_Symbol.svg"
                            className="w-5 h-5"
                            alt="" />
                    )}
                    <p className="font-heading text-xl font-semibold text-charcoal group-hover:text-ivory">
                        {value}
                    </p>
                </div>
                <p className="mt-1 font-body text-xs text-text/50 group-hover:text-ivory">
                    {label}
                </p>
                {link && (<Link className="mt-0.5 text-orange text-xs group-hover:text-charcoal" href={link}>
                    {linkLabel}
                </Link>)}
            </div>
        </div>
    );
}
