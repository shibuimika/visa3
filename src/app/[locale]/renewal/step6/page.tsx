"use client";

import { Button } from "@/components/ui/Button";
import { StepIndicator } from "@/components/layout/StepIndicator";
import { useFormContext } from "@/lib/form-context";
import { CheckCircle, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

export default function RenewalStep6Page() {
    const t = useTranslations("renewal.step6");
    const common = useTranslations("common");
    const router = useRouter();
    const { formData } = useFormContext();

    const onSubmit = async () => {
        // Simulate API submission
        console.log("Submitting Renewal Data:", formData);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        router.push("/complete");
    };

    // Required files for renewal application
    const requiredFiles = [
        { key: "residenceCardFileName", label: t("files.residenceCardFileName") },
        { key: "passportFileName", label: t("files.passportFileName") },
        { key: "payslipFileName", label: t("files.payslipFileName"), optional: formData.hasPartTimeJob !== "yes" },
        { key: "remittanceFileName", label: t("files.remittanceFileName"), optional: true },
    ];

    const allRequiredFilesUploaded = requiredFiles
        .filter(f => !f.optional)
        .every(f => formData[f.key as keyof typeof formData]);

    return (
        <div className="space-y-6">
            <StepIndicator currentStep={7} totalSteps={7} label={t("progress")} />

            <div className="space-y-2">
                <h1 className="text-xl font-bold text-foreground">{t("title")}</h1>
                <p className="text-sm text-muted-foreground">
                    {t("description")}
                </p>
            </div>

            <div className="space-y-6 rounded-lg border-2 border-border p-4 bg-card text-sm">
                {/* 基本情報 */}
                <div className="space-y-2">
                    <h3 className="font-bold text-foreground border-b-2 border-primary pb-1">{t("sections.basicInfo")}</h3>
                    <p><span className="text-muted-foreground">{t("labels.name")}:</span> {formData.name}</p>
                    <p><span className="text-muted-foreground">{t("labels.birthDate")}:</span> {formData.birthDate}</p>
                    <p><span className="text-muted-foreground">{t("labels.nationality")}:</span> {formData.nationality}</p>
                    <p><span className="text-muted-foreground">{t("labels.address")}:</span> {formData.address}</p>
                    <p><span className="text-muted-foreground">{t("labels.phone")}:</span> {formData.phone}</p>
                    <p><span className="text-muted-foreground">{t("labels.email")}:</span> {formData.email}</p>
                </div>

                {/* 在留カード・パスポート情報 */}
                <div className="space-y-2">
                    <h3 className="font-bold text-foreground border-b-2 border-primary pb-1">{t("sections.residenceInfo")}</h3>
                    <p className="font-medium">{t("labels.residenceCard")}</p>
                    <p><span className="text-muted-foreground">{t("labels.residenceCardNumber")}:</span> {formData.residenceCardNumber}</p>
                    <p><span className="text-muted-foreground">{t("labels.residenceExpiry")}:</span> {formData.residenceExpiry}</p>

                    <p className="font-medium pt-2">{t("labels.passport")}</p>
                    <p><span className="text-muted-foreground">{t("labels.passportNumber")}:</span> {formData.passportNumber}</p>
                    <p><span className="text-muted-foreground">{t("labels.passportExpiry")}:</span> {formData.passportExpiry}</p>
                </div>

                {/* 生活状況 */}
                <div className="space-y-2">
                    <h3 className="font-bold text-foreground border-b-2 border-primary pb-1">{t("sections.livingInfo")}</h3>
                    <p><span className="text-muted-foreground">{t("labels.rent")}:</span> {formData.rent}円</p>
                    <p><span className="text-muted-foreground">{t("labels.supporter")}:</span> {formData.supporter}</p>
                </div>

                {/* アルバイト情報 */}
                <div className="space-y-2">
                    <h3 className="font-bold text-foreground border-b-2 border-primary pb-1">{t("sections.partTimeJobInfo")}</h3>
                    <p><span className="text-muted-foreground">{t("labels.partTimeJob")}:</span> {formData.hasPartTimeJob === "yes" ? t("yes") : t("no")}</p>
                    {formData.hasPartTimeJob === "yes" && (
                        <>
                            <p><span className="text-muted-foreground">{t("labels.employerName")}:</span> {formData.employerName}</p>
                            <p><span className="text-muted-foreground">{t("labels.employerAddress")}:</span> {formData.employerAddress}</p>
                            <p><span className="text-muted-foreground">{t("labels.weeklyHours")}:</span> {formData.weeklyHours}時間</p>
                            <p><span className="text-muted-foreground">{t("labels.monthlyIncome")}:</span> {formData.monthlyIncome}円</p>
                        </>
                    )}
                </div>

                {/* 経費支弁者 */}
                <div className="space-y-2">
                    <h3 className="font-bold text-foreground border-b-2 border-primary pb-1">{t("sections.sponsorInfo")}</h3>
                    <p><span className="text-muted-foreground">{t("labels.sponsorName")}:</span> {formData.sponsorName}</p>
                    <p><span className="text-muted-foreground">{t("labels.relation")}:</span> {formData.relation}</p>
                    <p><span className="text-muted-foreground">{t("labels.annualIncome")}:</span> {formData.annualIncome}</p>
                    {formData.remittanceAmount && (
                        <p><span className="text-muted-foreground">{t("labels.remittanceAmount")}:</span> {formData.remittanceAmount}円</p>
                    )}
                </div>

                {/* 提出書類確認 */}
                <div className="space-y-3">
                    <h3 className="font-bold text-foreground border-b-2 border-primary pb-1">{t("sections.documents")}</h3>
                    <div className="space-y-2">
                        {requiredFiles.map((file) => {
                            const isUploaded = formData[file.key as keyof typeof formData];
                            const isRequired = !file.optional;
                            return (
                                <div key={file.key} className="flex items-center gap-2">
                                    {isUploaded ? (
                                        <CheckCircle className="h-4 w-4 text-accent" />
                                    ) : (
                                        <XCircle className={`h-4 w-4 ${isRequired ? 'text-destructive' : 'text-muted-foreground'}`} />
                                    )}
                                    <span className={isUploaded ? "text-foreground" : (isRequired ? "text-destructive" : "text-muted-foreground")}>
                                        {file.label}
                                        {file.optional && <span className="text-muted-foreground text-xs ml-1">{t("files.optional")}</span>}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                    {!allRequiredFilesUploaded && (
                        <p className="text-xs text-destructive mt-2">
                            {t("incompleteFiles")}
                        </p>
                    )}
                </div>
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
                    onClick={onSubmit}
                    disabled={!allRequiredFilesUploaded}
                >
                    {common("submit")}
                </Button>
            </div>
        </div>
    );
}
