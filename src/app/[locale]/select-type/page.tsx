"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { StepIndicator } from "@/components/layout/StepIndicator";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

export default function SelectTypePage() {
    const t = useTranslations('selectType');
    const common = useTranslations('common');
    const router = useRouter();

    const selectTypeSchema = z.object({
        applicationType: z.string().refine((val) => ["new", "renewal"].includes(val), {
            message: t('errors.selectType'),
        }),
    });

    type SelectTypeValues = z.infer<typeof selectTypeSchema>;

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<SelectTypeValues>({
        resolver: zodResolver(selectTypeSchema),
    });

    const selectedType = watch("applicationType");

    const onSubmit = (data: SelectTypeValues) => {
        if (data.applicationType === "new") {
            router.push("/new/step1");
        } else {
            router.push("/renewal/step1");
        }
    };

    return (
        <div className="space-y-8">
            <StepIndicator currentStep={1} totalSteps={10} label={t('progress')} />

            <div className="space-y-4">
                <h1 className="text-2xl font-bold text-foreground">
                    {t('title')}
                </h1>
                <p className="text-sm text-muted-foreground">
                    {t('description')}
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-4">
                    <label className="cursor-pointer block">
                        <input
                            type="radio"
                            value="new"
                            className="peer sr-only"
                            {...register("applicationType")}
                        />
                        <div className={cn(
                            "rounded-lg border-2 p-4 transition-all hover:bg-muted peer-checked:border-primary peer-checked:bg-primary/5",
                            errors.applicationType ? "border-destructive" : "border-border"
                        )}>
                            <div className="font-bold text-foreground">
                                {t('new.title')}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                                {t('new.description')}
                            </div>
                        </div>
                    </label>

                    <label className="cursor-pointer block">
                        <input
                            type="radio"
                            value="renewal"
                            className="peer sr-only"
                            {...register("applicationType")}
                        />
                        <div className={cn(
                            "rounded-lg border-2 p-4 transition-all hover:bg-muted peer-checked:border-primary peer-checked:bg-primary/5",
                            errors.applicationType ? "border-destructive" : "border-border"
                        )}>
                            <div className="font-bold text-foreground">
                                {t('renewal.title')}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                                {t('renewal.description')}
                            </div>
                        </div>
                    </label>

                    {errors.applicationType && (
                        <p className="text-sm text-destructive">{errors.applicationType.message}</p>
                    )}
                </div>

                <div className="flex justify-end">
                    <Button
                        type="submit"
                        size="lg"
                        className="w-full"
                        disabled={!selectedType}
                    >
                        {common('next')}
                    </Button>
                </div>
            </form>
        </div>
    );
}
