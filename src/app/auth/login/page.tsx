'use client'
import Link from "next/link";
import { MoveRight, Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthService } from "@/hooks/auth";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import FormField from "@/components/form";
import { VscLoading } from "react-icons/vsc";
import toast from "react-hot-toast";

export default function LoginPage() {
    const router = useRouter();
    const { login, loading, error: authError } = useAuthService();
    const { register, handleSubmit, formState: { errors } } = useForm();

    // console.log("authError : ", authError);

    const handleLogin = async (data: any) => {
        try {
            const res = await login({ email: data.email, password: data.password });
            const userData = res?.data?.results;
            if (res?.statusCode === 200) {
                const token = res?.data?.accessToken;
                if (token) {
                    Cookies.set("token", token, {
                        expires: data.remember ? 7 : undefined,
                        secure: true,
                        sameSite: "strict",
                    });
                }

                toast.success("Logged in Successfully.", {
                    position: "top-center"
                });

                // Redirect by role
                if (userData?.role === "admin") {
                    router.push("/admin/dashboard");
                } else if (userData?.role === "finance") {
                    router.push("/admin/finance");
                }
            }
        } catch (error: any) {
            console.log(error)
        }
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

                    {authError && (
                        <div className="p-3 mb-2 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-start animate-in fade-in slide-in-from-top-2">
                            <div className="flex-shrink-0 mt-0.5">
                                <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                                    Authentication Failed
                                </h3>
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400 opacity-90">
                                    {authError}
                                </p>
                            </div>
                        </div>
                    )}


                    <form className="space-y-6 mt-2" onSubmit={handleSubmit(handleLogin)}>
                        <div>
                            {/* Email Input */}
                            <FormField
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                icon={<Mail className="h-5 w-5" />}
                                register={register}
                                errors={errors}
                                validation={{
                                    required: "Email is required",
                                    pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email format" }
                                }}
                            />

                            {/* Password Input */}
                            <FormField
                                type="password"
                                name="password"
                                placeholder="Password"
                                icon={<Lock className="h-5 w-5" />}
                                register={register}
                                errors={errors}
                                validation={{ required: "Password is required" }}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <FormField
                                    type="checkbox"
                                    name="remember"
                                    placeholder="Remember me"
                                    register={register}
                                    errors={errors}
                                />
                            </div>

                            <div className="text-sm pb-5">
                                <Link href="/auth/forget-password" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex items-center justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-foreground bg-primary text-black! hover:bg-primary/80 dark:bg-white dark:text-black dark:hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 dark:focus:ring-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg cursor-pointer"
                            >
                                {loading ? (
                                    <>
                                        <VscLoading className="mr-2 h-5 w-5 animate-spin" />
                                        Please wait...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <MoveRight className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center text-sm text-muted-foreground dark:text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <Link href="#" className="font-semibold text-gray-900 dark:text-foreground hover:underline transition-all">
                            Contact Admin
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

