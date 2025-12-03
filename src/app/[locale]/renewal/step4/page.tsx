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

export default function RenewalStep4Page() {
    const t = useTranslations("renewal.step4");
    const common = useTranslations("common");
    const router = useRouter();
    const { formData, updateFormData } = useFormContext();

    const stepU4Schema = z.object({
        sponsorName: z.string().min(1, t("errors.sponsorNameRequired")),
        relation: z.string().min(1, t("errors.relationRequired")),
        annualIncome: z.coerce.number().min(1, t("errors.annualIncomeRequired")),
        remittanceAmount: z.coerce.number().optional(),
    });

    type StepU4Values = z.infer<typeof stepU4Schema>;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<StepU4Values>({
        resolver: zodResolver(stepU4Schema) as any,
        defaultValues: {
            sponsorName: "",
            relation: "",
            annualIncome: 0,
            remittanceAmount: 0,
        },
    });

    const [remittanceFile, setRemittanceFile] = useState<File | null>(null);
    const [remittanceFileName, setRemittanceFileName] = useState<string | null>(null);

    useEffect(() => {
        if (formData) {
            reset({
                sponsorName: formData.sponsorName || "",
                relation: formData.relation || "",
                annualIncome: formData.annualIncome || 0,
                remittanceAmount: formData.remittanceAmount || 0,
            });
            if (formData.remittanceFileName) setRemittanceFileName(formData.remittanceFileName);
        }
    }, [formData, reset]);

    const onSubmit = (data: StepU4Values) => {
        updateFormData({
            ...data,
            remittanceFileName: remittanceFile ? remittanceFile.name : remittanceFileName,
        });
        router.push("/renewal/step5");
    };

    return (
        <div className="space-y-6">
            <StepIndicator currentStep={5} totalSteps={7} label={t("progress")} />

            <div className="space-y-2">
                <h1 className="text-xl font-bold text-foreground">{t("title")}</h1>
                <p className="text-sm text-muted-foreground">
                    {t("description")}
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                    label={t("sponsorName")}
                    error={errors.sponsorName?.message}
                    {...register("sponsorName")}
                />
                <Input
                    label={t("relation")}
                    placeholder={t("placeholders.relation")}
                    error={errors.relation?.message}
                    {...register("relation")}
                />
                <Input
                    label={t("annualIncome")}
                    type="number"
                    error={errors.annualIncome?.message}
                    {...register("annualIncome")}
                />
                <Input
                    label={t("remittanceAmount")}
                    type="number"
                    placeholder={t("placeholders.remittanceAmount")}
                    {...register("remittanceAmount")}
                />

                <FileUpload
                    label={t("remittanceFile")}
                    accept="image/*,application/pdf"
                    onChange={(file) => {
                        setRemittanceFile(file);
                        if (file) setRemittanceFileName(file.name);
                        else setRemittanceFileName(null);
                    }}
                    fileName={remittanceFileName || undefined}
                />

                <div className="flex justify-between pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                    >
                        {common("back")}
                    </Button>
                    <Button type="submit">
                        {common("next")}
                    </Button>
                </div>
            </form>
        </div>
    );
}
