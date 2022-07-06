import { Container, Row, Col, Card } from "react-bootstrap";
import { CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import { getMonitors } from "libs";

const status: { [k: number]: { text: string; color: string } } = {
    0: { text: "Monitor Pausado", color: "gray" },
    1: { text: "No Comprobado Todavía", color: "warning" },
    2: { text: "En Linea", color: "success" },
    8: { text: "Desconocido", color: "black" },
    9: { text: "Desactivado", color: "danger" }
};

export const Status = () => {
    const [bot, setBot] = useState(null as any);
    const [backend, setBackend] = useState(null as any);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!bot || !backend)
            getMonitors()
                .then((monit) => {
                    setBot((monit.data.monitors as any[]).find((m) => [789361399].includes(m.id)));
                    setBackend((monit.data.monitors as any[]).find((m) => [786758750].includes(m.id)));
                    setLoading(false);
                })
                .catch((err) => setLoading(false));
    });

    return (
        <Container>
            <Row className="text-center pt-4">
                <h2>
                    <p>
                        <i className="material-icons" style={{ fontSize: "300%" }}>
                            dns
                        </i>
                    </p>
                    Status
                </h2>
                <Col sm={12} className="p-4">
                    {loading && <CircularProgress />}
                    {bot && (
                        <Row key={bot.id} className="mb-2">
                            <Col sm={12}>
                                <h4>
                                    {bot.friendly_name} {"-->"} Bot de Discord
                                </h4>
                                <p>
                                    <Card bg={status[bot.status].color}>{status[bot.status].text}</Card>
                                </p>
                            </Col>
                        </Row>
                    )}
                    {backend && (
                        <Row key={backend.id} className="mb-2">
                            <Col sm={12}>
                                <h4>
                                    {backend.friendly_name} {"-->"} Backend para la web
                                </h4>
                                <p>
                                    <Card bg={status[backend.status].color}>{status[backend.status].text}</Card>
                                </p>
                            </Col>
                        </Row>
                    )}
                    <br />
                </Col>
                <p>
                    Más detalles en{" "}
                    <a href="https://stats.uptimerobot.com/yX0r2hN910" target="__blank">
                        UptimeRobot
                    </a>
                </p>
            </Row>
        </Container>
    );
};
