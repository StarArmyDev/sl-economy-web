export interface Message {
    id: string;
    content?: string;
    embeds?: Embed[];
    components?: Component[];
    time: Date;
    user: User;
}

export interface User {
    id: string;
    avatarUrl: string;
    username: string;
    tag: number;
    roles?: Role[];
}

export interface Role {
    id: string;
    name: string;
    color?: string;
}

export interface Embed {
    title?: string;
    description?: string;
    url?: string;
    timestamp?: Date;
    color?: string;
    footer?: Footer;
    thumbnail?: string;
    image?: string;
    author?: Author;
    fields?: Field[];
}

export interface Footer {
    text?: string;
    iconUrl?: string;
}

export interface Author {
    name?: string;
    url?: string;
    iconUrl?: string;
}

export interface Field {
    name: string;
    value: string;
    inline?: boolean;
}

export type Component = SelectMenuComponent | ButtonComponent;

export interface SelectMenuComponent {
    type: "SelectMenu";
    placeholder: string;
    options: SelectMenuOption[];
}

export interface SelectMenuOption {
    label: string;
    value: string;
    description?: string;
    emoji?: string;
    default?: boolean;
}

export interface ButtonComponent {
    type: "Button";
    customId?: string;
    label: string;
    style?: "PRIMARY" | "SECONDARY" | "SUCCESS" | "DANGER" | "LINK";
    url?: string;
    emoji?: string;
    disabled?: boolean;
}
