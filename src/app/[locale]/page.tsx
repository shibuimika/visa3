import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from "@/components/ui/Button";
import LanguageSelector from "@/components/common/LanguageSelector";

export default function Home() {
  const t = useTranslations('home');

  return (
    <div className="flex flex-col items-center justify-center space-y-8 pt-20 text-center">
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>

      <h1 className="text-3xl font-bold text-foreground">
        {t('title')}
      </h1>
      <p className="text-muted-foreground max-w-xs">
        {t('description')}
      </p>
      <Link href="/login">
        <Button size="lg">{t('start')}</Button>
      </Link>
    </div>
  );
}
