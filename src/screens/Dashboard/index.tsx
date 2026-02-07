import { Container, Spinner, Alert, Col, Row, Tab, Nav, Button, Card, Form, InputGroup, Modal } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
//import Select from "react-select";
import Helmet from 'react-helmet';
import ms from 'ms';

import { ChannelsGuildGQL, ServerGQL, ShopServerGQL, UpdateServerGQL, useMutation, useQuery } from '@app/graphql';
import { ConvertString, ConvertorTime } from '@app/helpers';
import type { ServerSystem, GuildInfo, Item } from '@app/models';
import { useAppSelector } from '@app/storage';

const Styled = styled.div<{ bgColor?: string }>`
    .nav-link.active {
        background-color: ${props => props.bgColor || '#375a7f'} !important;
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
    type?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light';
    text?: string;
}

/* type FormValues = {
    language: {
        server: string;
    };
    prefix: string;
}; */

export const Dashboard: React.FC = () => {
    const user = useAppSelector(state => state.web.user);
    const defaultAvatar = 'https://cdn.discordapp.com/embed/avatars/0.png';

    if (!user) {
        window.history.replaceState(null, 'error403', '/error403');
        return <></>;
    }

    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [guild, setGuild] = useState<GuildInfo | undefined>();
    const [alert, setAlert] = useState([] as IAlert[]);
    const [chatExclude, setChatExclude] = useState([] as { name: string; id: string }[]);
    const [showModal, setShowModal] = useState(false);
    const [showModalNewItem, setShowModalNewItem] = useState(false);
    const [items, setItems] = useState<Item[]>([]);
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
        setValue,
    } = useForm();
    const itemForm = useForm<Item>();

    const [updateServerGQL] = useMutation(UpdateServerGQL);
    const [dbServer, setDbServer] = useState<ServerSystem | undefined>();

    const serverGQL = useQuery(ServerGQL, { variables: { id } });
    const channelsGQL = useQuery(ChannelsGuildGQL, { variables: { id } });
    const shopGQL = useQuery(ShopServerGQL, { variables: { id } });

    useEffect(() => {
        setLoading(true);
        const Servidor = user.guilds?.find(g => g.id === id);
        let usersManager: string[] = [];
        try {
            usersManager = JSON.parse(import.meta.env.VITE_BOT_MANAGER);
        } catch (error) {
            usersManager = [];
        }

        if (!Servidor || (!((Servidor.permissions & 2146958591) === 2146958591) && !usersManager.includes(user._id)))
            return window.location.replace('/error403');
        else setGuild(Servidor);

        init();
    }, [id, serverGQL.loading, channelsGQL.loading, shopGQL.loading]);

    const init = () => {
        if (!dbServer && !!serverGQL.data?.getServer && !channelsGQL.loading && !shopGQL.loading) {
            setDbServer(serverGQL.data.getServer);
            loadDB(serverGQL.data.getServer, channelsGQL.data.getChannelsGuild);
            setLoading(false);
        } else {
            setLoading(true);
            reset();
            setDbServer(undefined);
            serverGQL
                .refetch({ id })
                .then(({ data }) => {
                    if (data) {
                        setDbServer(data.getServer);
                        channelsGQL.refetch({ id }).then(chData => {
                            setChatExclude([]);
                            if (chData.data) loadDB(data.getServer, chData.data.getChannelsGuild);
                            setLoading(false);
                        });
                        shopGQL.refetch({ id }).then(shData => {
                            if (shData.data) setItems(shData.data.getShop.items);
                            console.log(shData?.data?.getShop);
                        });
                    } else setLoading(false);
                })
                .catch(() => setLoading(false));
        }
    };

    const loadDB = async (db: ServerSystem | null, channels: { name: string; id: string }[]) => {
        if (db?.excludedChannels)
            db.excludedChannels.map(ch =>
                setChatExclude(ec => [
                    ...ec,
                    {
                        name: channels.findIndex(c => c.id === ch) > -1 ? channels.find(c => c.id === ch)!.name : 'Canal Desconocido',
                        id: ch,
                    },
                ]),
            );
    };

    const removeAlert = (alert: IAlert) => setAlert(alerts => alerts.filter(x => x !== alert));

    const onSubmit = async (data: any, e: React.BaseSyntheticEvent<object> | undefined) => {
        const values: string[] = [];

        for (const key in data) {
            if (typeof data[key] != 'string')
                for (const key2 in data[key]) {
                    if (typeof data[key][key2] != 'string') {
                        if (
                            typeof data[key][key2] == 'number' &&
                            (!(dbServer as any)[key] || data[key][key2] !== (dbServer as any)[key][key2])
                        ) {
                            values.push(`${key}.${key2}`);
                            updateData(
                                (
                                    await updateServerGQL({
                                        variables: {
                                            id,
                                            create: true,
                                            name: `${key}.${key2}`,
                                            valueNumber: data[key][key2],
                                        },
                                    })
                                ).data?.updateServer,
                            );
                        } else
                            for (const key3 in data[key][key2]) {
                                if (
                                    data[key][key2][key3] &&
                                    (!isNaN(data[key][key2][key3]) || data[key][key2][key3].length > 0) &&
                                    (!dbServer?.[key as keyof typeof dbServer] ||
                                        !(dbServer as any)[key][key2] ||
                                        data[key][key2][key3] !== (dbServer as any)[key][key2][key3])
                                ) {
                                    if ((key3 === 'min' && data[key][key2]['max']) || (key3 === 'max' && data[key][key2]['min'])) {
                                        const minimo = data[key][key2]['min'];
                                        let maximo = data[key][key2]['max'];
                                        data[key][key2]['min'] = minimo > maximo ? maximo : minimo;
                                        data[key][key2]['max'] = maximo < minimo ? minimo : maximo === minimo ? ++maximo : maximo;
                                    }
                                    values.push(`${key}.${key2}.${key3}`);
                                    updateData(
                                        (
                                            await updateServerGQL({
                                                variables: {
                                                    id,
                                                    create: true,
                                                    name: `${key}.${key2}.${key3}`,
                                                    [typeof data[key][key2][key3] == 'number' ? 'valueNumber' : 'value']:
                                                        data[key][key2][key3],
                                                },
                                            })
                                        ).data.updateServer,
                                    );
                                }
                            }
                    } else if (
                        data[key][key2] &&
                        data[key][key2].length > 0 &&
                        (!(dbServer as any)[key] || data[key][key2] !== (dbServer as any)[key][key2])
                    ) {
                        let timerMs;
                        try {
                            timerMs = ms(data[key][key2]);
                        } catch (error) {
                            console.error(error);
                        }
                        values.push(`${key}.${key2}`);
                        updateData(
                            (
                                await updateServerGQL({
                                    variables: {
                                        id,
                                        create: true,
                                        name: `${key}.${key2}`,
                                        [timerMs ? 'valueNumber' : 'value']: timerMs ? timerMs : data[key][key2],
                                    },
                                })
                            ).data.updateServer,
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
                                value: data[key],
                            },
                        })
                    ).data.updateServer,
                );
            }
        }

        function updateData(newData: ServerSystem | null) {
            if (newData) {
                if (e) e.target.reset();
                setAlert(at => [...at, { type: 'success', show: true, text: 'Cambios Guardados Correctamente' }]);
                setDbServer(newData);
                if (newData.language?.server) setValue('language', newData.language.server);
                reset(values);
            }
        }
    };

    const onNewItem = async () => {};

    const onDelete = async (name: string) => {
        const newData = (
            await updateServerGQL({
                variables: {
                    id,
                    create: true,
                    name,
                },
            })
        ).data.deleteServerGQL;
        setDbServer(newData);
        reset([name]);
        if (name === 'language.server') setValue('language.server', 'es-MX');
        setAlert(at => [...at, { type: 'success', show: true, text: `Propiedad eliminada correctamente.` }]);
    };

    /* const SelectMenu = ({
        placeholder,
        options,
        defaultValue,
        registerName
    }: {
        placeholder: string;
        options: {
            value: string;
            label: string;
            emoji?: string;
        }[];
        defaultValue?: any;
        registerName?: string;
    }) => {
        const ctlRegister = registerName ? register(registerName) : undefined;

        return (
            <Select
                ref={ctlRegister?.ref}
                name={ctlRegister?.name || ""}
                onBlur={(event) => (ctlRegister ? ctlRegister.onBlur({ target: event }) : undefined)}
                onChange={(newValue) =>
                    ctlRegister
                        ? ctlRegister.onChange({
                              target: newValue
                          })
                        : undefined
                }
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
                    option: (base, { isDisabled, isFocused, isSelected }) => ({
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
                defaultValue={defaultValue}
            />
        );
    }; */

    if (loading || serverGQL.loading || channelsGQL.loading)
        return (
            <Container
                style={{
                    height: '67vh',
                    width: '100vw',
                    position: 'relative',
                    zIndex: 9999,
                    alignItems: 'center',
                    justifyContent: 'center',
                    display: 'flex',
                }}>
                <Helmet>
                    <title>SL-Economy | Dashboard</title>
                </Helmet>
                <Spinner animation="border" variant="warning" role="status" />
            </Container>
        );
    else {
        return (
            <Styled bgColor={dbServer?.colorMain || '#edbf10'}>
                <Container>
                    <Helmet>
                        <title>Dashboard | {guild?.name || ''}</title>
                    </Helmet>
                    <Row>
                        <Col sm>
                            <Row className="text-center">
                                {/* Foto, Creador y Nombre del servidor */}
                                <Col sm={12}>
                                    <Card style={{ backgroundColor: dbServer?.colorMain || '#375a7f' }}>
                                        <Row>
                                            <Col sm={12} className="p-4">
                                                <img
                                                    alt=""
                                                    onError={(e: any) => {
                                                        e.target.onerror = null;
                                                        e.target.src = defaultAvatar;
                                                    }}
                                                    className="rounded"
                                                    style={{ width: '15%' }}
                                                    src={
                                                        id && guild?.icon
                                                            ? `https://cdn.discordapp.com/icons/${id}/${guild.icon}.png?size=128`
                                                            : defaultAvatar
                                                    }
                                                />
                                            </Col>
                                            {guild?.owner ? (
                                                <Col sm={12}>
                                                    <h3>👑</h3>
                                                </Col>
                                            ) : null}
                                            <Col sm={12}>
                                                <h4>{guild?.name}</h4>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>

                                {/* Contenido */}
                                <Tab.Container defaultActiveKey="shop">
                                    {/* Menú Lateral */}
                                    <Col sm={2} className="text-center">
                                        <Nav variant="pills" className="flex-column">
                                            <Nav.Link eventKey="bot">Inicio</Nav.Link>
                                            <Nav.Link eventKey="economy">Economía</Nav.Link>
                                            <Nav.Link eventKey="shop">Tienda</Nav.Link>
                                        </Nav>
                                    </Col>
                                    {/* Contenido de los menús */}
                                    <Col className="text-center pt-4">
                                        <Tab.Content>
                                            {/* Alertas */}
                                            <Col sm={12}>
                                                {alert.map((variant, idx) => {
                                                    setTimeout(() => removeAlert(variant), 2000);
                                                    return (
                                                        <Alert
                                                            style={{ position: 'fixed', width: '52%', top: '5%', zIndex: 4 }}
                                                            key={idx}
                                                            show={variant.show}
                                                            variant={variant.type || 'success'}
                                                            dismissible
                                                            onClose={() => removeAlert(variant)}>
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
                                                                    {/* <SelectMenu
                                                                        placeholder="Idioma"
                                                                        options={[
                                                                            { label: "Español (México)", value: "es-MX" },
                                                                            { label: "Español (España)", value: "es-ES" },
                                                                            { label: "Inglés", value: "en-US" },
                                                                            { label: "Portugués", value: "pt-BR" }
                                                                        ]}
                                                                        defaultValue={dbServer?.language?.server ? dbServer.language.server : "es-MX"}
                                                                        registerName={"language.server"}
                                                                    /> */}
                                                                    <InputGroup className="mb-2">
                                                                        <InputGroup.Text>Idioma</InputGroup.Text>
                                                                        <Form.Control
                                                                            {...register('language.server')}
                                                                            as="select"
                                                                            defaultValue={
                                                                                dbServer?.language?.server
                                                                                    ? dbServer.language.server
                                                                                    : 'es-MX'
                                                                            }>
                                                                            <option key="Lg2">es-MX</option>
                                                                            <option key="Lg3">es-ES</option>
                                                                            <option key="Lg1">en-US</option>
                                                                            <option key="Lg4">pt-BR</option>
                                                                        </Form.Control>
                                                                        {dbServer?.language?.server != null ? (
                                                                            <Button
                                                                                variant="outline-danger"
                                                                                name="deleteLang"
                                                                                onClick={() => onDelete('language.server')}>
                                                                                Eliminar
                                                                            </Button>
                                                                        ) : null}
                                                                    </InputGroup>
                                                                    {errors.language?.message && (
                                                                        <span className="text-danger text-small d-block mb-2">
                                                                            {errors.language.message.toString()}
                                                                        </span>
                                                                    )}
                                                                </Col>
                                                                {/**
                                                                 * Idioma en Canales
                                                                 */}
                                                                {/* <Col sm>
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
                                                                </Col> */}
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
                                                        <Form
                                                            className="g-3 needs-validation"
                                                            onSubmit={handleSubmit(onSubmit)}
                                                            name="economyForm">
                                                            <Row className="align-items-center">
                                                                {/**
                                                                 * Currency
                                                                 */}
                                                                <Col sm={12} className="pt-4">
                                                                    <Form.Text className="text-muted">
                                                                        Coloca sólo emojis normales
                                                                    </Form.Text>
                                                                    <InputGroup className="mb-2">
                                                                        <InputGroup.Text>Moneda</InputGroup.Text>
                                                                        <Form.Control
                                                                            {...register('currency.name')}
                                                                            placeholder={
                                                                                dbServer?.currency?.name
                                                                                    ? dbServer.currency.name
                                                                                    : 'Por Defecto: 🔶'
                                                                            }
                                                                        />
                                                                        {dbServer?.currency?.name != null ? (
                                                                            <Button
                                                                                variant="outline-danger"
                                                                                name="deleteCooldownMensajes"
                                                                                onClick={() => onDelete('currency.name')}>
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
                                                                                    {...register('payment.messages.min', {
                                                                                        valueAsNumber: true,
                                                                                        min: 1,
                                                                                    })}
                                                                                    placeholder={
                                                                                        dbServer?.payment?.messages?.min
                                                                                            ? ConvertString(dbServer.payment.messages.min)
                                                                                            : 'No Configurado'
                                                                                    }
                                                                                />
                                                                                {dbServer?.payment?.messages?.min != null ? (
                                                                                    <Button
                                                                                        variant="outline-danger"
                                                                                        name="deleteCooldownMensajes"
                                                                                        onClick={() => onDelete('payment.messages.min')}>
                                                                                        Eliminar
                                                                                    </Button>
                                                                                ) : null}
                                                                            </InputGroup>
                                                                        </Col>
                                                                        <Col sm>
                                                                            <Form.Label>Pago Máximo</Form.Label>
                                                                            <InputGroup className="mb-2">
                                                                                <Form.Control
                                                                                    {...register('payment.messages.max', {
                                                                                        valueAsNumber: true,
                                                                                        min: 2,
                                                                                    })}
                                                                                    placeholder={
                                                                                        dbServer?.payment?.messages?.max
                                                                                            ? ConvertString(dbServer.payment.messages.max)
                                                                                            : 'No Configurado'
                                                                                    }
                                                                                />
                                                                                {dbServer?.payment?.messages?.max != null ? (
                                                                                    <Button
                                                                                        variant="outline-danger"
                                                                                        name="deleteCooldownMensajes"
                                                                                        onClick={() => onDelete('payment.mensajes.max')}>
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
                                                                                    {...register('cooldown.messages')}
                                                                                    placeholder={
                                                                                        dbServer?.cooldown?.messages
                                                                                            ? ConvertorTime(dbServer.cooldown.messages)
                                                                                            : 'Por Defecto: 1m'
                                                                                    }
                                                                                />
                                                                                {dbServer?.cooldown?.messages != null ? (
                                                                                    <Button
                                                                                        variant="outline-danger"
                                                                                        name="deleteCooldownMensajes"
                                                                                        onClick={() => onDelete('cooldown.mensajes')}>
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
                                                                            {chatExclude.map(ce => (
                                                                                <li className="channelCard" key={ce.id}>
                                                                                    <span>
                                                                                        <svg
                                                                                            style={{
                                                                                                opacity: '0.3',
                                                                                                marginTop: '-1px',
                                                                                                marginInlineEnd: '7px',
                                                                                                width: '18px',
                                                                                            }}
                                                                                            width="24"
                                                                                            height="24"
                                                                                            viewBox="0 0 24 24">
                                                                                            <path
                                                                                                fill="currentColor"
                                                                                                fillRule="evenodd"
                                                                                                clipRule="evenodd"
                                                                                                d="M5.88657 21C5.57547 21 5.3399 20.7189 5.39427 20.4126L6.00001 17H2.59511C2.28449 17 2.04905 16.7198 2.10259 16.4138L2.27759 15.4138C2.31946 15.1746 2.52722 15 2.77011 15H6.35001L7.41001 9H4.00511C3.69449 9 3.45905 8.71977 3.51259 8.41381L3.68759 7.41381C3.72946 7.17456 3.93722 7 4.18011 7H7.76001L8.39677 3.41262C8.43914 3.17391 8.64664 3 8.88907 3H9.87344C10.1845 3 10.4201 3.28107 10.3657 3.58738L9.76001 7H15.76L16.3968 3.41262C16.4391 3.17391 16.6466 3 16.8891 3H17.8734C18.1845 3 18.4201 3.28107 18.3657 3.58738L17.76 7H21.1649C21.4755 7 21.711 7.28023 21.6574 7.58619L21.4824 8.58619C21.4406 8.82544 21.2328 9 20.9899 9H17.41L16.35 15H19.7549C20.0655 15 20.301 15.2802 20.2474 15.5862L20.0724 16.5862C20.0306 16.8254 19.8228 17 19.5799 17H16L15.3632 20.5874C15.3209 20.8261 15.1134 21 14.8709 21H13.8866C13.5755 21 13.3399 20.7189 13.3943 20.4126L14 17H8.00001L7.36325 20.5874C7.32088 20.8261 7.11337 21 6.87094 21H5.88657ZM9.41045 9L8.35045 15H14.3504L15.4104 9H9.41045Z"></path>
                                                                                        </svg>{' '}
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
                                                                                            {...register('payment.crime.min', {
                                                                                                valueAsNumber: true,
                                                                                                min: 1,
                                                                                            })}
                                                                                            placeholder={
                                                                                                dbServer?.payment?.crime?.min
                                                                                                    ? ConvertString(
                                                                                                          dbServer.payment.crime.min,
                                                                                                      )
                                                                                                    : 'No Configurado'
                                                                                            }
                                                                                        />
                                                                                        {dbServer?.payment?.crime?.min != null ? (
                                                                                            <Button
                                                                                                variant="outline-danger"
                                                                                                name="deleteCooldownMensajes"
                                                                                                onClick={() =>
                                                                                                    onDelete('payment.crime.min')
                                                                                                }>
                                                                                                Eliminar
                                                                                            </Button>
                                                                                        ) : null}
                                                                                    </InputGroup>
                                                                                </Col>
                                                                                <Col sm>
                                                                                    <Form.Label>Pago Máximo</Form.Label>
                                                                                    <InputGroup className="mb-2">
                                                                                        <Form.Control
                                                                                            {...register('payment.crime.max', {
                                                                                                valueAsNumber: true,
                                                                                                min: 2,
                                                                                            })}
                                                                                            placeholder={
                                                                                                dbServer?.payment?.crime?.max
                                                                                                    ? ConvertString(
                                                                                                          dbServer.payment.crime.max,
                                                                                                      )
                                                                                                    : 'No Configurado'
                                                                                            }
                                                                                        />
                                                                                        {dbServer?.payment?.crime?.max != null ? (
                                                                                            <Button
                                                                                                variant="outline-danger"
                                                                                                name="deleteCooldownMensajes"
                                                                                                onClick={() =>
                                                                                                    onDelete('payment.crime.max')
                                                                                                }>
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
                                                                                            {...register('fineAmount.crime.min', {
                                                                                                valueAsNumber: true,
                                                                                                min: 1,
                                                                                            })}
                                                                                            placeholder={
                                                                                                dbServer?.fineAmount?.crime?.min
                                                                                                    ? ConvertString(
                                                                                                          dbServer.fineAmount.crime.min,
                                                                                                      )
                                                                                                    : 'No Configurado'
                                                                                            }
                                                                                        />
                                                                                        {dbServer?.fineAmount?.crime?.min != null ? (
                                                                                            <Button
                                                                                                variant="outline-danger"
                                                                                                name="deleteCooldownMensajes"
                                                                                                onClick={() =>
                                                                                                    onDelete('fineAmount.crime.min')
                                                                                                }>
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
                                                                                            {...register('fineAmount.crime.max', {
                                                                                                valueAsNumber: true,
                                                                                                min: 2,
                                                                                            })}
                                                                                            placeholder={
                                                                                                dbServer?.fineAmount?.crime?.max
                                                                                                    ? ConvertString(
                                                                                                          dbServer.fineAmount.crime.max,
                                                                                                      )
                                                                                                    : 'No Configurado'
                                                                                            }
                                                                                        />
                                                                                        {dbServer?.fineAmount?.crime?.max != null ? (
                                                                                            <Button
                                                                                                variant="outline-danger"
                                                                                                name="deleteCooldownMensajes"
                                                                                                onClick={() =>
                                                                                                    onDelete('fineAmount.crime.max')
                                                                                                }>
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
                                                                                            {...register('cooldown.crime')}
                                                                                            placeholder={
                                                                                                dbServer?.cooldown?.crime
                                                                                                    ? ConvertorTime(dbServer.cooldown.crime)
                                                                                                    : 'No Configurado'
                                                                                            }
                                                                                        />
                                                                                        {dbServer?.cooldown?.crime != null ? (
                                                                                            <Button
                                                                                                variant="outline-danger"
                                                                                                name="deleteCooldownMensajes"
                                                                                                onClick={() => onDelete('cooldown.crime')}>
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
                                                                                    {...register('payment.daily', {
                                                                                        valueAsNumber: true,
                                                                                        min: 1,
                                                                                    })}
                                                                                    placeholder={
                                                                                        dbServer?.payment?.daily
                                                                                            ? ConvertString(dbServer.payment.daily)
                                                                                            : 'No Configurado'
                                                                                    }
                                                                                />
                                                                                {dbServer?.payment?.daily != null ? (
                                                                                    <Button
                                                                                        variant="outline-danger"
                                                                                        name="deleteCooldownMensajes"
                                                                                        onClick={() => onDelete('payment.daily')}>
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
                                                                                    {...register('cooldown.daily')}
                                                                                    placeholder={
                                                                                        dbServer?.cooldown?.daily
                                                                                            ? ConvertorTime(dbServer.cooldown.daily)
                                                                                            : 'No Configurado'
                                                                                    }
                                                                                />
                                                                                {dbServer?.cooldown?.daily != null ? (
                                                                                    <Button
                                                                                        variant="outline-danger"
                                                                                        name="deleteCooldownMensajes"
                                                                                        onClick={() => onDelete('cooldown.daily')}>
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
                                                                                            {...register('payment.dice.min', {
                                                                                                valueAsNumber: true,
                                                                                                min: 1,
                                                                                            })}
                                                                                            placeholder={
                                                                                                dbServer?.payment?.dice?.min
                                                                                                    ? ConvertString(
                                                                                                          dbServer.payment.dice.min,
                                                                                                      )
                                                                                                    : 'No Configurado'
                                                                                            }
                                                                                        />
                                                                                        {dbServer?.payment?.dice?.min != null ? (
                                                                                            <Button
                                                                                                variant="outline-danger"
                                                                                                name="deleteCooldownMensajes"
                                                                                                onClick={() =>
                                                                                                    onDelete('payment.dice.min')
                                                                                                }>
                                                                                                Eliminar
                                                                                            </Button>
                                                                                        ) : null}
                                                                                    </InputGroup>
                                                                                </Col>
                                                                                <Col sm>
                                                                                    <Form.Label>Pago Máximo</Form.Label>
                                                                                    <InputGroup className="mb-2">
                                                                                        <Form.Control
                                                                                            {...register('payment.dice.max', {
                                                                                                valueAsNumber: true,
                                                                                                min: 2,
                                                                                            })}
                                                                                            placeholder={
                                                                                                dbServer?.payment?.dice?.max
                                                                                                    ? ConvertString(
                                                                                                          dbServer.payment.dice.max,
                                                                                                      )
                                                                                                    : 'No Configurado'
                                                                                            }
                                                                                        />
                                                                                        {dbServer?.payment?.dice?.max != null ? (
                                                                                            <Button
                                                                                                variant="outline-danger"
                                                                                                name="deleteCooldownMensajes"
                                                                                                onClick={() =>
                                                                                                    onDelete('payment.dice.max')
                                                                                                }>
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
                                                                                            {...register('fineAmount.dice.min', {
                                                                                                valueAsNumber: true,
                                                                                                min: 1,
                                                                                            })}
                                                                                            placeholder={
                                                                                                dbServer?.fineAmount?.dice?.min
                                                                                                    ? ConvertString(
                                                                                                          dbServer.fineAmount.dice.min,
                                                                                                      )
                                                                                                    : 'No Configurado'
                                                                                            }
                                                                                        />
                                                                                        {dbServer?.fineAmount?.dice?.min != null ? (
                                                                                            <Button
                                                                                                variant="outline-danger"
                                                                                                name="deleteCooldownMensajes"
                                                                                                onClick={() =>
                                                                                                    onDelete('fineAmount.dice.min')
                                                                                                }>
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
                                                                                            {...register('fineAmount.dice.max', {
                                                                                                valueAsNumber: true,
                                                                                                min: 2,
                                                                                            })}
                                                                                            placeholder={
                                                                                                dbServer?.fineAmount?.dice?.max
                                                                                                    ? ConvertString(
                                                                                                          dbServer.fineAmount.dice.max,
                                                                                                      )
                                                                                                    : 'No Configurado'
                                                                                            }
                                                                                        />
                                                                                        {dbServer?.fineAmount?.dice?.max != null ? (
                                                                                            <Button
                                                                                                variant="outline-danger"
                                                                                                name="deleteCooldownMensajes"
                                                                                                onClick={() =>
                                                                                                    onDelete('fineAmount.dice.max')
                                                                                                }>
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
                                                                                            {...register('cooldown.dice')}
                                                                                            placeholder={
                                                                                                dbServer?.cooldown?.dice
                                                                                                    ? ConvertorTime(dbServer.cooldown.dice)
                                                                                                    : 'No Configurado'
                                                                                            }
                                                                                        />
                                                                                        {dbServer?.cooldown?.dice != null ? (
                                                                                            <Button
                                                                                                variant="outline-danger"
                                                                                                name="deleteCooldownMensajes"
                                                                                                onClick={() => onDelete('cooldown.dice')}>
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
                                                                                    {...register('payment.flipcoin.min', {
                                                                                        valueAsNumber: true,
                                                                                        min: 1,
                                                                                    })}
                                                                                    placeholder={
                                                                                        dbServer?.payment?.flipcoin?.min
                                                                                            ? ConvertString(dbServer.payment.flipcoin.min)
                                                                                            : 'No Configurado'
                                                                                    }
                                                                                />
                                                                                {dbServer?.payment?.flipcoin?.min != null ? (
                                                                                    <Button
                                                                                        variant="outline-danger"
                                                                                        name="deleteCooldownMensajes"
                                                                                        onClick={() => onDelete('payment.flipcoin.min')}>
                                                                                        Eliminar
                                                                                    </Button>
                                                                                ) : null}
                                                                            </InputGroup>
                                                                        </Col>
                                                                        <Col sm>
                                                                            <Form.Label>Pago Máximo</Form.Label>
                                                                            <InputGroup className="mb-2">
                                                                                <Form.Control
                                                                                    {...register('payment.flipcoin.max', {
                                                                                        valueAsNumber: true,
                                                                                        min: 2,
                                                                                    })}
                                                                                    placeholder={
                                                                                        dbServer?.payment?.flipcoin?.max
                                                                                            ? ConvertString(dbServer.payment.flipcoin.max)
                                                                                            : 'No Configurado'
                                                                                    }
                                                                                />
                                                                                {dbServer?.payment?.flipcoin?.max != null ? (
                                                                                    <Button
                                                                                        variant="outline-danger"
                                                                                        name="deleteCooldownMensajes"
                                                                                        onClick={() => onDelete('payment.flipcoin.max')}>
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
                                                                                    {...register('fineAmount.flipcoin.min', {
                                                                                        valueAsNumber: true,
                                                                                        min: 1,
                                                                                    })}
                                                                                    placeholder={
                                                                                        dbServer?.fineAmount?.flipcoin?.min
                                                                                            ? ConvertString(
                                                                                                  dbServer.fineAmount.flipcoin.min,
                                                                                              )
                                                                                            : 'No Configurado'
                                                                                    }
                                                                                />
                                                                                {dbServer?.fineAmount?.flipcoin?.min != null ? (
                                                                                    <Button
                                                                                        variant="outline-danger"
                                                                                        name="deleteCooldownMensajes"
                                                                                        onClick={() => onDelete('fineAmount.flipcoin.min')}>
                                                                                        Eliminar
                                                                                    </Button>
                                                                                ) : null}
                                                                            </InputGroup>
                                                                        </Col>
                                                                        <Col sm>
                                                                            <Form.Label>Multa Máxima</Form.Label>
                                                                            <InputGroup className="mb-2">
                                                                                <Form.Control
                                                                                    {...register('fineAmount.flipcoin.max', {
                                                                                        valueAsNumber: true,
                                                                                        min: 2,
                                                                                    })}
                                                                                    placeholder={
                                                                                        dbServer?.fineAmount?.flipcoin?.max
                                                                                            ? ConvertString(
                                                                                                  dbServer.fineAmount.flipcoin.max,
                                                                                              )
                                                                                            : 'No Configurado'
                                                                                    }
                                                                                />
                                                                                {dbServer?.fineAmount?.flipcoin?.max != null ? (
                                                                                    <Button
                                                                                        variant="outline-danger"
                                                                                        name="deleteCooldownMensajes"
                                                                                        onClick={() => onDelete('fineAmount.flipcoin.max')}>
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
                                                                                    {...register('cooldown.flipcoin')}
                                                                                    placeholder={
                                                                                        dbServer?.cooldown?.flipcoin
                                                                                            ? ConvertorTime(dbServer.cooldown.flipcoin)
                                                                                            : 'No Configurado'
                                                                                    }
                                                                                />
                                                                                {dbServer?.cooldown?.flipcoin != null ? (
                                                                                    <Button
                                                                                        variant="outline-danger"
                                                                                        name="deleteCooldownMensajes"
                                                                                        onClick={() => onDelete('cooldown.flipcoin')}>
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
                                                                                    {...register('payment.loot.min')}
                                                                                    placeholder={'No Configurado'}
                                                                                />
                                                                            </InputGroup>
                                                                        </Col>
                                                                        <Col sm>
                                                                            <Form.Label>Items Máximos Ganados</Form.Label>
                                                                            <InputGroup className="mb-2">
                                                                                <Form.Control
                                                                                    disabled
                                                                                    {...register('payment.loot.max')}
                                                                                    placeholder={'No Configurado'}
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
                                                                                    {...register('cooldown.slotmachine')}
                                                                                    placeholder={
                                                                                        dbServer?.cooldown?.slotmachine
                                                                                            ? ConvertorTime(dbServer.cooldown.slotmachine)
                                                                                            : 'No Configurado'
                                                                                    }
                                                                                />
                                                                                {dbServer?.cooldown?.slotmachine != null ? (
                                                                                    <Button
                                                                                        variant="outline-danger"
                                                                                        name="deleteCooldownMensajes"
                                                                                        onClick={() => onDelete('cooldown.slotmachine')}>
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
                                                                                    {...register('fineAmount.rob.min', {
                                                                                        valueAsNumber: true,
                                                                                        min: 1,
                                                                                    })}
                                                                                    placeholder={
                                                                                        dbServer?.fineAmount?.rob?.min
                                                                                            ? ConvertString(dbServer.fineAmount.rob.min)
                                                                                            : 'No Configurado'
                                                                                    }
                                                                                />
                                                                                {dbServer?.fineAmount?.rob?.min != null ? (
                                                                                    <Button
                                                                                        variant="outline-danger"
                                                                                        name="deleteCooldownMensajes"
                                                                                        onClick={() => onDelete('fineAmount.rob.min')}>
                                                                                        Eliminar
                                                                                    </Button>
                                                                                ) : null}
                                                                            </InputGroup>
                                                                        </Col>
                                                                        <Col sm>
                                                                            <Form.Label>Multa Máxima</Form.Label>
                                                                            <InputGroup className="mb-2">
                                                                                <Form.Control
                                                                                    {...register('fineAmount.rob.max', {
                                                                                        valueAsNumber: true,
                                                                                        min: 2,
                                                                                    })}
                                                                                    placeholder={
                                                                                        dbServer?.fineAmount?.rob?.max
                                                                                            ? ConvertString(dbServer.fineAmount.rob.max)
                                                                                            : 'No Configurado'
                                                                                    }
                                                                                />
                                                                                {dbServer?.fineAmount?.rob?.max != null ? (
                                                                                    <Button
                                                                                        variant="outline-danger"
                                                                                        name="deleteCooldownMensajes"
                                                                                        onClick={() => onDelete('fineAmount.rob.max')}>
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
                                                                                    {...register('cooldown.rob')}
                                                                                    placeholder={
                                                                                        dbServer?.cooldown?.rob
                                                                                            ? ConvertorTime(dbServer.cooldown.rob)
                                                                                            : 'No Configurado'
                                                                                    }
                                                                                />
                                                                                {dbServer?.cooldown?.rob != null ? (
                                                                                    <Button
                                                                                        variant="outline-danger"
                                                                                        name="deleteCooldownMensajes"
                                                                                        onClick={() => onDelete('cooldown.rob')}>
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
                                                                                    {...register('payment.roulette.min')}
                                                                                    placeholder={'No Configurado'}
                                                                                />
                                                                            </InputGroup>
                                                                        </Col>
                                                                        <Col sm>
                                                                            <Form.Label>Apuesta Máxima</Form.Label>
                                                                            <InputGroup className="mb-2">
                                                                                <Form.Control
                                                                                    disabled
                                                                                    {...register('payment.roulette.max')}
                                                                                    placeholder={'No Configurado'}
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
                                                                                    {...register('cooldown.roulette')}
                                                                                    placeholder={
                                                                                        dbServer?.cooldown?.roulette
                                                                                            ? ConvertorTime(dbServer.cooldown.roulette)
                                                                                            : 'No Configurado'
                                                                                    }
                                                                                />
                                                                                {dbServer?.cooldown?.roulette != null ? (
                                                                                    <Button
                                                                                        variant="outline-danger"
                                                                                        name="deleteCooldownMensajes"
                                                                                        onClick={() => onDelete('cooldown.roulette')}>
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
                                                                                            {...register('payment.slotmachine.min', {
                                                                                                valueAsNumber: true,
                                                                                                min: 1,
                                                                                            })}
                                                                                            placeholder={
                                                                                                dbServer?.payment?.slotmachine?.min
                                                                                                    ? ConvertString(
                                                                                                          dbServer.payment.slotmachine.min,
                                                                                                      )
                                                                                                    : 'No Configurado'
                                                                                            }
                                                                                        />
                                                                                        {dbServer?.payment?.slotmachine?.min != null ? (
                                                                                            <Button
                                                                                                variant="outline-danger"
                                                                                                name="deleteCooldownMensajes"
                                                                                                onClick={() =>
                                                                                                    onDelete('payment.slotmachine.min')
                                                                                                }>
                                                                                                Eliminar
                                                                                            </Button>
                                                                                        ) : null}
                                                                                    </InputGroup>
                                                                                </Col>
                                                                                <Col sm>
                                                                                    <Form.Label>Pago Máximo</Form.Label>
                                                                                    <InputGroup className="mb-2">
                                                                                        <Form.Control
                                                                                            {...register('payment.slotmachine.max', {
                                                                                                valueAsNumber: true,
                                                                                                min: 2,
                                                                                            })}
                                                                                            placeholder={
                                                                                                dbServer?.payment?.slotmachine?.max
                                                                                                    ? ConvertString(
                                                                                                          dbServer.payment.slotmachine.max,
                                                                                                      )
                                                                                                    : 'No Configurado'
                                                                                            }
                                                                                        />
                                                                                        {dbServer?.payment?.slotmachine?.max != null ? (
                                                                                            <Button
                                                                                                variant="outline-danger"
                                                                                                name="deleteCooldownMensajes"
                                                                                                onClick={() =>
                                                                                                    onDelete('payment.slotmachine.max')
                                                                                                }>
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
                                                                                            {...register('fineAmount.slotmachine.min', {
                                                                                                valueAsNumber: true,
                                                                                                min: 1,
                                                                                            })}
                                                                                            placeholder={
                                                                                                dbServer?.fineAmount?.slotmachine?.min
                                                                                                    ? ConvertString(
                                                                                                          dbServer.fineAmount.slotmachine
                                                                                                              .min,
                                                                                                      )
                                                                                                    : 'No Configurado'
                                                                                            }
                                                                                        />
                                                                                        {dbServer?.fineAmount?.slotmachine?.min != null ? (
                                                                                            <Button
                                                                                                variant="outline-danger"
                                                                                                name="deleteCooldownMensajes"
                                                                                                onClick={() =>
                                                                                                    onDelete('fineAmount.slotmachine.min')
                                                                                                }>
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
                                                                                            {...register('fineAmount.slotmachine.max', {
                                                                                                valueAsNumber: true,
                                                                                                min: 2,
                                                                                            })}
                                                                                            placeholder={
                                                                                                dbServer?.fineAmount?.slotmachine?.max
                                                                                                    ? ConvertString(
                                                                                                          dbServer.fineAmount.slotmachine
                                                                                                              .max,
                                                                                                      )
                                                                                                    : 'No Configurado'
                                                                                            }
                                                                                        />
                                                                                        {dbServer?.fineAmount?.slotmachine?.max != null ? (
                                                                                            <Button
                                                                                                variant="outline-danger"
                                                                                                name="deleteCooldownMensajes"
                                                                                                onClick={() =>
                                                                                                    onDelete('fineAmount.slotmachine.max')
                                                                                                }>
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
                                                                                            {...register('cooldown.slotmachine')}
                                                                                            placeholder={
                                                                                                dbServer?.cooldown?.slotmachine
                                                                                                    ? ConvertorTime(
                                                                                                          dbServer.cooldown.slotmachine,
                                                                                                      )
                                                                                                    : 'No Configurado'
                                                                                            }
                                                                                        />
                                                                                        {dbServer?.cooldown?.slotmachine != null ? (
                                                                                            <Button
                                                                                                variant="outline-danger"
                                                                                                name="deleteCooldownMensajes"
                                                                                                onClick={() =>
                                                                                                    onDelete('cooldown.slotmachine')
                                                                                                }>
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
                                                                                            {...register('payment.trade.min', {
                                                                                                valueAsNumber: true,
                                                                                                min: 1,
                                                                                            })}
                                                                                            placeholder={
                                                                                                dbServer?.payment?.trade?.min
                                                                                                    ? ConvertString(
                                                                                                          dbServer.payment.trade.min,
                                                                                                      )
                                                                                                    : 'No Configurado'
                                                                                            }
                                                                                        />
                                                                                        {dbServer?.payment?.trade?.min != null ? (
                                                                                            <Button
                                                                                                variant="outline-danger"
                                                                                                name="deleteCooldownMensajes"
                                                                                                onClick={() =>
                                                                                                    onDelete('payment.trade.min')
                                                                                                }>
                                                                                                Eliminar
                                                                                            </Button>
                                                                                        ) : null}
                                                                                    </InputGroup>
                                                                                </Col>
                                                                                <Col sm>
                                                                                    <Form.Label>Pago Máximo</Form.Label>
                                                                                    <InputGroup className="mb-2">
                                                                                        <Form.Control
                                                                                            {...register('payment.trade.max', {
                                                                                                valueAsNumber: true,
                                                                                                min: 2,
                                                                                            })}
                                                                                            placeholder={
                                                                                                dbServer?.payment?.trade?.max
                                                                                                    ? ConvertString(
                                                                                                          dbServer.payment.trade.max,
                                                                                                      )
                                                                                                    : 'No Configurado'
                                                                                            }
                                                                                        />
                                                                                        {dbServer?.payment?.trade?.max != null ? (
                                                                                            <Button
                                                                                                variant="outline-danger"
                                                                                                name="deleteCooldownMensajes"
                                                                                                onClick={() =>
                                                                                                    onDelete('payment.trade.max')
                                                                                                }>
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
                                                                                            {...register('fineAmount.trade.min', {
                                                                                                valueAsNumber: true,
                                                                                                min: 1,
                                                                                            })}
                                                                                            placeholder={
                                                                                                dbServer?.fineAmount?.trade?.min
                                                                                                    ? ConvertString(
                                                                                                          dbServer.fineAmount.trade.min,
                                                                                                      )
                                                                                                    : 'No Configurado'
                                                                                            }
                                                                                        />
                                                                                        {dbServer?.fineAmount?.trade?.min != null ? (
                                                                                            <Button
                                                                                                variant="outline-danger"
                                                                                                name="deleteCooldownMensajes"
                                                                                                onClick={() =>
                                                                                                    onDelete('fineAmount.trade.min')
                                                                                                }>
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
                                                                                            {...register('fineAmount.trade.max', {
                                                                                                valueAsNumber: true,
                                                                                                min: 2,
                                                                                            })}
                                                                                            placeholder={
                                                                                                dbServer?.fineAmount?.trade?.max
                                                                                                    ? ConvertString(
                                                                                                          dbServer.fineAmount.trade.max,
                                                                                                      )
                                                                                                    : 'No Configurado'
                                                                                            }
                                                                                        />
                                                                                        {dbServer?.fineAmount?.trade?.max != null ? (
                                                                                            <Button
                                                                                                variant="outline-danger"
                                                                                                name="deleteCooldownMensajes"
                                                                                                onClick={() =>
                                                                                                    onDelete('fineAmount.trade.max')
                                                                                                }>
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
                                                                                            {...register('cooldown.trade')}
                                                                                            placeholder={
                                                                                                dbServer?.cooldown?.trade
                                                                                                    ? ConvertorTime(dbServer.cooldown.trade)
                                                                                                    : 'No Configurado'
                                                                                            }
                                                                                        />
                                                                                        {dbServer?.cooldown?.trade != null ? (
                                                                                            <Button
                                                                                                variant="outline-danger"
                                                                                                name="deleteCooldownMensajes"
                                                                                                onClick={() => onDelete('cooldown.trade')}>
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
                                                                                    {...register('payment.work.min', {
                                                                                        valueAsNumber: true,
                                                                                        min: 1,
                                                                                    })}
                                                                                    placeholder={
                                                                                        dbServer?.payment?.work?.min
                                                                                            ? ConvertString(dbServer.payment.work.min)
                                                                                            : 'No Configurado'
                                                                                    }
                                                                                />
                                                                                {dbServer?.payment?.work?.min != null ? (
                                                                                    <Button
                                                                                        variant="outline-danger"
                                                                                        name="deleteCooldownMensajes"
                                                                                        onClick={() => onDelete('payment.work.min')}>
                                                                                        Eliminar
                                                                                    </Button>
                                                                                ) : null}
                                                                            </InputGroup>
                                                                        </Col>
                                                                        <Col sm>
                                                                            <Form.Label>Pago Máximo</Form.Label>
                                                                            <InputGroup className="mb-2">
                                                                                <Form.Control
                                                                                    {...register('payment.work.max', {
                                                                                        valueAsNumber: true,
                                                                                        min: 2,
                                                                                    })}
                                                                                    placeholder={
                                                                                        dbServer?.payment?.work?.max
                                                                                            ? ConvertString(dbServer.payment.work.max)
                                                                                            : 'No Configurado'
                                                                                    }
                                                                                />
                                                                                {dbServer?.payment?.work?.max != null ? (
                                                                                    <Button
                                                                                        variant="outline-danger"
                                                                                        name="deleteCooldownMensajes"
                                                                                        onClick={() => onDelete('payment.work.max')}>
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
                                                                                    {...register('cooldown.work')}
                                                                                    placeholder={
                                                                                        dbServer?.cooldown?.work
                                                                                            ? ConvertorTime(dbServer.cooldown.work)
                                                                                            : 'No Configurado'
                                                                                    }
                                                                                />
                                                                                {dbServer?.cooldown?.work != null ? (
                                                                                    <Button
                                                                                        variant="outline-danger"
                                                                                        name="deleteCooldownMensajes"
                                                                                        onClick={() => onDelete('cooldown.trade')}>
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
                                                        <Row className="align-items-center">
                                                            {/**
                                                             * CrearteItems
                                                             */}
                                                            <Button
                                                                variant="outline-success"
                                                                type="button"
                                                                onClick={() => setShowModalNewItem(true)}>
                                                                Crear Item
                                                            </Button>
                                                            {/**
                                                             * ClearItems
                                                             */}
                                                            {/**
                                                             * Items
                                                             */}
                                                            <Col sm={12} className="pb-3">
                                                                <Form.Label>Artículos en Tienda</Form.Label>
                                                                <ul className="channelUl">
                                                                    {items.map((it: Item) => (
                                                                        <li className="channelCard" key={'it_' + it.nombre}>
                                                                            <span>
                                                                                {/* Verificar si el emoji tiene números */}
                                                                                {!it.emoji || it.emoji.match(/:/g) ? <></> : it.emoji}
                                                                                {it.nombre}
                                                                            </span>
                                                                            {/* <button
                                                                                type="button"
                                                                                aria-label="Close"
                                                                                onClick={d => {
                                                                                    setChatExclude(channels =>
                                                                                        channels.filter(x => x.id !== ce.id),
                                                                                    );
                                                                                }}>
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
                                                            </Col>
                                                            {/* Guardar */}
                                                            {/* <Col sm className="pt-4">
                                                                <Button variant="outline-warning" type="submit" name="action">
                                                                    Guardar
                                                                </Button>
                                                            </Col> */}
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Tab.Pane>
                                        </Tab.Content>
                                    </Col>
                                </Tab.Container>

                                {/* Modal - Crear Item */}
                                <Modal show={showModalNewItem} onHide={() => setShowModalNewItem(false)}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Nuevo Item</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <Form
                                            className="g-3 needs-validation"
                                            onSubmit={itemForm.handleSubmit(onNewItem)}
                                            name="economyForm">
                                            <Row>
                                                {/* Nombre */}
                                                <Col md={6}>
                                                    <Form.Label>Nombre</Form.Label>
                                                    <InputGroup className="mb-2">
                                                        <Form.Control
                                                            {...itemForm.register('nombre', { required: true })}
                                                            placeholder="Nombre del artículo"
                                                        />
                                                    </InputGroup>
                                                </Col>
                                                {/* Descripción */}
                                                <Col md={6}>
                                                    <Form.Label>Descripción</Form.Label>
                                                    <InputGroup className="mb-2">
                                                        <Form.Control
                                                            {...itemForm.register('descripcion')}
                                                            placeholder="Descripción detallada del artículo"
                                                        />
                                                    </InputGroup>
                                                </Col>
                                                {/* Precios */}
                                                <Form.Label>Precios</Form.Label>
                                                <Col md={6}>
                                                    <InputGroup className="mb-2">
                                                        <Form.Control
                                                            {...itemForm.register('precio.compra', { required: true })}
                                                            placeholder="Precio de Compra"
                                                        />
                                                    </InputGroup>
                                                </Col>
                                                <Col md={6}>
                                                    <InputGroup className="mb-2">
                                                        <Form.Control
                                                            {...itemForm.register('precio.venta', { required: true })}
                                                            placeholder="Precio de Venta"
                                                        />
                                                    </InputGroup>
                                                </Col>
                                                {/* Disponible */}
                                                <Col sm>
                                                    <Form.Label>Disponible para mostar en tienda</Form.Label>
                                                    <InputGroup className="mb-2">
                                                        <Form.Check {...itemForm.register('disponible')} placeholder="Disponible" />
                                                    </InputGroup>
                                                </Col>
                                                {/* Transferir */}
                                                <Col sm>
                                                    <Form.Label>Se puede transferir</Form.Label>
                                                    <InputGroup className="mb-2">
                                                        <Form.Check {...itemForm.register('transferible')} placeholder="Transferible" />
                                                    </InputGroup>
                                                </Col>
                                                {/* Basura */}
                                                <Col sm>
                                                    <Form.Label>Artículo para /Loot</Form.Label>
                                                    <InputGroup className="mb-2">
                                                        <Form.Check {...itemForm.register('basura')} placeholder="Basura" />
                                                    </InputGroup>
                                                </Col>
                                                {/* Compra Única */}
                                                <Col sm>
                                                    <Form.Label>Comprar una vez</Form.Label>
                                                    <InputGroup className="mb-2">
                                                        <Form.Check {...itemForm.register('compraunica')} placeholder="Compra Única" />
                                                    </InputGroup>
                                                </Col>
                                                {/* Tiempo */}
                                                <Col md={6}>
                                                    <Form.Label>Fecha de Expiración</Form.Label>
                                                    {/* <InputGroup className="mb-2">
                                                        <Form.Control
                                                            {...itemForm.register('tiempo')}
                                                            placeholder="Descripción detallada del artículo"
                                                        />
                                                    </InputGroup> */}
                                                </Col>
                                                {/* Stock */}
                                                <Col md={6}>
                                                    <Form.Label>Cantidad Disponible</Form.Label>
                                                    <InputGroup className="mb-2">
                                                        <Form.Control
                                                            {...itemForm.register('stock', { valueAsNumber: true })}
                                                            defaultValue={0}
                                                            placeholder="Stock"
                                                        />
                                                    </InputGroup>
                                                </Col>
                                                {/* Requiere */}
                                                {/* Obtiene */}
                                                {/* Elimina */}
                                                {/* Mensaje */}
                                                <Col md={6}>
                                                    <Form.Label>Mensaje al usar el artículo</Form.Label>
                                                    <InputGroup className="mb-2">
                                                        <Form.Control {...itemForm.register('mensaje')} placeholder="Mensaje" />
                                                    </InputGroup>
                                                </Col>
                                                {/* Evento */}
                                                <Col md={6}>
                                                    <Form.Label>Evento temático del servidor</Form.Label>
                                                    <InputGroup className="mb-2">
                                                        <Form.Control {...itemForm.register('evento')} placeholder="Evento" />
                                                    </InputGroup>
                                                </Col>
                                            </Row>
                                        </Form>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={() => setShowModalNewItem(false)}>
                                            Cancelar
                                        </Button>
                                        <Button variant="primary" type="submit">
                                            Crear
                                        </Button>
                                    </Modal.Footer>
                                </Modal>

                                {/* Modal - Borrar Todo */}
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
                                                        name: 'payment',
                                                    },
                                                });
                                                await updateServerGQL({
                                                    variables: {
                                                        id,
                                                        create: true,
                                                        name: 'fineAmount',
                                                    },
                                                });
                                                const newData = (
                                                    await updateServerGQL({
                                                        variables: {
                                                            id,
                                                            name: 'cooldown',
                                                        },
                                                    })
                                                ).data.deleteServerGQL;
                                                setDbServer(newData);
                                                reset();
                                                setAlert(at => [
                                                    ...at,
                                                    { type: 'success', show: true, text: `Configuraciones eliminadas correctamente.` },
                                                ]);
                                            }}>
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
