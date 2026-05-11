"use client";
import React, { ReactNode, useState } from "react";
import { UseFormRegister, FieldErrors, RegisterOptions, useFormContext, useWatch, Control } from "react-hook-form";
import { UploadCloud, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";


export type Option = {
    label: string;
    value: string | number;
    extraText?: string;
};

export interface FormFieldProps {
    /** The type of input field to render */
    type?: "text" | "email" | "password" | "number" | "select" | "radio" | "checkbox" | "file" | "textarea" | "tel" | "date";
    /** The name of the field, used for react-hook-form registration */
    name: string;
    /** The label displayed above the field */
    label?: string;
    /** Placeholder text for text, email, password, number, textarea, and select */
    placeholder?: string;
    /** Optional icon to display on the left side of text-based inputs */
    icon?: ReactNode;
    /** react-hook-form register function */
    register: UseFormRegister<any>;
    /** react-hook-form errors object */
    errors: FieldErrors<any>;
    /** react-hook-form validation rules */
    validation?: RegisterOptions;
    /** Options array for select and radio types */
    options?: Option[];
    /** Custom color classes for focus states (e.g. 'focus:ring-blue-500') */
    colorClass?: string;
    /** Additional custom classes for the wrapper or input */
    className?: string;
    /** Whether to allow multiple file uploads (only for type="file") */
    multiple?: boolean;
    /** Accept attribute for file uploads (e.g. 'image/*') */
    accept?: string;
    /** Optional control object from react-hook-form for custom inputs */
    control?: Control<any>;
}

const FormField: React.FC<FormFieldProps> = ({
    type = "text",
    name,
    label,
    placeholder,
    icon,
    register,
    errors,
    validation,
    options = [],
    colorClass = "",
    className = "",
    multiple = false,
    accept,
    control: propControl,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFilePreview(reader.result as string);
                };
                reader.readAsDataURL(file);
            } else {
                setFilePreview(null);
            }
        }
        // Trigger react-hook-form's onChange
        register(name, validation).onChange(e);
    };

    const clearFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setFileName(null);
        setFilePreview(null);
        const input = document.getElementById(`file-input-${name}`) as HTMLInputElement;
        if (input) {
            input.value = "";
            // Trigger a change event so react-hook-form sees it
            const event = {
                target: input,
                type: 'change'
            } as any;
            register(name, validation).onChange(event);
        }
    };

    // Extract the error for this specific field
    const error = errors[name];
    const hasError = !!error;

    // Premium base styling matching the dashboard's design system
    // Premium base styling matching the dashboard's design system
    const baseInputClasses = "block w-full border rounded-xl leading-5 bg-gray-50 dark:bg-[#151B2B] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none transition-all duration-300 sm:text-sm shadow-sm";

    // Adjust padding if an icon is present, and add right padding for password toggle
    const paddingClasses = `${icon ? "pl-10" : "pl-4"} py-3 ${type === "password" ? "pr-11" : "pr-4"}`;

    // Dynamic error vs default classes
    const errorClasses = hasError
        ? "border-rose-500 bg-rose-50 dark:bg-rose-500/5 text-rose-600 dark:text-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
        : `border-gray-200 dark:border-[#1E293B] focus:border-[#00E5FF] focus:ring-2 focus:ring-[#00E5FF]/20 ${colorClass}`;

    const formContext = useFormContext();
    const control = propControl || formContext?.control;

    // Get current value for custom components like select
    const watchedValue = useWatch({
        name,
        control,
    });

    // Common props spread to all input elements
    const commonProps = {
        ...register(name, validation),
        value: watchedValue ?? "",
        className: `${baseInputClasses} ${paddingClasses} ${errorClasses} ${className}`,
    };

    const renderInput = () => {
        switch (type) {
            // case "select":
            //     return (
            //         <select {...commonProps} className={`${commonProps.className} appearance-none cursor-pointer`}>
            //             {placeholder && (
            //                 <option value="" disabled hidden>
            //                     {placeholder}
            //                 </option>
            //             )}
            //             {options.map((opt, idx) => (
            //                 <option className="mb-1" key={idx} value={opt.value}>
            //                     {opt.label}
            //                 </option>
            //             ))}
            //         </select>
            //     );
            case "select":
                const selectedOption = options.find(
                    (opt) => opt.value?.toString() === commonProps.value?.toString()
                );

                return (
                    <div className="relative">
                        {/* Hidden input for react-hook-form */}
                        <input
                            type="hidden"
                            {...register(name, validation)}
                        />

                        {/* Trigger */}
                        <button
                            type="button"
                            onClick={() => setIsOpen(!isOpen)}
                            className={`${commonProps.className} appearance-none cursor-pointer text-left flex items-center justify-between group`}
                        >
                            <div className="flex-1 overflow-hidden">
                                {selectedOption ? (
                                    <div className="flex flex-col">
                                        <span className="font-bold text-gray-900 dark:text-white truncate">
                                            {selectedOption.label}
                                        </span>

                                        {selectedOption.extraText && (
                                            <span className="text-[10px] text-gray-500 dark:text-gray-500 font-medium uppercase tracking-wider">
                                                {selectedOption.extraText}
                                            </span>
                                        )}
                                    </div>
                                ) : (
                                    <span className="text-gray-400 dark:text-gray-600">
                                        {placeholder}
                                    </span>
                                )}
                            </div>
                            <svg
                                className={cn(
                                    "w-4 h-4 ml-2 transition-transform duration-200 text-gray-400 dark:text-gray-600",
                                    isOpen && "rotate-180"
                                )}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </button>

                        {/* Dropdown */}
                        {isOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setIsOpen(false)}
                                />
                                <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-gray-200 dark:border-[#1E293B] bg-white dark:bg-[#0B101E] shadow-[0_10px_40px_rgba(0,0,0,0.3)] animate-in fade-in zoom-in-95 duration-200">
                                    <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-[#1E293B]">
                                        {options.map((opt, idx) => (
                                            <div
                                                key={idx}
                                                onClick={() => {
                                                    if (formContext?.setValue) {
                                                        formContext.setValue(name, opt.value, { 
                                                            shouldValidate: true, 
                                                            shouldDirty: true,
                                                            shouldTouch: true 
                                                        });
                                                    } else {
                                                        const event = {
                                                            target: {
                                                                name,
                                                                value: opt.value,
                                                            },
                                                        } as any;
                                                        register(name, validation).onChange(event);
                                                    }
                                                    setIsOpen(false);
                                                }}
                                                className={cn(
                                                    "cursor-pointer px-4 py-3 hover:bg-gray-50 dark:hover:bg-[#151B2B] transition-colors border-b last:border-0 border-gray-100 dark:border-[#1E293B]",
                                                    opt.value?.toString() === commonProps.value?.toString() && "bg-[#00E5FF]/5 dark:bg-[#00E5FF]/5"
                                                )}
                                            >
                                                <div className="flex flex-col">
                                                    <span className={cn(
                                                        "text-sm font-bold transition-colors",
                                                        opt.value?.toString() === commonProps.value?.toString()
                                                            ? "text-[#00E5FF]"
                                                            : "text-gray-900 dark:text-white"
                                                    )}>
                                                        {opt.label}
                                                    </span>

                                                    {opt.extraText && (
                                                        <span className="text-[10px] text-gray-500 dark:text-gray-500 font-bold uppercase tracking-widest mt-0.5">
                                                            {opt.extraText}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                );

            case "textarea":
                return (
                    <textarea
                        placeholder={placeholder}
                        rows={4}
                        {...commonProps}
                        className={`${commonProps.className} resize-y min-h-[100px]`}
                    />
                );

            case "radio":
                return (
                    <div className={`flex flex-wrap gap-5 ${className}`}>
                        {options.map((opt, idx) => (
                            <label key={idx} className="flex items-center cursor-pointer group">
                                <input
                                    type="radio"
                                    value={opt.value}
                                    {...register(name, validation)}
                                    className="w-4 h-4 text-blue-600 bg-white border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-900 focus:ring-2 dark:bg-gray-800 dark:border-gray-600 cursor-pointer transition-colors"
                                />
                                <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 transition-colors">
                                    {opt.label}
                                </span>
                            </label>
                        ))}
                    </div>
                );

            case "checkbox":
                return (
                    <label className={`flex items-start cursor-pointer group ${className}`}>
                        <div className="flex items-center h-5">
                            <input
                                type="checkbox"
                                {...register(name, validation)}
                                className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-900 focus:ring-2 dark:bg-gray-800 dark:border-gray-600 cursor-pointer transition-colors"
                            />
                        </div>
                        <div className="ml-2 text-sm">
                            <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 transition-colors">
                                {placeholder || label}
                            </span>
                        </div>
                    </label>
                );

            case "file":
                return (
                    <div className="w-full">
                        {label && (
                            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                                {label}
                                {validation?.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                        )}
                        <input
                            type="file"
                            id={`file-input-${name}`}
                            multiple={multiple}
                            accept={accept}
                            {...register(name, validation)}
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        {!fileName ? (
                            <label
                                htmlFor={`file-input-${name}`}
                                className={`w-full h-32 border-2 border-dashed rounded-xl transition-all duration-300 flex flex-col items-center justify-center cursor-pointer group
                                ${hasError
                                        ? 'border-rose-500 bg-rose-50 dark:bg-rose-500/5'
                                        : 'border-gray-200 dark:border-[#334155] bg-gray-50 dark:bg-[#151B2B] hover:bg-gray-100 dark:hover:bg-[#1A2234] hover:border-gray-300 dark:hover:border-[#4b5563]'}`}
                            >
                                <div className="p-3 rounded-full bg-gray-200/50 dark:bg-gray-800/50 group-hover:bg-[#00E5FF]/10 transition-colors mb-2">
                                    <UploadCloud className={`h-6 w-6 transition-colors ${hasError ? 'text-rose-500' : 'text-gray-400 dark:text-gray-500 group-hover:text-[#00E5FF]'}`} />
                                </div>
                                <p className={`text-[11px] font-semibold transition-colors ${hasError ? 'text-rose-500' : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'}`}>
                                    Drag & drop or <span className="text-[#00E5FF]">browse</span>
                                </p>
                                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">Supports images, PDF up to 10MB</p>
                            </label>
                        ) : (
                            <div className="relative group/preview w-full h-32 rounded-xl border border-gray-200 dark:border-[#334155] bg-gray-50 dark:bg-[#151B2B] overflow-hidden flex items-center p-3 animate-in fade-in zoom-in-95 duration-300">
                                {filePreview ? (
                                    <div className="w-24 h-full rounded-lg overflow-hidden border border-gray-200 dark:border-white/10 relative flex-shrink-0">
                                        <Image
                                            src={filePreview}
                                            width={100}
                                            height={100}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-24 h-full rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-white/10 flex-shrink-0">
                                        <UploadCloud className="h-8 w-8 text-gray-400 dark:text-gray-600" />
                                    </div>
                                )}

                                <div className="ml-4 flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate pr-8">{fileName}</p>
                                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mt-1">Ready to upload</p>
                                </div>

                                <button
                                    onClick={clearFile}
                                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 transition-colors hover:text-white z-10 cursor-pointer"
                                    title="Remove file"
                                >
                                    <X className="h-4 w-4" />
                                </button>

                                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/preview:opacity-100 transition-opacity pointer-events-none" />
                            </div>
                        )}
                    </div>
                );

            default:
                // Handles text, email, password, number
                const inputType = type === "password" && showPassword ? "text" : type;
                return (
                    <>
                        <input
                            type={inputType}
                            placeholder={placeholder}
                            {...commonProps}
                        />
                        {type === "password" && (
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none transition-colors"
                            >
                                {showPassword ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        )}
                    </>
                );
        }
    };

    return (
        <div className="w-full flex flex-col mb-5">
            {/* Field Label */}
            {label && type !== "checkbox" && type !== "file" && (
                <label className="mb-1.5 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest ml-1">
                    {label}
                    {validation?.required && <span className="text-rose-500 ml-1">*</span>}
                </label>
            )}

            {/* Input Wrapper */}
            <div className="relative group/input w-full">
                {/* Floating Icon for text-based inputs */}
                {icon && type !== "radio" && type !== "checkbox" && type !== "file" && type !== "textarea" && (
                    <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors ${hasError ? 'text-rose-500' : 'text-gray-400 dark:text-gray-500 group-focus-within/input:text-[#00E5FF]'}`}>
                        {icon}
                    </div>
                )}

                {renderInput()}

            </div>

            {/* Error Message */}
            {hasError && (
                <div className="mt-1.5 ml-1 flex items-start text-rose-500 text-[10px] font-bold uppercase tracking-wider animate-in fade-in slide-in-from-top-1">
                    <svg className="w-3.5 h-3.5 mr-1 mt-px flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{error.message?.toString() || "This field is required"}</span>
                </div>
            )}
        </div>
    );
};

export default FormField;
