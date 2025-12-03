"use client";

import { Button } from "@/components/ui/Button";
import { FileUpload } from "@/components/form/FileUpload";
import { StepIndicator } from "@/components/layout/StepIndicator";
import { useFormContext } from "@/lib/form-context";
import { useState, useEffect } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

export default function RenewalStep5Page() {
    const t = useTranslations("renewal.step5");
    const common = useTranslations("common");
    const router = useRouter();
    const { formData, updateFormData } = useFormContext();
    const [files, setFiles] = useState<{ [key: string]: string | null }>({});

    useEffect(() => {
        if (formData) {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            setFiles({
                residenceCard: formData.residenceCardFileName || null,
                passport: formData.passportFileName || null,
                payslip: formData.payslipFileName || null,
                remittance: formData.remittanceFileName || null,
            });
        }
    }, [formData]);

    const handleFileUpdate = (key: string, file: File | null) => {
        const fileName = file ? file.name : null;
        setFiles((prev) => ({ ...prev, [key]: fileName }));
        updateFormData({ [`${key}FileName`]: fileName });
    };

    const requiredDocs = [
        { key: "residenceCard", label: t("labels.residenceCard"), required: true },
        { key: "passport", label: t("labels.passport"), required: true },
        { key: "payslip", label: t("labels.payslip"), required: formData.hasPartTimeJob === "yes" },
        { key: "remittance", label: t("labels.remittance"), required: formData.supporter === "family" },
    ];

    const allRequiredUploaded = requiredDocs.every(
        (doc) => !doc.required || files[doc.key]
    );

    return (
        <div className="space-y-6">
            <StepIndicator currentStep={6} totalSteps={7} label={t("progress")} />

            <div className="space-y-2">
                <h1 className="text-xl font-bold text-foreground">{t("title")}</h1>
                <p className="text-sm text-muted-foreground">
                    {t("description")}
                </p>
            </div>

            <div className="space-y-4">
                {requiredDocs.map((doc) => {
                    if (!doc.required && !files[doc.key]) return null;

                    const isUploaded = !!files[doc.key];

                    return (
                        <div key={doc.key} className="rounded-lg border border-border p-4 bg-white shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                    {isUploaded ? (
                                        <CheckCircle className="h-5 w-5 text-accent" />
                                    ) : (
                                        <AlertCircle className="h-5 w-5 text-destructive" />
                                    )}
                                    <span className="font-medium text-foreground">{doc.label}</span>
                                    {doc.required && (
                                        <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">{t("status.required")}</span>
                                    )}
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    {isUploaded ? t("status.uploaded") : t("status.notUploaded")}
                                </span>
                            </div>

                            <FileUpload
                                label={isUploaded ? t("buttons.replace") : t("buttons.upload")}
                                accept="image/*,application/pdf"
                                onChange={(file) => handleFileUpdate(doc.key, file)}
                                fileName={files[doc.key] || undefined}
                            />
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-between pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                >
                    {common("back")}
                </Button>
                <Button
                    onClick={() => router.push("/renewal/step6")}
                    disabled={!allRequiredUploaded}
                >
                    {t("buttons.next")}
                </Button>
            </div>
        </div>
    );
}
