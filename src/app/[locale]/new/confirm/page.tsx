"use client";

import { Button } from "@/components/ui/Button";
import { StepIndicator } from "@/components/layout/StepIndicator";
import { useFormContext } from "@/lib/form-context";
import { CheckCircle, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

export default function NewConfirmPage() {
    const t = useTranslations('newApplication.confirm');
    const tApp = useTranslations('newApplication');
    const router = useRouter();
    const { formData } = useFormContext();

    const onSubmit = async () => {
        // Simulate API submission
        console.log("Submitting New Application Data:", formData);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        router.push("/complete");
    };

    // Required files for new application
    const requiredFiles = [
        { key: "passportFileName", label: t('files.passportFileName') },
        { key: "proofFileName", label: t('files.proofFileName') },
        { key: "jlptFileName", label: t('files.jlptFileName'), optional: true },
        { key: "diplomaFileName", label: t('files.diplomaFileName') },
        { key: "transcriptFileName", label: t('files.transcriptFileName') },
        { key: "balanceFileName", label: t('files.balanceFileName') },
        { key: "statementFileName", label: t('files.statementFileName') },
        { key: "letterFileName", label: t('files.letterFileName') },
    ];

    const allRequiredFilesUploaded = requiredFiles
        .filter(f => !f.optional)
        .every(f => formData[f.key as keyof typeof formData]);

    // Helper to translate options safely
    const translateOption = (step: string, option: string | undefined) => {
        if (!option) return "";
        return tApp(`${step}.options.${option}`);
    };

    return (
        <div className="space-y-6">
            <StepIndicator currentStep={11} totalSteps={11} label={t('title')} />

            <div className="space-y-2">
                <h1 className="text-xl font-bold text-foreground">{t('pageTitle')}</h1>
                <p className="text-sm text-muted-foreground">
                    {t('description')}
                </p>
            </div>

            <div className="space-y-6 rounded-lg border-2 border-border p-4 bg-card text-sm">
                {/* 基本情報 */}
                <div className="space-y-2">
                    <h3 className="font-bold text-foreground border-b-2 border-primary pb-1">{t('sections.basicInfo')}</h3>
                    <p><span className="text-muted-foreground">{t('labels.nameRomaji')}:</span> {formData.nameRomaji}</p>
                    <p><span className="text-muted-foreground">{t('labels.nameNative')}:</span> {formData.nameNative}</p>
                    <p><span className="text-muted-foreground">{t('labels.birthDate')}:</span> {formData.birthDate}</p>
                    <p><span className="text-muted-foreground">{t('labels.nationality')}:</span> {formData.nationality}</p>
                    <p><span className="text-muted-foreground">{t('labels.homeAddress')}:</span> {formData.homeAddress}</p>
                    <p><span className="text-muted-foreground">{t('labels.homePhone')}:</span> {formData.homePhone}</p>
                    <p><span className="text-muted-foreground">{t('labels.email')}:</span> {formData.email}</p>
                </div>

                {/* パスポート情報 */}
                <div className="space-y-2">
                    <h3 className="font-bold text-foreground border-b-2 border-primary pb-1">{t('sections.passportInfo')}</h3>
                    <p><span className="text-muted-foreground">{t('labels.passportNumber')}:</span> {formData.passportNumber}</p>
                    <p><span className="text-muted-foreground">{t('labels.issueDate')}:</span> {formData.passportIssueDate}</p>
                    <p><span className="text-muted-foreground">{t('labels.expiryDate')}:</span> {formData.passportExpiryDate}</p>
                </div>

                {/* 家族・緊急連絡先 */}
                <div className="space-y-2">
                    <h3 className="font-bold text-foreground border-b-2 border-primary pb-1">{t('sections.familyInfo')}</h3>
                    <p className="font-medium">{t('labels.father')}</p>
                    <p><span className="text-muted-foreground">{t('labels.name')}:</span> {formData.father?.name}</p>
                    <p><span className="text-muted-foreground">{t('labels.birthDate')}:</span> {formData.father?.birthDate}</p>
                    <p><span className="text-muted-foreground">{t('labels.occupation')}:</span> {formData.father?.occupation}</p>

                    <p className="font-medium pt-2">{t('labels.mother')}</p>
                    <p><span className="text-muted-foreground">{t('labels.name')}:</span> {formData.mother?.name}</p>
                    <p><span className="text-muted-foreground">{t('labels.birthDate')}:</span> {formData.mother?.birthDate}</p>
                    <p><span className="text-muted-foreground">{t('labels.occupation')}:</span> {formData.mother?.occupation}</p>

                    <p className="font-medium pt-2">{t('labels.emergencyContact')}</p>
                    <p><span className="text-muted-foreground">{t('labels.name')}:</span> {formData.emergencyContact?.name}</p>
                    <p><span className="text-muted-foreground">{t('labels.relation')}:</span> {formData.emergencyContact?.relation}</p>
                    <p><span className="text-muted-foreground">{t('labels.phone')}:</span> {formData.emergencyContact?.phone}</p>
                </div>

                {/* 日本語学習歴 */}
                <div className="space-y-2">
                    <h3 className="font-bold text-foreground border-b-2 border-primary pb-1">{t('sections.japaneseStudy')}</h3>
                    <p><span className="text-muted-foreground">{t('labels.institutionName')}:</span> {formData.institutionName}</p>
                    <p><span className="text-muted-foreground">{t('labels.period')}:</span> {formData.periodStart} 〜 {formData.periodEnd}</p>
                    <p><span className="text-muted-foreground">{t('labels.totalHours')}:</span> {formData.totalHours}</p>
                    {formData.jlptScore && <p><span className="text-muted-foreground">{t('labels.jlptScore')}:</span> {formData.jlptScore}</p>}
                </div>

                {/* 学歴 */}
                <div className="space-y-2">
                    <h3 className="font-bold text-foreground border-b-2 border-primary pb-1">{t('sections.education')}</h3>
                    <p><span className="text-muted-foreground">{t('labels.schoolName')}:</span> {formData.schoolName}</p>
                    <p><span className="text-muted-foreground">{t('labels.graduationYear')}:</span> {formData.graduationYear}</p>
                    <p><span className="text-muted-foreground">{t('labels.major')}:</span> {formData.major}</p>
                </div>

                {/* 職歴（任意） */}
                {formData.companyName && (
                    <div className="space-y-2">
                        <h3 className="font-bold text-foreground border-b-2 border-primary pb-1">{t('sections.workHistory')}</h3>
                        <p><span className="text-muted-foreground">{t('labels.companyName')}:</span> {formData.companyName}</p>
                        <p><span className="text-muted-foreground">{t('labels.workPeriod')}:</span> {formData.period}</p>
                        <p><span className="text-muted-foreground">{t('labels.jobDescription')}:</span> {formData.jobDescription}</p>
                    </div>
                )}

                {/* 渡航歴 */}
                <div className="space-y-2">
                    <h3 className="font-bold text-foreground border-b-2 border-primary pb-1">{t('sections.travelHistory')}</h3>
                    <p><span className="text-muted-foreground">{t('labels.hasVisitedJapan')}:</span> {formData.hasVisitedJapan === "yes" ? t('yes') : t('no')}</p>
                    {formData.hasVisitedJapan === "yes" && (
                        <>
                            <p><span className="text-muted-foreground">{t('labels.visitDate')}:</span> {formData.visitDate}</p>
                            <p><span className="text-muted-foreground">{t('labels.visitPurpose')}:</span> {formData.visitPurpose}</p>
                        </>
                    )}
                    <p><span className="text-muted-foreground">{t('labels.hasAppliedVisa')}:</span> {formData.hasAppliedVisa === "yes" ? t('yes') : t('no')}</p>
                    {formData.hasAppliedVisa === "yes" && (
                        <p><span className="text-muted-foreground">{t('labels.applicationDetails')}:</span> {formData.applicationDetails}</p>
                    )}
                </div>

                {/* 留学目的 */}
                <div className="space-y-2">
                    <h3 className="font-bold text-foreground border-b-2 border-primary pb-1">{t('sections.studyPurpose')}</h3>
                    <p><span className="text-muted-foreground">{t('labels.reasonForJapan')}:</span> {formData.reasonForJapan}</p>
                    <p><span className="text-muted-foreground">{t('labels.reasonForSchool')}:</span> {formData.reasonForSchool}</p>
                    <p><span className="text-muted-foreground">{t('labels.futurePlan')}:</span> {translateOption('step8', formData.futurePlan)}</p>
                </div>

                {/* 経費支弁者 */}
                <div className="space-y-2">
                    <h3 className="font-bold text-foreground border-b-2 border-primary pb-1">{t('sections.financialSponsor')}</h3>
                    <p><span className="text-muted-foreground">{t('labels.sponsorType')}:</span> {translateOption('step9', formData.sponsorType)}</p>
                    <p><span className="text-muted-foreground">{t('labels.name')}:</span> {formData.name}</p>
                    <p><span className="text-muted-foreground">{t('labels.phone')}:</span> {formData.phone}</p>
                    <p><span className="text-muted-foreground">{t('labels.address')}:</span> {formData.address}</p>
                    <p><span className="text-muted-foreground">{t('labels.occupation')}:</span> {formData.occupation}</p>
                    <p><span className="text-muted-foreground">{t('labels.employer')}:</span> {formData.employer}</p>
                    <p><span className="text-muted-foreground">{t('labels.annualIncome')}:</span> {formData.annualIncome}</p>
                </div>

                {/* 日本での生活計画 */}
                <div className="space-y-2">
                    <h3 className="font-bold text-foreground border-b-2 border-primary pb-1">{t('sections.lifePlan')}</h3>
                    <p><span className="text-muted-foreground">{t('labels.plannedAddress')}:</span> {translateOption('step10', formData.plannedAddress)}</p>
                    <p><span className="text-muted-foreground">{t('labels.supporter')}:</span> {translateOption('step10', formData.supporter)}</p>
                    <p><span className="text-muted-foreground">{t('labels.partTimeJob')}:</span> {formData.partTimeJob === "yes" ? t('yes') : t('no')}</p>
                    {formData.partTimeJob === "yes" && (
                        <p><span className="text-muted-foreground">{t('labels.partTimeJobReason')}:</span> {formData.partTimeJobReason}</p>
                    )}
                </div>

                {/* 提出書類確認 */}
                <div className="space-y-3">
                    <h3 className="font-bold text-foreground border-b-2 border-primary pb-1">{t('sections.documents')}</h3>
                    <div className="space-y-2">
                        {requiredFiles.map((file) => {
                            const isUploaded = formData[file.key as keyof typeof formData];
                            return (
                                <div key={file.key} className="flex items-center gap-2">
                                    {isUploaded ? (
                                        <CheckCircle className="h-4 w-4 text-accent" />
                                    ) : (
                                        <XCircle className="h-4 w-4 text-destructive" />
                                    )}
                                    <span className={isUploaded ? "text-foreground" : "text-destructive"}>
                                        {file.label}
                                        {file.optional && <span className="text-muted-foreground text-xs ml-1">{t('files.optional')}</span>}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                    {!allRequiredFilesUploaded && (
                        <p className="text-xs text-destructive mt-2">
                            {t('incompleteFiles')}
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
                    {t('back') || 'Back'}
                </Button>
                <Button
                    onClick={onSubmit}
                    disabled={!allRequiredFilesUploaded}
                >
                    {t('submit')}
                </Button>
            </div>
        </div>
    );
}
