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

export default function RenewalStep2Page() {
    const t = useTranslations("renewal.step2");
    const common = useTranslations("common");
    const router = useRouter();
    const { formData, updateFormData } = useFormContext();

    const stepU2Schema = z.object({
        address: z.string().min(1, t("errors.addressRequired")),
        rent: z.coerce.number().min(0, t("errors.rentRequired")),
        supporter: z.string().min(1, t("errors.supporterRequired")),
    });

    type StepU2Values = z.infer<typeof stepU2Schema>;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<StepU2Values>({
        resolver: zodResolver(stepU2Schema) as any,
        defaultValues: {
            address: "",
            rent: 0,
            supporter: "",
        },
    });

    useEffect(() => {
        if (formData) {
            reset({
                address: formData.address || "",
                rent: formData.rent || 0,
                supporter: formData.supporter || "",
            });
        }
    }, [formData, reset]);

    const onSubmit = (data: StepU2Values) => {
        updateFormData(data);
        router.push("/renewal/step3");
    };

    return (
        <div className="space-y-6">
            <StepIndicator currentStep={3} totalSteps={7} label={t("progress")} />

            <div className="space-y-2">
                <h1 className="text-xl font-bold text-foreground">{t("title")}</h1>
                <p className="text-sm text-muted-foreground">
                    {t("description")}
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                    label={t("address")}
                    placeholder={t("placeholders.address")}
                    error={errors.address?.message}
                    {...register("address")}
                />
                <Input
                    label={t("rent")}
                    type="number"
                    placeholder={t("placeholders.rent")}
                    error={errors.rent?.message}
                    {...register("rent")}
                />

                <div className="space-y-1">
                    <label className="text-sm font-medium text-foreground">{t("supporter")}</label>
                    <select
                        className="flex h-10 w-full rounded-md border border-border bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                        {...register("supporter")}
                    >
                        <option value="">{common("select")}</option>
                        <option value="self">{t("options.self")}</option>
                        <option value="family">{t("options.family")}</option>
                        <option value="scholarship">{t("options.scholarship")}</option>
                        <option value="other">{t("options.other")}</option>
                    </select>
                    {errors.supporter && (
                        <p className="text-xs text-destructive">{errors.supporter.message}</p>
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
