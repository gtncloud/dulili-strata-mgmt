export function WattleIllustration({ className = "w-full h-full" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 400 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Background gradient */}
            <defs>
                <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FEF3C7" />
                    <stop offset="100%" stopColor="#FDE68A" />
                </linearGradient>
                <linearGradient id="wattleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FBBF24" />
                    <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>
            </defs>
            
            {/* Background circle */}
            <circle cx="200" cy="200" r="180" fill="url(#bgGradient)" opacity="0.3" />
            
            {/* Main wattle branch */}
            <g transform="translate(200, 200)">
                {/* Central stem */}
                <path
                    d="M0 -80 Q-10 -40 -5 0 Q0 40 0 80"
                    stroke="#6B7280"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                />
                
                {/* Left branch */}
                <path
                    d="M-5 -20 Q-40 -10 -60 10"
                    stroke="#6B7280"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                />
                
                {/* Right branch */}
                <path
                    d="M0 20 Q40 30 65 45"
                    stroke="#6B7280"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                />
                
                {/* Wattle blooms - golden spheres */}
                {/* Top cluster */}
                <circle cx="-8" cy="-85" r="18" fill="url(#wattleGradient)" />
                <circle cx="8" cy="-90" r="15" fill="#FCD34D" opacity="0.9" />
                <circle cx="-2" cy="-70" r="14" fill="#FDE047" opacity="0.85" />
                <circle cx="12" cy="-75" r="12" fill="#FACC15" opacity="0.8" />
                
                {/* Left cluster */}
                <circle cx="-65" cy="8" r="16" fill="url(#wattleGradient)" />
                <circle cx="-75" cy="18" r="13" fill="#FCD34D" opacity="0.9" />
                <circle cx="-55" cy="15" r="11" fill="#FDE047" opacity="0.85" />
                
                {/* Right cluster */}
                <circle cx="70" cy="43" r="17" fill="url(#wattleGradient)" />
                <circle cx="80" cy="52" r="14" fill="#FCD34D" opacity="0.9" />
                <circle cx="62" cy="55" r="12" fill="#FDE047" opacity="0.85" />
                
                {/* Bottom cluster */}
                <circle cx="5" cy="85" r="15" fill="url(#wattleGradient)" />
                <circle cx="-8" cy="90" r="12" fill="#FCD34D" opacity="0.9" />
                <circle cx="15" cy="95" r="10" fill="#FACC15" opacity="0.8" />
                
                {/* Leaves - silvery green */}
                <ellipse cx="-45" cy="-5" rx="20" ry="8" fill="#9CA3AF" opacity="0.6" transform="rotate(-45 -45 -5)" />
                <ellipse cx="-70" cy="25" rx="18" ry="7" fill="#9CA3AF" opacity="0.6" transform="rotate(-30 -70 25)" />
                <ellipse cx="50" cy="30" rx="22" ry="8" fill="#9CA3AF" opacity="0.6" transform="rotate(35 50 30)" />
                <ellipse cx="75" cy="60" rx="20" ry="7" fill="#9CA3AF" opacity="0.6" transform="rotate(45 75 60)" />
                <ellipse cx="-15" cy="70" rx="18" ry="7" fill="#9CA3AF" opacity="0.6" transform="rotate(-15 -15 70)" />
                <ellipse cx="20" cy="75" rx="16" ry="6" fill="#9CA3AF" opacity="0.6" transform="rotate(20 20 75)" />
                
                {/* Additional detail blooms */}
                <circle cx="-20" cy="-60" r="8" fill="#FEF08A" opacity="0.7" />
                <circle cx="18" cy="-55" r="7" fill="#FEF08A" opacity="0.7" />
                <circle cx="-50" cy="20" r="7" fill="#FEF08A" opacity="0.7" />
                <circle cx="55" cy="50" r="8" fill="#FEF08A" opacity="0.7" />
            </g>
            
            {/* Decorative dots */}
            <circle cx="80" cy="100" r="3" fill="#FBBF24" opacity="0.4" />
            <circle cx="320" cy="120" r="4" fill="#FBBF24" opacity="0.4" />
            <circle cx="90" cy="300" r="3" fill="#FBBF24" opacity="0.4" />
            <circle cx="310" cy="280" r="4" fill="#FBBF24" opacity="0.4" />
        </svg>
    );
}
