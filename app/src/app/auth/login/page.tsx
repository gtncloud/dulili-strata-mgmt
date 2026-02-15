
"use client";

import { useActionState } from "react";
import { login } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { DuliliLogo } from "@/components/dulili-logo";
import { DuliliIllustration } from "@/components/dulili-illustration";

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(login, undefined);

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Left side - Illustration */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 items-center justify-center p-12">
                <div className="max-w-md space-y-8">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <DuliliLogo className="h-12 w-12" />
                            <h1 className="text-3xl font-bold text-gray-900">Dulili</h1>
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                            Modern Strata Management
                        </h2>
                        <p className="text-gray-600 text-base leading-relaxed">
                            Connect owners, residents, and managers in one seamless platform. 
                            Streamline maintenance, finances, and community communications.
                        </p>
                    </div>
                    <div className="relative">
                        <DuliliIllustration className="w-full h-auto" />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <svg className="h-5 w-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Australian Made</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="h-5 w-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Secure & Compliant</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side - Login form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <Card className="w-full max-w-md border-gray-200 shadow-sm">
                    <CardHeader className="space-y-1">
                        <div className="flex items-center gap-3 mb-4 lg:hidden">
                            <DuliliLogo className="h-10 w-10" />
                            <span className="text-xl font-bold text-gray-900">Dulili</span>
                        </div>
                        <CardTitle className="text-xl font-semibold text-gray-900">Welcome back</CardTitle>
                        <CardDescription className="text-gray-600 text-sm">Sign in to your account</CardDescription>
                    </CardHeader>
                    <form action={formAction}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-gray-700 font-medium text-sm">Email</Label>
                                <Input 
                                    id="email" 
                                    name="email" 
                                    type="email" 
                                    placeholder="john@example.com" 
                                    required 
                                    className="h-10 text-sm"
                                />
                                {state?.errors?.email && <p className="text-xs text-rose-600">{state.errors.email}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-gray-700 font-medium text-sm">Password</Label>
                                <Input 
                                    id="password" 
                                    name="password" 
                                    type="password" 
                                    required 
                                    className="h-10 text-sm"
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4">
                            <Button 
                                className="w-full h-10 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium" 
                                type="submit" 
                                disabled={isPending}
                            >
                                {isPending ? "Logging in..." : "Log In"}
                            </Button>
                            <div className="text-center text-sm text-gray-600">
                                Don&apos;t have an account?{" "}
                                <Link href="/auth/register" className="font-semibold text-amber-600 hover:text-amber-700">
                                    Sign up
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
}
