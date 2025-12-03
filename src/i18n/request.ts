import { getRequestConfig } from 'next-intl/server';
import { routing } from './navigation';
import { notFound } from 'next/navigation';

// Can be imported from a shared config

export default getRequestConfig(async ({ requestLocale }) => {
    // This typically corresponds to the `[locale]` segment
    let locale = await requestLocale;

    // Ensure that a valid locale is used
    if (!locale || !routing.locales.includes(locale as any)) {
        locale = routing.defaultLocale;
    }

    return {
        locale,
        messages: (await import(`./locales/${locale}.json`)).default
    };
});
