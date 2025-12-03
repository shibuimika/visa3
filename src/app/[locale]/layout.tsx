import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Inter } from "next/font/google";
import "../globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import { FormProvider } from "@/lib/form-context";
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/navigation';

const inter = Inter({ subsets: ["latin"] });

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    // Ensure that the incoming `locale` is valid
    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    // Providing all messages to the client
    // side is the easiest way to get started
    const messages = await getMessages();

    return (
        <html lang={locale}>
            <body className={cn(inter.className, "flex min-h-screen flex-col bg-background text-foreground")}>
                <NextIntlClientProvider messages={messages}>
                    <FormProvider>
                        <Header />
                        <main className="flex-1 w-full max-w-md mx-auto p-4">
                            {children}
                        </main>
                        <Footer />
                    </FormProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
