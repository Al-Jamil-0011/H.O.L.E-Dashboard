

export interface ILoginPayload {
    email: string;
    password: string;
    remember?: boolean;
}

export interface IForgotPasswordPayload {
    email: string;
}

export interface IVerifyOtpPayload {
    email?: string;
    otp: string;
}

export interface IResetPasswordPayload {
    email?: string;
    newPassword: string;
    confirmPassword: string;
}