import { Chat, MemberCardPopup, TooltipsContainer } from "./discord";
import { useEffect, useRef, useState } from "react";
import { Row, Container, Col } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import splash from "../img/splash.png";

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
                    <Col sm={12} className="py-5">
                        <h1 className="text-center">Bienvenido</h1>
                    </Col>
                    <Col sm={12}>
                        <h4>Un bot de economía de la familia StarLight</h4>
                    </Col>
                    <Row sm={12} className="pt-5">
                        <Col sm={1} md={2}>
                            <a href="https://top.gg/bot/696723299459268728" target="_blank" rel="noopener noreferrer">
                                <img src="https://top.gg/api/widget/status/696723299459268728.svg?noavatar=true" alt="StarLight" />
                            </a>
                        </Col>
                        <br />
                        <br />
                        <Col sm={11} md={10}>
                            <Row>
                                <Col sm={4} md={4}>
                                    <h4>StarLight</h4>
                                </Col>
                                <Col sm={7} md={5}>
                                    <MemberCardPopup
                                        ref={(node) => {
                                            MemberCardPopup.instance = MemberCardPopup.instance || node;
                                        }}
                                    />

                                    <TooltipsContainer
                                        ref={(node) => {
                                            TooltipsContainer.instance = TooltipsContainer.instance || node;
                                        }}
                                    />
                                    <div style={{ width: width <= 580 ? width * 0.85 : width * 0.52 }}>
                                        <Chat
                                            channelName="Test"
                                            isWelcomeMessage={false}
                                            isReduced={width <= 710}
                                            messages={[
                                                {
                                                    id: "01",
                                                    content: "test",
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
                                                        }
                                                    ],
                                                    embeds: [
                                                        {
                                                            title: "Lista de Comandos",
                                                            description:
                                                                "Hola, soy StarLight Economy y vengo a ayudar. Esta es mi lista de comandos que puedes ocupar.\n\nPing: `19` ms\nCategorías en total: `2`\nComandos en total: `31`",
                                                            fields: [
                                                                {
                                                                    name: "Categorías",
                                                                    value: "🌠 **Bot** *[9]*\n💵 **Economía [14]**\n📦 **Artículos** *[8]*"
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
                                                                iconUrl:
                                                                    "https://cdn.discordapp.com/avatars/445746830563868672/a833898b70495642b92b18829212ba70.png"
                                                            },
                                                            image: "https://i.imgur.com/0phchtS.png",
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
                                                },
                                                {
                                                    id: "02",
                                                    content: "test 2",
                                                    time: new Date(Date.now()),
                                                    user: {
                                                        id: "002",
                                                        avatarUrl: "https://cdn.discordapp.com/avatars/445746830563868672/a833898b70495642b92b18829212ba70.png",
                                                        username: "DavichoStar",
                                                        tag: 8185,
                                                        roles: [{ id: "01", name: "Admin", color: "#ff0000" }]
                                                    }
                                                }
                                            ]}
                                        />
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Row>
            </Container>
        </div>
    );
}
