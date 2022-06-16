import { ButtonStyle, Chat, MemberCardPopup } from "./discord";
import { Row, Container, Col, Image } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import splash from "../img/splash.png";
import commandWork from "../img/command_work.png";
import commandShop from "../img/command_shop.png";

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
    const [width] = useWindowSize(targetRef);

    const search = useLocation().search;
    const guild_id = new URLSearchParams(search).get("guild_id");
    if (guild_id) {
        window.history.replaceState(null, "dashboard", `/dashboard/${guild_id}`);
        return <></>;
    }

    return (
        <div ref={targetRef}>
            <Container>
                <Row className="text-center">
                    <Col sm={12} className="py-5">
                        <img src={splash} alt="Banner StarLight-E" style={{ width: "50%" }} />
                    </Col>
                    <Col sm={12} className="py-3">
                        <h1 className="text-center">Bienvenido</h1>
                        <Col sm={1} md={2}>
                            <a href="https://top.gg/bot/696723299459268728" target="_blank" rel="noopener noreferrer">
                                <img src="https://top.gg/api/widget/status/696723299459268728.svg?noavatar=true" alt="StarLight" />
                            </a>
                        </Col>
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
                            <Col sm={7}>
                                <h4>¿Cómo funciona?</h4>
                                <p>
                                    Con StarLight puedes crear una economía ficticia y propia para tu comunidad, usando comando como work, daily, trade, rob y
                                    entre otros, pueden ganar y perder dinero. Todos estos comandos y más cosas se puede personalizar desde su ganancia, su taza
                                    de éxito, la cantidad de dinero a perder y el tiempo de enfriamiento para volver a usar el comando.
                                </p>
                            </Col>
                            <Col sm={5}>
                                <Image src={commandWork} width="100%" height="100%" />
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
                </Row>
            </Container>
        </div>
    );
}
