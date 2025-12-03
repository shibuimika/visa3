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

export default function NewStep10Page() {
    const t = useTranslations('newApplication.step10');
    const common = useTranslations('common');
    const router = useRouter();
    const { formData, updateFormData } = useFormContext();

    const step10Schema = z.object({
        plannedAddress: z.string().min(1, t('errors.inputRequired')),
        supporter: z.string().min(1, t('errors.selectRequired')),
        partTimeJob: z.string().refine((val) => ["yes", "no"].includes(val), {
            message: t('errors.selectRequired'),
        }),
        partTimeJobReason: z.string().optional(),
    }).superRefine((data, ctx) => {
        if (data.partTimeJob === "yes") {
            if (!data.partTimeJobReason) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: t('errors.reasonRequired'),
                    path: ["partTimeJobReason"],
                });
            }
        }
    });

    type Step10Values = z.infer<typeof step10Schema>;

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
    } = useForm<Step10Values>({
        resolver: zodResolver(step10Schema),
        defaultValues: {
            plannedAddress: "",
            supporter: "",
            partTimeJob: "no",
            partTimeJobReason: "",
        },
    });

    const partTimeJob = watch("partTimeJob");

    useEffect(() => {
        if (formData) {
            reset({
                plannedAddress: formData.plannedAddress || "",
                supporter: formData.supporter || "",
                partTimeJob: (formData.partTimeJob as "yes" | "no") || "no",
                partTimeJobReason: formData.partTimeJobReason || "",
            });
        }
    }, [formData, reset]);

    const onSubmit = (data: Step10Values) => {
        updateFormData(data);
        router.push("/new/confirm");
    };

    return (
        <div className="space-y-6">
            <StepIndicator currentStep={10} totalSteps={10} label={t('progress')} />

            <div className="space-y-2">
                <h1 className="text-xl font-bold text-foreground">{t('title')}</h1>
                <p className="text-sm text-muted-foreground">
                    {t('description')}
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-1">
                    <label className="text-sm font-medium text-foreground">{t('plannedAddress')}</label>
                    <select
                        className="flex h-10 w-full rounded-md border border-border bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                        {...register("plannedAddress")}
                    >
                        <option value="">{t('errors.selectRequired')}</option>
                        <option value="dormitory">{t('options.dormitory')}</option>
                        <option value="apartment">{t('options.apartment')}</option>
                        <option value="relative">{t('options.relative')}</option>
                        <option value="undecided">{t('options.undecided')}</option>
                    </select>
                    {errors.plannedAddress && (
                        <p className="text-xs text-destructive">{errors.plannedAddress.message}</p>
                    )}
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-foreground">{t('supporter')}</label>
                    <select
                        className="flex h-10 w-full rounded-md border border-border bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                        {...register("supporter")}
                    >
                        <option value="">{t('errors.selectRequired')}</option>
                        <option value="self">{t('options.self')}</option>
                        <option value="family">{t('options.family')}</option>
                        <option value="scholarship">{t('options.scholarship')}</option>
                        <option value="other">{t('options.other')}</option>
                    </select>
                    {errors.supporter && (
                        <p className="text-xs text-destructive">{errors.supporter.message}</p>
                    )}
                </div>

                <div className="space-y-4">
                    <label className="text-sm font-medium text-foreground">
                        {t('partTimeJob')}
                    </label>
                    <div className="flex space-x-4">
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                value="yes"
                                className="h-4 w-4 text-primary focus:ring-ring"
                                {...register("partTimeJob")}
                            />
                            <span>{t('yes')}</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                value="no"
                                className="h-4 w-4 text-primary focus:ring-ring"
                                {...register("partTimeJob")}
                            />
                            <span>{t('no')}</span>
                        </label>
                    </div>
                    {errors.partTimeJob && (
                        <p className="text-xs text-destructive">{errors.partTimeJob.message}</p>
                    )}

                    {partTimeJob === "yes" && (
                        <div className="pl-4 border-l-2 border-blue-100 space-y-4">
                            <Input
                                label={t('partTimeJobReason')}
                                placeholder={t('placeholders.partTimeJobReason')}
                                error={errors.partTimeJobReason?.message}
                                {...register("partTimeJobReason")}
                            />
                        </div>
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
                        {t('next')}
                    </Button>
                </div>
            </form>
        </div>
    );
}
