export interface Category {
    id: string;
    name: string;
    commands: Command[];
}

export interface Command {
    name: string;
    description: string;
    descriptionShort?: string;
    options?: CommandOptionData[];
}

export type CommandOptionData = SubGroupData | NonOptionsData | ChannelOptionData | ChoicesData | AutocompleteOption | NumericOptionData | SubCommandData;

export interface CommandOptionsData {
    name: string;
    description: string;
    require?: boolean;
    autocomplete?: boolean;
}

export interface NonOptionsData extends CommandOptionsData {
    type: NonChoiceResolvableType;
}

export interface SubCommandData extends CommandOptionsData {
    type: OptionType.Subcommand;
    options?: (ChoicesData | NonOptionsData | ChannelOptionData | AutocompleteOption | NumericOptionData)[];
}

export interface SubGroupData extends CommandOptionsData {
    type: OptionType.SubcommandGroup;
    options?: SubCommandData[];
}

export interface ChoicesData extends CommandOptionsData {
    type: ChoiceResolvableType;
    choices?: OptionChoiceData[];
    autocomplete?: false;
}

export interface ChannelOptionData extends CommandOptionsData {
    type: ChannelResolvableType;
    channelTypes?: ChannelType[];
    channel_types?: ChannelType[];
}

export interface AutocompleteOption extends Omit<CommandOptionsData, "autocomplete"> {
    type: OptionType.String | OptionType.Number | OptionType.Integer;
    autocomplete: true;
}

export interface NumericOptionData extends ChoicesData {
    type: NumericResolvableType;
    minValue?: number;
    min_value?: number;
    maxValue?: number;
    max_value?: number;
}
export interface OptionChoiceData {
    name: string;
    value: string | number;
}

export enum OptionType {
    Subcommand = 1,
    SubcommandGroup = 2,
    String = 3,
    Integer = 4,
    Boolean = 5,
    User = 6,
    Channel = 7,
    Role = 8,
    Mentionable = 9,
    Number = 10,
    Attachment = 11
}

export enum ChannelType {
    GuildText = 0,
    DM = 1,
    GuildVoice = 2,
    GroupDM = 3,
    GuildCategory = 4,
    GuildNews = 5,
    GuildNewsThread = 10,
    GuildPublicThread = 11,
    GuildPrivateThread = 12,
    GuildStageVoice = 13,
    GuildDirectory = 14,
    GuildForum = 15
}

export type TypeResolvable = OptionType;
export type NonChoiceResolvableType = Exclude<TypeResolvable, ChoicesData | SubOptionResolvableType | ChannelResolvableType>;
export type ChoiceResolvableType = OptionType.String | NumericResolvableType;
export type SubOptionResolvableType = OptionType.Subcommand | OptionType.SubcommandGroup;
export type ChannelResolvableType = OptionType.Channel;
export type NumericResolvableType = OptionType.Number | OptionType.Integer;
