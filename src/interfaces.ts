export interface IGuildObjet {
    id: string;
    name: string;
    icon: string;
    owner: boolean;
    permissions: number;
    features: string[];
}

export interface IUserObjet {
    _id: string;
    username: string;
    avatar: string;
    discriminator: string;
    flags: number;
    guilds: IGuildObjet[];
    locale: string;
    mfa_enabled: boolean;
    public_flags: number;
    timestamp: number;
}

export interface IPerfil {
    _id: string;
    /**
     * Dinero en el bolsillo del usuario.
     */
    dinero: number;
    /**
     * Dinero guardado en su banco.
     */
    banco: number;
    /**
     * Si el usuario está bloqueado.
     */
    bloqueado: boolean;
    /**
     * Inventario de items del usaurio.
     */
    inventario: {
        /**
         * Array de items.
         */
        items: IItemInventory[];
    };
}

export interface ISistemas {
    /**
     * Color principal personalizado de embeds en el servidor.
     */
    colorname?: string;
    images?: {
        fichas?: string[];
        flipcoin?: {
            cara: string;
            sello: string;
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
        categoria?: string;
    };
    /**
     * Prefijo personalizado del bot en el servidor.
     */
    prefix?: string;
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
    /**
     * Lista de comandos que no se podrán usar si el usuario está en ella.
     */
    blacklist?: {
        /**
         * Nombre del comando o categoría que será el afectado
         * para no poderse usar.
         */
        name: string;
        /**
         * Lista de afectados que es el id de un usuario, rol, canal
         * o la palabra "server" para todos los usuarios.
         */
        list: string[];
    }[];
    /**
     * Lista de comandos que ciertos usuarios que estén en la lista se
     * librarán de la BlackList.
     */
    whitelist?: {
        /**
         * Nombre del comando o categoría que será el afectado
         * para poderse usase.
         */
        name: string;
        /**
         * Lista de afectados que es el id de un usuario, rol o canal.
         */
        list: string[];
    }[];
    moneda?: {
        id?: string;
        name?: string;
    };
    pago?: {
        mensajes?: {
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
    multa?: {
        rob?: {
            min: number;
            max: number;
            fail: number;
        };
        tarde?: {
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
        mensajes?: number;
        daily?: number;
        rob?: number;
        crime?: number;
        tarde?: number;
        work?: number;
        trade?: number;
        dice?: number;
        roulette?: number;
        slotmachine?: number;
        flipcoin?: number;
        loot?: number;
    };
    chatExcluido?: string[];
}

export type ILanguages = "en-US" | "es-ES" | "es-MX" | "pt-BR";

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
