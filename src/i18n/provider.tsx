import localStorage from 'redux-persist/es/storage';
import { initReactI18next } from 'react-i18next';
import moment from 'moment';
import i18n from 'i18next';
import React from 'react';

import { LoadingSpinner } from '@app/components';
import { Languages, resources } from '.';

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
                compatibilityJSON: 'v3',
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

        //? Traducciones de fechas
        moment.updateLocale('es', {
            months: [
                'Enero',
                'Febrero',
                'Marzo',
                'Abril',
                'Mayo',
                'Junio',
                'Julio',
                'Agosto',
                'Septiembre',
                'Octubre',
                'Noviembre',
                'Diciembre',
            ],
            monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            weekdays: ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'],
            weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
            weekdaysMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
            longDateFormat: {
                LT: 'h:mm A',
                LTS: 'h:mm:ss A',
                L: 'DD/MM/YYYY',
                LL: 'D MMMM YYYY',
                LLL: 'D MMMM YYYY',
                LLLL: 'dddd, D MMMM YYYY',
            },
        });
        moment.updateLocale('en', {
            longDateFormat: {
                LT: 'h:mm A',
                LTS: 'h:mm:ss A',
                L: 'MM/DD/YYYY',
                LL: 'MMMM D YYYY',
                LLL: 'MMMM D YYYY',
                LLLL: 'dddd, MMMM D YYYY',
            },
        });
    }, [isi18n, lng]);

    if (!isi18n) return <LoadingSpinner />;

    return <>{children}</>;
};
