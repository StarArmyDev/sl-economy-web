import { gql, useQuery } from "@apollo/client";

export const ServerGQL = gql`
    query Server($id: String!) {
        getServer(id: $id) {
            _id
            colorname
            language {
                server
                channels {
                    id
                    lang
                }
            }
            pago {
                mensajes {
                    min
                    max
                }
                crime {
                    min
                    max
                }
                daily
                dice {
                    min
                    max
                }
                flipcoin {
                    min
                    max
                }
                slotmachine {
                    min
                    max
                }
                trade {
                    min
                    max
                }
                work {
                    min
                    max
                }
            }
            multa {
                rob {
                    min
                    max
                    fail
                }
                tarde {
                    min
                    max
                    fail
                }
                crime {
                    min
                    max
                    fail
                }
                trade {
                    min
                    max
                    fail
                }
                dice {
                    min
                    max
                }
                slotmachine {
                    min
                    max
                }
                flipcoin {
                    min
                    max
                }
                loot {
                    min
                    max
                    fail
                }
            }
            cooldown {
                crime
                daily
                dice
                flipcoin
                loot
                mensajes
                rob
                roulette
                slotmachine
                trade
                work
            }
            moneda {
                name
                id
            }
            chatExcluido
        }
    }
`;

export const ProfileGQL = gql`
    query ProfilesServer($id: String!, $orden: sortProfile, $skip: Int = 0, $limit: Int = 50) {
        AllProfilesInServer(id: $id, sort: $orden, skip: $skip, limit: $limit) {
            _id
            dinero
            banco
            user {
                _id
                username
                avatar
            }
        }
    }
`;

export const ProfilesUserGQL = gql`
    query getProfiles($id: String!, $skip: Int = 0, $limit: Int = 25) {
        AllProfilesOfUserOnServers(id: $id, skip: $skip, limit: $limit) {
            _id
            dinero
            banco
        }
    }
`;

export const GuildGQL = gql`
    query getGuild($id: String!) {
        getGuild(id: $id) {
            id
            name
            icon
            owner_id
        }
    }
`;

export const ChannelsGuildGQL = gql`
    query getChannelsGuild($id: String!) {
        getChannelsGuild(id: $id) {
            name
            id
            position
            parent_id
        }
    }
`;

export const UserGuildsGQL = gql`
    query UserGuilds($id: String) {
        getUserGuilds(id: $id) {
            admin {
                ...Datos
            }
            adminMutual {
                ...Datos
            }
            mutual {
                ...Datos
            }
        }
    }

    fragment Datos on Guild {
        id
        name
        icon
        owner
        permissions
    }
`;

export { useQuery };
