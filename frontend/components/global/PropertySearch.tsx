'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Check, Chevron, SearchIcon } from '@/app/assests/Icons';

type DropdownType = 'location' | 'propertyType' | 'price' | null;

type Option = {
    label: string;
    value: string;
};

function PropertySearch() {
    const [location, setLocation] = useState('');
    const [propertyType, setPropertyType] = useState('');
    const [price, setPrice] = useState('');
    const [subtype, setSubtype] = useState('');

    const [openDropdown, setOpenDropdown] = useState<DropdownType>(null);

    const searchRef = useRef<HTMLFormElement | null>(null);

    const router = useRouter();
    const searchParams = useSearchParams();

    // --------------------------------------------------
    // OPTIONS
    // --------------------------------------------------

    const locationOptions: Option[] = [
        { label: 'Abu Dhabi', value: 'abu-dhabi' },
        { label: 'Dubai', value: 'dubai' },
        { label: 'Sharjah', value: 'sharjah' },
        { label: 'Ajman', value: 'ajman' },
        { label: 'Umm Al Quwain', value: 'umm-al-quwain' },
        { label: 'Ras Al Khaimah', value: 'ras-al-khaimah' },
        { label: 'Fujairah', value: 'fujairah' },
    ];

    const propertyTypeOptions: Option[] = [
        {
            label: 'Residential',
            value: 'residential',
        },
        {
            label: 'Commercial',
            value: 'commercial',
        },
    ];

    const priceOptions: Option[] = [

        {
            label: ' 500,000 AED',
            value: 'below-50000',
        },
        {
            label: '500,000 - 10,000,000 AED',
            value: '50000-100000',
        },
        {
            label: '< 10,000,000 AED',
            value: 'above-100000',
        },
        {
            label: '50,000,000 AED',
            value: 'below-500000',
        },
        {
            label: '50,000,0 - 100,000,0 AED',
            value: '500000-1000000',
        },
        {
            label: '50,000,0 - 100,000,0 AED',
            value: '500000-1000000',
        },
        {
            label: '100,000,0-200,000,0 AED',
            value: '1000000-2000000',
        },
    ];

    const getSubtypeOptions = (type: string): Option[] => {
        if (type === 'residential') {
            return [
                {
                    label: 'Apartments',
                    value: 'apartment',
                },
                {
                    label: 'Villas',
                    value: 'villa',
                },
                {
                    label: 'Townhouses',
                    value: 'townhouse',
                },
            ];
        }

        if (type === 'commercial') {
            return [
                {
                    label: 'Retail',
                    value: 'retail',
                },
                {
                    label: 'Office',
                    value: 'office',
                },
            ];
        }

        return [];
    };

    const subtypeOptions = getSubtypeOptions(propertyType);

    // --------------------------------------------------
    // LABEL HELPERS
    // --------------------------------------------------

    const selectedLocation =
        locationOptions.find((item) => item.value === location)?.label ||
        'Location';

    const selectedPropertyType =
        propertyTypeOptions.find(
            (item) => item.value === propertyType
        )?.label || 'Property Type';

    const selectedSubtype =
        subtypeOptions.find((item) => item.value === subtype)?.label ||
        '';

    const selectedPrice =
        priceOptions.find((item) => item.value === price)?.label ||
        'Any Price';

    // --------------------------------------------------
    // SYNC STATE WITH URL
    // --------------------------------------------------

    useEffect(() => {
        setLocation(searchParams.get('location') ?? '');
        setPropertyType(searchParams.get('propertyType') ?? '');
        setPrice(searchParams.get('price') ?? '');
        setSubtype(searchParams.get('subtype') ?? '');
    }, [searchParams]);

    // --------------------------------------------------
    // RESET INVALID SUBTYPE
    // --------------------------------------------------

    useEffect(() => {
        const validSubtypes = getSubtypeOptions(propertyType);

        if (
            subtype &&
            !validSubtypes.some((option) => option.value === subtype)
        ) {
            setSubtype('');
        }
    }, [propertyType, subtype]);

    // --------------------------------------------------
    // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
    // --------------------------------------------------

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target as Node)
            ) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener(
                'mousedown',
                handleClickOutside
            );
        };
    }, []);

    // --------------------------------------------------
    // ESCAPE KEY
    // --------------------------------------------------

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setOpenDropdown(null);
            }
        };

        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener(
                'keydown',
                handleEscape
            );
        };
    }, []);

    // --------------------------------------------------
    // SUBMIT
    // --------------------------------------------------

    const handleSubmit = (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        const params = new URLSearchParams(
            searchParams.toString()
        );

        if (location) {
            params.set('location', location);
        } else {
            params.delete('location');
        }

        if (propertyType) {
            params.set('propertyType', propertyType);
        } else {
            params.delete('propertyType');
        }

        if (price) {
            params.set('price', price);
        } else {
            params.delete('price');
        }

        if (subtype) {
            params.set('subtype', subtype);
        } else {
            params.delete('subtype');
        }

        params.set('page', '1');

        setOpenDropdown(null);

        router.push(
            `/properties?${params.toString()}`
        );
    };

    // --------------------------------------------------
    // DROPDOWN TOGGLE
    // --------------------------------------------------

    const toggleDropdown = (
        dropdown: Exclude<DropdownType, null>
    ) => {
        setOpenDropdown((current) =>
            current === dropdown ? null : dropdown
        );
    };

    // --------------------------------------------------
    // LOCATION SELECT
    // --------------------------------------------------

    const handleLocationSelect = (value: string) => {
        setLocation(value);
        setOpenDropdown(null);
    };

    // --------------------------------------------------
    // PROPERTY TYPE SELECT
    // --------------------------------------------------

    const handlePropertyTypeSelect = (
        value: string
    ) => {
        setPropertyType(value);
        setSubtype('');

        // Keep property dropdown open so the
        // subtype submenu can be selected.
        setOpenDropdown('propertyType');
    };

    // --------------------------------------------------
    // SUBTYPE SELECT
    // --------------------------------------------------

    const handleSubtypeSelect = (
        value: string
    ) => {
        setSubtype(value);
        setOpenDropdown(null);
    };

    // --------------------------------------------------
    // PRICE SELECT
    // --------------------------------------------------

    const handlePriceSelect = (value: string) => {
        setPrice(value);
        setOpenDropdown(null);
    };

    return (
        <form
            ref={searchRef}
            onSubmit={handleSubmit}
            className="
                relative
                flex
                w-full
                max-w-[670px]
                flex-nowrap
                items-center
                rounded-[16px]
                sm:rounded-[24px]
                border
                border-white/20
                p-0.5
                shadow-xl
                bg-charcoal
                sm:p-1.5
            "
        >
            {/* =====================================================
                LOCATION
            ====================================================== */}

            <div className="relative min-w-0 flex-1">
                <button
                    type="button"
                    onClick={() => toggleDropdown('location')}
                    className="
                        flex
                        h-[46px]
                        sm:h-[58px]
                        w-full
                        items-center
                        justify-between
                        rounded-l-[14px]
                        sm:rounded-l-[20px]
                        px-2
                        sm:px-5
                        text-left
                        transition
                        hover:bg-white/5
                    "
                    aria-expanded={
                        openDropdown === 'location'
                    }
                    aria-haspopup="listbox"
                >
                    <div className="min-w-0">
                        <div
                            className="
                                flex
                                items-center
                                gap-1
                                sm:gap-2
                                font-body
                                text-[10px]
                                xs:text-xs
                                sm:text-[16px]
                                font-semibold
                                text-ivory
                                whitespace-nowrap
                            "
                        >
                            <span className="truncate">Location</span>

                            <Chevron
                                direction={
                                    openDropdown === 'location'
                                        ? 'up'
                                        : 'down'
                                }
                            />
                        </div>

                        <div
                            className="
                                mt-0.5
                                sm:mt-1
                                truncate
                                font-body
                                text-[10px]
                                sm:text-[14px]
                                text-ivory/60
                            "
                        >
                            {selectedLocation}
                        </div>
                    </div>
                </button>

                {openDropdown === 'location' && (
                    <div
                        className="
                            absolute
                            left-0
                            top-[calc(100%+8px)]
                            sm:top-[calc(100%+10px)]
                            z-50
                            w-[min(230px,88vw)]
                            overflow-hidden
                            rounded-[18px]
                            border
                            border-white/10
                            bg-[#242424]
                            p-2
                            shadow-2xl
                            backdrop-blur-xl
                        "
                    >
                        {locationOptions.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() =>
                                    handleLocationSelect(
                                        option.value
                                    )
                                }
                                className={`
                                    flex
                                    w-full
                                    items-center
                                    justify-between
                                    rounded-xl
                                    px-4
                                    py-3
                                    text-left
                                    font-body
                                    text-sm
                                    transition
                                    ${location ===
                                        option.value
                                        ? 'bg-white/10 text-ivory'
                                        : 'text-ivory/80 hover:bg-white/10 hover:text-ivory'
                                    }
                                `}
                            >
                                {option.label}

                                {location ===
                                    option.value && (
                                        <Check />
                                    )}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* DIVIDER */}

            <div className="block h-8 sm:h-12 w-px shrink-0 bg-white/20" />

            {/* =====================================================
                PROPERTY TYPE
            ====================================================== */}

            <div className="relative min-w-0 flex-1">
                <button
                    type="button"
                    onClick={() =>
                        toggleDropdown('propertyType')
                    }
                    className="
                        flex
                        h-[46px]
                        sm:h-[58px]
                        w-full
                        items-center
                        justify-between
                        px-2
                        sm:px-5
                        text-left
                        transition
                        hover:bg-white/5
                    "
                    aria-expanded={
                        openDropdown === 'propertyType'
                    }
                    aria-haspopup="menu"
                >
                    <div className="min-w-0">
                        <div
                            className="
                                flex
                                items-center
                                gap-1
                                sm:gap-2
                                font-body
                                text-[10px]
                                xs:text-xs
                                sm:text-[16px]
                                font-semibold
                                text-ivory
                                whitespace-nowrap
                            "
                        >
                            <span className="truncate">Property Type</span>

                            <Chevron
                                direction={
                                    openDropdown ===
                                        'propertyType'
                                        ? 'up'
                                        : 'down'
                                }
                            />
                        </div>

                        <div
                            className="
                                mt-0.5
                                sm:mt-1
                                truncate
                                font-body
                                text-[10px]
                                sm:text-[14px]
                                text-ivory/60
                            "
                        >
                            {selectedSubtype ||
                                selectedPropertyType}
                        </div>
                    </div>
                </button>

                {openDropdown === 'propertyType' && (
                    <div
                        className="
                            absolute
                            left-0
                            top-[calc(100%+8px)]
                            sm:top-[calc(100%+10px)]
                            z-50
                            flex
                            flex-col
                            sm:flex-row
                            items-start
                            gap-2
                        "
                    >
                        {/* MAIN PROPERTY TYPE MENU */}

                        <div
                            className="
                                w-[min(185px,88vw)]
                                overflow-hidden
                                rounded-[18px]
                                border
                                border-white/10
                                bg-[#242424]
                                p-2
                                shadow-2xl
                                backdrop-blur-xl
                            "
                        >
                            {propertyTypeOptions.map(
                                (option) => (
                                    <button
                                        key={
                                            option.value
                                        }
                                        type="button"
                                        onClick={() =>
                                            handlePropertyTypeSelect(
                                                option.value
                                            )
                                        }
                                        className={`
                                            flex
                                            w-full
                                            items-center
                                            justify-between
                                            rounded-xl
                                            px-4
                                            py-3
                                            text-left
                                            font-body
                                            text-xs
                                            sm:text-sm
                                            transition
                                            ${propertyType ===
                                                option.value
                                                ? 'bg-white/10 text-ivory'
                                                : 'text-ivory/80 hover:bg-white/10 hover:text-ivory'
                                            }
                                        `}
                                    >
                                        <span>
                                            {
                                                option.label
                                            }
                                        </span>

                                        <Chevron
                                            direction="right"
                                        />
                                    </button>
                                )
                            )}
                        </div>

                        {/* SUBTYPE MENU */}

                        {propertyType &&
                            subtypeOptions.length > 0 && (
                                <div
                                    className="
                                        w-[min(185px,88vw)]
                                        overflow-hidden
                                        rounded-[18px]
                                        border
                                        border-white/10
                                        bg-[#242424]
                                        p-2
                                        shadow-2xl
                                        backdrop-blur-xl
                                    "
                                >
                                    {subtypeOptions.map(
                                        (option) => (
                                            <button
                                                key={
                                                    option.value
                                                }
                                                type="button"
                                                onClick={() =>
                                                    handleSubtypeSelect(
                                                        option.value
                                                    )
                                                }
                                                className={`
                                                    flex
                                                    w-full
                                                    items-center
                                                    justify-between
                                                    rounded-xl
                                                    px-4
                                                    py-3
                                                    text-left
                                                    font-body
                                                    text-xs
                                                    sm:text-sm
                                                    transition
                                                    ${subtype ===
                                                        option.value
                                                        ? 'bg-white/10 text-ivory'
                                                        : 'text-ivory/80 hover:bg-white/10 hover:text-ivory'
                                                    }
                                                `}
                                            >
                                                {
                                                    option.label
                                                }

                                                {subtype ===
                                                    option.value && (
                                                        <Check />
                                                    )}
                                            </button>
                                        )
                                    )}
                                </div>
                            )}
                    </div>
                )}
            </div>

            {/* DIVIDER */}

            <div className="block h-8 sm:h-12 w-px shrink-0 bg-white/20" />

            {/* =====================================================
                PRICE
            ====================================================== */}

            <div className="relative min-w-0 flex-1">
                <button
                    type="button"
                    onClick={() => toggleDropdown('price')}
                    className="
                        flex
                        h-[46px]
                        sm:h-[58px]
                        w-full
                        items-center
                        justify-between
                        px-2
                        sm:px-5
                        text-left
                        transition
                        hover:bg-white/5
                    "
                    aria-expanded={
                        openDropdown === 'price'
                    }
                    aria-haspopup="listbox"
                >
                    <div className="min-w-0">
                        <div
                            className="
                                flex
                                items-center
                                gap-1
                                sm:gap-2
                                font-body
                                text-[10px]
                                xs:text-xs
                                sm:text-[16px]
                                font-semibold
                                text-ivory
                                whitespace-nowrap
                            "
                        >
                            <span className="truncate">Price</span>

                            <Chevron
                                direction={
                                    openDropdown === 'price'
                                        ? 'up'
                                        : 'down'
                                }
                            />
                        </div>

                        <div
                            className="
                                mt-0.5
                                sm:mt-1
                                truncate
                                font-body
                                text-[10px]
                                sm:text-[14px]
                                text-ivory/60
                            "
                        >
                            {selectedPrice}
                        </div>
                    </div>
                </button>

                {openDropdown === 'price' && (
                    <div
                        className="
                            absolute
                            right-0
                            top-[calc(100%+8px)]
                            sm:top-[calc(100%+10px)]
                            z-50
                            w-[min(260px,88vw)]
                            overflow-hidden
                            rounded-[18px]
                            border
                            border-white/10
                            bg-[#242424]
                            p-2
                            shadow-2xl
                            backdrop-blur-xl
                        "
                    >
                        {priceOptions.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() =>
                                    handlePriceSelect(
                                        option.value
                                    )
                                }
                                className={`
                                    flex
                                    w-full
                                    items-center
                                    justify-between
                                    rounded-xl
                                    px-4
                                    py-3
                                    text-left
                                    font-body
                                    text-sm
                                    transition
                                    ${price ===
                                        option.value ||
                                        (!price &&
                                            !option.value)
                                        ? 'bg-white/10 text-ivory'
                                        : 'text-ivory/80 hover:bg-white/10 hover:text-ivory'
                                    }
                                `}
                            >
                                {option.label}

                                {((!price &&
                                    !option.value) ||
                                    price ===
                                    option.value) && (
                                        <Check />
                                    )}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* =====================================================
                SEARCH BUTTON
            ====================================================== */}

            <button
                type="submit"
                aria-label="Search properties"
                className="
                    flex
                    h-[38px]
                    w-[38px]
                    sm:h-[58px]
                    sm:w-[58px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-[12px]
                    sm:rounded-[18px]
                    bg-orange
                    text-white
                    transition
                    hover:bg-orange-hover
                    focus:outline-none
                    focus:ring-2
                    focus:ring-orange
                    focus:ring-offset-2
                    focus:ring-offset-transparent
                    mr-0.5
                    sm:mr-0
                "
            >
                <SearchIcon />
            </button>
        </form>
    );
}

export default PropertySearch;
