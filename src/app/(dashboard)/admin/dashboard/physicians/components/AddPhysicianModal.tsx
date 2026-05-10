"use client";

import { useEffect, useState } from "react";
import { X, Upload, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCreatePhysician, useUpdatePhysician } from "@/hooks/admin/physicians";
import { useForm } from "react-hook-form";
import FormField from "@/components/form";
import Loader from "@/components/loader";

interface AddPhysicianModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
}

export function AddPhysicianModal({ isOpen, onClose, initialData }: AddPhysicianModalProps) {
  const isEdit = !!initialData;
  const { createPhysician, loading: isCreating } = useCreatePhysician();
  const { updatePhysician, loading: isUpdating } = useUpdatePhysician();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [specialties, setSpecialties] = useState<string[]>([]);
  const availableSpecialties = ["Ortho", "Neuro", "Pain", "Spine", "Peds", "DPM"];

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
        setSpecialties(typeof initialData.specialty === 'string' ? initialData.specialty.split(', ') : []);
      } else {
        reset({});
        setSpecialties([]);
      }
    }
  }, [isOpen, initialData, reset]);

  const toggleSpecialty = (spec: string) => {
    setSpecialties(prev =>
      prev.includes(spec) ? prev.filter(s => s !== spec) : [...prev, spec]
    );
  };

  const onSubmit = async (data: any) => {
    const payload = {
      ...data,
      specialty: specialties.join(", "),
      profile: data.profile?.[0],
      docs: data.docs ? Array.from(data.docs as FileList) : []
    };

    try {
      if (isEdit) {
        await updatePhysician(initialData._id, payload);
      } else {
        await createPhysician(payload);
      }
      onClose();
    } catch (err) {
      console.error("Failed to save physician:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-[60] w-full max-w-md bg-[#0B101E] border-l border-[#1E293B] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">

        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-[#1E293B]">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <button onClick={onClose} className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-[#1E293B]">
              <X className="h-5 w-5" />
            </button>
            {isEdit ? "Update Physician" : "Add Physician"}
          </h2>
        </div>

        {/* BODY */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto flex flex-col">
          <div className="flex-1 p-6 space-y-8 scrollbar-thin scrollbar-thumb-[#1E293B]">

            {/* Basic Information */}
            <section className="space-y-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Basic Information</h3>

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
                  placeholder="Central Orthopedics"
                  register={register}
                  errors={errors}
                />

                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Specialty</label>
                  <div className="flex flex-wrap gap-2">
                    {availableSpecialties.map(spec => (
                      <button
                        key={spec}
                        type="button"
                        onClick={() => toggleSpecialty(spec)}
                        className={cn(
                          "px-3 py-1.5 text-xs font-bold rounded-lg border transition-all",
                          specialties.includes(spec)
                            ? "bg-[#00E5FF]/20 text-[#00E5FF] border-[#00E5FF]/50 shadow-[0_0_10px_rgba(0,229,255,0.1)]"
                            : "bg-[#151B2B] text-gray-400 border-[#334155] hover:bg-[#1E293B]"
                        )}
                      >
                        {spec}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section className="space-y-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Contact</h3>

              <div className="space-y-4">
                <FormField
                  name="phoneNumber"
                  label="Phone Number"
                  type="tel"
                  placeholder="(555) 123-4567"
                  register={register}
                  errors={errors}
                />
                <FormField
                  name="cellNumber"
                  label="Cell"
                  type="tel"
                  placeholder="(555) 987-6543"
                  register={register}
                  errors={errors}
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
                    }
                  }}
                />
                <FormField
                  name="dateOfBirth"
                  label="Date of Birth"
                  type="date"
                  register={register}
                  errors={errors}
                  className="[color-scheme:dark]"
                />
              </div>
            </section>

            {/* Documents */}
            <section className="space-y-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Media (Optional)</h3>

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
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Note</h3>
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
          <div className="p-6 border-t border-[#1E293B] bg-[#0B101E] space-y-3 mt-auto">
            <button
              disabled={isCreating || isUpdating}
              type="submit"
              className="w-full py-3 text-sm font-bold text-[#0B101E] bg-[#00E5FF] rounded-xl hover:bg-cyan-400 transition-colors shadow-[0_0_15px_rgba(0,229,255,0.3)] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {(isCreating || isUpdating) ? <Loader size={16} /> : (isEdit ? "Update Physician" : "Save Physician")}
            </button>
            <button
              type="button"
              disabled={isCreating || isUpdating}
              onClick={onClose}
              className="w-full py-3 text-sm font-bold text-gray-300 bg-transparent border border-[#334155] rounded-xl hover:bg-[#1E293B] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>

      </div>
    </>
  );
}
