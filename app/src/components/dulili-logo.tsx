// Dulili Logo Components
// Dulili means "to build" in Aboriginal Australian language
// Boomerang design: Represents connection, return, and coming together

export function DuliliIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Simple boomerang shape */}
            <path
                d="M 30 50 Q 35 30, 50 25 L 50 35 Q 40 38, 35 50 Z"
                fill="#8B4513"
            />
            <path
                d="M 50 25 Q 65 30, 70 50 L 65 50 Q 60 38, 50 35 Z"
                fill="#8B4513"
            />
            
            {/* Dots on boomerang - Aboriginal style */}
            <circle cx="42" cy="35" r="2" fill="#F5E6D3" />
            <circle cx="45" cy="40" r="1.5" fill="#F5E6D3" />
            <circle cx="58" cy="35" r="2" fill="#F5E6D3" />
            <circle cx="55" cy="40" r="1.5" fill="#F5E6D3" />
        </svg>
    );
}

export function DuliliLogo({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Cream background circle */}
            <circle cx="100" cy="100" r="95" fill="#F5E6D3" />
            
            {/* Boomerang at top */}
            <g transform="translate(100, 30)">
                <path
                    d="M -20 0 Q -10 -15, 0 -18 L 0 -10 Q -8 -8, -15 0 Z"
                    fill="#8B4513"
                />
                <path
                    d="M 0 -18 Q 10 -15, 20 0 L 15 0 Q 8 -8, 0 -10 Z"
                    fill="#8B4513"
                />
                <circle cx="-10" cy="-10" r="1.5" fill="#F5E6D3" />
                <circle cx="-7" cy="-6" r="1" fill="#F5E6D3" />
                <circle cx="10" cy="-10" r="1.5" fill="#F5E6D3" />
                <circle cx="7" cy="-6" r="1" fill="#F5E6D3" />
            </g>
            
            {/* Circle of 7 diverse people */}
            {/* Person 1 - Top center */}
            <circle cx="100" cy="70" r="8" fill="#6B4423" />
            <path d="M 100 78 L 90 95 L 110 95 Z" fill="#4A5568" />
            
            {/* Person 2 - Top right */}
            <circle cx="130" cy="85" r="8" fill="#C19A6B" />
            <path d="M 130 93 L 120 110 L 140 110 Z" fill="#DC2626" />
            
            {/* Person 3 - Right */}
            <circle cx="145" cy="110" r="8" fill="#D4A574" />
            <path d="M 145 118 L 135 135 L 155 135 Z" fill="#B8860B" />
            
            {/* Person 4 - Bottom right */}
            <circle cx="130" cy="135" r="8" fill="#E8B796" />
            <path d="M 130 143 L 120 160 L 140 160 Z" fill="#1E3A8A" />
            
            {/* Person 5 - Bottom center */}
            <circle cx="100" cy="145" r="8" fill="#8B6F47" />
            <path d="M 100 153 L 90 170 L 110 170 Z" fill="#047857" />
            
            {/* Person 6 - Bottom left */}
            <circle cx="70" cy="135" r="8" fill="#5D4037" />
            <path d="M 70 143 L 60 160 L 80 160 Z" fill="#DC2626" />
            
            {/* Person 7 - Left */}
            <circle cx="55" cy="110" r="8" fill="#A0826D" />
            <path d="M 55 118 L 45 135 L 65 135 Z" fill="#1E3A8A" />
            
            {/* Connection lines between people */}
            <path d="M 100 78 L 130 93" stroke="#8B4513" strokeWidth="1.5" opacity="0.4" />
            <path d="M 130 93 L 145 118" stroke="#8B4513" strokeWidth="1.5" opacity="0.4" />
            <path d="M 145 118 L 130 143" stroke="#8B4513" strokeWidth="1.5" opacity="0.4" />
            <path d="M 130 143 L 100 153" stroke="#8B4513" strokeWidth="1.5" opacity="0.4" />
            <path d="M 100 153 L 70 143" stroke="#8B4513" strokeWidth="1.5" opacity="0.4" />
            <path d="M 70 143 L 55 118" stroke="#8B4513" strokeWidth="1.5" opacity="0.4" />
            <path d="M 55 118 L 100 78" stroke="#8B4513" strokeWidth="1.5" opacity="0.4" />
            
            {/* Cross connections */}
            <path d="M 100 78 L 145 118" stroke="#8B4513" strokeWidth="1" opacity="0.3" />
            <path d="M 130 93 L 100 153" stroke="#8B4513" strokeWidth="1" opacity="0.3" />
            <path d="M 145 118 L 70 143" stroke="#8B4513" strokeWidth="1" opacity="0.3" />
            <path d="M 130 143 L 55 118" stroke="#8B4513" strokeWidth="1" opacity="0.3" />
            
            {/* Aboriginal art pattern at bottom */}
            <g transform="translate(100, 180)">
                {/* Wavy lines */}
                <path
                    d="M -40 0 Q -30 -3, -20 0 Q -10 3, 0 0 Q 10 -3, 20 0 Q 30 3, 40 0"
                    stroke="#8B4513"
                    strokeWidth="1.5"
                    fill="none"
                />
                <path
                    d="M -40 5 Q -30 2, -20 5 Q -10 8, 0 5 Q 10 2, 20 5 Q 30 8, 40 5"
                    stroke="#8B4513"
                    strokeWidth="1.5"
                    fill="none"
                />
                
                {/* Dots */}
                <circle cx="-35" cy="2.5" r="1" fill="#8B4513" />
                <circle cx="-25" cy="2.5" r="1" fill="#8B4513" />
                <circle cx="-15" cy="2.5" r="1" fill="#8B4513" />
                <circle cx="-5" cy="2.5" r="1" fill="#8B4513" />
                <circle cx="5" cy="2.5" r="1" fill="#8B4513" />
                <circle cx="15" cy="2.5" r="1" fill="#8B4513" />
                <circle cx="25" cy="2.5" r="1" fill="#8B4513" />
                <circle cx="35" cy="2.5" r="1" fill="#8B4513" />
                
                {/* Aboriginal symbols */}
                <circle cx="-15" cy="12" r="3" stroke="#8B4513" strokeWidth="1" fill="none" />
                <path d="M -15 9 L -15 15 M -18 12 L -12 12" stroke="#8B4513" strokeWidth="1" />
                
                <circle cx="15" cy="12" r="3" stroke="#8B4513" strokeWidth="1" fill="none" />
                <circle cx="15" cy="12" r="1.5" fill="#8B4513" />
            </g>
            
            {/* Outer circle border */}
            <circle cx="100" cy="100" r="95" stroke="#C19A6B" strokeWidth="2" fill="none" />
        </svg>
    );
}
