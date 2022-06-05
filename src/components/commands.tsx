import { Accordion, Card, Col, Container, Nav, Row, Tab } from "react-bootstrap";
import { Category, OptionType } from "../types/Command";
import Snackbar from "@mui/material/Snackbar";
import { Alert } from "./partials";
import { useState } from "react";

export function Commands() {
    const CommandsArray: Category[] = [
        {
            id: "core",
            name: "Comandos Núcleo",
            commands: [
                {
                    name: "botinfo",
                    descriptionShort: "Obtén las estadísticas, novedades e información del creador del bot",
                    description: ""
                },
                {
                    name: "botsuggestion",
                    descriptionShort: "Da una sugerencia para el bot y se envía al canal del servidor oficial.",
                    description:
                        "Si tienes una idea puedes usar este comando, será enviado al canal sugerencias del servidor de soporte para ser votada por la comunidad y calificada por el desarrollador o un Bot Manager. También puedes mandar una imagen junto al comando.",
                    options: [{ type: OptionType.String, name: "sugerencias", description: "Un texto detallando la sugerencia o idea.", require: true }]
                },
                {
                    name: "bugreport",
                    descriptionShort:
                        "Reporta cualquier problema o falla al servidor de soporte oficial para arreglar el problema. También puedes mandar una imagen junto al comando.",
                    description:
                        'Cuando encuentres una falla, ya sean sencillas como de gramática, ortografía, apartados que aparezcan como "undefined" o fallas más seberas como que no se ejecuta un comando correctamente, no sale el resultado esperado, no responde nada, etc, usa este comando detallando lo mejor posible y si es necesario mandando una imagen, camptura de pantalla para mayor explicación.',
                    options: [{ type: OptionType.String, name: "problema | bug", description: "Un texto detallando el problema", require: true }]
                },
                {
                    name: "config",
                    descriptionShort: "Maneja la configuración del bot",
                    description: ""
                },
                {
                    name: "help",
                    descriptionShort: "Toda la información de los comandos.",
                    description: "",
                    options: [
                        {
                            type: OptionType.String,
                            name: "dm | md",
                            description: "Coloca esta palabla sola para recibir el mensaje a tu mensajes privados.",
                            require: false
                        },
                        {
                            type: OptionType.String,
                            name: "nombre de commando",
                            description:
                                "Coloca el nombre o alias de un comando para saber tu ayuda detallada como sus options que espera, alias, descripción, permisos requeridos, cooldown.",
                            require: false
                        }
                    ]
                },
                {
                    name: "invite",
                    descriptionShort: "Invitación para que puedas meter al bot a tu gremio. Además te proporciona links útiles.",
                    description:
                        'Te dará el enlace para invitar el bot a tu servidor que administras, deberás contar con el permiso "Guild Manager" o mayor. También proporciona la invitación del servidor oficial.'
                },
                {
                    name: "item",
                    descriptionShort: "Gestiona los items del servidor para crear una tienda.",
                    description: ""
                },
                {
                    name: "ping",
                    descriptionShort: "Obtén el tiempo de respuesta del bot",
                    description:
                        "Te dice el tiempo en milisegundos que tarda el bot en comunicarse con la API de Discord y el tiempo que tarda el bot en responder a un usuario."
                },
                {
                    name: "release",
                    descriptionShort: "Todo acerca de las novedades del bot",
                    description: "Se mostrará todas las novedades, arreglos y cambios que trajo la última actualización del bot."
                },
                {
                    name: "stats",
                    descriptionShort: "Obtén las estadísticas y datos técnicos del bot",
                    description:
                        "Muestra datos generales del bot como el total de servidores, usuarios en caché, tiempo encendido, creador, versión del bot, versión de la librería, canales en caché, conexiones a voz, número total de comandos públicos, hora del bot en el servidor y sistema operativo del servidor."
                },
                {
                    name: "vote",
                    descriptionShort: "Ve las opciones que tienes para votar en las listas de bots.",
                    description: "Muestra las listas de bots disponibles para votar o donde se encuentra el bot junto con una pequeña descripcción."
                }
            ]
        },
        //========
        {
            id: "economy",
            name: "Economía",
            commands: [
                {
                    name: "bal",
                    descriptionShort: "Consulta su dinero global o del servidor. Si tienen.",
                    description: ""
                },
                {
                    name: "crime",
                    descriptionShort: "Comete un crimen en el servidor. Pero si te atrapa la ley, pagarás las consecuencias.",
                    description: ""
                },
                {
                    name: "daily",
                    descriptionShort: "Obten recompensas cada 12 horas.",
                    description: ""
                },
                {
                    name: "deposite",
                    descriptionShort: "Guarda y protege tu dinero en tu banco. Así no te lo podrán robar.",
                    description: ""
                },
                {
                    name: "dice",
                    descriptionShort: "Tira un dado y obten el número. Opcionalmente puedes poner del 1 al 6 y ganar algo si adivinas o perder si no lo haces.",
                    description: ""
                },
                {
                    name: "flipcoin",
                    descriptionShort:
                        "Tira la moneda al aire. Opcionalmente puedes poner 1 (Cara) o 2 (Sello) para ganar algo si adivinas o perder si no lo haces.",
                    description: ""
                },
                {
                    name: "rob",
                    descriptionShort: "Roba dinero del bolsillo de un miembro del servidor.",
                    description: ""
                },
                {
                    name: "top",
                    descriptionShort: "Muestra quien está hasta arriba de todos",
                    description: ""
                },
                {
                    name: "trade",
                    descriptionShort: "Obten Dinero por... hacer comercios ilegales.",
                    description: ""
                },
                {
                    name: "trans",
                    descriptionShort: "Dale a alguien dinero de tu bolcillo.",
                    description: ""
                },
                {
                    name: "withdraw",
                    descriptionShort: "Saca dinero de tu banco a tu bolsillo para que lo puedas ocupar.",
                    description: ""
                },
                {
                    name: "work",
                    descriptionShort: "Obten Dinero por trabajar.",
                    description: ""
                }
            ]
        },
        {
            id: "items",
            name: "Artículos",
            commands: [
                {
                    name: "buy",
                    descriptionShort: "Compra articulos de la tienda.",
                    description: ""
                },
                {
                    name: "inventory",
                    descriptionShort: "Ve los artículos que has comprado.",
                    description: ""
                },
                {
                    name: "iteminfo",
                    descriptionShort: "Ve la información de un artículos.",
                    description: ""
                },
                {
                    name: "loot",
                    descriptionShort: "Saquea items aleatorios entre los mensajes del servidor.",
                    description: ""
                },
                {
                    name: "sell",
                    descriptionShort: "Vende articulos de tu inventario.",
                    description: ""
                },
                {
                    name: "shop",
                    descriptionShort: "Ve la tienda de articulos.",
                    description: ""
                },
                {
                    name: "transitem",
                    descriptionShort: "Dale a alguien un artículo de tu inventario.",
                    description: ""
                },
                {
                    name: "use",
                    descriptionShort: "Usa un item comprado en la tienda.",
                    description: ""
                }
            ]
        }
    ];
    const [open, setOpen] = useState(false);

    function copyClipboard(e: any) {
        navigator.clipboard
            .writeText(e.target.innerText)
            .then(() => setOpen(true))
            .catch(() => null);
    }

    const handleClose = (e: any, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }

        setOpen(false);
    };

    return (
        <Container>
            <Snackbar autoHideDuration={2000} anchorOrigin={{ vertical: "bottom", horizontal: "center" }} open={open} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
                    Copiado al portapapeles
                </Alert>
            </Snackbar>
            <Row>
                <Col md={12}>
                    <Card>
                        <Card.Body>
                            <Card.Title as="h3">Prefijo del bot</Card.Title>
                            <Card.Text>
                                <p>
                                    Ya no hay prefijo en el bot, ahora se usa con{" "}
                                    <code className="codeCopy" onClick={copyClipboard}>
                                        /
                                    </code>{" "}
                                    en el comienzo de cada comando, al igual que otros bots.
                                </p>
                                <p>
                                    El bot oficial solamente es:{" "}
                                    <code className="codeCopy" onClick={copyClipboard}>
                                        @StarLight Economy#1889
                                    </code>
                                </p>
                                <h3>Sintaxis de uso</h3>
                                <p>
                                    <code>&lt;&gt;</code> - Parámetro obligatorio
                                </p>
                                <p>
                                    <code>[]</code> - Parámetro opcional
                                </p>
                                <p>
                                    <code>&lt;opcion1|opcion2&gt;</code> - Eliga una de las opciones.
                                </p>
                                Recuerda de no poner ninguno de estos simbolos a la hora de ejecutar el comando.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={12} className="pt-4">
                    <Card>
                        <Card.Header className="text-center" as="h4">
                            Tabla de Comandos
                        </Card.Header>
                        <Card.Body>
                            <Tab.Container defaultActiveKey="core">
                                <Row>
                                    <Col md={3}>
                                        <Nav variant="pills" className="flex-column">
                                            {CommandsArray.map((dts) => (
                                                <Nav.Item key={dts.name}>
                                                    <Nav.Link eventKey={dts.id}>{dts.name}</Nav.Link>
                                                </Nav.Item>
                                            ))}
                                        </Nav>
                                    </Col>

                                    <Col md={9}>
                                        <Tab.Content>
                                            {CommandsArray.map((dts) => (
                                                <Tab.Pane key={dts.id} eventKey={dts.id}>
                                                    <Row>
                                                        {dts.commands.map((command) => (
                                                            <>
                                                                <Accordion>
                                                                    <Accordion.Item eventKey={command.name}>
                                                                        <Accordion.Header>
                                                                            <code
                                                                                className="codeCopy"
                                                                                onClick={copyClipboard}
                                                                                style={{ margin: "0px 15px 0px 0px" }}
                                                                            >
                                                                                {command.name}
                                                                            </code>
                                                                            {command.descriptionShort}
                                                                        </Accordion.Header>
                                                                        <Accordion.Body>
                                                                            {/* <p>
                                                                                Uso:{" "}
                                                                                {command.use ? (
                                                                                    <code className="codeCopy" onClick={copyClipboard}>
                                                                                        {command.name} {command.use}
                                                                                    </code>
                                                                                ) : (
                                                                                    <span className="text-muted">No requiere parámetros</span>
                                                                                )}
                                                                            </p> */}
                                                                            <p>{command.description}</p>
                                                                            {command.options && command.options.length > 0 ? <h5>Variables</h5> : null}
                                                                            {command.options
                                                                                ? command.options.map((vars) => (
                                                                                      <>
                                                                                          {vars.require ? (
                                                                                              <span className="text-muted">Esta variable es obligatoria</span>
                                                                                          ) : null}
                                                                                          <p>
                                                                                              <code>{vars.name}</code> {vars.description}
                                                                                          </p>
                                                                                      </>
                                                                                  ))
                                                                                : null}
                                                                            {/* {command.alias ? (
                                                                                <p>
                                                                                    <h5>Alias</h5>
                                                                                    {command.alias.map((c) => (
                                                                                        <>
                                                                                            <code className="codeCopy" onClick={copyClipboard}>
                                                                                                {c}
                                                                                            </code>{" "}
                                                                                        </>
                                                                                    ))}
                                                                                </p>
                                                                            ) : null} */}
                                                                        </Accordion.Body>
                                                                    </Accordion.Item>
                                                                </Accordion>
                                                                <p></p>
                                                            </>
                                                        ))}
                                                    </Row>
                                                </Tab.Pane>
                                            ))}
                                        </Tab.Content>
                                    </Col>
                                </Row>
                            </Tab.Container>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
