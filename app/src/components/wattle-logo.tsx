export function WattleLogo({ className = "h-8 w-8" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Wattle flower - golden yellow spherical blooms */}
            <circle cx="50" cy="35" r="12" fill="#FFD700" />
            <circle cx="65" cy="45" r="10" fill="#FFC700" opacity="0.9" />
            <circle cx="35" cy="45" r="10" fill="#FFC700" opacity="0.9" />
            
            {/* Stems */}
            <path
                d="M50 47 L50 75"
                stroke="#6B7280"
                strokeWidth="2.5"
                strokeLinecap="round"
            />
            <path
                d="M50 55 L40 65"
                stroke="#6B7280"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M50 55 L60 65"
                stroke="#6B7280"
                strokeWidth="2"
                strokeLinecap="round"
            />
            
            {/* Leaves - silvery green */}
            <ellipse cx="38" cy="68" rx="8" ry="4" fill="#9CA3AF" opacity="0.7" transform="rotate(-30 38 68)" />
            <ellipse cx="62" cy="68" rx="8" ry="4" fill="#9CA3AF" opacity="0.7" transform="rotate(30 62 68)" />
            <ellipse cx="50" cy="78" rx="8" ry="4" fill="#9CA3AF" opacity="0.7" />
            
            {/* Additional small blooms for detail */}
            <circle cx="45" cy="30" r="4" fill="#FFE55C" opacity="0.8" />
            <circle cx="55" cy="30" r="4" fill="#FFE55C" opacity="0.8" />
            <circle cx="50" cy="25" r="5" fill="#FFED4E" opacity="0.9" />
        </svg>
    );
}

export function WattleIcon({ className = "h-6 w-6" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Simplified wattle icon for small sizes */}
            <circle cx="12" cy="8" r="3" fill="currentColor" />
            <circle cx="16" cy="11" r="2.5" fill="currentColor" opacity="0.8" />
            <circle cx="8" cy="11" r="2.5" fill="currentColor" opacity="0.8" />
            <path
                d="M12 11 L12 20"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <path
                d="M12 14 L9 17"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
            />
            <path
                d="M12 14 L15 17"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
            />
        </svg>
    );
}
