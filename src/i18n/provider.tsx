import updateLocale from 'dayjs/plugin/updateLocale';
import localStorage from 'redux-persist/es/storage';
import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import dayjs from 'dayjs';
import React from 'react';
import 'dayjs/locale/es';
import 'dayjs/locale/en';

import { LoadingSpinner } from '@app/components';
import { Languages, resources } from '.';

dayjs.extend(updateLocale);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isi18n, setI18n] = React.useState(false);
    const [lng, setLng] = React.useState<Languages>('en');

    React.useEffect(() => {
        const init = async () => {
            setI18n(true);
            const userLanguage = (await localStorage.getItem('language')) as 'en' | 'es';

            if (userLanguage) setLng(userLanguage);
            else {
                let localeLanguage = navigator.language || navigator.languages[0] || (navigator as any).userLanguage;
                localeLanguage = localeLanguage.split('-')[0].split('_')[0];

                if ((Object.keys(resources) as Languages[]).includes(localeLanguage)) setLng(localeLanguage);
            }

            i18n.use(initReactI18next).init({
                compatibilityJSON: 'v4',
                lng: lng,
                fallbackLng: 'en',
                preload: Object.keys(resources) as Languages[],
                resources: resources,
                interpolation: {
                    escapeValue: false,
                },
            });
        };

        init();

        // Configurar locale para dayjs
        dayjs.locale(lng === 'es' ? 'es' : 'en');
    }, [isi18n, lng]);

    if (!isi18n) return <LoadingSpinner />;

    return <>{children}</>;
};
