export type ILanguages = 'en-US' | 'es-ES' | 'es-MX' | 'pt-BR';

export enum Months {
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
}

export interface AlertMessage {
    show: boolean;
    message: string;
    title?: string;
    variant?: string;
    time?: number;
}

export interface ErrorResponse {
    error: string;
}
