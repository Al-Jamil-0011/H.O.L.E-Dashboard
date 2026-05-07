'use client'
import Link from "next/link";
import { MoveRight, Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthService } from "@/hooks/auth";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import FormField from "@/components/form";
import { VscLoading } from "react-icons/vsc";

export default function LoginPage() {
    const router = useRouter();
    const { login, loading, error: authError } = useAuthService();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const handleLogin = async (data: any) => {
        try {
            const res = await login({ email: data.email, password: data.password });
            console.log("response : ", res);
            if (res?.statusCode === 200) {
                const token = res?.data?.accessToken;
                console.log("response : ", res?.data?.accessToken);
                if (token) {
                    Cookies.set("token", token, {
                        expires: data.remember ? 7 : undefined,
                        secure: true,
                        sameSite: "strict",
                    });
                }
                router.push("/admin/dashboard");
            }
        } catch (error) {
            console.log(error);
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

                    <form className="space-y-6" onSubmit={handleSubmit(handleLogin)}>
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
                                <Link href="#" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex items-center justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-foreground bg-accent-teal text-black! hover:bg-accent-teal/80 dark:bg-white dark:text-black dark:hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 dark:focus:ring-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg cursor-pointer"
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

