"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { StepIndicator } from "@/components/layout/StepIndicator";
import { useFormContext } from "@/lib/form-context";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

export default function NewStep6Page() {
    const t = useTranslations('newApplication.step6');
    const common = useTranslations('common');
    const router = useRouter();
    const { formData, updateFormData } = useFormContext();

    const step6Schema = z.object({
        companyName: z.string().optional(),
        period: z.string().optional(),
        jobDescription: z.string().optional(),
    });

    type Step6Values = z.infer<typeof step6Schema>;

    const {
        register,
        handleSubmit,
        reset,
    } = useForm<Step6Values>({
        resolver: zodResolver(step6Schema),
        defaultValues: {
            companyName: "",
            period: "",
            jobDescription: "",
        },
    });

    useEffect(() => {
        if (formData) {
            reset({
                companyName: formData.companyName || "",
                period: formData.period || "",
                jobDescription: formData.jobDescription || "",
            });
        }
    }, [formData, reset]);

    const onSubmit = (data: Step6Values) => {
        updateFormData(data);
        router.push("/new/step7");
    };

    return (
        <div className="space-y-6">
            <StepIndicator currentStep={6} totalSteps={10} label={t('progress')} />

            <div className="space-y-2">
                <h1 className="text-xl font-bold text-foreground">{t('title')}</h1>
                <p className="text-sm text-muted-foreground">
                    {t('description')}
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                    label={t('companyName')}
                    placeholder={t('placeholders.companyName')}
                    {...register("companyName")}
                />
                <Input
                    label={t('period')}
                    placeholder={t('placeholders.period')}
                    {...register("period")}
                />
                <div className="space-y-1">
                    <label className="text-sm font-medium text-foreground">{t('jobDescription')}</label>
                    <textarea
                        className="flex min-h-[80px] w-full rounded-md border border-border bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                        placeholder={t('placeholders.jobDescription')}
                        {...register("jobDescription")}
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
