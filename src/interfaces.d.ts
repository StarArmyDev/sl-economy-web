import { Document, ObjectId } from 'mongoose';

/**
 * @module DB
 */
interface IApiRole extends Document {
    name: string;
}
interface IApiUser extends Document {
    username: string;
    email?: string;
    emailVerified: boolean;
    password?: string;
    roles: ObjectId[];
}
interface IUser extends Document {
    _id: string;
    avatar: string;
    username: string;
    discriminator: string;
    public_flags?: number;
    flags?: number;
    locale?: string;
    mfa_enabled?: boolean;
    provider?: string;
    accessToken?: string;
    fetchedAt?: Date;
}
interface IPerfil extends Document {
    _id: string;
    dinero: number;
    banco: number;
    bloqueado: boolean;
    inventario: {
        bloqueado: boolean;
        items: IItemInventory[];
    };
}
interface ISistemas extends Document {
    moneda?: {
        id?: string;
        name?: string;
    };
    colorname?: string;
    images?: {
        fichas?: string[];
        flicoin?: {
            cara: string;
            sello: string;
        };
        dice?: {
            1: string;
            2: string;
            3: string;
            4: string;
            5: string;
            6: string;
        };
    };
    buy?: {
        categoria?: string;
    };
    prefix?: string;
    language?: {
        channels?: {
            id: string;
            lang: string;
        }[];
        server?: string;
    };
    blacklist?: any;
    whitelist?: any;
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
        flicoin?: {
            min: number;
            max: number;
        };
        roulette?: {
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
        roulette?: {
            min: number;
            max: number;
        };
        flicoin?: {
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
        flicoin?: number;
        loot?: number;
    };
    chatExcluido?: string[];
}
interface ITienda extends Document {
    items: IItem[];
}

//========[ Utilidades

interface IItem {
    _id: number;
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
    obtiene: {
        rol?: string;
        canal?: 'text' | 'voice';
    };
    requiere: {
        rol?: string;
        saldo?: number;
    };
    eliminar: {
        rol?: string;
    };
    mensaje?: string;
    evento?: string;
}

interface IItemInventory {
    _id: number;
    cantidad: number;
}

interface MesesVotos {
    Enero: number;
    Febrero: number;
    Marzo: number;
    Abril: number;
    Mayo: number;
    Junio: number;
    Julio: number;
    Agosto: number;
    Septiembre: number;
    Octubre: number;
    Noviembre: number;
    Diciembre: number;
}

interface IGuildObjet {
    id: string;
    name: string;
    icon: string;
    owner: boolean;
    permissions: number;
    features: string[];
    permissions_new: string;
    db?: {
        dinero: number;
        banco: number;
        items: IItemInventory[];
    };
}

interface IUserObjet {
    username: string;
    id: string;
    avatar: string;
    discriminator: string;
    flags: number;
    guilds: IGuildObjet[];
    locale: string;
    mfa_enabled: boolean;
    public_flags: number;
    timestamp: number;
}
