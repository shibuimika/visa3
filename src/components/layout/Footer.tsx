import { useTranslations } from "next-intl";

export function Footer() {
    const t = useTranslations("common");
    return (
        <footer className="border-t border-border bg-muted py-6 mt-auto">
            <div className="container mx-auto px-4 text-center text-xs text-muted-foreground">
                {t("copyright", { year: new Date().getFullYear() })}
            </div>
        </footer>
    );
}
