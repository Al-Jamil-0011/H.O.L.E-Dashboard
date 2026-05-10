"use client";

import { useEffect, useState } from "react";
import { X, Upload, Activity } from "lucide-react";
import { useCreateSurgery, useUpdateSurgery } from "@/hooks/admin/surgeries";
import { useForm } from "react-hook-form";
import FormField from "@/components/form";
import Loader from "@/components/loader";
import { usePhysicians } from "@/hooks/admin/physicians";

interface AddSurgeryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
}

export function AddSurgeryModal({ isOpen, onClose, initialData }: AddSurgeryModalProps) {
  const isEdit = !!initialData;
  const { createSurgery, loading: isCreating } = useCreateSurgery();
  const { updateSurgery, loading: isUpdating } = useUpdateSurgery();
  const { physicians } = usePhysicians();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Map initial data to form
        reset({
          physician: typeof initialData.info?.physician === 'object' ? initialData.info.physician._id : initialData.info?.physician,
          patientId: initialData.info?.patientId,
          facility: typeof initialData.info?.facility === 'object' ? initialData.info.facility._id : initialData.info?.facility,
          dateOfSurgery: initialData.info?.dateOfSurgery ? new Date(initialData.info.dateOfSurgery).toISOString().split('T')[0] : "",
          surgeryType: initialData.info?.surgeryType,
          screws: initialData.surgeryMaterial?.screws,
          plates: initialData.surgeryMaterial?.plates,
          rodsOrconnectors: initialData.surgeryMaterial?.rodsOrconnectors,
          implants: initialData.surgeryMaterial?.implants,
          biologics: initialData.surgeryMaterial?.biologics,
          caseNotes: initialData.docAndNotes?.caseNotes,
        });
      } else {
        reset({});
      }
    }
  }, [isOpen, initialData, reset]);

  const onSubmit = async (data: any) => {
    const payload = {
      ...data,
      sticker: data.sticker?.[0] || null,
      appre: data.appre?.[0] || null,
      appost: data.appost?.[0] || null,
      lateralpre: data.lateralpre?.[0] || null,
      lateralpost: data.lateralpost?.[0] || null,
      notes: data.notes ? Array.from(data.notes as FileList) : []
    };

    try {
      if (isEdit) {
        await updateSurgery(initialData._id, payload);
      } else {
        await createSurgery(payload);
      }
      onClose();
    } catch (err) {
      console.error("Failed to save surgery:", err);
    }
  };

  if (!isOpen) return null;

  const physicianOptions = physicians.map(p => ({
    label: p.fullName,
    value: p._id
  }));

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
            {isEdit ? "Update Surgery" : "Add Surgery"}
          </h2>
        </div>

        {/* BODY */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto flex flex-col">
          <div className="flex-1 p-6 space-y-8 scrollbar-thin scrollbar-thumb-[#1E293B]">

            {/* Surgery Info */}
            <section className="space-y-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Surgery Info</h3>
              <div className="space-y-4">
                <FormField
                  name="physician"
                  label="Physician"
                  type="select"
                  placeholder="Select Physician..."
                  options={physicianOptions}
                  register={register}
                  errors={errors}
                  validation={{ required: "Physician is required" }}
                />
                <FormField
                  name="patientId"
                  label="Patient Identifier (PT ID)"
                  placeholder="e.g. PT-123456"
                  register={register}
                  errors={errors}
                  validation={{ required: "Patient ID is required" }}
                />
                <FormField
                  name="facility"
                  label="Facility"
                  placeholder="Hospital or Clinic ID/Name"
                  register={register}
                  errors={errors}
                />
                <FormField
                  name="dateOfSurgery"
                  label="Date of Surgery"
                  type="date"
                  register={register}
                  errors={errors}
                  className="[color-scheme:dark]"
                />
                <FormField
                  name="surgeryType"
                  label="Surgery Type"
                  placeholder="Specific procedure name"
                  register={register}
                  errors={errors}
                />
              </div>
            </section>

            {/* Surgery Materials */}
            <section className="space-y-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Surgery Materials</h3>
              <div className="space-y-4">
                <FormField name="screws" label="Screws" placeholder="Details..." register={register} errors={errors} />
                <FormField name="plates" label="Plates" placeholder="Details..." register={register} errors={errors} />
                <FormField name="rodsOrconnectors" label="Rods/Connectors" placeholder="Details..." register={register} errors={errors} />
                <FormField name="implants" label="Implants" placeholder="Details..." register={register} errors={errors} />
                <FormField name="biologics" label="Biologics" placeholder="Details..." register={register} errors={errors} />
              </div>
            </section>

            {/* Radiology & Clinical Images */}
            <section className="space-y-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Radiology & Clinical Images</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField name="appre" label="AP PRE" type="file" register={register} errors={errors} />
                <FormField name="appost" label="AP POST" type="file" register={register} errors={errors} />
                <FormField name="lateralpre" label="LATERAL PRE" type="file" register={register} errors={errors} />
                <FormField name="lateralpost" label="LATERAL POST" type="file" register={register} errors={errors} />
                <div className="col-span-2">
                  <FormField name="sticker" label="PATIENT STICKER" type="file" register={register} errors={errors} />
                </div>
              </div>
            </section>

            {/* Documents & Notes */}
            <section className="space-y-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Documents & Notes</h3>
              <div className="space-y-4">
                <FormField
                  name="notes"
                  label="Upload Other Files"
                  type="file"
                  multiple
                  register={register}
                  errors={errors}
                />
                <FormField
                  name="caseNotes"
                  label="Case Notes"
                  type="textarea"
                  placeholder="Enter surgical notes, complications, or specific instructions..."
                  register={register}
                  errors={errors}
                />
              </div>
            </section>

          </div>

          {/* FOOTER */}
          <div className="p-6 border-t border-[#1E293B] bg-[#0B101E] space-y-3 mt-auto">
            <button
              disabled={isCreating || isUpdating}
              type="submit"
              className="w-full py-3 text-sm font-bold text-[#0B101E] bg-[#00E5FF] rounded-xl hover:bg-cyan-400 transition-colors shadow-[0_0_15px_rgba(0,229,255,0.3)] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {(isCreating || isUpdating) ? <Loader size={16} /> : (isEdit ? "Update Surgery" : "Save Surgery")}
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
