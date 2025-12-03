"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FileUpload } from "@/components/form/FileUpload";
import { StepIndicator } from "@/components/layout/StepIndicator";
import { useFormContext } from "@/lib/form-context";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

export default function NewStep5Page() {
    const t = useTranslations('newApplication.step5');
    const common = useTranslations('common');
    const router = useRouter();
    const { formData, updateFormData } = useFormContext();

    const step5Schema = z.object({
        schoolName: z.string().min(1, t('errors.schoolNameRequired')),
        graduationYear: z.string().min(1, t('errors.graduationYearRequired')),
        country: z.string().min(1, t('errors.countryRequired')),
    });

    type Step5Values = z.infer<typeof step5Schema>;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<Step5Values>({
        resolver: zodResolver(step5Schema) as any,
        defaultValues: {
            schoolName: "",
            graduationYear: "",
            country: "",
        },
    });

    const [diplomaFile, setDiplomaFile] = useState<File | null>(null);
    const [diplomaFileName, setDiplomaFileName] = useState<string | null>(null);
    const [transcriptFile, setTranscriptFile] = useState<File | null>(null);
    const [transcriptFileName, setTranscriptFileName] = useState<string | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);

    useEffect(() => {
        if (formData) {
            reset({
                schoolName: formData.schoolName || "",
                graduationYear: formData.graduationYear || "",
                country: formData.country || "",
            });
            if (formData.diplomaFileName) setDiplomaFileName(formData.diplomaFileName);
            if (formData.transcriptFileName) setTranscriptFileName(formData.transcriptFileName);
        }
    }, [formData, reset]);

    const onSubmit = (data: Step5Values) => {
        const errors: string[] = [];

        if (!diplomaFile && !diplomaFileName) {
            errors.push(t('errors.diplomaFileRequired'));
        }
        if (!transcriptFile && !transcriptFileName) {
            errors.push(t('errors.transcriptFileRequired'));
        }

        if (errors.length > 0) {
            setFileError(`${t('errors.filesRequired')}${errors.join("、")}`);
            return;
        }

        updateFormData({
            ...data,
            diplomaFileName: diplomaFile ? diplomaFile.name : diplomaFileName,
            transcriptFileName: transcriptFile ? transcriptFile.name : transcriptFileName,
        });
        router.push("/new/step6");
    };

    return (
        <div className="space-y-6">
            <StepIndicator currentStep={5} totalSteps={10} label={t('progress')} />

            <div className="space-y-2">
                <h1 className="text-xl font-bold text-foreground">{t('title')}</h1>
                <p className="text-sm text-muted-foreground">
                    {t('description')}
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                    label={t('schoolName')}
                    placeholder={t('placeholders.schoolName')}
                    error={errors.schoolName?.message}
                    {...register("schoolName")}
                />

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label={t('graduationYear')}
                        type="number"
                        placeholder={t('placeholders.graduationYear')}
                        error={errors.graduationYear?.message}
                        {...register("graduationYear")}
                    />
                    <Input
                        label={t('country')}
                        placeholder={t('placeholders.country')}
                        error={errors.country?.message}
                        {...register("country")}
                    />
                </div>

                <div className="space-y-4">
                    {fileError && (
                        <p className="text-xs text-destructive">{fileError}</p>
                    )}
                    <FileUpload
                        label={t('diplomaFile')}
                        accept="image/*,application/pdf"
                        onChange={(file) => {
                            setDiplomaFile(file);
                            setFileError(null);
                            if (file) setDiplomaFileName(file.name);
                            else setDiplomaFileName(null);
                        }}
                        fileName={diplomaFileName || undefined}
                    />

                    <FileUpload
                        label={t('transcriptFile')}
                        accept="image/*,application/pdf"
                        onChange={(file) => {
                            setTranscriptFile(file);
                            setFileError(null);
                            if (file) setTranscriptFileName(file.name);
                            else setTranscriptFileName(null);
                        }}
                        fileName={transcriptFileName || undefined}
                    />
                </div>

                <div className="flex justify-between pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                    >
                        {common('back')}
                    </Button>
                    <Button type="submit">
                        {common('next')}
                    </Button>
                </div>
            </form>
        </div>
    );
}
