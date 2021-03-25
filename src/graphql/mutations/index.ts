import { gql, useMutation } from "@apollo/client";

export const UpdateServerGQL = gql`
    mutation updateServerGQL($id: String!, $name: String!, $value: String, $valueNumber: Float) {
        updateServer(id: $id, name: $name, value: $value, valueNumber: $valueNumber) {
            _id
            colorname
            prefix
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

export { useMutation };
