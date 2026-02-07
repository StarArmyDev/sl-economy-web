import { gql, useMutation } from '@apollo/client';

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

export { useMutation };
