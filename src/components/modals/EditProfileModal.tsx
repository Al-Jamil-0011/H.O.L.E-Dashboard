"use client";

import { X, Save, UploadCloud, Loader2 } from 'lucide-react';
import { useForm, FormProvider } from "react-hook-form";
import FormField from "@/components/form";
import { IUser } from '@/hooks/admin/users/interface';
import { useUpdateProfile } from '@/hooks/admin/users';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    profile: IUser;
    onSuccess: () => void;
}

interface FormValues {
    fullName: string;
    email: string;
    phoneNumber: string;
    address: string;
    profileUrl?: FileList;
    dateOfBirth: string;
    territory: string;
}

export function EditProfileModal({ isOpen, onClose, profile, onSuccess }: EditProfileModalProps) {
    const { updateProfile, loading } = useUpdateProfile();

    const methods = useForm<FormValues>({
        defaultValues: {
            fullName: profile.fullName || "",
            email: profile.email || "",
            phoneNumber: profile.phoneNumber || "",
            address: profile.address || "",
        }
    });

    const { handleSubmit, register, formState: { errors }, reset } = methods;

    // Reset form when modal opens with fresh profile data
    useEffect(() => {
        if (isOpen) {
            reset({
                fullName: profile.fullName || "",
                email: profile.email || "",
                phoneNumber: profile.phoneNumber || "",
                address: profile.address || "",
                dateOfBirth: profile.dateOfBirth || "",
                territory: profile.territory || "",
            });
        }
    }, [isOpen, profile, reset]);

    if (!isOpen) return null;

    const onSubmit = async (data: FormValues) => {
        const formData = new FormData();
        formData.append("fullName", data.fullName);
        formData.append("phoneNumber", data.phoneNumber);
        formData.append("address", data.address);
        formData.append("dateOfBirth", data.dateOfBirth);
        formData.append("territory", data.territory);

        if (data.profileUrl && data.profileUrl[0]) {
            formData.append("profile", data.profileUrl[0]);
        }

        const res = await updateProfile(formData);
        if (res) {
            toast.success("Profile updated successfully");
            onSuccess();
            onClose();
        } else {
            toast.error("Failed to update profile");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-lg bg-card rounded-3xl shadow-2xl flex flex-col border border-border overflow-hidden animate-in slide-in-from-bottom-8 duration-500 ease-out">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-muted/30 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <Save className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-foreground">Edit Profile</h2>
                            <p className="text-xs text-muted-foreground">Update your personal information</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                    <FormProvider {...methods}>
                        <form id="edit-profile-form" onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                            <FormField
                                type="file"
                                name="profileUrl"
                                label="Profile Picture"
                                accept="image/*"
                                register={register}
                                errors={errors}
                            />

                            <FormField
                                type="text"
                                name="fullName"
                                label="Full Name"
                                placeholder="Enter your full name"
                                register={register}
                                errors={errors}
                                validation={{ required: "Full name is required" }}
                            />

                            <FormField
                                type="email"
                                name="email"
                                label="Email Address"
                                placeholder="email@example.com"
                                register={register}
                                errors={errors}
                                className="opacity-60 pointer-events-none" // Email usually not editable here
                                validation={{ required: "Email is required" }}
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                                <FormField
                                    type="tel"
                                    name="phoneNumber"
                                    label="Phone Number"
                                    placeholder="+1 (555) 000-0000"
                                    register={register}
                                    errors={errors}
                                />
                                <FormField
                                    type="text"
                                    name="address"
                                    label="Address"
                                    placeholder="City, State, Country"
                                    register={register}
                                    errors={errors}
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                                <FormField
                                    type="date"
                                    name="dateOfBirth"
                                    label="Date of Birth"
                                    register={register}
                                    errors={errors}
                                />
                                <FormField
                                    type="text"
                                    name="territory"
                                    label="Territory"
                                    placeholder="Enter your territory"
                                    register={register}
                                    errors={errors}
                                />
                            </div>
                        </form>
                    </FormProvider>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-border bg-muted/30 flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-3 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted transition-all cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="edit-profile-form"
                        disabled={loading}
                        className="flex-1 px-4 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 cursor-pointer"
                    >
                        {loading ? <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-sm">Saving Changes...</span>
                        </div> : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}
