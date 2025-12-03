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

export default function RenewalStep1Page() {
    const t = useTranslations("renewal.step1");
    const common = useTranslations("common");
    const router = useRouter();
    const { formData, updateFormData } = useFormContext();

    const stepU1Schema = z.object({
        name: z.string().min(1, t("errors.nameRequired")),
        birthDate: z.string().min(1, t("errors.birthDateRequired")),
        nationality: z.string().min(1, t("errors.nationalityRequired")),
        address: z.string().min(1, t("errors.addressRequired")),
        phone: z.string().min(1, t("errors.phoneRequired")),
        email: z.string().email(t("errors.emailInvalid")),
    });

    type StepU1Values = z.infer<typeof stepU1Schema>;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<StepU1Values>({
        resolver: zodResolver(stepU1Schema),
        defaultValues: {
            name: "",
            birthDate: "",
            nationality: "",
            address: "",
            phone: "",
            email: "",
        },
    });

    useEffect(() => {
        if (formData) {
            reset({
                name: formData.name || "",
                birthDate: formData.birthDate || "",
                nationality: formData.nationality || "",
                address: formData.address || "",
                phone: formData.phone || "",
                email: formData.email || "",
            });
        }
    }, [formData, reset]);

    const onSubmit = (data: StepU1Values) => {
        updateFormData(data);
        router.push("/renewal/step1b");
    };

    return (
        <div className="space-y-6">
            <StepIndicator currentStep={1} totalSteps={7} label={t("progress")} />

            <div className="space-y-2">
                <h1 className="text-xl font-bold text-foreground">{t("title")}</h1>
                <p className="text-sm text-muted-foreground">
                    {t("description")}
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                    label={t("name")}
                    placeholder={t("placeholders.name")}
                    error={errors.name?.message}
                    {...register("name")}
                />
                <Input
                    label={t("birthDate")}
                    type="date"
                    error={errors.birthDate?.message}
                    {...register("birthDate")}
                />
                <Input
                    label={t("nationality")}
                    placeholder={t("placeholders.nationality")}
                    error={errors.nationality?.message}
                    {...register("nationality")}
                />
                <Input
                    label={t("address")}
                    placeholder={t("placeholders.address")}
                    error={errors.address?.message}
                    {...register("address")}
                />
                <Input
                    label={t("phone")}
                    placeholder={t("placeholders.phone")}
                    error={errors.phone?.message}
                    {...register("phone")}
                />
                <Input
                    label={t("email")}
                    type="email"
                    error={errors.email?.message}
                    {...register("email")}
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
