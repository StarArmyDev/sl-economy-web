import { Container, Spinner, Alert, Col, Row, Tab, Nav, Button, Card, Modal } from 'react-bootstrap';
import { useQuery, useLazyQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import Helmet from 'react-helmet';
import ms from 'ms';

import {
    AddItemShopGQL,
    ChannelsGuildGQL,
    RemoveItemShopGQL,
    ServerGQL,
    ShopServerGQL,
    UpdateServerGQL,
    UpdateItemShopGQL,
    useMutation,
    ItemShopGQL,
} from '@app/graphql';
import { ItemFormModal, ShopManager, GeneralSettings, EconomySettings } from './components';
import type { ServerSystem, GuildInfo, Item, Tienda, ChannelGuildModel } from '@app/models';
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
    const [items, setItems] = useState<Item[]>([]);
    const [editingItem, setEditingItem] = useState<Item | null>(null);
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [isItemSaving, setIsItemSaving] = useState(false);
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

    const serverGQL = useQuery<{ getServer: ServerSystem }>(ServerGQL, { variables: { id } });
    const channelsGQL = useQuery<{ getChannelsGuild: ChannelGuildModel[] }>(ChannelsGuildGQL, { variables: { id } });
    const shopGQL = useQuery<{ getShop: Tienda }>(ShopServerGQL, { variables: { id } });
    const [getItemDetails] = useLazyQuery<{ getItemShop: Item }>(ItemShopGQL);

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
            loadDB(serverGQL.data.getServer, channelsGQL.data?.getChannelsGuild || []);
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

    const [addItemShopGQL] = useMutation(AddItemShopGQL);
    const [removeItemShopGQL] = useMutation(RemoveItemShopGQL);
    const [updateItemShopGQL] = useMutation(UpdateItemShopGQL);

    const onNewItem = async (data: Item) => {
        setIsItemSaving(true);

        try {
            const result = await addItemShopGQL({
                variables: {
                    id,
                    nombre: data.nombre,
                    descripcion: data.descripcion || '',
                    precio: {
                        compra: data.precio?.compra || 0,
                        venta: data.precio?.venta || 0,
                    },
                    emoji: data.emoji || undefined,
                    disponible: data.disponible ?? true,
                    transferible: data.transferible ?? true,
                    basura: data.basura ?? false,
                    compraunica: data.compraunica ?? false,
                    stock: data.stock || undefined,
                    mensaje: data.mensaje || undefined,
                    evento: data.evento || undefined,
                },
            });

            if (result.data?.addItemShop?.items) {
                setItems(result.data.addItemShop.items);
                handleCloseItemModal();
                setAlert(at => [...at, { type: 'success', show: true, text: 'Item creado correctamente' }]);
            } else throw new Error(result.data?.addItemShop?.error || 'Error al crear el item');
        } catch (error: any) {
            setAlert(at => [...at, { type: 'danger', show: true, text: error.message || 'Error al crear el item' }]);
        } finally {
            setIsItemSaving(false);
        }
    };

    const onDeleteItem = async (itemId: string | number) => {
        try {
            const result = await removeItemShopGQL({
                variables: { id, itemId: String(itemId) },
            });

            if (result.data?.removeItemShop?.error) {
                setAlert(at => [...at, { type: 'danger', show: true, text: result.data.removeItemShop.error }]);
            } else if (result.data?.removeItemShop?.items) {
                setItems(result.data.removeItemShop.items);
                setAlert(at => [...at, { type: 'success', show: true, text: 'Item eliminado correctamente' }]);
            }
        } catch (error: any) {
            setAlert(at => [...at, { type: 'danger', show: true, text: error.message || 'Error al eliminar el item' }]);
        }
    };

    const onEditItem = async (data: Item) => {
        setIsItemSaving(true);

        try {
            const result = await updateItemShopGQL({
                variables: {
                    id,
                    itemId: data._id,
                    nombre: data.nombre,
                    descripcion: data.descripcion || '',
                    precio: {
                        compra: data.precio?.compra || 0,
                        venta: data.precio?.venta || 0,
                    },
                    emoji: data.emoji || undefined,
                    disponible: data.disponible ?? true,
                    transferible: data.transferible ?? true,
                    basura: data.basura ?? false,
                    compraunica: data.compraunica ?? false,
                    stock: data.stock || undefined,
                    mensaje: data.mensaje || undefined,
                    evento: data.evento || undefined,
                },
            });

            if (result.data?.updateItemShop?.items) {
                setItems(result.data.updateItemShop.items);
                handleCloseItemModal();
                setAlert(at => [...at, { type: 'success', show: true, text: 'Item actualizado correctamente' }]);
            } else throw new Error(result.data?.updateItemShop?.error || 'Error al actualizar el item');
        } catch (error: any) {
            setAlert(at => [...at, { type: 'danger', show: true, text: error.message || 'Error al actualizar el item' }]);
        } finally {
            setIsItemSaving(false);
        }
    };

    const onSaveItem = async (item: Item) => {
        if (editingItem) {
            await onEditItem(item);
        } else {
            await onNewItem(item);
        }
    };

    const handleOpenNewItemModal = () => {
        itemForm.reset();
        setEditingItem(null);
        setIsItemModalOpen(true);
    };

    const handleOpenEditModal = async (itemId: string | number) => {
        const itemResp = await getItemDetails({ variables: { id, itemId } });
        const item = itemResp.data?.getItemShop;

        if (!item) {
            setAlert(at => [...at, { type: 'danger', show: true, text: 'Item no encontrado' }]);
            return;
        }

        setEditingItem(item);
        setIsItemModalOpen(true);
    };

    const handleCloseItemModal = () => {
        setEditingItem(null);
        setIsItemModalOpen(false);
    };

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
                                                <GeneralSettings
                                                    register={register}
                                                    errors={errors}
                                                    dbServer={dbServer}
                                                    onSubmit={handleSubmit(onSubmit)}
                                                    onDelete={onDelete}
                                                />
                                            </Tab.Pane>

                                            {/* Panel de Economía */}
                                            <Tab.Pane eventKey="economy">
                                                <Row className="align-items-center text-center">
                                                    <EconomySettings
                                                        register={register}
                                                        errors={errors}
                                                        dbServer={dbServer}
                                                        onDelete={onDelete}
                                                        onSubmit={handleSubmit(onSubmit)}
                                                        chatExclude={chatExclude}
                                                    />
                                                </Row>
                                            </Tab.Pane>

                                            {/* Panel de Tienda */}
                                            <Tab.Pane eventKey="shop">
                                                <ShopManager
                                                    items={items}
                                                    onCreateItem={handleOpenNewItemModal}
                                                    onEditItem={handleOpenEditModal}
                                                    onDeleteItem={onDeleteItem}
                                                />
                                            </Tab.Pane>
                                        </Tab.Content>
                                    </Col>
                                </Tab.Container>

                                {/* Modal - Crear/Editar Item */}
                                <ItemFormModal
                                    show={isItemModalOpen}
                                    onHide={handleCloseItemModal}
                                    onSubmit={onSaveItem}
                                    item={editingItem}
                                    isLoading={isItemSaving}
                                />

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
