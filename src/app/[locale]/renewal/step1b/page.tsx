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

export default function RenewalStep1bPage() {
    const t = useTranslations("renewal.step1b");
    const common = useTranslations("common");
    const router = useRouter();
    const { formData, updateFormData } = useFormContext();

    const stepU1bSchema = z.object({
        residenceCardNumber: z.string().min(1, t("errors.residenceCardNumberRequired")),
        residenceExpiry: z.string().min(1, t("errors.residenceExpiryRequired")),
        passportNumber: z.string().min(1, t("errors.passportNumberRequired")),
        passportExpiry: z.string().min(1, t("errors.passportExpiryRequired")),
    });

    type StepU1bValues = z.infer<typeof stepU1bSchema>;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<StepU1bValues>({
        resolver: zodResolver(stepU1bSchema),
        defaultValues: {
            residenceCardNumber: "",
            residenceExpiry: "",
            passportNumber: "",
            passportExpiry: "",
        },
    });

    const [residenceCardFile, setResidenceCardFile] = useState<File | null>(null);
    const [passportFile, setPassportFile] = useState<File | null>(null);
    const [residenceCardFileName, setResidenceCardFileName] = useState<string | null>(null);
    const [passportFileName, setPassportFileName] = useState<string | null>(null);

    useEffect(() => {
        if (formData) {
            reset({
                residenceCardNumber: formData.residenceCardNumber || "",
                residenceExpiry: formData.residenceExpiry || "",
                passportNumber: formData.passportNumber || "",
                passportExpiry: formData.passportExpiry || "",
            });
            if (formData.residenceCardFileName) setResidenceCardFileName(formData.residenceCardFileName);
            if (formData.passportFileName) setPassportFileName(formData.passportFileName);
        }
    }, [formData, reset]);

    const onSubmit = (data: StepU1bValues) => {
        updateFormData({
            ...data,
            residenceCardFileName: residenceCardFile ? residenceCardFile.name : residenceCardFileName,
            passportFileName: passportFile ? passportFile.name : passportFileName,
        });
        router.push("/renewal/step2");
    };

    return (
        <div className="space-y-6">
            <StepIndicator currentStep={2} totalSteps={7} label={t("progress")} />

            <div className="space-y-2">
                <h1 className="text-xl font-bold text-foreground">{t("title")}</h1>
                <p className="text-sm text-muted-foreground">
                    {t("description")}
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                    <h3 className="font-medium text-foreground">{t("sections.residenceCard")}</h3>
                    <Input
                        label={t("residenceCardNumber")}
                        placeholder={t("placeholders.residenceCardNumber")}
                        error={errors.residenceCardNumber?.message}
                        {...register("residenceCardNumber")}
                    />
                    <Input
                        label={t("residenceExpiry")}
                        type="date"
                        error={errors.residenceExpiry?.message}
                        {...register("residenceExpiry")}
                    />
                    <FileUpload
                        label={t("files.residenceCard")}
                        accept="image/*,application/pdf"
                        onChange={(file) => {
                            setResidenceCardFile(file);
                            if (file) setResidenceCardFileName(file.name);
                            else setResidenceCardFileName(null);
                        }}
                        fileName={residenceCardFileName || undefined}
                    />
                </div>

                <div className="space-y-4">
                    <h3 className="font-medium text-foreground">{t("sections.passport")}</h3>
                    <Input
                        label={t("passportNumber")}
                        error={errors.passportNumber?.message}
                        {...register("passportNumber")}
                    />
                    <Input
                        label={t("passportExpiry")}
                        type="date"
                        error={errors.passportExpiry?.message}
                        {...register("passportExpiry")}
                    />
                    <FileUpload
                        label={t("files.passport")}
                        accept="image/*,application/pdf"
                        onChange={(file) => {
                            setPassportFile(file);
                            if (file) setPassportFileName(file.name);
                            else setPassportFileName(null);
                        }}
                        fileName={passportFileName || undefined}
                    />
                </div>

                <p className="text-xs text-muted-foreground">{t("note")}</p>

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
