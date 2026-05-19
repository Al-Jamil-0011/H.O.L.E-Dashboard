"use client";

import { useEffect } from "react";
import { X, } from "lucide-react";
import { useCreateSurgery, useSingleSurgery, useUpdateSurgery } from "@/hooks/admin/surgeries";
import { useForm, FormProvider } from "react-hook-form";
import FormField from "@/components/form";
import Loader from "@/components/loader";
import { useFacilities, usePhysicians } from "@/hooks/common";
import { customToast } from "@/lib/utils";

interface AddSurgeryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
  refetch?: () => void;
}

export function AddSurgeryModal({ isOpen, onClose, initialData, refetch }: AddSurgeryModalProps) {
  const isEdit = !!initialData;
  const { createSurgery, loading: isCreating } = useCreateSurgery();
  const { updateSurgery, loading: isUpdating } = useUpdateSurgery();
  const { physicianOptions } = usePhysicians();
  const { facilityOptions } = useFacilities();
  const { refetch: refetchSingle } = useSingleSurgery(initialData?._id);

  const methods = useForm();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = methods;

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
      dateOfSurgery: data.dateOfSurgery
        ? new Date(data.dateOfSurgery).toISOString()
        : "",
      sticker: data.sticker?.[0] || null,
      appre: data.appre?.[0] || null,
      appost: data.appost?.[0] || null,
      lateralpre: data.lateralpre?.[0] || null,
      lateralpost: data.lateralpost?.[0] || null,
      notes: data.notes ? Array.from(data.notes as FileList) : []
    };

    console.log("payload", payload)

    try {
      if (isEdit) {
        const result = await updateSurgery(initialData?._id, payload);
        if (result?.statusCode === 201) {
          onClose();
          if (refetch) refetch();
          if (refetchSingle) refetchSingle();
          customToast.success(result?.message || "Surgery updated successfully");
        } else {
          customToast.error(result?.message || "Failed to update surgery");
        }
      } else {
        const result = await createSurgery(payload);
        if (result?.statusCode === 201) {
          onClose();
          if (refetch) refetch();
          customToast.success(result?.message || "Surgery created successfully");
        } else {
          customToast.error(result?.message || "Failed to create surgery");
        }
      }
    } catch (err: any) {
      console.error(err);
      customToast.error(err?.message || "Failed to save surgery");
    }
  };

  if (!isOpen) return null;

  // const physicianOptions = physicians.map(p => ({
  //   label: p.fullName,
  //   value: p._id,
  // }));

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
            {isEdit ? "Update Surgery" : "Add Surgery"}
          </h2>
        </div>

        {/* BODY */}
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto flex flex-col">
            <div className="flex-1 p-6 space-y-8 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-[#1E293B]">

              {/* Surgery Info */}
              <section className="space-y-4">
                <h3 className="text-xs font-bold text-gray-600 dark:text-gray-500 uppercase tracking-widest">Surgery Info</h3>
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
                    type="select"
                    placeholder="Select Facility..."
                    options={facilityOptions}
                    register={register}
                    errors={errors}
                    validation={{ required: "Facility is required" }}
                  />
                  <FormField
                    name="dateOfSurgery"
                    label="Date of Surgery"
                    type="date"
                    register={register}
                    errors={errors}
                    className="dark:[color-scheme:dark]"
                    validation={{ required: "Date of Surgery is required" }}
                  />
                  <FormField
                    name="surgeryType"
                    label="Surgery Type"
                    placeholder="Specific procedure name"
                    register={register}
                    errors={errors}
                    validation={{ required: "Surgery Type is required" }}
                  />
                </div>
              </section>

              {/* Surgery Materials */}
              <section className="space-y-4">
                <h3 className="text-xs font-bold text-gray-600 dark:text-gray-500 uppercase tracking-widest">Surgery Materials</h3>
                <div className="space-y-4">
                  <FormField
                    name="screws"
                    label="Screws"
                    placeholder="Details..."
                    register={register}
                    errors={errors}
                    validation={{ required: "Screws is required" }}
                  />
                  <FormField
                    name="plates"
                    label="Plates"
                    placeholder="Details..."
                    register={register}
                    errors={errors}
                    validation={{ required: "Plates is required" }}
                  />
                  <FormField
                    name="rodsOrconnectors"
                    label="Rods/Connectors"
                    placeholder="Details..."
                    register={register}
                    errors={errors}
                    validation={{ required: "Rods/Connectors is required" }}
                  />
                  <FormField
                    name="implants"
                    label="Implants"
                    placeholder="Details..."
                    register={register}
                    errors={errors}
                    validation={{ required: "Implants is required" }}
                  />
                  <FormField
                    name="biologics"
                    label="Biologics"
                    placeholder="Details..."
                    register={register}
                    errors={errors}
                    validation={{ required: "Biologics is required" }}
                  />
                </div>
              </section>

              {/* Radiology & Clinical Images */}
              <section className="space-y-4">
                <h3 className="text-xs font-bold text-gray-600 dark:text-gray-500 uppercase tracking-widest">Radiology & Clinical Images</h3>
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
                <h3 className="text-xs font-bold text-gray-600 dark:text-gray-500 uppercase tracking-widest">Documents & Notes</h3>
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
                    validation={{ required: "Case Notes is required" }}
                  />
                </div>
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
                  :
                  (isEdit ? "Update Surgery" : "Save Surgery")
                }
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
