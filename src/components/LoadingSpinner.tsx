import { useTranslation } from 'react-i18next';
import '@css/spinner.css';
import React from 'react';

export const LoadingSpinner = () => {
    const { t } = useTranslation('Global');
    const ref = React.useRef(document.getElementById('mainContainer')?.clientHeight || window.innerHeight);

    React.useEffect(() => {
        ref.current = document.getElementById('mainContainer')?.clientHeight || window.innerHeight;
    });

    return (
        <div className="spinner-container" style={{ height: ref.current }}>
            <div className="loader">
                <div className="loader--dot"></div>
                <div className="loader--dot"></div>
                <div className="loader--dot"></div>
                <div className="loader--dot"></div>
                <div className="loader--dot"></div>
                <div className="loader--dot"></div>
                <div className="loader--text">{t('loaging')}</div>
            </div>
        </div>
    );
};
