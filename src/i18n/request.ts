import { getRequestConfig } from 'next-intl/server';
import { routing } from './navigation';

// Static imports for all locale files
import ja from './locales/ja.json';
import en from './locales/en.json';
import zh from './locales/zh.json';
import vi from './locales/vi.json';

const messages = {
    ja,
    en,
    zh,
    vi
} as const;

export default getRequestConfig(async ({ requestLocale }) => {
    // This typically corresponds to the `[locale]` segment
    let locale = await requestLocale;

    // Ensure that a valid locale is used
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!locale || !routing.locales.includes(locale as any)) {
        locale = routing.defaultLocale;
    }

    return {
        locale,
        messages: messages[locale as keyof typeof messages]
    };
});
