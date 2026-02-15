// Dulili Illustration - Clean, Modern Design
// Based on the official Dulili brand image
// Shows diverse community united in a circle with Aboriginal art elements

export function DuliliIllustration({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 400 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Soft cream background */}
            <rect width="400" height="400" fill="#F5E6D3" />
            
            {/* Decorative soft circles */}
            <circle cx="80" cy="80" r="40" fill="#FFF8E7" opacity="0.6" />
            <circle cx="350" cy="120" r="50" fill="#FFF8E7" opacity="0.6" />
            
            {/* Main circle container */}
            <circle cx="200" cy="200" r="140" stroke="#C19A6B" strokeWidth="2" fill="none" />
            
            {/* Boomerang at top */}
            <g transform="translate(200, 80)">
                <path
                    d="M -25 0 Q -12 -18, 0 -22 L 0 -12 Q -10 -10, -18 0 Z"
                    fill="#8B4513"
                />
                <path
                    d="M 0 -22 Q 12 -18, 25 0 L 18 0 Q 10 -10, 0 -12 Z"
                    fill="#8B4513"
                />
                <circle cx="-12" cy="-12" r="2" fill="#F5E6D3" />
                <circle cx="-8" cy="-8" r="1.5" fill="#F5E6D3" />
                <circle cx="12" cy="-12" r="2" fill="#F5E6D3" />
                <circle cx="8" cy="-8" r="1.5" fill="#F5E6D3" />
            </g>
            
            {/* Text: DULILI */}
            <text x="200" y="120" textAnchor="middle" fill="#8B4513" fontSize="32" fontWeight="700" letterSpacing="4">
                DULILI
            </text>
            
            {/* Text: TOGETHER, UNITED, CONNECTED */}
            <text x="200" y="140" textAnchor="middle" fill="#A0826D" fontSize="11" fontWeight="500" letterSpacing="2">
                TOGETHER, UNITED, CONNECTED
            </text>
            
            {/* Circle of 7 diverse people */}
            
            {/* Person 1 - Top center */}
            <circle cx="200" cy="170" r="12" fill="#6B4423" />
            <path d="M 200 182 L 188 205 L 212 205 Z" fill="#4A5568" />
            
            {/* Person 2 - Top right */}
            <circle cx="250" cy="190" r="12" fill="#C19A6B" />
            <path d="M 250 202 L 238 225 L 262 225 Z" fill="#DC2626" />
            
            {/* Person 3 - Right */}
            <circle cx="275" cy="230" r="12" fill="#D4A574" />
            <path d="M 275 242 L 263 265 L 287 265 Z" fill="#B8860B" />
            
            {/* Person 4 - Bottom right */}
            <circle cx="250" cy="270" r="12" fill="#E8B796" />
            <path d="M 250 282 L 238 305 L 262 305 Z" fill="#1E3A8A" />
            
            {/* Person 5 - Bottom center */}
            <circle cx="200" cy="285" r="12" fill="#8B6F47" />
            <path d="M 200 297 L 188 320 L 212 320 Z" fill="#047857" />
            
            {/* Person 6 - Bottom left */}
            <circle cx="150" cy="270" r="12" fill="#5D4037" />
            <path d="M 150 282 L 138 305 L 162 305 Z" fill="#DC2626" />
            
            {/* Person 7 - Left */}
            <circle cx="125" cy="230" r="12" fill="#A0826D" />
            <path d="M 125 242 L 113 265 L 137 265 Z" fill="#1E3A8A" />
            
            {/* Connection lines between people - forming web of relationships */}
            {/* Outer circle connections */}
            <path d="M 200 182 L 250 202" stroke="#8B4513" strokeWidth="2" opacity="0.3" />
            <path d="M 250 202 L 275 242" stroke="#8B4513" strokeWidth="2" opacity="0.3" />
            <path d="M 275 242 L 250 282" stroke="#8B4513" strokeWidth="2" opacity="0.3" />
            <path d="M 250 282 L 200 297" stroke="#8B4513" strokeWidth="2" opacity="0.3" />
            <path d="M 200 297 L 150 282" stroke="#8B4513" strokeWidth="2" opacity="0.3" />
            <path d="M 150 282 L 125 242" stroke="#8B4513" strokeWidth="2" opacity="0.3" />
            <path d="M 125 242 L 200 182" stroke="#8B4513" strokeWidth="2" opacity="0.3" />
            
            {/* Cross connections - showing deeper relationships */}
            <path d="M 200 182 L 275 242" stroke="#8B4513" strokeWidth="1.5" opacity="0.2" />
            <path d="M 250 202 L 200 297" stroke="#8B4513" strokeWidth="1.5" opacity="0.2" />
            <path d="M 275 242 L 150 282" stroke="#8B4513" strokeWidth="1.5" opacity="0.2" />
            <path d="M 250 282 L 125 242" stroke="#8B4513" strokeWidth="1.5" opacity="0.2" />
            <path d="M 200 182 L 200 297" stroke="#8B4513" strokeWidth="1.5" opacity="0.2" />
            <path d="M 250 202 L 150 282" stroke="#8B4513" strokeWidth="1.5" opacity="0.2" />
            
            {/* Aboriginal art pattern at bottom */}
            <g transform="translate(200, 350)">
                {/* Wavy lines - representing water/connection */}
                <path
                    d="M -60 0 Q -45 -4, -30 0 Q -15 4, 0 0 Q 15 -4, 30 0 Q 45 4, 60 0"
                    stroke="#8B4513"
                    strokeWidth="2"
                    fill="none"
                />
                <path
                    d="M -60 8 Q -45 4, -30 8 Q -15 12, 0 8 Q 15 4, 30 8 Q 45 12, 60 8"
                    stroke="#8B4513"
                    strokeWidth="2"
                    fill="none"
                />
                
                {/* Dots between lines */}
                <circle cx="-52" cy="4" r="1.5" fill="#8B4513" />
                <circle cx="-37" cy="4" r="1.5" fill="#8B4513" />
                <circle cx="-22" cy="4" r="1.5" fill="#8B4513" />
                <circle cx="-7" cy="4" r="1.5" fill="#8B4513" />
                <circle cx="7" cy="4" r="1.5" fill="#8B4513" />
                <circle cx="22" cy="4" r="1.5" fill="#8B4513" />
                <circle cx="37" cy="4" r="1.5" fill="#8B4513" />
                <circle cx="52" cy="4" r="1.5" fill="#8B4513" />
                
                {/* Aboriginal symbols */}
                <g transform="translate(-25, 18)">
                    <circle cx="0" cy="0" r="5" stroke="#8B4513" strokeWidth="1.5" fill="none" />
                    <path d="M 0 -5 L 0 5 M -5 0 L 5 0" stroke="#8B4513" strokeWidth="1.5" />
                </g>
                
                <g transform="translate(25, 18)">
                    <circle cx="0" cy="0" r="5" stroke="#8B4513" strokeWidth="1.5" fill="none" />
                    <circle cx="0" cy="0" r="2.5" fill="#8B4513" />
                </g>
            </g>
        </svg>
    );
}
