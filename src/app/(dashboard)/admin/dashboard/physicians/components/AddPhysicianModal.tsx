"use client";

import { useEffect, useState } from "react";
import { cn, customToast } from "@/lib/utils";
import { useCreatePhysician, useSinglePhysician, useUpdatePhysician } from "@/hooks/admin/physicians";
import { useForm, FormProvider } from "react-hook-form";
import FormField from "@/components/form";
import Loader from "@/components/loader";
import { usePractices } from "@/hooks/common";
import { X } from "lucide-react";

interface AddPhysicianModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
  refetch?: () => void;
}

export function AddPhysicianModal({ isOpen, onClose, initialData, refetch }: AddPhysicianModalProps) {
  const isEdit = !!initialData;
  const { createPhysician, loading: isCreating } = useCreatePhysician();
  const { updatePhysician, loading: isUpdating } = useUpdatePhysician();
  const { refetch: refetchSingle } = useSinglePhysician(initialData?._id);

  const methods = useForm();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = methods;

  const { practiceOptions } = usePractices();

  const [specialty, setSpecialty] = useState<string | null>(null);
  const availableSpecialties = [
    { label: "Ortho", value: "ortho" },
    { label: "Neuro", value: "neuro" },
    { label: "Pain", value: "pain" },
    { label: "Ortho/Spine", value: "ortho/spine" },
    { label: "Peds", value: "peds" },
    { label: "DPM", value: "dmp" }
  ];

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Map initial data to form
        reset({
          fullName: initialData.fullName,
          practice: initialData.practice,
          email: initialData.contactInfo?.email,
          phoneNumber: initialData.contactInfo?.phoneNumber,
          cellNumber: initialData.contactInfo?.cellNumber,
          dateOfBirth: initialData.contactInfo?.dateOfBirth ? new Date(initialData.contactInfo.dateOfBirth).toISOString().split('T')[0] : "",
          noteToSelf: initialData.noteToSelf,
        });
        setSpecialty(initialData.specialty || null);
      } else {
        reset({});
        setSpecialty(null);
      }
    }
  }, [isOpen, initialData, reset]);

  const toggleSpecialty = (spec: string) => {
    setSpecialty(prev => prev === spec ? null : spec);
  };

  const onSubmit = async (data: any) => {
    const payload = {
      ...data,
      specialty: specialty,
      profile: data.profile?.[0],
      docs: data.docs ? Array.from(data.docs as FileList) : []
    };

    try {
      if (isEdit) {
        const result = await updatePhysician(initialData?._id, payload);
        if (result?.statusCode === 201) {
          customToast.success(result?.message || "Physician updated successfully");
          onClose();
          if (refetch) refetch();
          if (refetchSingle) refetchSingle();
        } else {
          customToast.error(result?.message || "Failed to update physician");
        }

      } else {
        const result = await createPhysician(payload);
        if (result?.statusCode === 201) {
          customToast.success(result?.message || "Physician created successfully");
          onClose();
          if (refetch) refetch();
        } else {
          customToast.error(result?.message || "Failed to create physician");
        }
      }
    } catch (err: any) {
      console.error("Failed to save physician:", err);
      customToast.error(err?.message || "Something went wrong");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-[60] w-full max-w-md bg-white dark:bg-[#0B101E] border-l border-gray-200 dark:border-[#1E293B] dark:shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">

        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-[#1E293B]">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <button onClick={onClose} className="p-1 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#1E293B] cursor-pointer">
              <X className="h-5 w-5" />
            </button>
            {isEdit ? "Update Physician" : "Add Physician"}
          </h2>
        </div>

        {/* BODY */}
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto flex flex-col">
            <div className="flex-1 p-6 space-y-8 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-[#1E293B]">

              {/* Basic Information */}
              <section className="space-y-4">
                <h3 className="text-xs font-bold text-gray-600 dark:text-gray-500 uppercase tracking-widest">Basic Information</h3>

                <div className="space-y-4">
                  <FormField
                    name="fullName"
                    label="Full Name"
                    placeholder="Dr. Jane Smith"
                    register={register}
                    errors={errors}
                    validation={{ required: "Full name is required" }}
                  />

                  <FormField
                    name="practice"
                    label="Practice Name"
                    type="select"
                    placeholder="Select Practice..."
                    options={practiceOptions}
                    register={register}
                    errors={errors}
                    validation={{ required: "Practice name is required" }}
                  />

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-400 mb-1.5 ">Specialty</label>
                    <div className="flex flex-wrap gap-2">
                      {availableSpecialties.map(spec => (
                        <button
                          key={spec.value}
                          type="button"
                          onClick={() => toggleSpecialty(spec.value)}
                          className={cn(
                            "px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer",
                            specialty === spec.value
                              ? "bg-[#309488]/10 dark:bg-[#00E5FF]/20 text-[#309488] dark:text-[#00E5FF] border-[#309488]/30 dark:border-[#00E5FF]/50 dark:shadow-[0_0_10px_rgba(48,148,136,0.1)] dark:shadow-[0_0_10px_rgba(0,229,255,0.1)]"
                              : "bg-gray-50 dark:bg-[#151B2B] text-gray-600 dark:text-gray-400 border-gray-200 dark:border-[#334155] hover:bg-gray-100 dark:hover:bg-[#1E293B]"
                          )}
                        >
                          {spec.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Contact */}
              <section className="space-y-4">
                <h3 className="text-xs font-bold text-gray-600 dark:text-gray-500 uppercase tracking-widest">Contact</h3>

                <div className="space-y-4">
                  <FormField
                    name="phoneNumber"
                    label="Phone Number"
                    type="tel"
                    placeholder="(555) 123-4567"
                    register={register}
                    errors={errors}
                    validation={{ required: "Phone number is required" }}
                  />
                  <FormField
                    name="cellNumber"
                    label="Cell"
                    type="tel"
                    placeholder="(555) 987-6543"
                    register={register}
                    errors={errors}
                    validation={{ required: "Cell number is required" }}
                  // validation={{
                  //   pattern: {
                  //     value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  //     message: "Invalid cell number"
                  //   },
                  //   required: "Cell number is required"
                  // }}
                  />
                  <FormField
                    name="email"
                    label="Email Address"
                    type="email"
                    placeholder="physician@example.com"
                    register={register}
                    errors={errors}
                    validation={{
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      },
                      required: "Email address is required"
                    }}
                  />
                  <FormField
                    name="dateOfBirth"
                    label="Date of Birth"
                    type="date"
                    register={register}
                    errors={errors}
                    className="dark:[color-scheme:dark]"
                    validation={{ required: "Date of birth is required" }}
                  />
                </div>
              </section>

              {/* Documents */}
              <section className="space-y-4">
                <h3 className="text-xs font-bold text-gray-600 dark:text-gray-500 uppercase tracking-widest">Media (Optional)</h3>

                <div className="space-y-4">
                  <FormField
                    name="profile"
                    label="Profile Picture"
                    type="file"
                    accept="image/*"
                    register={register}
                    errors={errors}
                  />
                  <FormField
                    name="docs"
                    label="Business Card / Docs"
                    type="file"
                    register={register}
                    errors={errors}
                    multiple
                  />
                </div>
              </section>

              {/* Notes */}
              <section className="space-y-4">
                <h3 className="text-xs font-bold text-gray-600 dark:text-gray-500 uppercase tracking-widest">Note</h3>
                <FormField
                  name="noteToSelf"
                  label="Note to Self"
                  type="textarea"
                  placeholder="Add private notes about this physician..."
                  register={register}
                  errors={errors}
                />
              </section>

            </div>

            {/* FOOTER */}
            <div className="p-6 border-t border-gray-200 dark:border-[#1E293B] bg-gray-50 dark:bg-[#0B101E] space-y-3 mt-auto">
              <button
                disabled={isCreating || isUpdating}
                type="submit"
                className="w-full py-3 text-sm font-medium text-white dark:text-[#0B101E] bg-[#309488] dark:bg-[#00E5FF] rounded-xl hover:bg-[#277a70] dark:hover:bg-cyan-400 transition-colors dark:shadow-[0_0_15px_rgba(48,148,136,0.3)] dark:shadow-[0_0_15px_rgba(0,229,255,0.3)] flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {(isCreating || isUpdating) ?
                  <div className="flex items-center gap-2">
                    <Loader color="currentColor" size={16} />
                    <span>Loading...</span>
                  </div>
                  : (isEdit ? "Update Physician" : "Save Physician")}
              </button>
              <button
                type="button"
                disabled={isCreating || isUpdating}
                onClick={onClose}
                className="w-full py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-transparent border border-gray-300 dark:border-[#334155] rounded-xl hover:bg-gray-100 dark:hover:bg-[#1E293B] transition-colors disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </FormProvider>

      </div>
    </>
  );
}
