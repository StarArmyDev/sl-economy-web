import { Container, Spinner, Alert, Col, Row, Tab, Nav, Button, Card, Form, InputGroup, Modal } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { useForm } from "react-hook-form";
import ms from "ms";
import { ChannelsGuildGQL, ServerGQL, UpdateServerGQL, useMutation, useQuery } from "../graphql";
import { ISistemas, IUserObjet } from "../interfaces";
import { ConverString, ConverTime } from "../libs";
import { BOT_MANAGER } from "../Constants";

interface IAlert {
    show: boolean;
    type?: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "dark" | "light";
    text?: string;
}

export function Dashboard(props: { match: any; user: IUserObjet }) {
    if (!window.localStorage.getItem("user")) return <Redirect to="/error403" />;
    const id = props.match && props.match.params && props.match.params.id ? props.match.params.id : null;
    const user: IUserObjet = JSON.parse(window.localStorage.getItem("user")!);
    const [loading, setLoading] = useState(true);
    const [guild, setGuild] = useState(null as any);
    const [alert, setAlert] = useState([] as IAlert[]);
    const [chatExclude, setChatExclude] = useState([] as { name: string; id: string }[]);
    const [showModal, setShowModal] = useState(false);
    const { register, errors, handleSubmit, reset, setValue } = useForm();

    const [dbServer, setDbServer] = useState(null as ISistemas | null);

    const load = async () => {
        if (!guild) {
            var Servidor = props.user.guilds.find((g) => g.id === id);
            setGuild(Servidor);
        }
        setLoading(false);
    };

    const loadDB = async (db: ISistemas | null, channels: { name: string; id: string }[]) => {
        console.log(db);
        if (db?.chatExcluido)
            db.chatExcluido.map((ch) =>
                setChatExclude((ec) => [
                    ...ec,
                    { name: channels.findIndex((c) => c.id === ch) > -1 ? channels.find((c) => c.id === ch)!.name : "Canal Desconocido", id: ch }
                ])
            );
    };

    useEffect(() => {
        var guild = user.guilds.find((g) => g.id === id);
        if (!guild || (!((guild.permissions & 2146958591) === 2146958591) && !BOT_MANAGER.includes(user._id))) return window.location.replace("/error403");
        load();
    });

    const removeAlert = (alert: IAlert) => setAlert((alerts) => alerts.filter((x) => x !== alert));

    const [updateServerGQL] = useMutation(UpdateServerGQL);

    const onSubmit = async (data: any, e: React.BaseSyntheticEvent<object, any, any> | undefined) => {
        let values: string[] = [];

        for (let key in data) {
            if (typeof data[key] != "string")
                for (let key2 in data[key]) {
                    if (typeof data[key][key2] != "string") {
                        if (typeof data[key][key2] == "number" && (!(dbServer as any)[key] || data[key][key2] !== (dbServer as any)[key][key2])) {
                            values.push(`${key}.${key2}`);
                            updateData(
                                (
                                    await updateServerGQL({
                                        variables: {
                                            id,
                                            name: `${key}.${key2}`,
                                            valueNumber: data[key][key2]
                                        }
                                    })
                                ).data.updateServer
                            );
                        } else
                            for (let key3 in data[key][key2]) {
                                if (
                                    data[key][key2][key3] &&
                                    (!isNaN(data[key][key2][key3]) || data[key][key2][key3].length > 0) &&
                                    (!(dbServer as any)[key] || !(dbServer as any)[key][key2] || data[key][key2][key3] !== (dbServer as any)[key][key2][key3])
                                ) {
                                    if ((key3 === "min" && data[key][key2]["max"]) || (key3 === "max" && data[key][key2]["min"])) {
                                        let minimo = data[key][key2]["min"];
                                        let maximo = data[key][key2]["max"];
                                        data[key][key2]["min"] = minimo > maximo ? maximo : minimo;
                                        data[key][key2]["max"] = maximo < minimo ? minimo : maximo === minimo ? ++maximo : maximo;
                                    }
                                    values.push(`${key}.${key2}.${key3}`);
                                    updateData(
                                        (
                                            await updateServerGQL({
                                                variables: {
                                                    id,
                                                    name: `${key}.${key2}.${key3}`,
                                                    [typeof data[key][key2][key3] == "number" ? "valueNumber" : "value"]: data[key][key2][key3]
                                                }
                                            })
                                        ).data.updateServer
                                    );
                                }
                            }
                    } else if (data[key][key2] && data[key][key2].length > 0 && (!(dbServer as any)[key] || data[key][key2] !== (dbServer as any)[key][key2])) {
                        let timerMs;
                        try {
                            timerMs = ms(data[key][key2]);
                        } catch (_) {}
                        values.push(`${key}.${key2}`);
                        updateData(
                            (
                                await updateServerGQL({
                                    variables: {
                                        id,
                                        name: `${key}.${key2}`,
                                        [timerMs ? "valueNumber" : "value"]: timerMs ? timerMs : data[key][key2]
                                    }
                                })
                            ).data.updateServer
                        );
                    }
                }
            else if (data[key] && data[key].length > 0 && data[key] !== (dbServer as any)[key]) {
                values.push(key);
                updateData(
                    (
                        await updateServerGQL({
                            variables: {
                                id,
                                name: key,
                                value: data[key]
                            }
                        })
                    ).data.updateServer
                );
            }
        }

        function updateData(newData: ISistemas | null) {
            if (newData) {
                if (e) e.target.reset();
                setAlert((at) => [...at, { type: "success", show: true, text: "Cambios Guardados Correctamente" }]);
                setDbServer(newData);
                if (newData.language?.server) setValue("language", newData.language.server);
                reset(values);
            }
        }
    };

    const onDelete = async (name: string) => {
        var newData = (
            await updateServerGQL({
                variables: {
                    id,
                    name
                }
            })
        ).data.deleteServerGQL;
        setDbServer(newData);
        reset([name]);
        if (name === "language.server") setValue("language.server", "es-MX");
        setAlert((at) => [...at, { type: "success", show: true, text: `Propiedad eliminada correctamente.` }]);
    };

    const graphql = useQuery(ServerGQL, { variables: { id } });
    const channelsGQL = useQuery(ChannelsGuildGQL, { variables: { id } });

    if (loading || graphql.loading || channelsGQL.loading)
        return (
            <Container className="text-center">
                <Spinner animation="border" variant="warning" role="status" />
            </Container>
        );
    else {
        if (!dbServer && graphql.data?.getServer) {
            setDbServer(graphql.data.getServer);
            loadDB(graphql.data.getServer, channelsGQL.data.getChannelsGuild);
        }

        return (
            <Container>
                <Row>
                    <Col sm={12}>
                        <ins
                            className="adsbygoogle"
                            style={{ display: "block" }}
                            data-ad-client="ca-pub-2365658233726619"
                            data-ad-slot="5039508803"
                            data-ad-format="auto"
                            data-full-width-responsive="true"
                        ></ins>
                        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
                    </Col>

                    <Col sm>
                        <Row className="text-center">
                            <Col sm={12}>
                                <Card className="bg-primary">
                                    <Row>
                                        <Col sm={12} className="p-4">
                                            <img
                                                className="rounded"
                                                style={{ width: "15%" }}
                                                src={`https://cdn.discordapp.com/icons/${id}/${guild.icon}.png?size=128`}
                                                alt=""
                                            />
                                        </Col>
                                        {guild.ownerID === user?._id ? (
                                            <Col sm={12}>
                                                <h3>👑</h3>
                                            </Col>
                                        ) : null}
                                        <Col sm={12}>
                                            <h4>{guild.name}</h4>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                            <Tab.Container defaultActiveKey="bot">
                                <Col sm={2} className="text-center">
                                    <Nav variant="pills" className="flex-column">
                                        <Nav.Link eventKey="bot">Inicio</Nav.Link>
                                        <Nav.Link eventKey="economy">Economía</Nav.Link>
                                        <Nav.Link eventKey="shop" disabled>
                                            Tienda
                                        </Nav.Link>
                                    </Nav>
                                </Col>
                                <Col className="text-center pt-4">
                                    <Tab.Content>
                                        {/* Alertas */}
                                        <Col sm={12}>
                                            {alert.map((variant, idx) => {
                                                setTimeout(() => removeAlert(variant), 2000);
                                                return (
                                                    <Alert
                                                        style={{ position: "fixed", width: "52%", top: "5%", zIndex: 4 }}
                                                        key={idx}
                                                        show={variant.show}
                                                        variant={variant.type}
                                                        dismissible
                                                        onClose={() => removeAlert(variant)}
                                                    >
                                                        <Alert.Heading>{variant.text}</Alert.Heading>
                                                    </Alert>
                                                );
                                            })}
                                        </Col>

                                        {/* Panel de Bot */}
                                        <Tab.Pane eventKey="bot">
                                            <Row className="align-items-center text-center">
                                                <Col sm={12}>
                                                    <h3>Configuraciones Generales</h3>
                                                </Col>
                                                <Col sm={12}>
                                                    <Form className="g-3 needs-validation" onSubmit={handleSubmit(onSubmit)}>
                                                        <Form.Row className="align-items-center">
                                                            {/**
                                                             * Prefix
                                                             */}
                                                            <Col sm>
                                                                <InputGroup className="mb-2">
                                                                    <InputGroup.Prepend>
                                                                        <InputGroup.Text>Prefijo</InputGroup.Text>
                                                                    </InputGroup.Prepend>
                                                                    <Form.Control
                                                                        name="prefix"
                                                                        placeholder={dbServer?.prefix ? dbServer.prefix : "Por Defecto: e!"}
                                                                        ref={register({
                                                                            maxLength: {
                                                                                value: 5,
                                                                                message: "No más de 5 carácteres"
                                                                            }
                                                                        })}
                                                                    />
                                                                    {dbServer?.prefix != null ? (
                                                                        <Button variant="outline-danger" name="deletePrefix" onClick={() => onDelete("prefix")}>
                                                                            Eliminar
                                                                        </Button>
                                                                    ) : null}
                                                                </InputGroup>
                                                                {errors.prefix && (
                                                                    <span className="text-danger text-small d-block mb-2">{errors.prefix.message}</span>
                                                                )}
                                                            </Col>
                                                            {/**
                                                             * Idioma
                                                             */}
                                                            <Col sm>
                                                                <InputGroup className="mb-2">
                                                                    <InputGroup.Prepend>
                                                                        <InputGroup.Text>Idioma</InputGroup.Text>
                                                                    </InputGroup.Prepend>
                                                                    <Form.Control
                                                                        name="language.server"
                                                                        as="select"
                                                                        ref={register}
                                                                        defaultValue={dbServer?.language?.server ? dbServer.language.server : "es-MX"}
                                                                    >
                                                                        <option key="Lg2">es-MX</option>
                                                                        <option key="Lg3">es-ES</option>
                                                                        <option key="Lg1">en-US</option>
                                                                        <option key="Lg4">pt-BR</option>
                                                                    </Form.Control>
                                                                    {dbServer?.language?.server != null ? (
                                                                        <Button
                                                                            variant="outline-danger"
                                                                            name="deleteLang"
                                                                            onClick={() => onDelete("language.server")}
                                                                        >
                                                                            Eliminar
                                                                        </Button>
                                                                    ) : null}
                                                                </InputGroup>
                                                                {errors.language && (
                                                                    <span className="text-danger text-small d-block mb-2">{errors.language.message}</span>
                                                                )}
                                                            </Col>
                                                            {/**
                                                             * Idioma en Canales
                                                             */}
                                                            {/**
                                                             * BlackList
                                                             */}
                                                            {/**
                                                             * WhiteList
                                                             */}
                                                            {/* Guardar */}
                                                            <Col sm={12} className="pt-4">
                                                                <Button variant="outline-warning" type="submit" name="action">
                                                                    Guardar
                                                                </Button>
                                                            </Col>
                                                        </Form.Row>
                                                    </Form>
                                                </Col>
                                            </Row>
                                        </Tab.Pane>

                                        {/* Panel de Economía */}
                                        <Tab.Pane eventKey="economy">
                                            <Row className="align-items-center text-center">
                                                <Col sm={12}>
                                                    <h3>Economía</h3>
                                                </Col>
                                                <Col sm={12}>
                                                    <Form className="g-3 needs-validation" onSubmit={handleSubmit(onSubmit)} name="economyForm">
                                                        <Form.Row className="align-items-center">
                                                            {/**
                                                             * Currency
                                                             */}
                                                            <Col sm={12} className="pt-4">
                                                                <Form.Text className="text-muted">Coloca sólo emojis normales</Form.Text>
                                                                <InputGroup className="mb-2">
                                                                    <InputGroup.Prepend>
                                                                        <InputGroup.Text>Moneda</InputGroup.Text>
                                                                    </InputGroup.Prepend>
                                                                    <Form.Control
                                                                        name="moneda.name"
                                                                        placeholder={dbServer?.moneda?.name ? dbServer.moneda.name : "Por Defecto: 🔶"}
                                                                        ref={register}
                                                                    />
                                                                    {dbServer?.moneda?.name != null ? (
                                                                        <Button
                                                                            variant="outline-danger"
                                                                            name="deleteCooldownMensajes"
                                                                            onClick={() => onDelete("moneda.name")}
                                                                        >
                                                                            Eliminar
                                                                        </Button>
                                                                    ) : null}
                                                                </InputGroup>
                                                            </Col>
                                                            {/**
                                                             * Dinero por Escribir
                                                             */}
                                                            <Col sm={12}>
                                                                <Row className="economy">
                                                                    <Col sm={12}>
                                                                        <h5>Dinero por Escribir</h5>
                                                                    </Col>
                                                                    {/**
                                                                     * Payout
                                                                     */}
                                                                    <Col sm>
                                                                        <Form.Label>Pago Mínimo</Form.Label>
                                                                        <InputGroup className="mb-2">
                                                                            <Form.Control
                                                                                name="pago.mensajes.min"
                                                                                placeholder={
                                                                                    dbServer?.pago?.mensajes?.min
                                                                                        ? ConverString(dbServer.pago.mensajes.min)
                                                                                        : "No Configurado"
                                                                                }
                                                                                ref={register({ valueAsNumber: true, min: 1 })}
                                                                            />
                                                                            {dbServer?.pago?.mensajes?.min != null ? (
                                                                                <Button
                                                                                    variant="outline-danger"
                                                                                    name="deleteCooldownMensajes"
                                                                                    onClick={() => onDelete("pago.mensajes.min")}
                                                                                >
                                                                                    Eliminar
                                                                                </Button>
                                                                            ) : null}
                                                                        </InputGroup>
                                                                    </Col>
                                                                    <Col sm>
                                                                        <Form.Label>Pago Máximo</Form.Label>
                                                                        <InputGroup className="mb-2">
                                                                            <Form.Control
                                                                                name="pago.mensajes.max"
                                                                                placeholder={
                                                                                    dbServer?.pago?.mensajes?.max
                                                                                        ? ConverString(dbServer.pago.mensajes.max)
                                                                                        : "No Configurado"
                                                                                }
                                                                                ref={register({ valueAsNumber: true, min: 2 })}
                                                                            />
                                                                            {dbServer?.pago?.mensajes?.max != null ? (
                                                                                <Button
                                                                                    variant="outline-danger"
                                                                                    name="deleteCooldownMensajes"
                                                                                    onClick={() => onDelete("pago.mensajes.max")}
                                                                                >
                                                                                    Eliminar
                                                                                </Button>
                                                                            ) : null}
                                                                        </InputGroup>
                                                                    </Col>
                                                                    {/**
                                                                     * Cooldow
                                                                     */}
                                                                    <Col sm>
                                                                        <Form.Label>Cooldown</Form.Label>
                                                                        <InputGroup className="mb-2">
                                                                            <Form.Control
                                                                                name="cooldown.mensajes"
                                                                                placeholder={
                                                                                    dbServer?.cooldown?.mensajes
                                                                                        ? ConverTime(dbServer.cooldown.mensajes)
                                                                                        : "Por Defecto: 1m"
                                                                                }
                                                                                ref={register}
                                                                            />
                                                                            {dbServer?.cooldown?.mensajes != null ? (
                                                                                <Button
                                                                                    variant="outline-danger"
                                                                                    name="deleteCooldownMensajes"
                                                                                    onClick={() => onDelete("cooldown.mensajes")}
                                                                                >
                                                                                    Eliminar
                                                                                </Button>
                                                                            ) : null}
                                                                        </InputGroup>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                            {/**
                                                             * chatExcluido
                                                             */}
                                                            <Col sm={12} className="pb-3">
                                                                <Form.Label>Canales Excluidos</Form.Label>
                                                                {chatExclude.length === 0 ? (
                                                                    <Col sm={12} className="text-muted">
                                                                        Sin Canales
                                                                    </Col>
                                                                ) : (
                                                                    <ul className="channelUl">
                                                                        {chatExclude.map((ce) => (
                                                                            <li className="channelCard">
                                                                                <span>
                                                                                    <svg
                                                                                        style={{
                                                                                            opacity: "0.3",
                                                                                            marginTop: "-1px",
                                                                                            marginInlineEnd: "7px",
                                                                                            width: "18px"
                                                                                        }}
                                                                                        width="24"
                                                                                        height="24"
                                                                                        viewBox="0 0 24 24"
                                                                                    >
                                                                                        <path
                                                                                            fill="currentColor"
                                                                                            fill-rule="evenodd"
                                                                                            clip-rule="evenodd"
                                                                                            d="M5.88657 21C5.57547 21 5.3399 20.7189 5.39427 20.4126L6.00001 17H2.59511C2.28449 17 2.04905 16.7198 2.10259 16.4138L2.27759 15.4138C2.31946 15.1746 2.52722 15 2.77011 15H6.35001L7.41001 9H4.00511C3.69449 9 3.45905 8.71977 3.51259 8.41381L3.68759 7.41381C3.72946 7.17456 3.93722 7 4.18011 7H7.76001L8.39677 3.41262C8.43914 3.17391 8.64664 3 8.88907 3H9.87344C10.1845 3 10.4201 3.28107 10.3657 3.58738L9.76001 7H15.76L16.3968 3.41262C16.4391 3.17391 16.6466 3 16.8891 3H17.8734C18.1845 3 18.4201 3.28107 18.3657 3.58738L17.76 7H21.1649C21.4755 7 21.711 7.28023 21.6574 7.58619L21.4824 8.58619C21.4406 8.82544 21.2328 9 20.9899 9H17.41L16.35 15H19.7549C20.0655 15 20.301 15.2802 20.2474 15.5862L20.0724 16.5862C20.0306 16.8254 19.8228 17 19.5799 17H16L15.3632 20.5874C15.3209 20.8261 15.1134 21 14.8709 21H13.8866C13.5755 21 13.3399 20.7189 13.3943 20.4126L14 17H8.00001L7.36325 20.5874C7.32088 20.8261 7.11337 21 6.87094 21H5.88657ZM9.41045 9L8.35045 15H14.3504L15.4104 9H9.41045Z"
                                                                                        ></path>
                                                                                    </svg>{" "}
                                                                                    {ce.name}
                                                                                </span>
                                                                                {/* <button
                                                                                    type="button"
                                                                                    aria-label="Close"
                                                                                    onClick={(d) => {
                                                                                        setChatExclude((channels) => channels.filter((x) => x.id !== ce.id));
                                                                                    }}
                                                                                >
                                                                                    <i className="material-icons channelButtonIcon">clear</i>
                                                                                </button> */}
                                                                            </li>
                                                                        ))}
                                                                        {/* <li>
                                                                    <button
                                                                        className="channelButtonAdd"
                                                                        type="button"
                                                                        aria-label="Close"
                                                                        onClick={() => {
                                                                            setChatExclude((ce) => [...ce, { name: "bot", id: "bot" }]);
                                                                        }}
                                                                    >
                                                                        <i className="material-icons channelButtonIcon">add</i>
                                                                    </button>
                                                                </li> */}
                                                                    </ul>
                                                                )}
                                                            </Col>
                                                            {/**
                                                             * Crime
                                                             */}
                                                            <Col sm={12}>
                                                                <Row className="economy e-var">
                                                                    <Col sm={12}>
                                                                        <h5>Crime</h5>
                                                                    </Col>
                                                                    <Col sm={12}>
                                                                        <Row>
                                                                            {/**
                                                                             * Payout
                                                                             */}
                                                                            <Col sm>
                                                                                <Form.Label>Pago Mínimo</Form.Label>
                                                                                <InputGroup className="mb-2">
                                                                                    <Form.Control
                                                                                        name="pago.crime.min"
                                                                                        placeholder={
                                                                                            dbServer?.pago?.crime?.min
                                                                                                ? ConverString(dbServer.pago.crime.min)
                                                                                                : "No Configurado"
                                                                                        }
                                                                                        ref={register({ valueAsNumber: true, min: 1 })}
                                                                                    />
                                                                                    {dbServer?.pago?.crime?.min != null ? (
                                                                                        <Button
                                                                                            variant="outline-danger"
                                                                                            name="deleteCooldownMensajes"
                                                                                            onClick={() => onDelete("pago.crime.min")}
                                                                                        >
                                                                                            Eliminar
                                                                                        </Button>
                                                                                    ) : null}
                                                                                </InputGroup>
                                                                            </Col>
                                                                            <Col sm>
                                                                                <Form.Label>Pago Máximo</Form.Label>
                                                                                <InputGroup className="mb-2">
                                                                                    <Form.Control
                                                                                        name="pago.crime.max"
                                                                                        placeholder={
                                                                                            dbServer?.pago?.crime?.max
                                                                                                ? ConverString(dbServer.pago.crime.max)
                                                                                                : "No Configurado"
                                                                                        }
                                                                                        ref={register({ valueAsNumber: true, min: 2 })}
                                                                                    />
                                                                                    {dbServer?.pago?.crime?.max != null ? (
                                                                                        <Button
                                                                                            variant="outline-danger"
                                                                                            name="deleteCooldownMensajes"
                                                                                            onClick={() => onDelete("pago.crime.max")}
                                                                                        >
                                                                                            Eliminar
                                                                                        </Button>
                                                                                    ) : null}
                                                                                </InputGroup>
                                                                            </Col>
                                                                            {/**
                                                                             * Fineamount
                                                                             */}
                                                                            <Col sm>
                                                                                <Form.Label>Multa Mínima</Form.Label>
                                                                                <InputGroup className="mb-2">
                                                                                    <Form.Control
                                                                                        name="multa.crime.min"
                                                                                        placeholder={
                                                                                            dbServer?.multa?.crime?.min
                                                                                                ? ConverString(dbServer.multa.crime.min)
                                                                                                : "No Configurado"
                                                                                        }
                                                                                        ref={register({ valueAsNumber: true, min: 1 })}
                                                                                    />
                                                                                    {dbServer?.multa?.crime?.min != null ? (
                                                                                        <Button
                                                                                            variant="outline-danger"
                                                                                            name="deleteCooldownMensajes"
                                                                                            onClick={() => onDelete("multa.crime.min")}
                                                                                        >
                                                                                            Eliminar
                                                                                        </Button>
                                                                                    ) : null}
                                                                                </InputGroup>
                                                                            </Col>
                                                                        </Row>
                                                                    </Col>
                                                                    <Col sm={12}>
                                                                        <Row>
                                                                            {/**
                                                                             * Fineamount
                                                                             */}
                                                                            <Col sm>
                                                                                <Form.Label>Multa Máxima</Form.Label>
                                                                                <InputGroup className="mb-2">
                                                                                    <Form.Control
                                                                                        name="multa.crime.max"
                                                                                        placeholder={
                                                                                            dbServer?.multa?.crime?.max
                                                                                                ? ConverString(dbServer.multa.crime.max)
                                                                                                : "No Configurado"
                                                                                        }
                                                                                        ref={register({ valueAsNumber: true, min: 2 })}
                                                                                    />
                                                                                    {dbServer?.multa?.crime?.max != null ? (
                                                                                        <Button
                                                                                            variant="outline-danger"
                                                                                            name="deleteCooldownMensajes"
                                                                                            onClick={() => onDelete("multa.crime.max")}
                                                                                        >
                                                                                            Eliminar
                                                                                        </Button>
                                                                                    ) : null}
                                                                                </InputGroup>
                                                                            </Col>
                                                                            {/**
                                                                             * Cooldow
                                                                             */}
                                                                            <Col sm>
                                                                                <Form.Label>Cooldown</Form.Label>
                                                                                <InputGroup className="mb-2">
                                                                                    <Form.Control
                                                                                        name="cooldown.crime"
                                                                                        placeholder={
                                                                                            dbServer?.cooldown?.crime
                                                                                                ? ConverTime(dbServer.cooldown.crime)
                                                                                                : "No Configurado"
                                                                                        }
                                                                                        ref={register}
                                                                                    />
                                                                                    {dbServer?.cooldown?.crime != null ? (
                                                                                        <Button
                                                                                            variant="outline-danger"
                                                                                            name="deleteCooldownMensajes"
                                                                                            onClick={() => onDelete("cooldown.crime")}
                                                                                        >
                                                                                            Eliminar
                                                                                        </Button>
                                                                                    ) : null}
                                                                                </InputGroup>
                                                                            </Col>
                                                                        </Row>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                            {/**
                                                             * Daily
                                                             */}
                                                            <Col sm={12}>
                                                                <Row className="economy">
                                                                    <Col sm={12}>
                                                                        <h5>Daily</h5>
                                                                    </Col>
                                                                    {/**
                                                                     * Payout
                                                                     */}
                                                                    <Col>
                                                                        <Form.Label>Pago</Form.Label>
                                                                        <InputGroup className="mb-2">
                                                                            <Form.Control
                                                                                name="pago.daily"
                                                                                placeholder={
                                                                                    dbServer?.pago?.daily ? ConverString(dbServer.pago.daily) : "No Configurado"
                                                                                }
                                                                                ref={register({ valueAsNumber: true, min: 1 })}
                                                                            />
                                                                            {dbServer?.pago?.daily != null ? (
                                                                                <Button
                                                                                    variant="outline-danger"
                                                                                    name="deleteCooldownMensajes"
                                                                                    onClick={() => onDelete("pago.daily")}
                                                                                >
                                                                                    Eliminar
                                                                                </Button>
                                                                            ) : null}
                                                                        </InputGroup>
                                                                    </Col>
                                                                    {/**
                                                                     * Cooldow
                                                                     */}
                                                                    <Col sm>
                                                                        <Form.Label>Cooldown</Form.Label>
                                                                        <InputGroup className="mb-2">
                                                                            <Form.Control
                                                                                name="cooldown.daily"
                                                                                placeholder={
                                                                                    dbServer?.cooldown?.daily
                                                                                        ? ConverTime(dbServer.cooldown.daily)
                                                                                        : "No Configurado"
                                                                                }
                                                                                ref={register}
                                                                            />
                                                                            {dbServer?.cooldown?.daily != null ? (
                                                                                <Button
                                                                                    variant="outline-danger"
                                                                                    name="deleteCooldownMensajes"
                                                                                    onClick={() => onDelete("cooldown.daily")}
                                                                                >
                                                                                    Eliminar
                                                                                </Button>
                                                                            ) : null}
                                                                        </InputGroup>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                            {/**
                                                             * Dice
                                                             */}
                                                            <Col sm={12}>
                                                                <Row className="economy e-var">
                                                                    <Col sm={12}>
                                                                        <h5>Dice</h5>
                                                                    </Col>
                                                                    <Col sm={12}>
                                                                        <Row>
                                                                            {/**
                                                                             * Payout
                                                                             */}
                                                                            <Col sm>
                                                                                <Form.Label>Pago Mínimo</Form.Label>
                                                                                <InputGroup className="mb-2">
                                                                                    <Form.Control
                                                                                        name="pago.dice.min"
                                                                                        placeholder={
                                                                                            dbServer?.pago?.dice?.min
                                                                                                ? ConverString(dbServer.pago.dice.min)
                                                                                                : "No Configurado"
                                                                                        }
                                                                                        ref={register({ valueAsNumber: true, min: 1 })}
                                                                                    />
                                                                                    {dbServer?.pago?.dice?.min != null ? (
                                                                                        <Button
                                                                                            variant="outline-danger"
                                                                                            name="deleteCooldownMensajes"
                                                                                            onClick={() => onDelete("pago.dice.min")}
                                                                                        >
                                                                                            Eliminar
                                                                                        </Button>
                                                                                    ) : null}
                                                                                </InputGroup>
                                                                            </Col>
                                                                            <Col sm>
                                                                                <Form.Label>Pago Máximo</Form.Label>
                                                                                <InputGroup className="mb-2">
                                                                                    <Form.Control
                                                                                        name="pago.dice.max"
                                                                                        placeholder={
                                                                                            dbServer?.pago?.dice?.max
                                                                                                ? ConverString(dbServer.pago.dice.max)
                                                                                                : "No Configurado"
                                                                                        }
                                                                                        ref={register({ valueAsNumber: true, min: 2 })}
                                                                                    />
                                                                                    {dbServer?.pago?.dice?.max != null ? (
                                                                                        <Button
                                                                                            variant="outline-danger"
                                                                                            name="deleteCooldownMensajes"
                                                                                            onClick={() => onDelete("pago.dice.max")}
                                                                                        >
                                                                                            Eliminar
                                                                                        </Button>
                                                                                    ) : null}
                                                                                </InputGroup>
                                                                            </Col>
                                                                            {/**
                                                                             * Fineamount
                                                                             */}
                                                                            <Col sm>
                                                                                <Form.Label>Multa Mínima</Form.Label>
                                                                                <InputGroup className="mb-2">
                                                                                    <Form.Control
                                                                                        name="multa.dice.min"
                                                                                        placeholder={
                                                                                            dbServer?.multa?.dice?.min
                                                                                                ? ConverString(dbServer.multa.dice.min)
                                                                                                : "No Configurado"
                                                                                        }
                                                                                        ref={register({ valueAsNumber: true, min: 1 })}
                                                                                    />
                                                                                    {dbServer?.multa?.dice?.min != null ? (
                                                                                        <Button
                                                                                            variant="outline-danger"
                                                                                            name="deleteCooldownMensajes"
                                                                                            onClick={() => onDelete("multa.dice.min")}
                                                                                        >
                                                                                            Eliminar
                                                                                        </Button>
                                                                                    ) : null}
                                                                                </InputGroup>
                                                                            </Col>
                                                                        </Row>
                                                                    </Col>
                                                                    <Col sm={12}>
                                                                        <Row>
                                                                            {/**
                                                                             * Fineamount
                                                                             */}
                                                                            <Col sm>
                                                                                <Form.Label>Multa Máxima</Form.Label>
                                                                                <InputGroup className="mb-2">
                                                                                    <Form.Control
                                                                                        name="multa.dice.max"
                                                                                        placeholder={
                                                                                            dbServer?.multa?.dice?.max
                                                                                                ? ConverString(dbServer.multa.dice.max)
                                                                                                : "No Configurado"
                                                                                        }
                                                                                        ref={register({ valueAsNumber: true, min: 2 })}
                                                                                    />
                                                                                    {dbServer?.multa?.dice?.max != null ? (
                                                                                        <Button
                                                                                            variant="outline-danger"
                                                                                            name="deleteCooldownMensajes"
                                                                                            onClick={() => onDelete("multa.dice.max")}
                                                                                        >
                                                                                            Eliminar
                                                                                        </Button>
                                                                                    ) : null}
                                                                                </InputGroup>
                                                                            </Col>

                                                                            {/**
                                                                             * Cooldow
                                                                             */}
                                                                            <Col sm>
                                                                                <Form.Label>Cooldown</Form.Label>
                                                                                <InputGroup className="mb-2">
                                                                                    <Form.Control
                                                                                        name="cooldown.dice"
                                                                                        placeholder={
                                                                                            dbServer?.cooldown?.dice
                                                                                                ? ConverTime(dbServer.cooldown.dice)
                                                                                                : "No Configurado"
                                                                                        }
                                                                                        ref={register}
                                                                                    />
                                                                                    {dbServer?.cooldown?.dice != null ? (
                                                                                        <Button
                                                                                            variant="outline-danger"
                                                                                            name="deleteCooldownMensajes"
                                                                                            onClick={() => onDelete("cooldown.dice")}
                                                                                        >
                                                                                            Eliminar
                                                                                        </Button>
                                                                                    ) : null}
                                                                                </InputGroup>
                                                                            </Col>
                                                                        </Row>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                            {/**
                                                             * FlipCoin
                                                             */}
                                                            <Col sm={12}>
                                                                <Row className="economy">
                                                                    <Col sm={12}>
                                                                        <h5>FlipCoin</h5>
                                                                    </Col>
                                                                    {/**
                                                                     * Payout
                                                                     */}
                                                                    <Col sm>
                                                                        <Form.Label>Pago Mínimo</Form.Label>
                                                                        <InputGroup className="mb-2">
                                                                            <Form.Control
                                                                                name="pago.flipcoin.min"
                                                                                placeholder={
                                                                                    dbServer?.pago?.flipcoin?.min
                                                                                        ? ConverString(dbServer.pago.flipcoin.min)
                                                                                        : "No Configurado"
                                                                                }
                                                                                ref={register({ valueAsNumber: true, min: 1 })}
                                                                            />
                                                                            {dbServer?.pago?.flipcoin?.min != null ? (
                                                                                <Button
                                                                                    variant="outline-danger"
                                                                                    name="deleteCooldownMensajes"
                                                                                    onClick={() => onDelete("pago.flipcoin.min")}
                                                                                >
                                                                                    Eliminar
                                                                                </Button>
                                                                            ) : null}
                                                                        </InputGroup>
                                                                    </Col>
                                                                    <Col sm>
                                                                        <Form.Label>Pago Máximo</Form.Label>
                                                                        <InputGroup className="mb-2">
                                                                            <Form.Control
                                                                                name="pago.flipcoin.max"
                                                                                placeholder={
                                                                                    dbServer?.pago?.flipcoin?.max
                                                                                        ? ConverString(dbServer.pago.flipcoin.max)
                                                                                        : "No Configurado"
                                                                                }
                                                                                ref={register({ valueAsNumber: true, min: 2 })}
                                                                            />
                                                                            {dbServer?.pago?.flipcoin?.max != null ? (
                                                                                <Button
                                                                                    variant="outline-danger"
                                                                                    name="deleteCooldownMensajes"
                                                                                    onClick={() => onDelete("pago.flipcoin.max")}
                                                                                >
                                                                                    Eliminar
                                                                                </Button>
                                                                            ) : null}
                                                                        </InputGroup>
                                                                    </Col>
                                                                    {/**
                                                                     * Fineamount
                                                                     */}
                                                                    <Col sm>
                                                                        <Form.Label>Multa Mínima</Form.Label>
                                                                        <InputGroup className="mb-2">
                                                                            <Form.Control
                                                                                name="multa.flipcoin.min"
                                                                                placeholder={
                                                                                    dbServer?.multa?.flipcoin?.min
                                                                                        ? ConverString(dbServer.multa.flipcoin.min)
                                                                                        : "No Configurado"
                                                                                }
                                                                                ref={register({ valueAsNumber: true, min: 1 })}
                                                                            />
                                                                            {dbServer?.multa?.flipcoin?.min != null ? (
                                                                                <Button
                                                                                    variant="outline-danger"
                                                                                    name="deleteCooldownMensajes"
                                                                                    onClick={() => onDelete("multa.flipcoin.min")}
                                                                                >
                                                                                    Eliminar
                                                                                </Button>
                                                                            ) : null}
                                                                        </InputGroup>
                                                                    </Col>
                                                                    <Col sm>
                                                                        <Form.Label>Multa Máxima</Form.Label>
                                                                        <InputGroup className="mb-2">
                                                                            <Form.Control
                                                                                name="multa.flipcoin.max"
                                                                                placeholder={
                                                                                    dbServer?.multa?.flipcoin?.max
                                                                                        ? ConverString(dbServer.multa.flipcoin.max)
                                                                                        : "No Configurado"
                                                                                }
                                                                                ref={register({ valueAsNumber: true, min: 2 })}
                                                                            />
                                                                            {dbServer?.multa?.flipcoin?.max != null ? (
                                                                                <Button
                                                                                    variant="outline-danger"
                                                                                    name="deleteCooldownMensajes"
                                                                                    onClick={() => onDelete("multa.flipcoin.max")}
                                                                                >
                                                                                    Eliminar
                                                                                </Button>
                                                                            ) : null}
                                                                        </InputGroup>
                                                                    </Col>
                                                                    {/**
                                                                     * Cooldow
                                                                     */}
                                                                    <Col sm>
                                                                        <Form.Label>Cooldown</Form.Label>
                                                                        <InputGroup className="mb-2">
                                                                            <Form.Control
                                                                                name="cooldown.flipcoin"
                                                                                placeholder={
                                                                                    dbServer?.cooldown?.flipcoin
                                                                                        ? ConverTime(dbServer.cooldown.flipcoin)
                                                                                        : "No Configurado"
                                                                                }
                                                                                ref={register}
                                                                            />
                                                                            {dbServer?.cooldown?.flipcoin != null ? (
                                                                                <Button
                                                                                    variant="outline-danger"
                                                                                    name="deleteCooldownMensajes"
                                                                                    onClick={() => onDelete("cooldown.flipcoin")}
                                                                                >
                                                                                    Eliminar
                                                                                </Button>
                                                                            ) : null}
                                                                        </InputGroup>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                            {/**
                                                             * Loot
                                                             */}
                                                            <Col sm={12}>
                                                                <Row className="economy e-var">
                                                                    <Col sm={12}>
                                                                        <h5>Loot</h5>
                                                                    </Col>
                                                                    <Col sm>
                                                                        <Form.Label>Items Mínimos Ganados</Form.Label>
                                                                        <InputGroup className="mb-2">
                                                                            <Form.Control
                                                                                disabled
                                                                                name="pago.loot.min"
                                                                                placeholder={"No Configurado"}
                                                                                ref={register}
                                                                            />
                                                                        </InputGroup>
                                                                    </Col>
                                                                    <Col sm>
                                                                        <Form.Label>Items Máximos Ganados</Form.Label>
                                                                        <InputGroup className="mb-2">
                                                                            <Form.Control
                                                                                disabled
                                                                                name="pago.loot.max"
                                                                                placeholder={"No Configurado"}
                                                                                ref={register}
                                                                            />
                                                                        </InputGroup>
                                                                    </Col>
                                                                    {/**
                                                                     * Cooldow
                                                                     */}
                                                                    <Col sm>
                                                                        <Form.Label>Cooldown</Form.Label>
                                                                        <InputGroup className="mb-2">
                                                                            <Form.Control
                                                                                disabled
                                                                                name="cooldown.slotmachine"
                                                                                placeholder={
                                                                                    dbServer?.cooldown?.slotmachine
                                                                                        ? ConverTime(dbServer.cooldown.slotmachine)
                                                                                        : "No Configurado"
                                                                                }
                                                                                ref={register}
                                                                            />
                                                                            {dbServer?.cooldown?.slotmachine != null ? (
                                                                                <Button
                                                                                    variant="outline-danger"
                                                                                    name="deleteCooldownMensajes"
                                                                                    onClick={() => onDelete("cooldown.slotmachine")}
                                                                                >
                                                                                    Eliminar
                                                                                </Button>
                                                                            ) : null}
                                                                        </InputGroup>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                            {/**
                                                             * Rob
                                                             */}
                                                            <Col sm={12}>
                                                                <Row className="economy">
                                                                    <Col sm={12}>
                                                                        <h5>Rob</h5>
                                                                    </Col>
                                                                    {/**
                                                                     * Fineamount
                                                                     */}
                                                                    <Col sm>
                                                                        <Form.Label>Multa Mínima</Form.Label>
                                                                        <InputGroup className="mb-2">
                                                                            <Form.Control
                                                                                name="multa.rob.min"
                                                                                placeholder={
                                                                                    dbServer?.multa?.rob?.min
                                                                                        ? ConverString(dbServer.multa.rob.min)
                                                                                        : "No Configurado"
                                                                                }
                                                                                ref={register({ valueAsNumber: true, min: 1 })}
                                                                            />
                                                                            {dbServer?.multa?.rob?.min != null ? (
                                                                                <Button
                                                                                    variant="outline-danger"
                                                                                    name="deleteCooldownMensajes"
                                                                                    onClick={() => onDelete("multa.rob.min")}
                                                                                >
                                                                                    Eliminar
                                                                                </Button>
                                                                            ) : null}
                                                                        </InputGroup>
                                                                    </Col>
                                                                    <Col sm>
                                                                        <Form.Label>Multa Máxima</Form.Label>
                                                                        <InputGroup className="mb-2">
                                                                            <Form.Control
                                                                                name="multa.rob.max"
                                                                                placeholder={
                                                                                    dbServer?.multa?.rob?.max
                                                                                        ? ConverString(dbServer.multa.rob.max)
                                                                                        : "No Configurado"
                                                                                }
                                                                                ref={register({ valueAsNumber: true, min: 2 })}
                                                                            />
                                                                            {dbServer?.multa?.rob?.max != null ? (
                                                                                <Button
                                                                                    variant="outline-danger"
                                                                                    name="deleteCooldownMensajes"
                                                                                    onClick={() => onDelete("multa.rob.max")}
                                                                                >
                                                                                    Eliminar
                                                                                </Button>
                                                                            ) : null}
                                                                        </InputGroup>
                                                                    </Col>
                                                                    {/**
                                                                     * Cooldow
                                                                     */}
                                                                    <Col sm>
                                                                        <Form.Label>Cooldown</Form.Label>
                                                                        <InputGroup className="mb-2">
                                                                            <Form.Control
                                                                                name="cooldown.rob"
                                                                                placeholder={
                                                                                    dbServer?.cooldown?.rob
                                                                                        ? ConverTime(dbServer.cooldown.rob)
                                                                                        : "No Configurado"
                                                                                }
                                                                                ref={register}
                                                                            />
                                                                            {dbServer?.cooldown?.rob != null ? (
                                                                                <Button
                                                                                    variant="outline-danger"
                                                                                    name="deleteCooldownMensajes"
                                                                                    onClick={() => onDelete("cooldown.rob")}
                                                                                >
                                                                                    Eliminar
                                                                                </Button>
                                                                            ) : null}
                                                                        </InputGroup>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                            {/**
                                                             * Roulette
                                                             */}
                                                            <Col sm={12}>
                                                                <Row className="economy e-var">
                                                                    <Col sm={12}>
                                                                        <h5>Roulette</h5>
                                                                    </Col>
                                                                    <Col sm>
                                                                        <Form.Label>Apuesta Mínima</Form.Label>
                                                                        <InputGroup className="mb-2">
                                                                            <Form.Control
                                                                                disabled
                                                                                name="pago.roulette.min"
                                                                                placeholder={"No Configurado"}
                                                                                ref={register}
                                                                            />
                                                                        </InputGroup>
                                                                    </Col>
                                                                    <Col sm>
                                                                        <Form.Label>Apuesta Máxima</Form.Label>
                                                                        <InputGroup className="mb-2">
                                                                            <Form.Control
                                                                                disabled
                                                                                name="pago.roulette.max"
                                                                                placeholder={"No Configurado"}
                                                                                ref={register}
                                                                            />
                                                                        </InputGroup>
                                                                    </Col>
                                                                    {/**
                                                                     * Cooldow
                                                                     */}
                                                                    <Col sm>
                                                                        <Form.Label>Cooldown</Form.Label>
                                                                        <InputGroup className="mb-2">
                                                                            <Form.Control
                                                                                disabled
                                                                                name="cooldown.roulette"
                                                                                placeholder={
                                                                                    dbServer?.cooldown?.roulette
                                                                                        ? ConverTime(dbServer.cooldown.roulette)
                                                                                        : "No Configurado"
                                                                                }
                                                                                ref={register}
                                                                            />
                                                                            {dbServer?.cooldown?.roulette != null ? (
                                                                                <Button
                                                                                    variant="outline-danger"
                                                                                    name="deleteCooldownMensajes"
                                                                                    onClick={() => onDelete("cooldown.roulette")}
                                                                                >
                                                                                    Eliminar
                                                                                </Button>
                                                                            ) : null}
                                                                        </InputGroup>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                            {/**
                                                             * SlotMachine
                                                             */}
                                                            <Col sm={12}>
                                                                <Row className="economy">
                                                                    <Col sm={12}>
                                                                        <h5>SlotMachine</h5>
                                                                    </Col>
                                                                    <Col sm={12}>
                                                                        <Row>
                                                                            {/**
                                                                             * Payout
                                                                             */}
                                                                            <Col sm>
                                                                                <Form.Label>Pago Mínimo</Form.Label>
                                                                                <InputGroup className="mb-2">
                                                                                    <Form.Control
                                                                                        name="pago.slotmachine.min"
                                                                                        placeholder={
                                                                                            dbServer?.pago?.slotmachine?.min
                                                                                                ? ConverString(dbServer.pago.slotmachine.min)
                                                                                                : "No Configurado"
                                                                                        }
                                                                                        ref={register({ valueAsNumber: true, min: 1 })}
                                                                                    />
                                                                                    {dbServer?.pago?.slotmachine?.min != null ? (
                                                                                        <Button
                                                                                            variant="outline-danger"
                                                                                            name="deleteCooldownMensajes"
                                                                                            onClick={() => onDelete("pago.slotmachine.min")}
                                                                                        >
                                                                                            Eliminar
                                                                                        </Button>
                                                                                    ) : null}
                                                                                </InputGroup>
                                                                            </Col>
                                                                            <Col sm>
                                                                                <Form.Label>Pago Máximo</Form.Label>
                                                                                <InputGroup className="mb-2">
                                                                                    <Form.Control
                                                                                        name="pago.slotmachine.max"
                                                                                        placeholder={
                                                                                            dbServer?.pago?.slotmachine?.max
                                                                                                ? ConverString(dbServer.pago.slotmachine.max)
                                                                                                : "No Configurado"
                                                                                        }
                                                                                        ref={register({ valueAsNumber: true, min: 2 })}
                                                                                    />
                                                                                    {dbServer?.pago?.slotmachine?.max != null ? (
                                                                                        <Button
                                                                                            variant="outline-danger"
                                                                                            name="deleteCooldownMensajes"
                                                                                            onClick={() => onDelete("pago.slotmachine.max")}
                                                                                        >
                                                                                            Eliminar
                                                                                        </Button>
                                                                                    ) : null}
                                                                                </InputGroup>
                                                                            </Col>
                                                                            {/**
                                                                             * Fineamount
                                                                             */}
                                                                            <Col sm>
                                                                                <Form.Label>Multa Mínima</Form.Label>
                                                                                <InputGroup className="mb-2">
                                                                                    <Form.Control
                                                                                        name="multa.slotmachine.min"
                                                                                        placeholder={
                                                                                            dbServer?.multa?.slotmachine?.min
                                                                                                ? ConverString(dbServer.multa.slotmachine.min)
                                                                                                : "No Configurado"
                                                                                        }
                                                                                        ref={register({ valueAsNumber: true, min: 1 })}
                                                                                    />
                                                                                    {dbServer?.multa?.slotmachine?.min != null ? (
                                                                                        <Button
                                                                                            variant="outline-danger"
                                                                                            name="deleteCooldownMensajes"
                                                                                            onClick={() => onDelete("multa.slotmachine.min")}
                                                                                        >
                                                                                            Eliminar
                                                                                        </Button>
                                                                                    ) : null}
                                                                                </InputGroup>
                                                                            </Col>
                                                                        </Row>
                                                                    </Col>
                                                                    <Col sm={12}>
                                                                        <Row>
                                                                            <Col sm>
                                                                                <Form.Label>Multa Máxima</Form.Label>
                                                                                <InputGroup className="mb-2">
                                                                                    <Form.Control
                                                                                        name="multa.slotmachine.max"
                                                                                        placeholder={
                                                                                            dbServer?.multa?.slotmachine?.max
                                                                                                ? ConverString(dbServer.multa.slotmachine.max)
                                                                                                : "No Configurado"
                                                                                        }
                                                                                        ref={register({ valueAsNumber: true, min: 2 })}
                                                                                    />
                                                                                    {dbServer?.multa?.slotmachine?.max != null ? (
                                                                                        <Button
                                                                                            variant="outline-danger"
                                                                                            name="deleteCooldownMensajes"
                                                                                            onClick={() => onDelete("multa.slotmachine.max")}
                                                                                        >
                                                                                            Eliminar
                                                                                        </Button>
                                                                                    ) : null}
                                                                                </InputGroup>
                                                                            </Col>
                                                                            {/**
                                                                             * Cooldow
                                                                             */}
                                                                            <Col sm>
                                                                                <Form.Label>Cooldown</Form.Label>
                                                                                <InputGroup className="mb-2">
                                                                                    <Form.Control
                                                                                        name="cooldown.slotmachine"
                                                                                        placeholder={
                                                                                            dbServer?.cooldown?.slotmachine
                                                                                                ? ConverTime(dbServer.cooldown.slotmachine)
                                                                                                : "No Configurado"
                                                                                        }
                                                                                        ref={register}
                                                                                    />
                                                                                    {dbServer?.cooldown?.slotmachine != null ? (
                                                                                        <Button
                                                                                            variant="outline-danger"
                                                                                            name="deleteCooldownMensajes"
                                                                                            onClick={() => onDelete("cooldown.slotmachine")}
                                                                                        >
                                                                                            Eliminar
                                                                                        </Button>
                                                                                    ) : null}
                                                                                </InputGroup>
                                                                            </Col>
                                                                        </Row>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                            {/**
                                                             * Trade
                                                             */}
                                                            <Col sm={12}>
                                                                <Row className="economy e-var">
                                                                    <Col sm={12}>
                                                                        <h5>Trade</h5>
                                                                    </Col>
                                                                    <Col sm={12}>
                                                                        <Row>
                                                                            {/**
                                                                             * Payout
                                                                             */}
                                                                            <Col sm>
                                                                                <Form.Label>Pago Mínimo</Form.Label>
                                                                                <InputGroup className="mb-2">
                                                                                    <Form.Control
                                                                                        name="pago.trade.min"
                                                                                        placeholder={
                                                                                            dbServer?.pago?.trade?.min
                                                                                                ? ConverString(dbServer.pago.trade.min)
                                                                                                : "No Configurado"
                                                                                        }
                                                                                        ref={register({ valueAsNumber: true, min: 1 })}
                                                                                    />
                                                                                    {dbServer?.pago?.trade?.min != null ? (
                                                                                        <Button
                                                                                            variant="outline-danger"
                                                                                            name="deleteCooldownMensajes"
                                                                                            onClick={() => onDelete("pago.trade.min")}
                                                                                        >
                                                                                            Eliminar
                                                                                        </Button>
                                                                                    ) : null}
                                                                                </InputGroup>
                                                                            </Col>
                                                                            <Col sm>
                                                                                <Form.Label>Pago Máximo</Form.Label>
                                                                                <InputGroup className="mb-2">
                                                                                    <Form.Control
                                                                                        name="pago.trade.max"
                                                                                        placeholder={
                                                                                            dbServer?.pago?.trade?.max
                                                                                                ? ConverString(dbServer.pago.trade.max)
                                                                                                : "No Configurado"
                                                                                        }
                                                                                        ref={register({ valueAsNumber: true, min: 2 })}
                                                                                    />
                                                                                    {dbServer?.pago?.trade?.max != null ? (
                                                                                        <Button
                                                                                            variant="outline-danger"
                                                                                            name="deleteCooldownMensajes"
                                                                                            onClick={() => onDelete("pago.trade.max")}
                                                                                        >
                                                                                            Eliminar
                                                                                        </Button>
                                                                                    ) : null}
                                                                                </InputGroup>
                                                                            </Col>
                                                                            {/**
                                                                             * Fineamount
                                                                             */}
                                                                            <Col sm>
                                                                                <Form.Label>Multa Mínima</Form.Label>
                                                                                <InputGroup className="mb-2">
                                                                                    <Form.Control
                                                                                        name="multa.trade.min"
                                                                                        placeholder={
                                                                                            dbServer?.multa?.trade?.min
                                                                                                ? ConverString(dbServer.multa.trade.min)
                                                                                                : "No Configurado"
                                                                                        }
                                                                                        ref={register({ valueAsNumber: true, min: 1 })}
                                                                                    />
                                                                                    {dbServer?.multa?.trade?.min != null ? (
                                                                                        <Button
                                                                                            variant="outline-danger"
                                                                                            name="deleteCooldownMensajes"
                                                                                            onClick={() => onDelete("multa.trade.min")}
                                                                                        >
                                                                                            Eliminar
                                                                                        </Button>
                                                                                    ) : null}
                                                                                </InputGroup>
                                                                            </Col>
                                                                        </Row>
                                                                    </Col>
                                                                    <Col sm={12}>
                                                                        <Row>
                                                                            <Col sm>
                                                                                <Form.Label>Multa Máxima</Form.Label>
                                                                                <InputGroup className="mb-2">
                                                                                    <Form.Control
                                                                                        name="multa.trade.max"
                                                                                        placeholder={
                                                                                            dbServer?.multa?.trade?.max
                                                                                                ? ConverString(dbServer.multa.trade.max)
                                                                                                : "No Configurado"
                                                                                        }
                                                                                        ref={register({ valueAsNumber: true, min: 2 })}
                                                                                    />
                                                                                    {dbServer?.multa?.trade?.max != null ? (
                                                                                        <Button
                                                                                            variant="outline-danger"
                                                                                            name="deleteCooldownMensajes"
                                                                                            onClick={() => onDelete("multa.trade.max")}
                                                                                        >
                                                                                            Eliminar
                                                                                        </Button>
                                                                                    ) : null}
                                                                                </InputGroup>
                                                                            </Col>
                                                                            {/**
                                                                             * Cooldow
                                                                             */}
                                                                            <Col sm>
                                                                                <Form.Label>Cooldown</Form.Label>
                                                                                <InputGroup className="mb-2">
                                                                                    <Form.Control
                                                                                        name="cooldown.trade"
                                                                                        placeholder={
                                                                                            dbServer?.cooldown?.trade
                                                                                                ? ConverTime(dbServer.cooldown.trade)
                                                                                                : "No Configurado"
                                                                                        }
                                                                                        ref={register}
                                                                                    />
                                                                                    {dbServer?.cooldown?.trade != null ? (
                                                                                        <Button
                                                                                            variant="outline-danger"
                                                                                            name="deleteCooldownMensajes"
                                                                                            onClick={() => onDelete("cooldown.trade")}
                                                                                        >
                                                                                            Eliminar
                                                                                        </Button>
                                                                                    ) : null}
                                                                                </InputGroup>
                                                                            </Col>
                                                                        </Row>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                            {/**
                                                             * Work
                                                             */}
                                                            <Col sm={12}>
                                                                <Row className="economy">
                                                                    <Col sm={12}>
                                                                        <h5>Work</h5>
                                                                    </Col>
                                                                    {/**
                                                                     * Payout
                                                                     */}
                                                                    <Col sm>
                                                                        <Form.Label>Pago Mínimo</Form.Label>
                                                                        <InputGroup className="mb-2">
                                                                            <Form.Control
                                                                                name="pago.work.min"
                                                                                placeholder={
                                                                                    dbServer?.pago?.work?.min
                                                                                        ? ConverString(dbServer.pago.work.min)
                                                                                        : "No Configurado"
                                                                                }
                                                                                ref={register({ valueAsNumber: true, min: 1 })}
                                                                            />
                                                                            {dbServer?.pago?.work?.min != null ? (
                                                                                <Button
                                                                                    variant="outline-danger"
                                                                                    name="deleteCooldownMensajes"
                                                                                    onClick={() => onDelete("pago.work.min")}
                                                                                >
                                                                                    Eliminar
                                                                                </Button>
                                                                            ) : null}
                                                                        </InputGroup>
                                                                    </Col>
                                                                    <Col sm>
                                                                        <Form.Label>Pago Máximo</Form.Label>
                                                                        <InputGroup className="mb-2">
                                                                            <Form.Control
                                                                                name="pago.work.max"
                                                                                placeholder={
                                                                                    dbServer?.pago?.work?.max
                                                                                        ? ConverString(dbServer.pago.work.max)
                                                                                        : "No Configurado"
                                                                                }
                                                                                ref={register({ valueAsNumber: true, min: 2 })}
                                                                            />
                                                                            {dbServer?.pago?.work?.max != null ? (
                                                                                <Button
                                                                                    variant="outline-danger"
                                                                                    name="deleteCooldownMensajes"
                                                                                    onClick={() => onDelete("pago.work.max")}
                                                                                >
                                                                                    Eliminar
                                                                                </Button>
                                                                            ) : null}
                                                                        </InputGroup>
                                                                    </Col>
                                                                    {/**
                                                                     * Cooldow
                                                                     */}
                                                                    <Col sm>
                                                                        <Form.Label>Cooldown</Form.Label>
                                                                        <InputGroup className="mb-2">
                                                                            <Form.Control
                                                                                name="cooldown.work"
                                                                                placeholder={
                                                                                    dbServer?.cooldown?.work
                                                                                        ? ConverTime(dbServer.cooldown.work)
                                                                                        : "No Configurado"
                                                                                }
                                                                                ref={register}
                                                                            />
                                                                            {dbServer?.cooldown?.work != null ? (
                                                                                <Button
                                                                                    variant="outline-danger"
                                                                                    name="deleteCooldownMensajes"
                                                                                    onClick={() => onDelete("cooldown.trade")}
                                                                                >
                                                                                    Eliminar
                                                                                </Button>
                                                                            ) : null}
                                                                        </InputGroup>
                                                                    </Col>
                                                                </Row>
                                                            </Col>

                                                            {/**
                                                             * Restart y Guardar
                                                             */}
                                                            <Col sm={12} className="pt-4">
                                                                <Row>
                                                                    {/**
                                                                     * RestartEconomy
                                                                     */}
                                                                    {/* <Col sm>
                                                                        <Button variant="outline-danger" type="button" onClick={() => setShowModal(true)}>
                                                                            Resetear Economía
                                                                        </Button>
                                                                    </Col> */}
                                                                    {/**
                                                                     * Guardar
                                                                     */}
                                                                    <Col sm>
                                                                        <Button variant="outline-warning" type="submit" name="action">
                                                                            Guardar
                                                                        </Button>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        </Form.Row>
                                                    </Form>
                                                </Col>
                                            </Row>
                                        </Tab.Pane>

                                        {/* Panel de Tienda */}
                                        <Tab.Pane eventKey="shop">
                                            <Row className="align-items-center text-center">
                                                <Col sm={12}>
                                                    <h3>Tienda</h3>
                                                </Col>
                                                <Col sm={12}>
                                                    Sección en construcción
                                                    <Form className="g-3 needs-validation" onSubmit={handleSubmit(onSubmit)}>
                                                        <Form.Row className="align-items-center">
                                                            {/**
                                                             * ClearItems
                                                             */}
                                                            {/**
                                                             * CrearteItems
                                                             */}
                                                            {/* Guardar */}
                                                            {/* <Col sm className="pt-4">
                                                                <Button variant="outline-warning" type="submit" name="action">
                                                                    Guardar
                                                                </Button>
                                                            </Col> */}
                                                        </Form.Row>
                                                    </Form>
                                                </Col>
                                            </Row>
                                        </Tab.Pane>
                                    </Tab.Content>
                                </Col>
                            </Tab.Container>
                            <Modal show={showModal} onHide={() => setShowModal(false)}>
                                <Modal.Header closeButton>
                                    <Modal.Title>¿Está seguro de esta acción?</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>Borrará toda la configuración de economía</Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                                        Cancelar
                                    </Button>
                                    <Button
                                        variant="primary"
                                        onClick={async () => {
                                            setShowModal(false);
                                            await updateServerGQL({
                                                variables: {
                                                    id,
                                                    name: "pago"
                                                }
                                            });
                                            await updateServerGQL({
                                                variables: {
                                                    id,
                                                    name: "multa"
                                                }
                                            });
                                            var newData = (
                                                await updateServerGQL({
                                                    variables: {
                                                        id,
                                                        name: "cooldown"
                                                    }
                                                })
                                            ).data.deleteServerGQL;
                                            setDbServer(newData);
                                            reset();
                                            setAlert((at) => [...at, { type: "success", show: true, text: `Configuraciones eliminadas correctamente.` }]);
                                        }}
                                    >
                                        Borrar Todo
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </Row>
                    </Col>

                    <Col sm={2} className="text-center">
                        <ins
                            className="adsbygoogle"
                            style={{ display: "block" }}
                            data-ad-client="ca-pub-2365658233726619"
                            data-ad-slot="9212396026"
                            data-ad-format="auto"
                            data-full-width-responsive="true"
                        ></ins>
                        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
                    </Col>
                </Row>
            </Container>
        );
    }
}
