"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { FileBox, LogIn, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
    const { data: session } = useSession();

    return (
        <nav className="border-b border-indigo-100/50 bg-white/70 backdrop-blur-xl sticky top-0 z-50 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-2.5 rounded-xl shadow-lg shadow-indigo-200 group-hover:shadow-indigo-300 transition-all duration-300 group-hover:scale-105">
                            <FileBox className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-extrabold bg-gradient-to-r from-indigo-700 to-violet-700 bg-clip-text text-transparent tracking-tight">
                            lightfiles
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        {session ? (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-3 text-sm font-medium text-slate-700 bg-indigo-50/50 px-4 py-2 rounded-full border border-indigo-100">
                                    {session.user?.image ? (
                                        <img
                                            src={session.user.image}
                                            alt={session.user.name || "User"}
                                            className="h-8 w-8 rounded-full border-2 border-white shadow-sm"
                                        />
                                    ) : (
                                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 border-2 border-white shadow-sm">
                                            <User className="h-4 w-4" />
                                        </div>
                                    )}
                                    <span className="hidden sm:inline-block text-indigo-900">
                                        {session.user?.name}
                                    </span>
                                </div>
                                <button
                                    onClick={() => signOut()}
                                    className="p-2.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200 hover:shadow-md"
                                    title="Sign Out"
                                >
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => signIn("google")}
                                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-full font-semibold transition-all duration-300 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 active:scale-95 active:translate-y-0"
                            >
                                <LogIn className="h-4 w-4" />
                                <span>Login with Google</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
