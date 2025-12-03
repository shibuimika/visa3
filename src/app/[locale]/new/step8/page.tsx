"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { StepIndicator } from "@/components/layout/StepIndicator";
import { useFormContext } from "@/lib/form-context";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

export default function NewStep8Page() {
    const t = useTranslations('newApplication.step8');
    const common = useTranslations('common');
    const router = useRouter();
    const { formData, updateFormData } = useFormContext();

    const step8Schema = z.object({
        reasonForJapan: z.string().min(50, t('errors.minLength')),
        reasonForSchool: z.string().min(50, t('errors.minLength')),
        futurePlan: z.string().refine((val) => ["study", "work", "undecided"].includes(val), {
            message: t('errors.selectRequired'),
        }),
    });

    type Step8Values = z.infer<typeof step8Schema>;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<Step8Values>({
        resolver: zodResolver(step8Schema),
        defaultValues: {
            reasonForJapan: "",
            reasonForSchool: "",
            futurePlan: "",
        },
    });

    useEffect(() => {
        if (formData) {
            reset({
                reasonForJapan: formData.reasonForJapan || "",
                reasonForSchool: formData.reasonForSchool || "",
                futurePlan: formData.futurePlan || "",
            });
        }
    }, [formData, reset]);

    const onSubmit = (data: Step8Values) => {
        updateFormData(data);
        router.push("/new/step9");
    };

    return (
        <div className="space-y-6">
            <StepIndicator currentStep={8} totalSteps={10} label={t('progress')} />

            <div className="space-y-2">
                <h1 className="text-xl font-bold text-foreground">{t('title')}</h1>
                <p className="text-sm text-muted-foreground">
                    {t('description')}
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-1">
                    <label className="text-sm font-medium text-foreground">{t('reasonForJapan')}</label>
                    <textarea
                        className="flex min-h-[120px] w-full rounded-md border border-border bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                        placeholder={t('placeholders.reasonForJapan')}
                        {...register("reasonForJapan")}
                    />
                    {errors.reasonForJapan && (
                        <p className="text-xs text-destructive">{errors.reasonForJapan.message}</p>
                    )}
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-foreground">{t('reasonForSchool')}</label>
                    <textarea
                        className="flex min-h-[80px] w-full rounded-md border border-border bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                        placeholder={t('placeholders.reasonForSchool')}
                        {...register("reasonForSchool")}
                    />
                    {errors.reasonForSchool && (
                        <p className="text-xs text-destructive">{errors.reasonForSchool.message}</p>
                    )}
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-foreground">{t('futurePlan')}</label>
                    <select
                        className="flex h-10 w-full rounded-md border border-border bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                        {...register("futurePlan")}
                    >
                        <option value="">{t('placeholders.select')}</option>
                        <option value="study">{t('options.study')}</option>
                        <option value="work">{t('options.work')}</option>
                        <option value="undecided">{t('options.undecided')}</option>
                    </select>
                    {errors.futurePlan && (
                        <p className="text-xs text-destructive">{errors.futurePlan.message}</p>
                    )}
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
