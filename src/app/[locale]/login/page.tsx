"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";

export default function LoginPage() {
    const t = useTranslations('login');
    const common = useTranslations('common');
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const loginSchema = z.object({
        email: z.string().email(t('errors.invalidEmail')),
        password: z.string().min(1, t('errors.required')),
    });

    type LoginValues = z.infer<typeof loginSchema>;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginValues) => {
        setIsLoading(true);
        // Dummy authentication
        console.log("Login data:", data);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API
        setIsLoading(false);
        router.push("/select-type");
    };

    return (
        <div className="flex flex-col items-center justify-center space-y-6 pt-10">
            <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-foreground">{t('title')}</h1>
                <p className="text-sm text-muted-foreground">
                    {t('title')}
                </p>
            </div>

            <div className="w-full max-w-sm space-y-4 rounded-lg bg-white p-6 shadow-sm border border-gray-100">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        id="email"
                        label={t('email')}
                        type="email"
                        placeholder="example@email.com"
                        error={errors.email?.message}
                        {...register("email")}
                    />
                    <Input
                        id="password"
                        label={t('password')}
                        type="password"
                        error={errors.password?.message}
                        {...register("password")}
                    />

                    <div className="flex justify-end">
                        <Link
                            href="#"
                            className="text-xs text-primary hover:underline"
                        >
                            {t('forgotPassword')}
                        </Link>
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? common('loading') : t('submit')}
                    </Button>
                </form>

                <div className="text-center text-xs text-muted-foreground">
                    <Link href="#" className="ml-1 text-primary hover:underline">
                        {t('register')}
                    </Link>
                </div>
            </div>
        </div>
    );
}
