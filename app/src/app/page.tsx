
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building, Users, ShieldCheck, Zap, LayoutDashboard, MessageSquare } from "lucide-react";
import { DuliliIcon } from "@/components/dulili-logo";
import { WattleIllustration } from "@/components/wattle-illustration";

export default function Home() {
    return (
        <div className="flex min-h-screen flex-col bg-white">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
                <div className="container px-4 lg:px-6 h-14 flex items-center mx-auto max-w-7xl">
                    <Link className="flex items-center gap-2.5" href="/">
                        <div className="flex items-center justify-center w-7 h-7 text-amber-500">
                            <DuliliIcon className="h-7 w-7" />
                        </div>
                        <span className="font-semibold text-sm text-gray-900">Dulili</span>
                    </Link>
                    <nav className="ml-auto flex items-center gap-6">
                        <Link className="text-[13px] font-medium text-gray-600 hover:text-gray-900 transition-colors" href="#features">
                            Features
                        </Link>
                        <Link className="text-[13px] font-medium text-gray-600 hover:text-gray-900 transition-colors" href="/auth/login">
                            Login
                        </Link>
                        <Link href="/auth/register">
                            <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white h-8 px-3 text-[13px]">
                                Get Started
                            </Button>
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="w-full py-20 md:py-28 bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 relative overflow-hidden">
                    {/* Background Illustration */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-20">
                        <WattleIllustration className="w-full max-w-4xl h-auto" />
                    </div>
                    
                    <div className="container px-4 md:px-6 mx-auto max-w-7xl relative z-10">
                        <div className="flex flex-col items-center text-center space-y-6">
                            <div className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                                <span className="flex h-1.5 w-1.5 rounded-full bg-amber-600 mr-2"></span>
                                Modern Strata Management Platform
                            </div>
                            
                            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl max-w-4xl text-gray-900">
                                Smart Living for Modern Communities
                            </h1>
                            
                            <p className="max-w-2xl text-gray-700 text-base leading-relaxed">
                                Connect owners, residents, and managers in one seamless platform. Streamline maintenance, finances, and communication for your strata scheme.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-3 pt-3">
                                <Link href="/auth/register">
                                    <Button size="lg" className="h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white text-[13px]">
                                        Get Started <ArrowRight className="ml-2 h-3.5 w-3.5" />
                                    </Button>
                                </Link>
                                <Link href="/auth/login">
                                    <Button size="lg" variant="outline" className="h-10 px-6 border-slate-300 text-slate-700 hover:bg-slate-100 text-[13px]">
                                        Sign In
                                    </Button>
                                </Link>
                            </div>

                            {/* Dashboard Preview */}
                            <div className="mt-12 w-full max-w-5xl mx-auto">
                                <div className="rounded-xl bg-white shadow-xl border border-slate-200 overflow-hidden">
                                    <div className="flex items-center border-b border-slate-200 px-4 py-2.5 bg-slate-50">
                                        <div className="flex space-x-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                                            <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                                            <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                                        </div>
                                        <div className="mx-auto text-xs text-slate-500 font-medium">Dashboard</div>
                                    </div>
                                    <div className="p-6 grid grid-cols-4 gap-5 bg-slate-50 h-[350px]">
                                        <div className="col-span-1 space-y-2.5">
                                            <div className="h-7 w-3/4 bg-slate-200 rounded"></div>
                                            <div className="h-3 w-full bg-slate-100 rounded"></div>
                                            <div className="h-3 w-full bg-slate-100 rounded"></div>
                                            <div className="h-3 w-5/6 bg-slate-100 rounded"></div>
                                        </div>
                                        <div className="col-span-3 grid grid-cols-2 gap-3">
                                            <div className="h-28 bg-blue-50 rounded-lg border border-blue-100 p-3">
                                                <div className="h-7 w-7 bg-blue-600 rounded-lg mb-2"></div>
                                                <div className="h-3 w-1/2 bg-blue-100 rounded"></div>
                                            </div>
                                            <div className="h-28 bg-emerald-50 rounded-lg border border-emerald-100 p-3">
                                                <div className="h-7 w-7 bg-emerald-600 rounded-lg mb-2"></div>
                                                <div className="h-3 w-1/2 bg-emerald-100 rounded"></div>
                                            </div>
                                            <div className="col-span-2 h-40 bg-white rounded-lg border border-slate-200 shadow-sm p-3">
                                                <div className="h-5 w-1/3 bg-slate-100 rounded mb-3"></div>
                                                <div className="space-y-2">
                                                    <div className="h-10 w-full bg-slate-50 rounded border border-slate-100"></div>
                                                    <div className="h-10 w-full bg-slate-50 rounded border border-slate-100"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="w-full py-20 bg-white">
                    <div className="container px-4 md:px-6 mx-auto max-w-7xl">
                        <div className="text-center mb-14 space-y-3">
                            <h2 className="text-2xl font-bold tracking-tight md:text-3xl text-slate-900">
                                Everything you need to manage your strata
                            </h2>
                            <p className="text-base text-slate-600 max-w-2xl mx-auto">
                                A complete suite of tools built to make strata management effortless and transparent.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Feature 1 */}
                            <div className="rounded-lg p-5 border border-slate-200 bg-white hover:shadow-lg transition-shadow">
                                <div className="p-2.5 bg-blue-100 w-fit rounded-lg mb-3">
                                    <LayoutDashboard className="w-5 h-5 text-blue-600" />
                                </div>
                                <h3 className="text-base font-semibold mb-2 text-slate-900">Centralized Dashboard</h3>
                                <p className="text-[13px] text-slate-600 leading-relaxed">Monitor financials, maintenance requests, and community announcements from a single, intuitive dashboard.</p>
                            </div>

                            {/* Feature 2 */}
                            <div className="rounded-lg p-5 border border-slate-200 bg-white hover:shadow-lg transition-shadow">
                                <div className="p-2.5 bg-emerald-100 w-fit rounded-lg mb-3">
                                    <Zap className="w-5 h-5 text-emerald-600" />
                                </div>
                                <h3 className="text-base font-semibold mb-2 text-slate-900">Instant Maintenance</h3>
                                <p className="text-[13px] text-slate-600 leading-relaxed">Log requests in seconds, track progress in real-time, and ensure thorough resolution tracking.</p>
                            </div>

                            {/* Feature 3 */}
                            <div className="rounded-lg p-5 border border-slate-200 bg-white hover:shadow-lg transition-shadow">
                                <div className="p-2.5 bg-rose-100 w-fit rounded-lg mb-3">
                                    <ShieldCheck className="w-5 h-5 text-rose-600" />
                                </div>
                                <h3 className="text-base font-semibold mb-2 text-slate-900">Secure & Compliant</h3>
                                <p className="text-[13px] text-slate-600 leading-relaxed">Enterprise-grade security for your data. Fully compliant with Australian Strata legislation.</p>
                            </div>

                            {/* Feature 4 */}
                            <div className="rounded-lg p-5 border border-slate-200 bg-white hover:shadow-lg transition-shadow">
                                <div className="p-2.5 bg-purple-100 w-fit rounded-lg mb-3">
                                    <Users className="w-5 h-5 text-purple-600" />
                                </div>
                                <h3 className="text-base font-semibold mb-2 text-slate-900">Community First</h3>
                                <p className="text-[13px] text-slate-600 leading-relaxed">Foster a connected community with built-in messaging, event planning, and transparent document sharing.</p>
                            </div>

                            {/* Feature 5 */}
                            <div className="rounded-lg p-5 border border-slate-200 bg-white hover:shadow-lg transition-shadow">
                                <div className="p-2.5 bg-amber-100 w-fit rounded-lg mb-3">
                                    <MessageSquare className="w-5 h-5 text-amber-600" />
                                </div>
                                <h3 className="text-base font-semibold mb-2 text-slate-900">Real-time Updates</h3>
                                <p className="text-[13px] text-slate-600 leading-relaxed">Stay informed with instant notifications for maintenance updates, announcements, and important documents.</p>
                            </div>

                            {/* Feature 6 */}
                            <div className="rounded-lg p-5 border border-slate-200 bg-white hover:shadow-lg transition-shadow">
                                <div className="p-2.5 bg-indigo-100 w-fit rounded-lg mb-3">
                                    <Building className="w-5 h-5 text-indigo-600" />
                                </div>
                                <h3 className="text-base font-semibold mb-2 text-slate-900">Building Management</h3>
                                <p className="text-[13px] text-slate-600 leading-relaxed">Complete building profile management with lot tracking, member directories, and financial oversight.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="py-20 bg-amber-600 text-white">
                    <div className="container px-4 md:px-6 mx-auto max-w-7xl text-center">
                        <h2 className="text-2xl font-bold tracking-tight md:text-3xl mb-5">
                            Ready to modernize your strata management?
                        </h2>
                        <p className="text-slate-300 mb-7 max-w-2xl mx-auto text-base">
                            Join strata schemes across Australia using Wattle to streamline their operations.
                        </p>
                        <Link href="/auth/register">
                            <Button size="lg" className="h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white text-[13px]">
                                Get Started Now
                            </Button>
                        </Link>
                    </div>
                </section>
            </main>

            <footer className="w-full py-6 border-t border-slate-200 bg-white">
                <div className="container px-4 md:px-6 mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                        <div className="flex items-center justify-center w-5 h-5 text-amber-500">
                            <DuliliIcon className="h-5 w-5" />
                        </div>
                        <p className="text-xs font-medium text-slate-700">
                            Dulili © 2026
                        </p>
                    </div>
                    <nav className="flex gap-5">
                        <Link className="text-xs text-slate-600 hover:text-slate-900 transition-colors" href="#">
                            Terms
                        </Link>
                        <Link className="text-xs text-slate-600 hover:text-slate-900 transition-colors" href="#">
                            Privacy
                        </Link>
                        <Link className="text-xs text-slate-600 hover:text-slate-900 transition-colors" href="#">
                            Contact
                        </Link>
                    </nav>
                </div>
            </footer>
        </div>
    );
}
