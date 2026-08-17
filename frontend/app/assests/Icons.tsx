

/* --------------------------------
   Icons
-------------------------------- */

export function EmailIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            className="h-5 w-5"
        >
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" />
        </svg>
    );
}

export function PhoneIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            className="h-5 w-5"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.6 3.5h2.1l1.5 4-2 1.5a15.8 15.8 0 0 0 6.8 6.8l1.5-2 4 1.5v2.1c0 1.1-.9 2-2 2C10.3 19.4 4.6 13.7 4.6 5.5c0-1.1.9-2 2-2Z"
            />
        </svg>
    );
}

export function LinkedInIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-4 w-4"
        >
            <path d="M6.5 8.5H3.2V20h3.3V8.5ZM4.85 3A1.95 1.95 0 1 0 4.85 6.9 1.95 1.95 0 0 0 4.85 3ZM20.8 13.4c0-3.47-1.85-5.08-4.32-5.08-1.99 0-2.88 1.1-3.38 1.87V8.5H9.8V20h3.3v-5.69c0-1.5.28-2.96 2.15-2.96 1.84 0 1.87 1.72 1.87 3.06V20h3.3l.38-6.6Z" />
        </svg>
    );
}

export function InstagramIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            className="h-4 w-4"
        >
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
    );
}

export function FacebookIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-4 w-4"
        >
            <path d="M13.5 21v-8h2.8l.4-3h-3.2V8.1c0-.87.24-1.46 1.5-1.46h1.8V4a24 24 0 0 0-2.6-.13c-2.58 0-4.35 1.58-4.35 4.48V10H7v3h2.85v8h3.65Z" />
        </svg>
    );
}
export function ArrowIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            className="h-4 w-4"
            aria-hidden="true"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 19 19 5M9 5h10v10"
            />
        </svg>
    )
}

export function ChevronIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-4 w-4"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m6 9 6 6 6-6"
            />
        </svg>
    );
}

export function Chevron({
    direction = 'down',
}: {
    direction?: 'up' | 'down' | 'right';
}) {
    const rotation =
        direction === 'up'
            ? 'rotate-180'
            : direction === 'right'
                ? '-rotate-90'
                : '';

    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`h-3 w-3 sm:h-4 sm:w-4 shrink-0 transition-transform ${rotation}`}
        >
            <path
                d="m6 9 6 6 6-6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}


export function Check() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-4 w-4 shrink-0"
        >
            <path
                d="m5 12 4 4L19 6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}


export function SearchIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5 sm:h-6 sm:w-6"
        >
            <circle cx="11" cy="11" r="7" />

            <path
                d="m16.5 16.5 4 4"
                strokeLinecap="round"
            />
        </svg>
    );
}



export function LocationIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            className="h-4 w-4 shrink-0 text-orange"
            aria-hidden="true"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21s7-5.2 7-11a7 7 0 10-14 0c0 5.8 7 11 7 11Z"
            />
            <circle cx="12" cy="10" r="2.2" />
        </svg>
    );
}

export function CheckIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-3.5 w-3.5"
            aria-hidden="true"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m6 12 4 4 8-8"
            />
        </svg>
    );
}

export function BuildingIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            className="h-4 w-4 text-orange"
            aria-hidden="true"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 20h16M6 20V7l6-3v16M18 20V9l-6-2"
            />
            <path
                strokeLinecap="round"
                d="M9 9h1M9 12h1M9 15h1M14 11h1M14 14h1M14 17h1"
            />
        </svg>
    );
}

export function FloorPlanIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
            aria-hidden="true"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 9V5h4M15 5h4v4M19 15v4h-4M9 19H5v-4"
            />
            <path
                strokeLinecap="round"
                d="M9 9h6v6H9z"
            />
        </svg>
    );
}