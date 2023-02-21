import ResourceFiles from '../translations';
import { Resource } from 'i18next';

export const resources = ResourceFiles;

export type Languages = keyof typeof ResourceFiles;

export type I18nResources = Resource & typeof ResourceFiles;

/* declare module 'react-i18next' {
    interface CustomTypeOptions {
        resources: typeof ResourceFiles;
    }
} */

export * from './provider';
