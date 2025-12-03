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

export default function NewStep4Page() {
    const t = useTranslations('newApplication.step4');
    const common = useTranslations('common');
    const router = useRouter();
    const { formData, updateFormData } = useFormContext();

    const step4Schema = z.object({
        institutionName: z.string().min(1, t('errors.institutionNameRequired')),
        periodStart: z.string().min(1, t('errors.periodStartRequired')),
        periodEnd: z.string().min(1, t('errors.periodEndRequired')),
        totalHours: z.coerce.number().min(1, t('errors.totalHoursRequired')),
        jlptScore: z.string().optional(),
    }).refine((data) => {
        const start = new Date(data.periodStart);
        const end = new Date(data.periodEnd);
        return end > start;
    }, {
        message: t('errors.periodEndInvalid'),
        path: ["periodEnd"],
    });

    type Step4Values = z.infer<typeof step4Schema>;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<Step4Values>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(step4Schema) as any,
        defaultValues: {
            institutionName: "",
            periodStart: "",
            periodEnd: "",
            totalHours: 0,
            jlptScore: "",
        },
    });

    const [proofFile, setProofFile] = useState<File | null>(null);
    const [proofFileName, setProofFileName] = useState<string | null>(null);
    const [jlptFile, setJlptFile] = useState<File | null>(null);
    const [jlptFileName, setJlptFileName] = useState<string | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);

    useEffect(() => {
        if (formData) {
            reset({
                institutionName: formData.institutionName || "",
                periodStart: formData.periodStart || "",
                periodEnd: formData.periodEnd || "",
                totalHours: formData.totalHours || 0,
                jlptScore: formData.jlptScore || "",
            });
            // eslint-disable-next-line react-hooks/exhaustive-deps
            // eslint-disable-next-line react-hooks/exhaustive-deps
            if (formData.proofFileName) setProofFileName(formData.proofFileName);
            if (formData.jlptFileName) setJlptFileName(formData.jlptFileName);
        }
    }, [formData, reset]);

    const onSubmit = (data: Step4Values) => {
        if (!proofFile && !proofFileName) {
            setFileError(t('errors.proofFileRequired'));
            return;
        }

        updateFormData({
            ...data,
            proofFileName: proofFile ? proofFile.name : proofFileName,
            jlptFileName: jlptFile ? jlptFile.name : jlptFileName,
        });
        router.push("/new/step5");
    };

    return (
        <div className="space-y-6">
            <StepIndicator currentStep={4} totalSteps={10} label={t('progress')} />

            <div className="space-y-2">
                <h1 className="text-xl font-bold text-foreground">{t('title')}</h1>
                <p className="text-sm text-muted-foreground">
                    {t('description')}
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                    label={t('institutionName')}
                    placeholder={t('placeholders.institutionName')}
                    error={errors.institutionName?.message}
                    {...register("institutionName")}
                />

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label={t('periodStart')}
                        type="date"
                        error={errors.periodStart?.message}
                        {...register("periodStart")}
                    />
                    <Input
                        label={t('periodEnd')}
                        type="date"
                        error={errors.periodEnd?.message}
                        {...register("periodEnd")}
                    />
                </div>

                <Input
                    label={t('totalHours')}
                    type="number"
                    placeholder={t('placeholders.totalHours')}
                    error={errors.totalHours?.message}
                    {...register("totalHours")}
                />

                <FileUpload
                    label={t('proofFile')}
                    accept="image/*,application/pdf"
                    onChange={(file) => {
                        setProofFile(file);
                        setFileError(null);
                        if (file) setProofFileName(file.name);
                        else setProofFileName(null);
                    }}
                    fileName={proofFileName || undefined}
                    error={fileError || undefined}
                />

                <div className="border-t pt-4 mt-4">
                    <h3 className="font-medium text-foreground mb-4">{t('jlptSection')}</h3>
                    <Input
                        label={t('jlptScore')}
                        placeholder={t('placeholders.jlptScore')}
                        {...register("jlptScore")}
                    />
                    <div className="mt-4">
                        <FileUpload
                            label={t('jlptFile')}
                            accept="image/*,application/pdf"
                            onChange={(file) => {
                                setJlptFile(file);
                                if (file) setJlptFileName(file.name);
                                else setJlptFileName(null);
                            }}
                            fileName={jlptFileName || undefined}
                        />
                    </div>
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
