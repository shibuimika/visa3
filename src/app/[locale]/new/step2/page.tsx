"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FileUpload } from "@/components/form/FileUpload";
import { StepIndicator } from "@/components/layout/StepIndicator";
import { useFormContext } from "@/lib/form-context";
import { useEffect } from "react";
import React from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

export default function NewStep2Page() {
    const t = useTranslations('newApplication.step2');
    const common = useTranslations('common');
    const router = useRouter();
    const { formData, updateFormData } = useFormContext();

    const step2Schema = z.object({
        passportNumber: z.string().min(1, t('errors.passportNumberRequired')),
        passportIssueDate: z.string().min(1, t('errors.passportIssueDateRequired')),
        passportExpiryDate: z.string().min(1, t('errors.passportExpiryDateRequired')),
    }).refine((data) => {
        const issue = new Date(data.passportIssueDate);
        const expiry = new Date(data.passportExpiryDate);
        return expiry > issue;
    }, {
        message: t('errors.passportExpiryInvalid'),
        path: ["passportExpiryDate"],
    });

    type Step2Values = z.infer<typeof step2Schema>;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<Step2Values>({
        resolver: zodResolver(step2Schema),
        defaultValues: {
            passportNumber: "",
            passportIssueDate: "",
            passportExpiryDate: "",
        },
    });

    const [passportFile, setPassportFile] = React.useState<File | null>(null);
    const [passportFileName, setPassportFileName] = React.useState<string | null>(null);
    const [fileError, setFileError] = React.useState<string | null>(null);

    useEffect(() => {
        if (formData) {
            reset({
                passportNumber: formData.passportNumber || "",
                passportIssueDate: formData.passportIssueDate || "",
                passportExpiryDate: formData.passportExpiryDate || "",
            });
            if (formData.passportFileName) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                setPassportFileName(formData.passportFileName);
            }
        }
    }, [formData, reset]);

    const onSubmit = (data: Step2Values) => {
        if (!passportFile && !passportFileName) {
            setFileError(t('errors.passportFileRequired'));
            return;
        }

        updateFormData({
            ...data,
            passportFileName: passportFile ? passportFile.name : passportFileName,
        });
        router.push("/new/step3");
    };

    return (
        <div className="space-y-6">
            <StepIndicator currentStep={2} totalSteps={10} label={t('progress')} />

            <div className="space-y-2">
                <h1 className="text-xl font-bold text-foreground">{t('title')}</h1>
                <p className="text-sm text-muted-foreground">
                    {t('description')}
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                    label={t('passportNumber')}
                    placeholder={t('placeholders.passportNumber')}
                    error={errors.passportNumber?.message}
                    {...register("passportNumber")}
                />
                <Input
                    label={t('passportIssueDate')}
                    type="date"
                    error={errors.passportIssueDate?.message}
                    {...register("passportIssueDate")}
                />
                <Input
                    label={t('passportExpiryDate')}
                    type="date"
                    error={errors.passportExpiryDate?.message}
                    {...register("passportExpiryDate")}
                />

                <FileUpload
                    label={t('passportFile')}
                    accept="image/*,application/pdf"
                    onChange={(file) => {
                        setPassportFile(file);
                        setFileError(null);
                        if (file) setPassportFileName(file.name);
                        else setPassportFileName(null);
                    }}
                    fileName={passportFileName || undefined}
                    error={fileError || undefined}
                />

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
