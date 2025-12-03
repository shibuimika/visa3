import { Link } from "@/i18n/navigation";
import LanguageSelector from "@/components/common/LanguageSelector";

export function Header() {
    return (
        <header className="border-b border-border bg-card sticky top-0 z-50">
            <div className="container mx-auto flex h-14 items-center justify-between px-4">
                <Link href="/" className="text-lg font-bold text-primary">
                    VisaApply
                </Link>
                <LanguageSelector />
            </div>
        </header>
    );
}
