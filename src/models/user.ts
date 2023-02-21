import { Months } from '.';

export interface User {
    _id: string;
    avatar: string;
    username: string;
    discriminator: string;
    //=======[ Premium
    premium?: {
        /**
         * Si la membresía está activa.
         */
        isActive: boolean;
        /**
         * Si el usuario ya fue notificado.
         */
        wasNotified: boolean;
        /**
         * Fecha del último pago.
         */
        startDate: Date;
        /**
         * Tiempo de cuando se acabará su suscripción.
         * Generado con Date.now() + tiempo en milisegundos.
         */
        expiredTimestamp: number;
        /**
         * Cantidad máxima de servidores capaz de mejorar.
         */
        guildSlots: number;
        /**
         * Lista de servidores mejorados actualmente.
         */
        guilds: {
            /**
             * Id del serivor de Discord.
             */
            _id: string;
            /**
             * Id del shard en donde se encuentra el servidor.
             */
            shard: number;
            /**
             * Nombre del servidor.
             */
            name: string;
            /**
             * Icono del servidor.
             */
            icon?: string | null;
        }[];
        /**
         * Historial de pagos.
         */
        paymentHistory: {
            /**
             * Identificador del pago.
             */
            _id: string;
            /**
             * Fecha en el que se efectuó el pago.
             */
            date: Date;
            /**
             * Cantidad cobrada en dólares.
             */
            charged: number;
            /**
             * Métido de pago.
             */
            paymentMethod: string;
        }[];
    };
    //=======[ Votos
    votes: {
        total: number;
        years: {
            year: number;
            month: Months;
            total: number;
            votes: {
                botlist: string;
                count: number;
            }[];
        }[];
    };
    //=======[ No Importante
    public_flags?: number;
    flags?: number;
    locale?: string;
    mfa_enabled?: boolean;
    provider?: string;
    fetchedAt?: Date;
    //=======[ Access
    accessToken?: string;
    refreshToken?: string;
    //=======[ Guilds
    guilds?: GuildInfo[];
    //=======[ Permisos
    permissions?: Permissions[];
}

export type Permissions = 'Admin' | 'UserAdmin' | 'BotAdmin';

interface GuildInfo {
    id: string;
    name: string;
    icon?: string;
    owner: boolean;
    permissions: number;
    features?: string[];
}
