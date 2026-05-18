'use client'
import { MoveRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthService } from "@/hooks/auth";
import { useForm } from "react-hook-form";
import { VscLoading } from "react-icons/vsc";
import { useRef, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { customToast } from "@/lib/utils";

export default function OtpVerificationPage() {
    const router = useRouter();
    const { verifyOtp, loading, error: authError, resendOtp } = useAuthService();
    const [userMail, setUserMail] = useState<string>("");
    const [resending, setResending] = useState<boolean>(false);
    const [fieldError, setFieldError] = useState<string>("");

    const token = Cookies.get("token");

    // Initialize Form with reset
    const { register, handleSubmit, setValue, watch, reset } = useForm({
        defaultValues: {
            otp: ["", "", "", "", "", ""]
        }
    });

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const otpValues = watch("otp");

    useEffect(() => {
        const mail = localStorage.getItem("email");
        if (mail) {
            setUserMail(mail);
        }
    }, []);

    useEffect(() => {
        if (fieldError) setFieldError("");
    }, [otpValues.join("")]);

    const handleOtpChange = (value: string, index: number) => {
        const lastChar = value.slice(-1);
        if (!/^\d?$/.test(lastChar)) return;

        setValue(`otp.${index}`, lastChar);

        if (lastChar && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !otpValues[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const onSubmit = async (data: any) => {
        const otpString = data.otp.join("");

        if (!token) {
            setFieldError("Token not found");
            return;
        }

        if (otpString.length < 6) {
            setFieldError("Please enter all 6 digits of the verification code.");
            return;
        }

        try {
            const res = await verifyOtp({ otp: otpString });
            if (res?.statusCode === 200 || res?.statusCode === 201) {
                customToast.success(res?.message || "Verification successful!");

                const finalToken = res?.data?.token;
                if (finalToken) {
                    Cookies.set("token", finalToken, {
                        expires: 1,
                        secure: true,
                        sameSite: "strict",
                    });
                }

                router.push("/auth/reset-password");
            }
        } catch (error: any) {
            console.error(error);
        }
    };

    const handleResendOtp = async () => {
        if (!userMail) {
            customToast.error("Email not found");
            return;
        }

        setResending(true);

        // clear local field error
        setFieldError("");

        try {
            Cookies.remove("token");

            const res = await resendOtp({ email: userMail });

            if (res?.statusCode === 200 || res?.statusCode === 201) {
                customToast.success("Otp resend successfully!");

                // reset form inputs
                reset({ otp: ["", "", "", "", "", ""] });

                // focus first input
                inputRefs.current[0]?.focus();

                const finalToken = res?.data?.token;

                if (finalToken) {
                    Cookies.set("token", finalToken, {
                        expires: 7,
                        secure: true,
                        sameSite: "strict",
                    });
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setResending(false);
        }
    };

    const displayError = fieldError || authError;

    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden font-sans w-full">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[120px] animate-pulse delay-700"></div>

            <div className="relative z-10 w-full max-w-md mx-auto p-4 md:p-0">
                <div className="backdrop-blur-xl bg-card/70 border border-border rounded-3xl dark:shadow-sm p-8 overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-80"></div>

                    <div className="text-center mb-8">
                        <h1 className="text-3xl text-muted-foreground font-bold mb-2 tracking-tight">Enter verification code</h1>
                        <p className="text-sm text-muted-foreground">
                            We’ve sent a verification code to <span className="text-primary font-semibold">{userMail || "your email"}</span>.
                        </p>
                    </div>

                    <form className="space-y-6 mt-2" onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex justify-between gap-2 md:gap-3">
                            {Array.from({ length: 6 }).map((_, index) => {
                                const {
                                    ref,
                                    ...rest
                                } = register(`otp.${index}`);

                                return (
                                    <input
                                        key={index}
                                        {...rest}
                                        ref={(el) => {
                                            ref(el);
                                            inputRefs.current[index] = el;
                                        }}
                                        type="text"
                                        maxLength={1}
                                        inputMode="numeric"
                                        value={otpValues[index] || ""}
                                        className={`w-12 h-14 text-center border border-gray-200 rounded-xl bg-white/10 dark:bg-white/5 transition-all duration-300 sm:text-lg font-bold text-foreground focus:outline-none focus:ring-2 ${displayError ? "border-red-500 focus:ring-red-500/20" : "dark:border-gray-500 focus:border-primary focus:ring-primary/20"}`}
                                        onChange={(e) => handleOtpChange(e.target.value, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                    />
                                );
                            })}
                        </div>

                        {displayError && (
                            <div className="p-3 mb-2 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 flex items-start">
                                <p className="text-sm text-red-600 dark:text-red-400">{displayError}</p>
                            </div>
                        )}

                        <div className="flex gap-3 items-center justify-between">
                            <span className="text-sm text-muted-foreground">Didn&apos;t receive a code?</span>
                            <button
                                type="button"
                                onClick={handleResendOtp}
                                disabled={resending || loading}
                                className="flex items-center cursor-pointer font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors text-sm!"
                            >
                                {resending ? <VscLoading className="mr-2 h-4 w-4 animate-spin text-primary" /> : null}
                                {resending ? "Sending..." : "Resend Code"}
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || resending}
                            className="group relative w-full flex items-center justify-center py-3 px-4 text-sm font-medium rounded-xl text-foreground bg-primary! text-white dark:text-black! hover:!bg-primary/80 dark:bg-white dark:text-black dark:hover:bg-gray-100 focus:outline-none  duration-300 transform dark:shadow-md cursor-pointer"
                        >
                            {loading ? (
                                <>
                                    <VscLoading className="mr-2 h-5 w-5 animate-spin" /> Processing...
                                </>
                            ) : (
                                <>
                                    <span className="mr-2">Verify Code</span>
                                    <MoveRight className="h-4 w-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}