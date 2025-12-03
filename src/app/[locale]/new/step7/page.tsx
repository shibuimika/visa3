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

export default function NewStep7Page() {
    const t = useTranslations('newApplication.step7');
    const common = useTranslations('common');
    const router = useRouter();
    const { formData, updateFormData } = useFormContext();

    const step7Schema = z.object({
        hasVisitedJapan: z.string().refine((val) => ["yes", "no"].includes(val), {
            message: t('errors.selectRequired'),
        }),
        visitDate: z.string().optional(),
        visitPurpose: z.string().optional(),

        hasAppliedVisa: z.string().refine((val) => ["yes", "no"].includes(val), {
            message: t('errors.selectRequired'),
        }),
        applicationDetails: z.string().optional(),
    }).superRefine((data, ctx) => {
        if (data.hasVisitedJapan === "yes") {
            if (!data.visitDate) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: t('errors.visitDateRequired'),
                    path: ["visitDate"],
                });
            }
            if (!data.visitPurpose) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: t('errors.visitPurposeRequired'),
                    path: ["visitPurpose"],
                });
            }
        }
        if (data.hasAppliedVisa === "yes") {
            if (!data.applicationDetails) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: t('errors.applicationDetailsRequired'),
                    path: ["applicationDetails"],
                });
            }
        }
    });

    type Step7Values = z.infer<typeof step7Schema>;

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
    } = useForm<Step7Values>({
        resolver: zodResolver(step7Schema),
        defaultValues: {
            hasVisitedJapan: "no",
            visitDate: "",
            visitPurpose: "",
            hasAppliedVisa: "no",
            applicationDetails: "",
        },
    });

    const hasVisitedJapan = watch("hasVisitedJapan");
    const hasAppliedVisa = watch("hasAppliedVisa");

    useEffect(() => {
        if (formData) {
            reset({
                hasVisitedJapan: (formData.hasVisitedJapan as "yes" | "no") || "no",
                visitDate: formData.visitDate || "",
                visitPurpose: formData.visitPurpose || "",
                hasAppliedVisa: (formData.hasAppliedVisa as "yes" | "no") || "no",
                applicationDetails: formData.applicationDetails || "",
            });
        }
    }, [formData, reset]);

    const onSubmit = (data: Step7Values) => {
        updateFormData(data);
        router.push("/new/step8");
    };

    return (
        <div className="space-y-6">
            <StepIndicator currentStep={7} totalSteps={10} label={t('progress')} />

            <div className="space-y-2">
                <h1 className="text-xl font-bold text-foreground">{t('title')}</h1>
                <p className="text-sm text-muted-foreground">
                    {t('description')}
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Visit History */}
                <div className="space-y-4">
                    <label className="text-sm font-medium text-foreground">
                        {t('hasVisitedJapan')}
                    </label>
                    <div className="flex space-x-4">
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                value="yes"
                                className="h-4 w-4 text-primary focus:ring-ring"
                                {...register("hasVisitedJapan")}
                            />
                            <span>{t('yes')}</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                value="no"
                                className="h-4 w-4 text-primary focus:ring-ring"
                                {...register("hasVisitedJapan")}
                            />
                            <span>{t('no')}</span>
                        </label>
                    </div>
                    {errors.hasVisitedJapan && (
                        <p className="text-xs text-destructive">{errors.hasVisitedJapan.message}</p>
                    )}

                    {hasVisitedJapan === "yes" && (
                        <div className="pl-4 border-l-2 border-blue-100 space-y-4">
                            <Input
                                label={t('visitDate')}
                                type="date"
                                error={errors.visitDate?.message}
                                {...register("visitDate")}
                            />
                            <Input
                                label={t('visitPurpose')}
                                placeholder={t('placeholders.visitPurpose')}
                                error={errors.visitPurpose?.message}
                                {...register("visitPurpose")}
                            />
                        </div>
                    )}
                </div>

                {/* Visa Application History */}
                <div className="space-y-4">
                    <label className="text-sm font-medium text-foreground">
                        {t('hasAppliedVisa')}
                    </label>
                    <div className="flex space-x-4">
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                value="yes"
                                className="h-4 w-4 text-primary focus:ring-ring"
                                {...register("hasAppliedVisa")}
                            />
                            <span>{t('yes')}</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                value="no"
                                className="h-4 w-4 text-primary focus:ring-ring"
                                {...register("hasAppliedVisa")}
                            />
                            <span>{t('no')}</span>
                        </label>
                    </div>
                    {errors.hasAppliedVisa && (
                        <p className="text-xs text-destructive">{errors.hasAppliedVisa.message}</p>
                    )}

                    {hasAppliedVisa === "yes" && (
                        <div className="pl-4 border-l-2 border-blue-100 space-y-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-foreground">{t('applicationDetails')}</label>
                                <textarea
                                    className="flex min-h-[80px] w-full rounded-md border border-border bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                                    placeholder={t('placeholders.applicationDetails')}
                                    {...register("applicationDetails")}
                                />
                                {errors.applicationDetails && (
                                    <p className="text-xs text-destructive">{errors.applicationDetails.message}</p>
                                )}
                            </div>
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
                        {common('next')}
                    </Button>
                </div>
            </form>
        </div>
    );
}
