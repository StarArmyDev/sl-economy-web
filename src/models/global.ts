export interface IPerfil {
    /**
     * Dinero en el bolsillo del usuario.
     */
    dinero: number;
    /**
     * Dinero guardado en su banco.
     */
    banco: number;
    /**
     * Suma del dinero en el bolsillo y en el banco.
     */
    total: number;
    /**
     * Si el usuario está bloqueado.
     */
    locked: boolean;
    /**
     * Inventario de items del usaurio.
     */
    inventario: {
        /**
         * Si el usuario está bloqueado.
         */
        locked: boolean;
        /**
         * Array de items.
         */
        items: IItemInventory[];
    };
}

export interface ISistemas {
    _id?: string;
    /**
     * Color principal personalizado de embeds en el servidor.
     */
    colorMain?: string;
    images?: {
        records?: string[];
        flipcoin?: {
            face: string;
            stamp: string;
        };
        dice?: {
            _1: string;
            _2: string;
            _3: string;
            _4: string;
            _5: string;
            _6: string;
        };
    };
    buy?: {
        category?: string;
    };
    /**
     * Idioma con el que se manejarán los comandos.
     */
    language?: {
        /**
         * Idioma principal del servidor.
         */
        server?: ILanguages;
        /**
         * Canales con idomas personalizados.
         */
        channels?: {
            /**
             * Id del canal de discord.
             */
            id: string;
            /**
             * Idioma a usar en este canal.
             */
            lang: ILanguages;
        }[];
    };
    currency?: {
        id?: string;
        name?: string;
    };
    payment?: {
        messages?: {
            min: number;
            max: number;
        };
        crime?: {
            min: number;
            max: number;
        };
        daily?: number;
        dice?: {
            min: number;
            max: number;
        };
        flipcoin?: {
            min: number;
            max: number;
        };
        slotmachine?: {
            min: number;
            max: number;
        };
        trade?: {
            min: number;
            max: number;
        };
        work?: {
            min: number;
            max: number;
        };
    };
    fineAmount?: {
        rob?: {
            min: number;
            max: number;
            fail: number;
        };
        crime?: {
            min: number;
            max: number;
            fail: number;
        };
        trade?: {
            min: number;
            max: number;
            fail: number;
        };
        dice?: {
            min: number;
            max: number;
        };
        slotmachine?: {
            min: number;
            max: number;
        };
        flipcoin?: {
            min: number;
            max: number;
        };
        loot?: {
            min: number;
            max: number;
            fail: number;
        };
    };
    cooldown?: {
        crime?: number;
        daily?: number;
        dice?: number;
        flipcoin?: number;
        loot?: number;
        messages?: number;
        rob?: number;
        roulette?: number;
        slotmachine?: number;
        trade?: number;
        work?: number;
    };
    auditlogs?: {
        webhook?: {
            url: string;
        };
        onlyImportant?: boolean;
    };
    excludedChannels?: string[];
}

export interface ITienda {
    _id: string;
    /**
     * Lista de items del servidor
     */
    items: IItem[];
}

export interface IItem extends Document {
    _id: string | number;
    nombre: string;
    precio: {
        compra?: number;
        venta?: number;
    };
    descripcion: string;
    emoji?: string;
    disponible: boolean;
    transferible: boolean;
    basura: boolean;
    compraunica: boolean;
    tiempo?: number;
    stock?: number;
    requiere?: {
        rol?: string;
        item?: {
            id: string;
            cantidad: number;
            eliminar: boolean;
        };
        saldo?: number;
    };
    obtiene?: {
        rol?: string;
        canal?: 'text' | 'voice';
        item?: {
            id: string;
            cantidad: number;
        };
    };
    eliminar?: {
        rol?: string;
        item?: {
            id: string;
            cantidad: number;
        };
    };
    mensaje?: string;
    evento?: string;
}

export interface IItemInventory {
    /**
     * Id del item en la tienda.
     */
    _id: number;
    /**
     * Cantidad del item que tiene el usuario.
     */
    cantidad: number;
}

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
