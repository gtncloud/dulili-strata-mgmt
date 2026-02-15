"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Loader2 } from "lucide-react";
import { sendMessage } from "./actions";
import { formatDistanceToNow } from "date-fns";

interface Message {
    id: string;
    content: string;
    createdAt: Date;
    user: {
        id: string;
        name: string;
        role: string;
    };
}

interface Member {
    id: string;
    name: string;
    role: string;
}

interface ChatInterfaceProps {
    channelId: string;
    userId: string;
    initialMessages: Message[];
    members: Member[];
}

export default function ChatInterface({
    channelId,
    userId,
    initialMessages,
    members,
}: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [newMessage, setNewMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Auto-refresh messages every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            window.location.reload();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || isSending) return;

        setIsSending(true);
        const content = newMessage.trim();
        setNewMessage("");

        try {
            const result = await sendMessage(channelId, userId, content);
            if (result.success && result.message) {
                setMessages((prev) => [...prev, result.message as Message]);
                scrollToBottom();
            }
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend(e);
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case "manager":
                return "bg-amber-100 text-amber-700";
            case "committee":
                return "bg-purple-100 text-purple-700";
            case "owner":
                return "bg-blue-100 text-blue-700";
            case "tenant":
                return "bg-gray-100 text-gray-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="flex flex-col flex-1 min-h-0">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-sm">No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((message) => {
                        const isOwnMessage = message.user.id === userId;
                        return (
                            <div
                                key={message.id}
                                className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                            >
                                <div className={`max-w-[70%] ${isOwnMessage ? "items-end" : "items-start"} flex flex-col gap-1`}>
                                    {!isOwnMessage && (
                                        <div className="flex items-center gap-2 px-3">
                                            <span className="text-xs font-medium text-gray-900">
                                                {message.user.name}
                                            </span>
                                            <span
                                                className={`px-1.5 py-0.5 text-[10px] font-medium rounded ${getRoleBadgeColor(
                                                    message.user.role
                                                )}`}
                                            >
                                                {message.user.role}
                                            </span>
                                        </div>
                                    )}
                                    <div
                                        className={`px-4 py-2 rounded-lg ${
                                            isOwnMessage
                                                ? "bg-amber-500 text-white"
                                                : "bg-gray-100 text-gray-900"
                                        }`}
                                    >
                                        <p className="text-sm whitespace-pre-wrap break-words">
                                            {message.content}
                                        </p>
                                    </div>
                                    <span className="text-[10px] text-gray-500 px-3">
                                        {formatDistanceToNow(new Date(message.createdAt), {
                                            addSuffix: true,
                                        })}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSend} className="border-t border-gray-200 pt-4">
                <div className="flex gap-2">
                    <textarea
                        ref={textareaRef}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
                        rows={1}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm resize-none"
                        disabled={isSending}
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || isSending}
                        className="px-4 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                        {isSending ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <Send className="h-5 w-5" />
                        )}
                    </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    Messages refresh automatically every 5 seconds
                </p>
            </form>
        </div>
    );
}
