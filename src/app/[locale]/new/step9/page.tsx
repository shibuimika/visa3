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

export default function NewStep9Page() {
    const t = useTranslations('newApplication.step9');
    const common = useTranslations('common');
    const router = useRouter();
    const { formData, updateFormData } = useFormContext();

    const step9Schema = z.object({
        sponsorType: z.string().min(1, t('errors.selectRequired')),
        name: z.string().min(1, t('errors.nameRequired')),
        phone: z.string().min(1, t('errors.phoneRequired')),
        address: z.string().min(1, t('errors.addressRequired')),
        occupation: z.string().min(1, t('errors.occupationRequired')),
        employer: z.string().min(1, t('errors.employerRequired')),
        annualIncome: z.coerce.number().min(1, t('errors.annualIncomeRequired')),
    });

    type Step9Values = z.infer<typeof step9Schema>;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<Step9Values>({
        resolver: zodResolver(step9Schema) as any,
        defaultValues: {
            sponsorType: "",
            name: "",
            phone: "",
            address: "",
            occupation: "",
            employer: "",
            annualIncome: 0,
        },
    });

    const [balanceFile, setBalanceFile] = useState<File | null>(null);
    const [balanceFileName, setBalanceFileName] = useState<string | null>(null);
    const [statementFile, setStatementFile] = useState<File | null>(null);
    const [statementFileName, setStatementFileName] = useState<string | null>(null);
    const [letterFile, setLetterFile] = useState<File | null>(null);
    const [letterFileName, setLetterFileName] = useState<string | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);

    useEffect(() => {
        if (formData) {
            reset({
                sponsorType: formData.sponsorType || "",
                name: formData.name || "",
                phone: formData.phone || "",
                address: formData.address || "",
                occupation: formData.occupation || "",
                employer: formData.employer || "",
                annualIncome: formData.annualIncome || 0,
            });
            if (formData.balanceFileName) setBalanceFileName(formData.balanceFileName);
            if (formData.statementFileName) setStatementFileName(formData.statementFileName);
            if (formData.letterFileName) setLetterFileName(formData.letterFileName);
        }
    }, [formData, reset]);

    const onSubmit = (data: Step9Values) => {
        const errors: string[] = [];

        if (!balanceFile && !balanceFileName) {
            errors.push(t('errors.balanceFileRequired'));
        }
        if (!statementFile && !statementFileName) {
            errors.push(t('errors.statementFileRequired'));
        }
        if (!letterFile && !letterFileName) {
            errors.push(t('errors.letterFileRequired'));
        }

        if (errors.length > 0) {
            setFileError(`${t('errors.filesRequired')}${errors.join("、")}`);
            return;
        }

        updateFormData({
            ...data,
            balanceFileName: balanceFile ? balanceFile.name : balanceFileName,
            statementFileName: statementFile ? statementFile.name : statementFileName,
            letterFileName: letterFile ? letterFile.name : letterFileName,
        });
        router.push("/new/step10");
    };

    return (
        <div className="space-y-6">
            <StepIndicator currentStep={9} totalSteps={10} label={t('progress')} />

            <div className="space-y-2">
                <h1 className="text-xl font-bold text-foreground">{t('title')}</h1>
                <p className="text-sm text-muted-foreground">
                    {t('description')}
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-1">
                    <label className="text-sm font-medium text-foreground">{t('sponsorType')}</label>
                    <select
                        className="flex h-10 w-full rounded-md border border-border bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                        {...register("sponsorType")}
                    >
                        <option value="">{t('errors.selectRequired')}</option>
                        <option value="father">{t('options.father')}</option>
                        <option value="mother">{t('options.mother')}</option>
                        <option value="self">{t('options.self')}</option>
                        <option value="other">{t('options.other')}</option>
                    </select>
                    {errors.sponsorType && (
                        <p className="text-xs text-destructive">{errors.sponsorType.message}</p>
                    )}
                </div>

                <Input
                    label={t('name')}
                    error={errors.name?.message}
                    {...register("name")}
                />
                <Input
                    label={t('phone')}
                    error={errors.phone?.message}
                    {...register("phone")}
                />
                <Input
                    label={t('address')}
                    error={errors.address?.message}
                    {...register("address")}
                />
                <Input
                    label={t('occupation')}
                    error={errors.occupation?.message}
                    {...register("occupation")}
                />
                <Input
                    label={t('employer')}
                    error={errors.employer?.message}
                    {...register("employer")}
                />
                <Input
                    label={t('annualIncome')}
                    type="number"
                    error={errors.annualIncome?.message}
                    {...register("annualIncome")}
                />

                <div className="space-y-4 pt-2">
                    <h3 className="font-medium text-foreground">{t('requiredDocuments')}</h3>
                    {fileError && (
                        <p className="text-xs text-destructive">{fileError}</p>
                    )}
                    <FileUpload
                        label={t('balanceFile')}
                        accept="image/*,application/pdf"
                        onChange={(file) => {
                            setBalanceFile(file);
                            setFileError(null);
                            if (file) setBalanceFileName(file.name);
                            else setBalanceFileName(null);
                        }}
                        fileName={balanceFileName || undefined}
                    />

                    <FileUpload
                        label={t('statementFile')}
                        accept="image/*,application/pdf"
                        onChange={(file) => {
                            setStatementFile(file);
                            setFileError(null);
                            if (file) setStatementFileName(file.name);
                            else setStatementFileName(null);
                        }}
                        fileName={statementFileName || undefined}
                    />

                    <FileUpload
                        label={t('letterFile')}
                        accept="image/*,application/pdf"
                        onChange={(file) => {
                            setLetterFile(file);
                            setFileError(null);
                            if (file) setLetterFileName(file.name);
                            else setLetterFileName(null);
                        }}
                        fileName={letterFileName || undefined}
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
