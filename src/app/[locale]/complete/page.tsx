import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export default function CompletePage() {
    const t = useTranslations("complete");

    return (
        <div className="flex flex-col items-center justify-center space-y-8 pt-20 text-center">
            <div className="rounded-full bg-accent/10 p-4">
                <CheckCircle className="h-12 w-12 text-accent" />
            </div>

            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
                <p className="text-muted-foreground max-w-xs mx-auto">
                    {t("message")}
                    <br />
                    {t("nextSteps")}
                </p>
            </div>

            <Link href="/">
                <Button variant="outline">{t("backToHome")}</Button>
            </Link>
        </div>
    );
}
