import { gql } from '@apollo/client/core';

export const UpdateServerGQL = gql`
    mutation updateServerGQL($id: String!, $name: String!, $value: String, $valueNumber: Float, $create: Boolean = false) {
        updateServer(id: $id, name: $name, value: $value, valueNumber: $valueNumber, createIfNotExist: $create) {
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

export const DeleteProfileGQL = gql`
    mutation deleteProfileGQL($id: String!) {
        deleteProfile(id: $id) {
            _id
            dinero
            banco
        }
    }
`;

export const UpdateGuildsGQL = gql`
    mutation updateGuilds($id: String!) {
        updateGuilds(id: $id) {
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

export const AddItemShopGQL = gql`
    mutation addItemShop(
        $id: ID!
        $nombre: String!
        $descripcion: String!
        $precio: PrecioItemInput
        $emoji: String
        $disponible: Boolean!
        $transferible: Boolean!
        $basura: Boolean!
        $compraunica: Boolean!
        $stock: Int
        $mensaje: String
        $evento: String
    ) {
        addItemShop(
            id: $id
            nombre: $nombre
            descripcion: $descripcion
            precio: $precio
            emoji: $emoji
            disponible: $disponible
            transferible: $transferible
            basura: $basura
            compraunica: $compraunica
            stock: $stock
            mensaje: $mensaje
            evento: $evento
        ) {
            _id
            items {
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
            error
        }
    }
`;

export const RemoveItemShopGQL = gql`
    mutation removeItemShop($id: ID!, $itemId: ID!) {
        removeItemShop(id: $id, itemId: $itemId) {
            _id
            items {
                _id
                nombre
                emoji
                stock
            }
            error
        }
    }
`;

export const UpdateItemShopGQL = gql`
    mutation updateItemShop(
        $id: ID!
        $itemId: ID!
        $nombre: String!
        $descripcion: String!
        $precio: PrecioItemInput
        $emoji: String
        $disponible: Boolean!
        $transferible: Boolean!
        $basura: Boolean!
        $compraunica: Boolean!
        $stock: Int
        $mensaje: String
        $evento: String
    ) {
        updateItemShop(
            id: $id
            _id: $itemId
            nombre: $nombre
            descripcion: $descripcion
            precio: $precio
            emoji: $emoji
            disponible: $disponible
            transferible: $transferible
            basura: $basura
            compraunica: $compraunica
            stock: $stock
            mensaje: $mensaje
            evento: $evento
        ) {
            _id
            items {
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
            error
        }
    }
`;

/**
 * Mutación para actualizar configuración general del bot (pestaña Inicio)
 */
export const UpdateBotServerGQL = gql`
    mutation updateBotServer($id: String!, $data: UpdateBotServerInput!) {
        updateBotServer(id: $id, data: $data) {
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
            auditlogs {
                onlyImportant
                webhook {
                    url
                }
            }
        }
    }
`;

/**
 * Mutación para actualizar configuración de economía (pestaña Economía)
 */
export const UpdateEconomyServerGQL = gql`
    mutation updateEconomyServer($id: String!, $data: UpdateEconomyServerInput!) {
        updateEconomyServer(id: $id, data: $data) {
            _id
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
