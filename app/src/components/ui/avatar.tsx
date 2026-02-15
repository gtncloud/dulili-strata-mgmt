
"use strict";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar"; // We need to install this or Implement custom
import { cn } from "@/lib/utils";

// Since I don't want to install more radix deps if not needed, I'll build a simple custom one
// But Shadcn uses radix. Let's install it to be safe or just use simple div for now to save time/bandwidth
// Actually standard shadcn uses radix.
// I'll implement a simple version without radix for now to avoid install errors/time

const Avatar = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
            className
        )}
        {...props}
    />
));
Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef<
    HTMLImageElement,
    React.ImgHTMLAttributes<HTMLImageElement>
>(({ className, ...props }, ref) => (
    <img
        ref={ref}
        className={cn("aspect-square h-full w-full", className)}
        {...props}
    />
));
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "flex h-full w-full items-center justify-center rounded-full bg-muted",
            className
        )}
        {...props}
    />
));
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };
