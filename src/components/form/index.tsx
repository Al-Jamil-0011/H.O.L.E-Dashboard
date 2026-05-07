"use client";
import React, { ReactNode, useState } from "react";
import { UseFormRegister, FieldErrors, RegisterOptions } from "react-hook-form";

export type Option = {
    label: string;
    value: string | number;
};

export interface FormFieldProps {
    /** The type of input field to render */
    type?: "text" | "email" | "password" | "number" | "select" | "radio" | "checkbox" | "file" | "textarea";
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
    colorClass = "focus:ring-blue-500/50 focus:border-blue-500/50",
    className = "",
    multiple = false,
    accept,
}) => {
    const [showPassword, setShowPassword] = useState(false);

    // Extract the error for this specific field
    const error = errors[name];
    const hasError = !!error;

    // Premium base styling matching the dashboard's design system
    const baseInputClasses = "block w-full border rounded-xl leading-5 bg-white/50 dark:bg-white/5 placeholder-gray-400 focus:outline-none transition-all duration-300 sm:text-sm text-gray-900 dark:text-gray-100 shadow-sm";

    // Adjust padding if an icon is present, and add right padding for password toggle
    const paddingClasses = `${icon ? "pl-10" : "pl-4"} py-3 ${type === "password" ? "pr-11" : "pr-4"}`;

    // Dynamic error vs default classes
    const errorClasses = hasError
        ? "border-red-500 focus:ring-2 focus:ring-red-500/50 focus:border-red-500 bg-red-50/50 dark:bg-red-500/5 text-red-900"
        : `border-gray-200 dark:border-white/10 focus:ring-2 ${colorClass}`;

    // Common props spread to all input elements
    const commonProps = {
        ...register(name, validation),
        className: `${baseInputClasses} ${paddingClasses} ${errorClasses} ${className}`,
    };

    const renderInput = () => {
        switch (type) {
            case "select":
                return (
                    <select {...commonProps} className={`${commonProps.className} appearance-none cursor-pointer`}>
                        {placeholder && (
                            <option value="" disabled hidden>
                                {placeholder}
                            </option>
                        )}
                        {options.map((opt, idx) => (
                            <option key={idx} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
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
                    <div className="relative">
                        <input
                            type="file"
                            multiple={multiple}
                            accept={accept}
                            {...register(name, validation)}
                            className={`block w-full text-sm text-gray-500 border border-gray-200 dark:border-white/10 rounded-xl cursor-pointer bg-white/50 dark:bg-white/5 focus:outline-none dark:text-gray-400 dark:placeholder-gray-400 shadow-sm
                            file:mr-4 file:py-3 file:px-4 file:rounded-l-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/30 dark:file:text-blue-400 transition-all ${hasError ? 'border-red-500 focus:ring-red-500/50' : 'focus:ring-2 focus:ring-blue-500/50'} ${className}`}
                        />
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
            {label && type !== "checkbox" && (
                <label className="mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                    {label}
                    {validation?.required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            {/* Input Wrapper */}
            <div className="relative group/input w-full">
                {/* Floating Icon for text-based inputs */}
                {icon && type !== "radio" && type !== "checkbox" && type !== "file" && type !== "textarea" && (
                    <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors ${hasError ? 'text-red-500' : 'text-gray-400 group-focus-within/input:text-blue-500'}`}>
                        {icon}
                    </div>
                )}

                {renderInput()}

                {/* Dropdown chevron for select */}
                {type === "select" && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </div>
                )}
            </div>

            {/* Error Message */}
            {hasError && (
                <div className="mt-1.5 flex items-start text-red-500 text-sm font-medium animate-in fade-in slide-in-from-top-1">
                    <svg className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{error.message?.toString() || "This field is required"}</span>
                </div>
            )}
        </div>
    );
};

export default FormField;
