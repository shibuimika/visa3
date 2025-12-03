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

export default function NewStep1Page() {
    const t = useTranslations('newApplication.step1');
    const common = useTranslations('common');
    const router = useRouter();
    const { formData, updateFormData } = useFormContext();

    const step1Schema = z.object({
        nameRomaji: z.string().min(1, t('errors.nameRomajiRequired')),
        nameNative: z.string().min(1, t('errors.nameNativeRequired')),
        birthDate: z.string().min(1, t('errors.birthDateRequired')),
        nationality: z.string().min(1, t('errors.nationalityRequired')),
        homeAddress: z.string().min(1, t('errors.homeAddressRequired')),
        homePhone: z.string().regex(/^[0-9+\-]+$/, t('errors.homePhoneInvalid')).min(1, t('errors.homePhoneRequired')),
        email: z.string().email(t('errors.emailInvalid')).min(1, t('errors.emailRequired')),
    });

    type Step1Values = z.infer<typeof step1Schema>;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<Step1Values>({
        resolver: zodResolver(step1Schema),
        defaultValues: {
            nameRomaji: "",
            nameNative: "",
            birthDate: "",
            nationality: "",
            homeAddress: "",
            homePhone: "",
            email: "",
        },
    });

    useEffect(() => {
        if (formData) {
            reset({
                nameRomaji: formData.nameRomaji || "",
                nameNative: formData.nameNative || "",
                birthDate: formData.birthDate || "",
                nationality: formData.nationality || "",
                homeAddress: formData.homeAddress || "",
                homePhone: formData.homePhone || "",
                email: formData.email || "",
            });
        }
    }, [formData, reset]);

    const onSubmit = (data: Step1Values) => {
        updateFormData(data);
        router.push("/new/step2");
    };

    return (
        <div className="space-y-6">
            <StepIndicator currentStep={1} totalSteps={10} label={t('progress')} />

            <div className="space-y-2">
                <h1 className="text-xl font-bold text-foreground">{t('title')}</h1>
                <p className="text-sm text-muted-foreground">
                    {t('description')}
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                    label={t('nameRomaji')}
                    placeholder={t('placeholders.nameRomaji')}
                    error={errors.nameRomaji?.message}
                    {...register("nameRomaji")}
                />
                <Input
                    label={t('nameNative')}
                    placeholder={t('placeholders.nameNative')}
                    error={errors.nameNative?.message}
                    {...register("nameNative")}
                />
                <Input
                    label={t('birthDate')}
                    type="date"
                    error={errors.birthDate?.message}
                    {...register("birthDate")}
                />

                <div className="space-y-1">
                    <label className="text-sm font-medium text-foreground">{t('nationality')}</label>
                    <select
                        className="flex h-10 w-full rounded-md border border-border bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                        {...register("nationality")}
                    >
                        <option value="">{t('nationalitySelect')}</option>
                        <option value="China">{t('nationalityOptions.China')}</option>
                        <option value="Vietnam">{t('nationalityOptions.Vietnam')}</option>
                        <option value="Nepal">{t('nationalityOptions.Nepal')}</option>
                        <option value="Other">{t('nationalityOptions.Other')}</option>
                    </select>
                    {errors.nationality && (
                        <p className="text-xs text-destructive">{errors.nationality.message}</p>
                    )}
                </div>

                <Input
                    label={t('homeAddress')}
                    placeholder={t('placeholders.homeAddress')}
                    error={errors.homeAddress?.message}
                    {...register("homeAddress")}
                />
                <Input
                    label={t('homePhone')}
                    placeholder={t('placeholders.homePhone')}
                    error={errors.homePhone?.message}
                    {...register("homePhone")}
                />
                <Input
                    label={t('email')}
                    type="email"
                    placeholder={t('placeholders.email')}
                    error={errors.email?.message}
                    {...register("email")}
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
