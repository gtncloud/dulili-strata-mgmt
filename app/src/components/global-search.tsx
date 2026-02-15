"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, FileText, Wrench, Megaphone, User, X, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SearchResult {
    id: string;
    type: "document" | "maintenance" | "announcement" | "member" | "amenity";
    title: string;
    description?: string;
    url: string;
}

export function GlobalSearch() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const searchTimeout = setTimeout(async () => {
            if (query.length < 2) {
                setResults([]);
                return;
            }

            setLoading(true);
            try {
                const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                const data = await response.json();
                setResults(data.results || []);
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(searchTimeout);
    }, [query]);

    const getIcon = (type: string) => {
        switch (type) {
            case "document":
                return <FileText className="h-4 w-4 text-indigo-600" />;
            case "maintenance":
                return <Wrench className="h-4 w-4 text-amber-600" />;
            case "announcement":
                return <Megaphone className="h-4 w-4 text-purple-600" />;
            case "member":
                return <User className="h-4 w-4 text-blue-600" />;
            case "amenity":
                return <Sparkles className="h-4 w-4 text-amber-600" />;
            default:
                return <Search className="h-4 w-4" />;
        }
    };

    const getTypeLabel = (type: string) => {
        return type.charAt(0).toUpperCase() + type.slice(1);
    };

    const handleResultClick = (url: string) => {
        setOpen(false);
        setQuery("");
        router.push(url);
    };

    return (
        <div className="relative w-full max-w-md">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                    type="text"
                    placeholder="Search documents, maintenance, amenities..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setOpen(true);
                    }}
                    onFocus={() => setOpen(true)}
                    className="pl-10 pr-10 h-10 bg-white border-slate-200"
                />
                {query && (
                    <button
                        onClick={() => {
                            setQuery("");
                            setResults([]);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Results Dropdown */}
            {open && query.length >= 2 && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setOpen(false)}
                    />
                    <Card className="absolute top-full mt-2 w-full max-h-96 overflow-auto z-50 shadow-lg border-slate-200">
                        {loading ? (
                            <div className="p-8 text-center">
                                <Loader2 className="h-6 w-6 animate-spin mx-auto text-slate-400" />
                                <p className="text-sm text-slate-500 mt-2">Searching...</p>
                            </div>
                        ) : results.length === 0 ? (
                            <div className="p-8 text-center">
                                <Search className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                                <p className="text-sm text-slate-600">No results found</p>
                                <p className="text-xs text-slate-400 mt-1">Try a different search term</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {results.map((result) => (
                                    <button
                                        key={result.id}
                                        onClick={() => handleResultClick(result.url)}
                                        className="w-full p-3 hover:bg-slate-50 transition-colors text-left flex items-start gap-3"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            {getIcon(result.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="text-sm font-medium text-slate-900 truncate">
                                                    {result.title}
                                                </h4>
                                                <Badge variant="outline" className="text-xs">
                                                    {getTypeLabel(result.type)}
                                                </Badge>
                                            </div>
                                            {result.description && (
                                                <p className="text-xs text-slate-500 line-clamp-1">
                                                    {result.description}
                                                </p>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </Card>
                </>
            )}
        </div>
    );
}
