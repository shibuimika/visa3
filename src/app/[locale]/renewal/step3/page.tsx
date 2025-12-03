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

export default function RenewalStep3Page() {
    const t = useTranslations("renewal.step3");
    const common = useTranslations("common");
    const router = useRouter();
    const { formData, updateFormData } = useFormContext();

    const stepU3Schema = z.object({
        hasPartTimeJob: z.string().refine((val) => ["yes", "no"].includes(val), {
            message: t("errors.selectRequired"),
        }),
        employerName: z.string().optional(),
        employerAddress: z.string().optional(),
        weeklyHours: z.coerce.number().optional(),
        monthlyIncome: z.coerce.number().optional(),
    }).superRefine((data, ctx) => {
        if (data.hasPartTimeJob === "yes") {
            if (!data.employerName) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, message: t("errors.employerNameRequired"), path: ["employerName"] });
            }
            if (!data.employerAddress) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, message: t("errors.employerAddressRequired"), path: ["employerAddress"] });
            }
            if (!data.weeklyHours) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, message: t("errors.weeklyHoursRequired"), path: ["weeklyHours"] });
            }
            if (!data.monthlyIncome) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, message: t("errors.monthlyIncomeRequired"), path: ["monthlyIncome"] });
            }
        }
    });

    type StepU3Values = z.infer<typeof stepU3Schema>;

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
    } = useForm<StepU3Values>({
        resolver: zodResolver(stepU3Schema) as any,
        defaultValues: {
            hasPartTimeJob: "no",
            employerName: "",
            employerAddress: "",
            weeklyHours: 0,
            monthlyIncome: 0,
        },
    });

    const hasPartTimeJob = watch("hasPartTimeJob");
    const [payslipFile, setPayslipFile] = useState<File | null>(null);
    const [payslipFileName, setPayslipFileName] = useState<string | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);

    useEffect(() => {
        if (formData) {
            reset({
                hasPartTimeJob: (formData.hasPartTimeJob as "yes" | "no") || "no",
                employerName: formData.employerName || "",
                employerAddress: formData.employerAddress || "",
                weeklyHours: formData.weeklyHours || 0,
                monthlyIncome: formData.monthlyIncome || 0,
            });
            if (formData.payslipFileName) setPayslipFileName(formData.payslipFileName);
        }
    }, [formData, reset]);

    const onSubmit = (data: StepU3Values) => {
        if (data.hasPartTimeJob === "yes") {
            if (!payslipFile && !payslipFileName) {
                setFileError(t("errors.payslipFileRequired"));
                return;
            }
        }

        updateFormData({
            ...data,
            payslipFileName: payslipFile ? payslipFile.name : payslipFileName,
        });
        router.push("/renewal/step4");
    };

    return (
        <div className="space-y-6">
            <StepIndicator currentStep={4} totalSteps={7} label={t("progress")} />

            <div className="space-y-2">
                <h1 className="text-xl font-bold text-foreground">{t("title")}</h1>
                <p className="text-sm text-muted-foreground">
                    {t("description")}
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-4">
                    <div className="flex space-x-4">
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                value="yes"
                                className="h-4 w-4 text-primary focus:ring-ring"
                                {...register("hasPartTimeJob")}
                            />
                            <span>{t("yes")}</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                value="no"
                                className="h-4 w-4 text-primary focus:ring-ring"
                                {...register("hasPartTimeJob")}
                            />
                            <span>{t("no")}</span>
                        </label>
                    </div>
                    {errors.hasPartTimeJob && (
                        <p className="text-xs text-destructive">{errors.hasPartTimeJob.message}</p>
                    )}

                    {hasPartTimeJob === "yes" && (
                        <div className="pl-4 border-l-2 border-blue-100 space-y-4">
                            <Input
                                label={t("employerName")}
                                error={errors.employerName?.message}
                                {...register("employerName")}
                            />
                            <Input
                                label={t("employerAddress")}
                                error={errors.employerAddress?.message}
                                {...register("employerAddress")}
                            />
                            <Input
                                label={t("weeklyHours")}
                                type="number"
                                error={errors.weeklyHours?.message}
                                {...register("weeklyHours")}
                            />
                            <Input
                                label={t("monthlyIncome")}
                                type="number"
                                error={errors.monthlyIncome?.message}
                                {...register("monthlyIncome")}
                            />

                            <FileUpload
                                label={t("payslipFile")}
                                accept="image/*,application/pdf"
                                onChange={(file) => {
                                    setPayslipFile(file);
                                    setFileError(null);
                                    if (file) setPayslipFileName(file.name);
                                    else setPayslipFileName(null);
                                }}
                                fileName={payslipFileName || undefined}
                                error={fileError || undefined}
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
