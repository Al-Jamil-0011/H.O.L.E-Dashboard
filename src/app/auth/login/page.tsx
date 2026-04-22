'use client'
import Link from "next/link";
import { MoveRight, Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const handleLogin = () => {
        router.push("/admin/dashboard");
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden font-sans w-full">
            {/* Dynamic Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 dark:bg-blue-500/10 blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 dark:bg-purple-500/10 blur-[120px] animate-pulse delay-700"></div>

            {/* Main Container Core */}
            <div className="relative z-10 w-full max-w-md mx-auto p-4 md:p-0">

                {/* Glassmorphic Card */}
                <div className="backdrop-blur-xl bg-card/70 border border-border rounded-3xl shadow-sm p-8 overflow-hidden group">

                    {/* Subtle gradient border line at top */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-80"></div>

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 mb-2 tracking-tight">
                            Welcome Back
                        </h1>
                        <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                            Enter your credentials to access your H.O.L.E account.
                        </p>
                    </div>

                    <form className="space-y-6">
                        <div className="space-y-4">
                            {/* Email Input */}
                            <div className="relative group/input">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground group-focus-within/input:text-blue-500 transition-colors">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <input
                                    type="email"
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-white/10 rounded-xl leading-5 bg-white/50 dark:bg-white/5 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 sm:text-sm text-gray-900 dark:text-gray-100"
                                    placeholder="Email Address"
                                    required
                                />
                            </div>

                            {/* Password Input */}
                            <div className="relative group/input">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground group-focus-within/input:text-blue-500 transition-colors">
                                    <Lock className="h-5 w-5" />
                                </div>
                                <input
                                    type="password"
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-white/10 rounded-xl leading-5 bg-white/50 dark:bg-white/5 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 sm:text-sm text-gray-900 dark:text-gray-100"
                                    placeholder="Password"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer transition-colors"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 dark:text-muted-foreground cursor-pointer">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <Link href="#" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        <div>
                            <button
                                onClick={handleLogin}
                                type="submit"
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-foreground bg-accent-teal text-white hover:bg-accent-teal/80 dark:bg-white dark:text-black dark:hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 dark:focus:ring-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
                            >
                                Sign In
                                <MoveRight className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center text-sm text-muted-foreground dark:text-muted-foreground">
                        Don't have an account?{" "}
                        <Link href="#" className="font-semibold text-gray-900 dark:text-foreground hover:underline transition-all">
                            Contact Admin
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

