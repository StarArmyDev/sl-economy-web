import { ILanguages } from '.';

export interface Perfil {
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
        items: ItemInventory[];
    };
}

export interface AllProfilesInServer {
    userRank: {
        position: number;
        profile: {
            _id: string;
            dinero: number;
            banco: number;
            total: number;
            locked: boolean;
        };
    };
    profiles: ProfileTop[];
}

export interface ProfileTop {
    _id: string;
    dinero: number;
    banco: number;
    total: number;
    user: {
        _id: string;
        avatar: string;
        username: string;
        discriminator: string;
    };
}

export interface ServerSystem {
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

export interface Tienda {
    _id: string;
    /**
     * Lista de items del servidor
     */
    items: Item[];
}

export interface Item {
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

export interface ItemInventory {
    /**
     * Id del item en la tienda.
     */
    _id: number;
    /**
     * Cantidad del item que tiene el usuario.
     */
    cantidad: number;
}
