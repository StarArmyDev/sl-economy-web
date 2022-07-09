import { Container, Spinner, Alert, Col, Row, Tab, Nav, Button, Card, Form, InputGroup, Modal } from "react-bootstrap";
import { ChannelsGuildGQL, ServerGQL, UpdateServerGQL, useMutation, useQuery } from "../graphql";
import React, { useEffect, useState, FC } from "react";
import { ConvertString, ConvertorTime } from "libs";
import { ISistemas, IUserObjet } from "interfaces";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { BOT_MANAGER } from "Constants";
import styled from "styled-components";
import Select from "react-select";
import ms from "ms";

const Styled = styled.div`
    .nav-link.active {
        background-color: ${(props: { bgColor?: string }) => props.bgColor || "#375a7f"} !important;
    }

    .nav-link.disabled {
        color: #adb5bd !important;
    }

    .form-control: disabled {
        background-color: #7d8083 !important;
    }

    /* Chrome, Firefox, Opera, Safari 10.1+ */
    .form-control: disabled::placeholder {
        color: #fff !important;
        opacity: 0.8; /* Firefox */
    }

    /* Microsoft Edge */
    .form-control: disabled::-ms-input-placeholder {
        color: #fff !important;
    }
`;

interface IAlert {
    show: boolean;
    type?: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "dark" | "light";
    text?: string;
}

/* type FormValues = {
    language: {
        server: string;
    };
    prefix: string;
}; */

export const Dashboard: FC<{ user: IUserObjet }> = ({ user }) => {
    if (!user) {
        window.history.replaceState(null, "error403", "/error403");
        return <></>;
    }
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [guild, setGuild] = useState(null as any);
    const [alert, setAlert] = useState([] as IAlert[]);
    const [chatExclude, setChatExclude] = useState([] as { name: string; id: string }[]);
    const [showModal, setShowModal] = useState(false);
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
        setValue
    } = useForm();

    const [updateServerGQL] = useMutation(UpdateServerGQL);
    const [dbServer, setDbServer] = useState(null as ISistemas | null);

    const load = async () => {
        if (!guild) {
            var Servidor = user.guilds.find((g) => g.id === id);
            setGuild(Servidor);
        }
        setLoading(false);
    };

    const loadDB = async (db: ISistemas | null, channels: { name: string; id: string }[]) => {
        console.log(db);
        if (db?.excludedChannels)
            db.excludedChannels.map((ch) =>
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
                                            create: true,
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
                                                    create: true,
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
                                        create: true,
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
                                create: true,
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
                    create: true,
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
            <Styled bgColor={dbServer?.colorMain}>
                <Container>
                    <Row>
                        <Col sm>
                            <Row className="text-center">
                                <Col sm={12}>
                                    <Card style={{ backgroundColor: dbServer?.colorMain || "#375a7f" }}>
                                        <Row>
                                            <Col sm={12} className="p-4">
                                                <img
                                                    alt=""
                                                    onError={(e: any) => {
                                                        e.target.onerror = null;
                                                        e.target.src = "https://cdn.discordapp.com/embed/avatars/0.png";
                                                    }}
                                                    className="rounded"
                                                    style={{ width: "15%" }}
                                                    src={`https://cdn.discordapp.com/icons/${id}/${guild.icon}.png?size=128`}
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
                                                            <Row className="align-items-center">
                                                                {/**
                                                                 * Idioma
                                                                 */}
                                                                <Col sm>
                                                                    <InputGroup className="mb-2">
                                                                        <InputGroup.Text>Idioma</InputGroup.Text>
                                                                        <Form.Control
                                                                            {...register("language.server")}
                                                                            as="select"
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
                                                                <Col sm>
                                                                    <Row>
                                                                        <Col sm>
                                                                            <SelectMenu
                                                                                placeholder="Canales"
                                                                                options={[
                                                                                    { label: "uno", value: "a" },
                                                                                    { label: "uno", value: "a" }
                                                                                ]}
                                                                            />
                                                                        </Col>
                                                                        <Col sm>
                                                                            <SelectMenu
                                                                                placeholder="Canales"
                                                                                options={[
                                                                                    { label: "Español (México)", value: "es-MX" },
                                                                                    { label: "Español (España)", value: "es-ES" },
                                                                                    { label: "Inglés", value: "en-US" },
                                                                                    { label: "Portugués", value: "pt-BR" }
                                                                                ]}
                                                                            />
                                                                        </Col>
                                                                    </Row>
                                                                </Col>
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
                                                            </Row>
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
                                                            <Row className="align-items-center">
                                                                {/**
                                                                 * Currency
                                                                 */}
                                                                <Col sm={12} className="pt-4">
                                                                    <Form.Text className="text-muted">Coloca sólo emojis normales</Form.Text>
                                                                    <InputGroup className="mb-2">
                                                                        <InputGroup.Text>Moneda</InputGroup.Text>
                                                                        <Form.Control
                                                                            {...register("moneda.name")}
                                                                            placeholder={dbServer?.moneda?.name ? dbServer.moneda.name : "Por Defecto: 🔶"}
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
                                                                                    {...register("pago.mensajes.min", { valueAsNumber: true, min: 1 })}
                                                                                    placeholder={
                                                                                        dbServer?.pago?.mensajes?.min
                                                                                            ? ConvertString(dbServer.pago.mensajes.min)
                                                                                            : "No Configurado"
                                                                                    }
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
                                                                                    {...register("pago.mensajes.max", { valueAsNumber: true, min: 2 })}
                                                                                    placeholder={
                                                                                        dbServer?.pago?.mensajes?.max
                                                                                            ? ConvertString(dbServer.pago.mensajes.max)
                                                                                            : "No Configurado"
                                                                                    }
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
                                                                                    {...register("cooldown.mensajes")}
                                                                                    placeholder={
                                                                                        dbServer?.cooldown?.mensajes
                                                                                            ? ConvertorTime(dbServer.cooldown.mensajes)
                                                                                            : "Por Defecto: 1m"
                                                                                    }
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
                                                                                            {...register("pago.crime.min", { valueAsNumber: true, min: 1 })}
                                                                                            placeholder={
                                                                                                dbServer?.pago?.crime?.min
                                                                                                    ? ConvertString(dbServer.pago.crime.min)
                                                                                                    : "No Configurado"
                                                                                            }
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
                                                                                            {...register("pago.crime.max", { valueAsNumber: true, min: 2 })}
                                                                                            placeholder={
                                                                                                dbServer?.pago?.crime?.max
                                                                                                    ? ConvertString(dbServer.pago.crime.max)
                                                                                                    : "No Configurado"
                                                                                            }
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
                                                                                            {...register("multa.crime.min", { valueAsNumber: true, min: 1 })}
                                                                                            placeholder={
                                                                                                dbServer?.multa?.crime?.min
                                                                                                    ? ConvertString(dbServer.multa.crime.min)
                                                                                                    : "No Configurado"
                                                                                            }
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
                                                                                            {...register("multa.crime.max", { valueAsNumber: true, min: 2 })}
                                                                                            placeholder={
                                                                                                dbServer?.multa?.crime?.max
                                                                                                    ? ConvertString(dbServer.multa.crime.max)
                                                                                                    : "No Configurado"
                                                                                            }
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
                                                                                            {...register("cooldown.crime")}
                                                                                            placeholder={
                                                                                                dbServer?.cooldown?.crime
                                                                                                    ? ConvertorTime(dbServer.cooldown.crime)
                                                                                                    : "No Configurado"
                                                                                            }
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
                                                                                    {...register("pago.daily", { valueAsNumber: true, min: 1 })}
                                                                                    placeholder={
                                                                                        dbServer?.pago?.daily
                                                                                            ? ConvertString(dbServer.pago.daily)
                                                                                            : "No Configurado"
                                                                                    }
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
                                                                                    {...register("cooldown.daily")}
                                                                                    placeholder={
                                                                                        dbServer?.cooldown?.daily
                                                                                            ? ConvertorTime(dbServer.cooldown.daily)
                                                                                            : "No Configurado"
                                                                                    }
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
                                                                                            {...register("pago.dice.min", { valueAsNumber: true, min: 1 })}
                                                                                            placeholder={
                                                                                                dbServer?.pago?.dice?.min
                                                                                                    ? ConvertString(dbServer.pago.dice.min)
                                                                                                    : "No Configurado"
                                                                                            }
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
                                                                                            {...register("pago.dice.max", { valueAsNumber: true, min: 2 })}
                                                                                            placeholder={
                                                                                                dbServer?.pago?.dice?.max
                                                                                                    ? ConvertString(dbServer.pago.dice.max)
                                                                                                    : "No Configurado"
                                                                                            }
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
                                                                                            {...register("multa.dice.min", { valueAsNumber: true, min: 1 })}
                                                                                            placeholder={
                                                                                                dbServer?.multa?.dice?.min
                                                                                                    ? ConvertString(dbServer.multa.dice.min)
                                                                                                    : "No Configurado"
                                                                                            }
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
                                                                                            {...register("multa.dice.max", { valueAsNumber: true, min: 2 })}
                                                                                            placeholder={
                                                                                                dbServer?.multa?.dice?.max
                                                                                                    ? ConvertString(dbServer.multa.dice.max)
                                                                                                    : "No Configurado"
                                                                                            }
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
                                                                                            {...register("cooldown.dice")}
                                                                                            placeholder={
                                                                                                dbServer?.cooldown?.dice
                                                                                                    ? ConvertorTime(dbServer.cooldown.dice)
                                                                                                    : "No Configurado"
                                                                                            }
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
                                                                                    {...register("pago.flipcoin.min", { valueAsNumber: true, min: 1 })}
                                                                                    placeholder={
                                                                                        dbServer?.pago?.flipcoin?.min
                                                                                            ? ConvertString(dbServer.pago.flipcoin.min)
                                                                                            : "No Configurado"
                                                                                    }
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
                                                                                    {...register("pago.flipcoin.max", { valueAsNumber: true, min: 2 })}
                                                                                    placeholder={
                                                                                        dbServer?.pago?.flipcoin?.max
                                                                                            ? ConvertString(dbServer.pago.flipcoin.max)
                                                                                            : "No Configurado"
                                                                                    }
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
                                                                                    {...register("multa.flipcoin.min", { valueAsNumber: true, min: 1 })}
                                                                                    placeholder={
                                                                                        dbServer?.multa?.flipcoin?.min
                                                                                            ? ConvertString(dbServer.multa.flipcoin.min)
                                                                                            : "No Configurado"
                                                                                    }
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
                                                                                    {...register("multa.flipcoin.max", { valueAsNumber: true, min: 2 })}
                                                                                    placeholder={
                                                                                        dbServer?.multa?.flipcoin?.max
                                                                                            ? ConvertString(dbServer.multa.flipcoin.max)
                                                                                            : "No Configurado"
                                                                                    }
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
                                                                                    {...register("cooldown.flipcoin")}
                                                                                    placeholder={
                                                                                        dbServer?.cooldown?.flipcoin
                                                                                            ? ConvertorTime(dbServer.cooldown.flipcoin)
                                                                                            : "No Configurado"
                                                                                    }
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
                                                                                    {...register("pago.loot.min")}
                                                                                    placeholder={"No Configurado"}
                                                                                />
                                                                            </InputGroup>
                                                                        </Col>
                                                                        <Col sm>
                                                                            <Form.Label>Items Máximos Ganados</Form.Label>
                                                                            <InputGroup className="mb-2">
                                                                                <Form.Control
                                                                                    disabled
                                                                                    {...register("pago.loot.max")}
                                                                                    placeholder={"No Configurado"}
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
                                                                                    {...register("cooldown.slotmachine")}
                                                                                    placeholder={
                                                                                        dbServer?.cooldown?.slotmachine
                                                                                            ? ConvertorTime(dbServer.cooldown.slotmachine)
                                                                                            : "No Configurado"
                                                                                    }
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
                                                                                    {...register("multa.rob.min", { valueAsNumber: true, min: 1 })}
                                                                                    placeholder={
                                                                                        dbServer?.multa?.rob?.min
                                                                                            ? ConvertString(dbServer.multa.rob.min)
                                                                                            : "No Configurado"
                                                                                    }
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
                                                                                    {...register("multa.rob.max", { valueAsNumber: true, min: 2 })}
                                                                                    placeholder={
                                                                                        dbServer?.multa?.rob?.max
                                                                                            ? ConvertString(dbServer.multa.rob.max)
                                                                                            : "No Configurado"
                                                                                    }
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
                                                                                    {...register("cooldown.rob")}
                                                                                    placeholder={
                                                                                        dbServer?.cooldown?.rob
                                                                                            ? ConvertorTime(dbServer.cooldown.rob)
                                                                                            : "No Configurado"
                                                                                    }
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
                                                                                    {...register("pago.roulette.min")}
                                                                                    placeholder={"No Configurado"}
                                                                                />
                                                                            </InputGroup>
                                                                        </Col>
                                                                        <Col sm>
                                                                            <Form.Label>Apuesta Máxima</Form.Label>
                                                                            <InputGroup className="mb-2">
                                                                                <Form.Control
                                                                                    disabled
                                                                                    {...register("pago.roulette.max")}
                                                                                    placeholder={"No Configurado"}
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
                                                                                    {...register("cooldown.roulette")}
                                                                                    placeholder={
                                                                                        dbServer?.cooldown?.roulette
                                                                                            ? ConvertorTime(dbServer.cooldown.roulette)
                                                                                            : "No Configurado"
                                                                                    }
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
                                                                                            {...register("pago.slotmachine.min", {
                                                                                                valueAsNumber: true,
                                                                                                min: 1
                                                                                            })}
                                                                                            placeholder={
                                                                                                dbServer?.pago?.slotmachine?.min
                                                                                                    ? ConvertString(dbServer.pago.slotmachine.min)
                                                                                                    : "No Configurado"
                                                                                            }
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
                                                                                            {...register("pago.slotmachine.max", {
                                                                                                valueAsNumber: true,
                                                                                                min: 2
                                                                                            })}
                                                                                            placeholder={
                                                                                                dbServer?.pago?.slotmachine?.max
                                                                                                    ? ConvertString(dbServer.pago.slotmachine.max)
                                                                                                    : "No Configurado"
                                                                                            }
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
                                                                                            {...register("multa.slotmachine.min", {
                                                                                                valueAsNumber: true,
                                                                                                min: 1
                                                                                            })}
                                                                                            placeholder={
                                                                                                dbServer?.multa?.slotmachine?.min
                                                                                                    ? ConvertString(dbServer.multa.slotmachine.min)
                                                                                                    : "No Configurado"
                                                                                            }
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
                                                                                            {...register("multa.slotmachine.max", {
                                                                                                valueAsNumber: true,
                                                                                                min: 2
                                                                                            })}
                                                                                            placeholder={
                                                                                                dbServer?.multa?.slotmachine?.max
                                                                                                    ? ConvertString(dbServer.multa.slotmachine.max)
                                                                                                    : "No Configurado"
                                                                                            }
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
                                                                                            {...register("cooldown.slotmachine")}
                                                                                            placeholder={
                                                                                                dbServer?.cooldown?.slotmachine
                                                                                                    ? ConvertorTime(dbServer.cooldown.slotmachine)
                                                                                                    : "No Configurado"
                                                                                            }
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
                                                                                            {...register("pago.trade.min", { valueAsNumber: true, min: 1 })}
                                                                                            placeholder={
                                                                                                dbServer?.pago?.trade?.min
                                                                                                    ? ConvertString(dbServer.pago.trade.min)
                                                                                                    : "No Configurado"
                                                                                            }
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
                                                                                            {...register("pago.trade.max", { valueAsNumber: true, min: 2 })}
                                                                                            placeholder={
                                                                                                dbServer?.pago?.trade?.max
                                                                                                    ? ConvertString(dbServer.pago.trade.max)
                                                                                                    : "No Configurado"
                                                                                            }
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
                                                                                            {...register("multa.trade.min", { valueAsNumber: true, min: 1 })}
                                                                                            placeholder={
                                                                                                dbServer?.multa?.trade?.min
                                                                                                    ? ConvertString(dbServer.multa.trade.min)
                                                                                                    : "No Configurado"
                                                                                            }
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
                                                                                            {...register("multa.trade.max", { valueAsNumber: true, min: 2 })}
                                                                                            placeholder={
                                                                                                dbServer?.multa?.trade?.max
                                                                                                    ? ConvertString(dbServer.multa.trade.max)
                                                                                                    : "No Configurado"
                                                                                            }
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
                                                                                            {...register("cooldown.trade")}
                                                                                            placeholder={
                                                                                                dbServer?.cooldown?.trade
                                                                                                    ? ConvertorTime(dbServer.cooldown.trade)
                                                                                                    : "No Configurado"
                                                                                            }
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
                                                                                    {...register("pago.work.min", { valueAsNumber: true, min: 1 })}
                                                                                    placeholder={
                                                                                        dbServer?.pago?.work?.min
                                                                                            ? ConvertString(dbServer.pago.work.min)
                                                                                            : "No Configurado"
                                                                                    }
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
                                                                                    {...register("pago.work.max", { valueAsNumber: true, min: 2 })}
                                                                                    placeholder={
                                                                                        dbServer?.pago?.work?.max
                                                                                            ? ConvertString(dbServer.pago.work.max)
                                                                                            : "No Configurado"
                                                                                    }
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
                                                                                    {...register("cooldown.work")}
                                                                                    placeholder={
                                                                                        dbServer?.cooldown?.work
                                                                                            ? ConvertorTime(dbServer.cooldown.work)
                                                                                            : "No Configurado"
                                                                                    }
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
                                                            </Row>
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
                                                            <Row className="align-items-center">
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
                                                            </Row>
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
                                                        create: true,
                                                        name: "pago"
                                                    }
                                                });
                                                await updateServerGQL({
                                                    variables: {
                                                        id,
                                                        create: true,
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

                        <Col sm={2} className="text-center"></Col>
                    </Row>
                </Container>
            </Styled>
        );
    }
};

const SelectMenu = ({ placeholder, options }: { placeholder: string; options: any[] }) => {
    return (
        <Select
            className="select"
            styles={{
                menu: (base) => ({
                    ...base,
                    backgroundColor: "#2f3136",
                    textAlign: "left",
                    color: "#fff"
                }),
                container: (base) => ({
                    ...base
                }),
                control: (base) => ({
                    ...base,
                    backgroundColor: "#444444",
                    color: "#fff",
                    border: "none"
                }),
                option: (base, { data, isDisabled, isFocused, isSelected }) => ({
                    ...base,
                    borderBottom: "1px dotted pink",
                    padding: 10,
                    backgroundColor: isDisabled ? undefined : isSelected ? "#888" : isFocused ? "#edbf10" : undefined,
                    color: isDisabled ? "#ccc" : isSelected ? undefined : isFocused ? "#000" : undefined,
                    ":active": {
                        ...base[":active"],
                        backgroundColor: !isDisabled ? (isSelected ? "#edbf10" : "#888") : undefined,
                        color: !isDisabled ? (isSelected ? "#000" : "#fff") : undefined
                    }
                }),
                valueContainer: (base) => ({
                    ...base
                }),
                singleValue: (base) => ({
                    ...base,
                    textAlign: "left",
                    color: "#fff"
                }),
                placeholder: (base) => ({
                    ...base,
                    color: "#a3a6aa",
                    textAlign: "left",
                    whiteSpace: "nowrap",
                    lineHeight: "18px"
                })
            }}
            placeholder={placeholder}
            options={options.map((option) => ({
                value: option.value,
                label: `${option.emoji || ""} ${option.label}`
            }))}
        />
    );
};
