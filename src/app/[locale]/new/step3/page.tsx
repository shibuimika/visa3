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

export default function NewStep3Page() {
    const t = useTranslations('newApplication.step3');
    const common = useTranslations('common');
    const router = useRouter();
    const { formData, updateFormData } = useFormContext();

    const step3Schema = z.object({
        father: z.object({
            name: z.string().optional(),
            birthDate: z.string().optional(),
            occupation: z.string().optional(),
            address: z.string().optional(),
        }),
        mother: z.object({
            name: z.string().optional(),
            birthDate: z.string().optional(),
            occupation: z.string().optional(),
            address: z.string().optional(),
        }),
        emergencyContact: z.object({
            name: z.string().min(1, t('errors.nameRequired')),
            relation: z.string().min(1, t('errors.relationRequired')),
            phone: z.string().min(1, t('errors.phoneRequired')),
        }),
    });

    type Step3Values = z.infer<typeof step3Schema>;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<Step3Values>({
        resolver: zodResolver(step3Schema),
        defaultValues: {
            father: { name: "", birthDate: "", occupation: "", address: "" },
            mother: { name: "", birthDate: "", occupation: "", address: "" },
            emergencyContact: { name: "", relation: "", phone: "" },
        },
    });

    useEffect(() => {
        if (formData) {
            reset({
                father: formData.father || { name: "", birthDate: "", occupation: "", address: "" },
                mother: formData.mother || { name: "", birthDate: "", occupation: "", address: "" },
                emergencyContact: formData.emergencyContact || { name: "", relation: "", phone: "" },
            });
        }
    }, [formData, reset]);

    const onSubmit = (data: Step3Values) => {
        updateFormData(data);
        router.push("/new/step4");
    };

    return (
        <div className="space-y-6">
            <StepIndicator currentStep={3} totalSteps={10} label={t('progress')} />

            <div className="space-y-2">
                <h1 className="text-xl font-bold text-foreground">{t('title')}</h1>
                <p className="text-sm text-muted-foreground">
                    {t('description')}
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Father */}
                <div className="space-y-4 rounded-lg border border-border p-4 bg-muted">
                    <h2 className="font-semibold text-foreground">{t('father')}</h2>
                    <Input
                        label={t('name')}
                        {...register("father.name")}
                    />
                    <Input
                        label={t('birthDate')}
                        type="date"
                        {...register("father.birthDate")}
                    />
                    <Input
                        label={t('occupation')}
                        {...register("father.occupation")}
                    />
                    <Input
                        label={t('address')}
                        {...register("father.address")}
                    />
                </div>

                {/* Mother */}
                <div className="space-y-4 rounded-lg border border-border p-4 bg-muted">
                    <h2 className="font-semibold text-foreground">{t('mother')}</h2>
                    <Input
                        label={t('name')}
                        {...register("mother.name")}
                    />
                    <Input
                        label={t('birthDate')}
                        type="date"
                        {...register("mother.birthDate")}
                    />
                    <Input
                        label={t('occupation')}
                        {...register("mother.occupation")}
                    />
                    <Input
                        label={t('address')}
                        {...register("mother.address")}
                    />
                </div>

                {/* Emergency Contact */}
                <div className="space-y-4 rounded-lg border border-blue-100 p-4 bg-blue-50">
                    <h2 className="font-semibold text-blue-900">{t('emergencyContact')}</h2>
                    <Input
                        label={t('name')}
                        error={errors.emergencyContact?.name?.message}
                        {...register("emergencyContact.name")}
                    />
                    <Input
                        label={t('relation')}
                        placeholder={t('placeholders.relation')}
                        error={errors.emergencyContact?.relation?.message}
                        {...register("emergencyContact.relation")}
                    />
                    <Input
                        label={t('phone')}
                        error={errors.emergencyContact?.phone?.message}
                        {...register("emergencyContact.phone")}
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
