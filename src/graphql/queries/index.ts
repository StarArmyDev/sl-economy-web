import { gql } from '@apollo/client/core';

export const ServerGQL = gql`
    query Server($id: String!) {
        getServer(id: $id) {
            _id
            colorMain
            images {
                records
                flipcoin {
                    face
                    stamp
                }
                dice {
                    _1
                    _2
                    _3
                    _4
                    _5
                    _6
                }
            }
            buy {
                category
            }
            language {
                server
                channels {
                    id
                    lang
                }
            }
            currency {
                name
                id
            }
            payment {
                messages {
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
            fineAmount {
                rob {
                    min
                    max
                    fail
                }
                trade {
                    min
                    max
                    fail
                }
                crime {
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
                messages
                rob
                roulette
                slotmachine
                trade
                work
            }
            excludedChannels
        }
    }
`;

export const ProfileGQL = gql`
    query ProfilesServer($id: String!, $userId: String, $orden: sortProfile, $skip: Int = 0, $limit: Int) {
        AllProfilesInServer(id: $id, userId: $userId, sort: $orden, skip: $skip, limit: $limit) {
            userRank {
                position
                profile {
                    _id
                    dinero
                    banco
                    total
                    locked
                }
            }
            profiles {
                _id
                dinero
                banco
                total
                locked
                user {
                    _id
                    avatar
                    username
                    discriminator
                }
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
            total
            locked
            user {
                _id
                avatar
                username
                discriminator
            }
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

export const ShopServerGQL = gql`
    query Shop($id: String!) {
        getShop(id: $id) {
            _id
            items {
                _id
                nombre
                emoji
                stock
                disponible
            }
            error
        }
    }
`;

export const ItemShopGQL = gql`
    query GetItemShop($id: String!, $itemId: ID!) {
        getItemShop(id: $id, itemId: $itemId) {
            _id
            nombre
            descripcion
            emoji
            stock
            disponible
            transferible
            basura
            compraunica
            precio {
                compra
                venta
            }
            mensaje
            evento
        }
    }
`;
