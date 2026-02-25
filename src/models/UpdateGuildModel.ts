import { GuildInfo } from './user';

export interface UpdateGuildModel {
    updateGuilds: GuildsModel;
}

export interface GuildsModel {
    admin: GuildInfo[];
    adminMutual: GuildInfo[];
    mutual: GuildInfo[];
}
