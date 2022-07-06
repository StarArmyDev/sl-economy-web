import { Container, Row, Col, Card } from "react-bootstrap";
import { CircularProgress, Divider } from "@mui/material";
import { useState, useEffect } from "react";
import { getMonitors } from "libs";

const status: { [k: number]: { text: string; color: string } } = {
    0: { text: "Monitor Pausado", color: "gray" },
    1: { text: "No Comprobado Todavía", color: "#f29030" },
    2: { text: "En Linea", color: "#3bd671" },
    8: { text: "Desconocido", color: "black" },
    9: { text: "Caído", color: "#ba3737" }
};

export const Status = () => {
    const [bot, setBot] = useState(undefined as IStatus | undefined);
    const [backend, setBackend] = useState(undefined as IStatus | undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!bot || !backend)
            getMonitors()
                .then((monit) => {
                    setBot((monit.data.monitors as IStatus[]).find((m) => [789361399].includes(m.id)));
                    setBackend((monit.data.monitors as IStatus[]).find((m) => [786758750].includes(m.id)));
                    setLoading(false);
                })
                .catch((err) => setLoading(false));
    });

    return (
        <Container>
            <Row className="text-center pt-4">
                <h2>
                    <Row className="align-items-center">
                        <Col className="text-end">
                            <i className="material-icons" style={{ fontSize: "300%" }}>
                                dns
                            </i>
                        </Col>
                        <Col className="text-start">Status</Col>
                    </Row>
                </h2>
                {loading && (
                    <Col sm={12}>
                        <CircularProgress />
                    </Col>
                )}
                {!loading && (
                    <>
                        <Col sm={12} className="p-4">
                            <Card>
                                <Card.Body>
                                    <Row className="align-items-center text-start">
                                        <i
                                            className="material-icons col-1 mx-5"
                                            style={{
                                                fontSize: "400%",
                                                color:
                                                    !bot && !backend
                                                        ? ""
                                                        : bot?.status === 2 && backend?.status === 2
                                                        ? "#3bd671"
                                                        : ![0, 2].includes(bot?.status || 0) && ![0, 2].includes(backend?.status || 0)
                                                        ? "#ba3737"
                                                        : "#f29030"
                                            }}
                                        >
                                            circle
                                        </i>
                                        <h4 className="col">
                                            {!bot && !backend ? (
                                                "Desconocido"
                                            ) : (
                                                <>
                                                    {bot?.status === 2 && backend?.status === 2
                                                        ? "Todos los sitemas"
                                                        : ![0, 2].includes(bot?.status || 0) && ![0, 2].includes(backend?.status || 0)
                                                        ? "Todos los sistemas no"
                                                        : "Algunos Sistemas"}{" "}
                                                    <span
                                                        style={{
                                                            color:
                                                                bot?.status === 2 && backend?.status === 2
                                                                    ? "#3bd671"
                                                                    : ![0, 2].includes(bot?.status || 0) && ![0, 2].includes(backend?.status || 0)
                                                                    ? "#ba3737"
                                                                    : "#f29030"
                                                        }}
                                                    >
                                                        operativos
                                                    </span>
                                                </>
                                            )}
                                        </h4>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col sm={12} className="p-4">
                            <Card>
                                <Card.Body>
                                    {bot && (
                                        <Row key={bot.id} className="m-2 align-items-center text-center">
                                            <Col sm>
                                                <h4>{bot.friendly_name}</h4>
                                                <h6 style={{ color: "#edbf10" }}> Bot de Discord</h6>
                                            </Col>
                                            <Col sm>
                                                <Card style={{ backgroundColor: status[bot.status].color }}>{status[bot.status].text}</Card>
                                            </Col>
                                        </Row>
                                    )}
                                    <Divider className="m-4" />
                                    {backend && (
                                        <Row key={backend.id} className="m-2 align-items-center text-center">
                                            <Col sm>
                                                <h4>{backend.friendly_name}</h4>
                                                <h6 style={{ color: "#edbf10" }}>Backend para la web</h6>
                                            </Col>
                                            <Col sm>
                                                <p>
                                                    <Card style={{ backgroundColor: status[backend.status].color }}>{status[backend.status].text}</Card>
                                                </p>
                                            </Col>
                                        </Row>
                                    )}
                                </Card.Body>
                            </Card>
                            <br />
                        </Col>
                    </>
                )}
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

interface IStatus {
    id: number;
    friendly_name: string;
    url: string;
    /**
     * 1 - HTTP(s)
     * 2 - Keyword
     * 3 - Ping
     * 4 - Port
     * 5 - Heartbeat
     */
    type: 1 | 2 | 3 | 4 | 5;
    /**
     * 1 - HTTP (80)
     * 2 - HTTPS (443)
     * 3 - FTP (21)
     * 4 - SMTP (25)
     * 5 - POP3 (110)
     * 6 - IMAP (143)
     * 99 - Custom Port
     */
    sub_type: (1 | 2 | 3 | 4 | 5 | 6 | 99) | string;
    /**
     * 1 - exists
     * 2 - not exists
     */
    keyword_type?: (1 | 2) | null;
    /**
     * 0 - case sensitive
     * 1 - case insensitive
     */
    keyword_case_type: (0 | 1) | string;
    keyword_value: string;
    http_username: string;
    http_password: string;
    port: string;
    interval: number;
    /**
     * 0 - paused
     * 1 - not checked yet
     * 2 - up
     * 8 - seems down
     * 9 - down
     */
    status: 0 | 1 | 2 | 8 | 9;
    create_datetime: number;
    monitor_group?: number;
    is_group_main?: number;
    logs?: [
        {
            type: number;
            datetime: number;
            duration: number;
        }
    ];
}
