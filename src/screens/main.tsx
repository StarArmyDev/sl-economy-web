import { ButtonStyle, Chat, MemberCardPopup } from "components/discord";
import { Row, Container, Col, Image, Card } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import commandWork from "img/command_work.png";
import commandShop from "img/command_shop.png";
import commandLoot from "img/command_loot.png";
import commandTop from "img/command_top.png";
import splash from "img/splash.png";
import { getMonitors } from "libs";
import Helmet from "react-helmet";

const status: { [k: number]: { text: string; color: string } } = {
    0: { text: "Monitor Pausado", color: "gray" },
    1: { text: "No Comprobado Todavía", color: "warning" },
    2: { text: "En Linea", color: "success" },
    8: { text: "Desconocido", color: "black" },
    9: { text: "Desactivado", color: "danger" }
};

function useWindowSize(targetRef: React.RefObject<HTMLHeadingElement>) {
    const [size, setSize] = useState([0, 0]);
    useEffect(() => {
        function updateSize() {
            if (targetRef.current && (targetRef.current.offsetWidth !== size[0] || targetRef.current.offsetHeight !== size[1])) {
                setSize([targetRef.current.offsetWidth, targetRef.current.offsetHeight]);
            }
        }
        window.addEventListener("resize", updateSize);
        updateSize();
        return () => window.removeEventListener("resize", updateSize);
    });
    return size;
}

export function Main() {
    const targetRef = useRef<HTMLHeadingElement>(null);
    const [monitor, setMonitor] = useState(null);
    const [width] = useWindowSize(targetRef);

    useEffect(() => {
        if (!monitor)
            getMonitors()
                .then((monitors) => {
                    setMonitor((monitors.data.monitors as any[]).find((m) => m.id === 789361399));
                })
                .catch(() => null);
    }, [monitor]);

    const search = useLocation().search;
    const guild_id = new URLSearchParams(search).get("guild_id");
    if (guild_id) {
        window.history.replaceState(null, "dashboard", `/dashboard/${guild_id}`);
        return <></>;
    }

    return (
        <div ref={targetRef}>
            <Container>
                <Helmet>
                    <title>StarLight Economy | Inicio</title>
                </Helmet>
                <Row className="text-center">
                    <Col sm={12} className="py-5">
                        <img src={splash} alt="Banner StarLight-E" style={{ width: "50%" }} />
                    </Col>
                    <Col sm={12} className="py-3">
                        <h1 className="text-center">Bienvenido</h1>
                        <Row className="pt-4 align-items-center">
                            {/* Estado */}
                            {monitor && (
                                <Col sm={2}>
                                    <Link to="/status" style={{ textDecoration: "none", color: "#fff" }}>
                                        <Card>
                                            Estado
                                            <Card bg={status[(monitor as any)?.status].color}>{status[(monitor as any)?.status].text}</Card>
                                        </Card>
                                    </Link>
                                </Col>
                            )}
                            {/* TopGG */}
                            <Col sm className="text-end">
                                <a href="https://top.gg/bot/696723299459268728">
                                    <img src="https://top.gg/api/widget/servers/696723299459268728.svg" alt="StarLight" />
                                </a>
                            </Col>
                        </Row>
                    </Col>
                    {/* Comando Help */}
                    <Col sm={12} className="py-3">
                        <Row className="pt-4 align-items-center">
                            <Col sm={6}>
                                <h4>Un bot de economía de la familia StarLight</h4>
                                <p>
                                    Listo para ayudarte a construir una economía completa de manera fácil y totalmente en español, desde el bot hasta su soporte
                                    para todos los hispanohablantes.
                                </p>
                            </Col>
                            <Col sm={4}>
                                <MemberCardPopup
                                    ref={(node) => {
                                        MemberCardPopup.instance = MemberCardPopup.instance || node;
                                    }}
                                />

                                <div style={{ width: width <= 580 ? width * 0.95 : width * 0.5 }}>
                                    <Chat
                                        channelName="General"
                                        isWelcomeMessage={false}
                                        isReduced={width <= 710}
                                        messages={[
                                            {
                                                id: "01",
                                                reply: {
                                                    content: "/help",
                                                    user: {
                                                        id: "002",
                                                        avatarUrl: "https://i.imgur.com/0Fm2H63.png",
                                                        username: "DavichoStar",
                                                        tag: 8104,
                                                        roles: [{ id: "002", name: "Midsummer Night", color: "#09c4c6" }]
                                                    }
                                                },
                                                embeds: [
                                                    {
                                                        title: "Lista de Comandos",
                                                        description:
                                                            "Hola, soy StarLight Economy y vengo a ayudar. Esta es mi lista de comandos que puedes ocupar.\n\nPing: `28` ms\nCategorías en total: `2`\nComandos en total: `31`",
                                                        fields: [
                                                            {
                                                                name: "Categorías",
                                                                value: "🌠 **Bot [9]**\n💵 **Economía [14]**\n📦 **Artículos [8]**"
                                                            }
                                                        ],
                                                        thumbnail: "https://i.imgur.com/0phchtS.png",
                                                        color: "#ffd700",
                                                        timestamp: new Date(),
                                                        author: {
                                                            name: "StarLight Economy",
                                                            iconUrl: "https://i.imgur.com/0phchtS.png"
                                                        },
                                                        footer: {
                                                            text: "DavichoStar#8104 | Versión 2.0.0-beta",
                                                            iconUrl: "https://i.imgur.com/0Fm2H63.png"
                                                        }
                                                    }
                                                ],
                                                components: [
                                                    {
                                                        type: "SelectMenu",
                                                        placeholder: "Selecciona una categoría",
                                                        options: [
                                                            {
                                                                label: "Bot",
                                                                value: "1",
                                                                emoji: "🌠"
                                                            },
                                                            {
                                                                label: "Economía",
                                                                value: "2",
                                                                emoji: "💵"
                                                            },
                                                            {
                                                                label: "Artículos",
                                                                value: "3",
                                                                emoji: "📦"
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        type: "Button",
                                                        emoji: "🌠",
                                                        label: "Invitación",
                                                        style: ButtonStyle.Link,
                                                        url: "https://discord.com/oauth2/authorize?client_id=880955114653888524&permissions=8&scope=bot%20applications.commands"
                                                    },
                                                    {
                                                        type: "Button",
                                                        emoji: "📥",
                                                        label: "Servidor de Soporte",
                                                        style: ButtonStyle.Link,
                                                        url: "https://discord.gg/MZN8Yf6"
                                                    },
                                                    {
                                                        type: "Button",
                                                        emoji: "🗳️",
                                                        label: "Vota en TopGG",
                                                        style: ButtonStyle.Link,
                                                        url: "https://top.gg/bot/696723299459268728"
                                                    }
                                                ],
                                                time: new Date(Date.now()),
                                                user: {
                                                    id: "001",
                                                    avatarUrl: "https://i.imgur.com/0phchtS.png",
                                                    username: "StarLight Economy",
                                                    tag: 1889,
                                                    roles: [{ id: "696723737642532945", name: "StarLight Economy", color: "#ffd700" }]
                                                }
                                            }
                                        ]}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    {/* Comando Work */}
                    <Col sm={12} className="pt-4">
                        <Row className="align-items-center">
                            <Col sm={5}>
                                <Image src={commandWork} width="100%" height="100%" />
                            </Col>
                            <Col sm={7}>
                                <h4>¿Cómo funciona?</h4>
                                <p>
                                    Con StarLight puedes crear una economía ficticia y propia para tu comunidad, usando comando como work, daily, trade, rob y
                                    entre otros, pueden ganar y perder dinero. Todos estos comandos y más cosas se puede personalizar desde su ganancia, su taza
                                    de éxito, la cantidad de dinero a perder y el tiempo de enfriamiento para volver a usar el comando.
                                </p>
                            </Col>
                        </Row>
                    </Col>
                    {/* Tienda */}
                    <Col sm={12} className="pt-4">
                        <Row className="align-items-center">
                            <Col sm={7}>
                                <h4>Gasta el dinero</h4>
                                <p>
                                    Está bien el ganar dinero, acumularlo y estar en el Top uno pero... ¿Qué puedo hacer con él? Bueno, par eso los
                                    administradores pueden crea una tienda y agregar artículos a lo que su imaginación dicte, con una gran posibilidad de usos
                                    ya que tiene parámetros personalizables como el dar un rol, un nuevo canal de texto o voz o incluso otro item ¿Por qué no?.
                                    También puedes limitar el uso o compra de estos artículos como el requerir un rol, otro artículo, que esté en la tienda por
                                    tiempo limitado o una cantidad limitada, ideal para eventos temáticos.
                                </p>
                            </Col>
                            <Col sm={5}>
                                <Image src={commandShop} width="100%" height="100%" />
                            </Col>
                        </Row>
                    </Col>
                    {/* Loot */}
                    <Col sm={12} className="pt-4">
                        <Row className="align-items-center">
                            <Col sm={5}>
                                <Image src={commandLoot} width="100%" height="100%" />
                            </Col>
                            <Col sm={7}>
                                <h4>Items Looteables</h4>
                                <p>
                                    Al crear algunos items denominados "basura" creas items que pueden ser obtenidos aleatoriamente con el comando Loot. Estos
                                    pueden ser vendidos por el usuario o usados, dependerá de ti.
                                </p>
                            </Col>
                        </Row>
                    </Col>
                    {/* Top */}
                    <Col sm={12} className="pt-4">
                        <Row className="align-items-center">
                            <Col sm={7}>
                                <h4>Rankings</h4>
                                <p>
                                    Tanto con el comando Top como en esta página, puedes ver el ranking de los usuarios con el dinero que ganan, estando en el
                                    podio los que mayor dinero tienen entre sus bolsillos y en su banco. ¡No dejes que te quiten tu puesto!
                                </p>
                            </Col>
                            <Col sm={5}>
                                <Image src={commandTop} width="100%" height="100%" />
                            </Col>
                        </Row>
                    </Col>
                    {/* Más */}
                    <Col sm={12} className="pt-5">
                        <h4>Y mucho más</h4>
                        <Row className="align-items-center">
                            <Col sm>
                                <Card>
                                    <Card.Header>
                                        <Card.Title>
                                            <h5>100% En Español</h5>
                                        </Card.Title>
                                    </Card.Header>
                                    <Card.Body>
                                        <Card.Text>
                                            ¿Te ha pasado alguna vez que usas una aplicación de origen extranjero y no viene en español o viene pero te
                                            encuentras algunos textos en inglés a pesar de estar "en español"? No te preocupes, StarLight está diseñado por y
                                            para hispanohablantes.
                                            <br />
                                            <br />
                                            <br />
                                            Si configura el bot en inglés, es más probable que encuentre fragmentos o textos en español. (Se voltearon los
                                            papeles EU!).
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col sm>
                                <Card>
                                    <Card.Header>
                                        <Card.Title>
                                            <h5>Comunidad</h5>
                                        </Card.Title>
                                    </Card.Header>
                                    <Card.Body>
                                        <Card.Text>
                                            En nuestro servidor puedes interactuar directamente con el creador, dar comentarios para mejorar, un soporte
                                            directo, novedades sobre el futuro, sorteos, dinámicas y mucho más!
                                            <br />
                                            También puedes encontrar y crear contenido para apoyar al bot, como videos, guías, arte y demás. Sólo asegurate de
                                            seguir los términos y condiciones que los encuentras mas abajo.
                                            <br />
                                            <br />
                                            <Link to="/about">Averiguar más</Link>
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col sm>
                                <Card>
                                    <Card.Header>
                                        <Card.Title>
                                            <h5>Enfoque</h5>
                                        </Card.Title>
                                    </Card.Header>
                                    <Card.Body>
                                        <Card.Text>
                                            Puede que comparado con otros bots de la competencia, parezca algo escaso de funciones. Pero es principalmente
                                            porque el enfoque del bot es pura y exclusivamente la economía, si necesitas comando de moderación, de utilidad,
                                            bienvenidas y despedias, puedes usar a{" "}
                                            <a href="https://top.gg/bot/517786947171909643" target="__blank">
                                                StarLight
                                            </a>{" "}
                                            normal con esas y más funciones.
                                            <br />
                                            Pero no te preocupes, se tiene pensado agregar más funciones en el futuro, como juegos o más comandos para obtener,
                                            gastar y administrar tu dinero.
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
