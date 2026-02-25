import { Container, Spinner, Alert, Col, Row, Tab, Nav, Button, Card, Modal } from 'react-bootstrap';
import { useLazyQuery, useMutation } from '@apollo/client/react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import ms from 'ms';

import {
    AddItemShopGQL,
    ChannelsGuildGQL,
    RemoveItemShopGQL,
    ServerGQL,
    ShopServerGQL,
    UpdateServerGQL,
    UpdateItemShopGQL,
    ItemShopGQL,
    UpdateBotServerGQL,
    UpdateEconomyServerGQL,
} from '@app/graphql';
import { ItemFormModal, ShopManager, GeneralSettings, EconomySettings } from './components';
import type { ServerSystem, GuildInfo, Item, Tienda, ChannelGuildModel } from '@app/models';
import { useAppSelector } from '@app/storage';

const Styled = styled.div<{ $bgColor?: string }>`
    .nav-link.active {
        background-color: ${props => props.$bgColor || '#375a7f'} !important;
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

    const [loading, setLoading] = useState(false);
    const [guild, setGuild] = useState<GuildInfo | undefined>();
    const [alert, setAlert] = useState([] as IAlert[]);
    const [chatExclude, setChatExclude] = useState<string[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [items, setItems] = useState<Item[]>([]);
    const [editingItem, setEditingItem] = useState<Item | null>(null);
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [isItemSaving, setIsItemSaving] = useState(false);
    const [dbServer, setDbServer] = useState<ServerSystem | undefined>();
    const [tabActive, setTabActive] = useState<'bot' | 'economy' | 'shop'>('bot');

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
        setValue,
    } = useForm();
    const itemForm = useForm<Item>();

    const [onServerGQL, serverGQL] = useLazyQuery<{ getServer: ServerSystem }>(ServerGQL);
    const [onChannelsGQL, channelsGQL] = useLazyQuery<{ getChannelsGuild: ChannelGuildModel[] }>(ChannelsGuildGQL);
    const [onShopGQL, shopGQL] = useLazyQuery<{ getShop: Tienda }, { id: string }>(ShopServerGQL);
    const [getItemDetails] = useLazyQuery<{ getItemShop: Item }>(ItemShopGQL);

    const [addItemShopGQL] = useMutation<{ addItemShop: Tienda & { error?: string } }>(AddItemShopGQL);
    const [removeItemShopGQL] = useMutation<{ removeItemShop: Tienda & { error?: string } }>(RemoveItemShopGQL);
    const [updateItemShopGQL] = useMutation<{ updateItemShop: Tienda & { error?: string } }>(UpdateItemShopGQL);
    const [updateServerGQL] = useMutation<{ updateServer: ServerSystem }>(UpdateServerGQL);
    const [updateBotServerGQL] = useMutation<{ updateBotServer: ServerSystem }>(UpdateBotServerGQL);
    const [updateEconomyServerGQL] = useMutation<{ updateEconomyServer: ServerSystem }>(UpdateEconomyServerGQL);

    useEffect(() => {
        if (loading) return;
        setLoading(true);

        const Servidor = user.guilds?.find(g => g.id === id);
        let usersManager: string[] = [];
        try {
            usersManager = JSON.parse(import.meta.env.VITE_BOT_MANAGER);
        } catch (error) {
            usersManager = [];
        }

        if (!Servidor || (!((Servidor.permissions & 2146958591) === 2146958591) && !usersManager.includes(user._id))) {
            setLoading(false);
            return window.location.replace('/error403');
        } else {
            setGuild(Servidor);
            setLoading(false);
            setTabActive('bot');
            onServerGQL({ variables: { id } });
        }
    }, [id, user]);

    // Efecto separado para cargar datos cuando la query completa
    useEffect(() => {
        if (serverGQL.data?.getServer && !dbServer) {
            setDbServer(serverGQL.data.getServer);
            setLoading(false);
        }
    }, [serverGQL.data, dbServer]);

    useEffect(() => {
        if (serverGQL.data?.getServer) {
            loadDB(serverGQL.data.getServer);
        }
    }, [serverGQL.data]);

    useEffect(() => {
        if (shopGQL.data) {
            setItems(shopGQL.data.getShop?.items || []);
        }
    }, [shopGQL.data]);

    const loadDB = async (db: ServerSystem | null) => {
        if (db?.excludedChannels) {
            setChatExclude(db.excludedChannels);
        }
    };

    const handleExcludedChannelsChange = (channelIds: string[]) => {
        setChatExclude(channelIds);
    };

    const removeAlert = (alert: IAlert) => setAlert(alerts => alerts.filter(x => x !== alert));

    /**
     * Handler para guardar configuración general del bot (pestaña Inicio)
     */
    const onSubmitGeneral = async (data: any) => {
        try {
            // Construir objeto con los datos del formulario
            const updateData: Record<string, any> = {};

            // Language
            if (data.language?.server) {
                updateData.language = { server: data.language.server };
            }

            // ColorMain
            if (data.colorMain) {
                updateData.colorMain = data.colorMain;
            }

            // Images
            if (data.images) {
                updateData.images = data.images;
            }

            // Buy
            if (data.buy?.category) {
                updateData.buy = { category: data.buy.category };
            }

            // Auditlogs
            if (data.auditlogs) {
                updateData.auditlogs = data.auditlogs;
            }

            const result = await updateBotServerGQL({
                variables: { id, data: updateData },
            });

            if (result.data?.updateBotServer) {
                setDbServer(prev => ({ ...prev, ...result.data!.updateBotServer }));
                setAlert(at => [...at, { type: 'success', show: true, text: 'Configuración General guardada' }]);
            }
        } catch (error: any) {
            setAlert(at => [...at, { type: 'danger', show: true, text: error.message || 'Error al guardar' }]);
        }
    };

    /**
     * Handler para guardar configuración de economía (pestaña Economía)
     */
    const onSubmitEconomy = async (data: any) => {
        try {
            // Construir objeto con los datos del formulario
            const updateData: Record<string, any> = {};

            // Currency
            if (data.currency) {
                updateData.currency = {
                    name: data.currency.name || undefined,
                    id: data.currency.id || undefined,
                };
            }

            // Payment - convertir cooldowns de string a ms
            if (data.payment) {
                updateData.payment = {};
                for (const key in data.payment) {
                    if (typeof data.payment[key] === 'object') {
                        updateData.payment[key] = {
                            min: data.payment[key].min || undefined,
                            max: data.payment[key].max || undefined,
                        };
                    } else if (data.payment[key] !== undefined && data.payment[key] !== null) {
                        updateData.payment[key] = data.payment[key];
                    }
                }
            }

            // FineAmount
            if (data.fineAmount) {
                updateData.fineAmount = {};
                for (const key in data.fineAmount) {
                    if (typeof data.fineAmount[key] === 'object') {
                        updateData.fineAmount[key] = {
                            min: data.fineAmount[key].min || undefined,
                            max: data.fineAmount[key].max || undefined,
                            fail: data.fineAmount[key].fail || undefined,
                        };
                    }
                }
            }

            // Cooldown - convertir strings a ms
            if (data.cooldown) {
                updateData.cooldown = {};
                for (const key in data.cooldown) {
                    const value = data.cooldown[key];
                    if (value) {
                        try {
                            // Si es string, intentar convertir a ms
                            updateData.cooldown[key] = typeof value === 'string' ? ms(value) : value;
                        } catch {
                            updateData.cooldown[key] = value;
                        }
                    }
                }
            }

            // ExcludedChannels - desde el estado
            updateData.excludedChannels = chatExclude;

            const result = await updateEconomyServerGQL({
                variables: { id, data: updateData },
            });

            if (result.data?.updateEconomyServer) {
                setDbServer(prev => ({ ...prev, ...result.data!.updateEconomyServer }));
                setAlert(at => [...at, { type: 'success', show: true, text: 'Configuración de Economía guardada' }]);
            }
        } catch (error: any) {
            setAlert(at => [...at, { type: 'danger', show: true, text: error.message || 'Error al guardar' }]);
        }
    };

    /**
     * Handler genérico que selecciona el handler correcto según la pestaña activa
     */
    const onSubmit = async (data: any, e: React.BaseSyntheticEvent<object> | undefined) => {
        if (tabActive === 'bot') {
            await onSubmitGeneral(data);
        } else if (tabActive === 'economy') {
            await onSubmitEconomy(data);
        }
        if (e) e.target.reset();
        reset();
    };

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

            if (result.data?.removeItemShop?.items) {
                setItems(result.data.removeItemShop.items);
                setAlert(at => [...at, { type: 'success', show: true, text: 'Item eliminado correctamente' }]);
            } else throw new Error(result.data?.removeItemShop?.error || 'Error al eliminar el item');
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
        ).data?.updateServer;
        setDbServer(newData);
        reset([name]);
        if (name === 'language.server') setValue('language.server', 'es-MX');
        setAlert(at => [...at, { type: 'success', show: true, text: `Propiedad eliminada correctamente.` }]);
    };

    if (loading)
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
            <Styled $bgColor={dbServer?.colorMain || '#edbf10'}>
                <Container>
                    <Helmet>
                        <title>Dashboard {guild?.name ? `| ${guild?.name}` : ''}</title>
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
                                <Tab.Container
                                    activeKey={tabActive}
                                    onSelect={key => key && setTabActive(key as 'bot' | 'economy' | 'shop')}>
                                    {/* Menú Lateral */}
                                    <Col sm={2} className="text-center">
                                        <Nav variant="pills" className="flex-column">
                                            <Nav.Link eventKey="bot">Inicio</Nav.Link>
                                            <Nav.Link eventKey="economy" onClick={() => id && onChannelsGQL({ variables: { id } })}>
                                                Economía
                                            </Nav.Link>
                                            <Nav.Link eventKey="shop" onClick={() => id && onShopGQL({ variables: { id } })}>
                                                Tienda
                                            </Nav.Link>
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
                                                {serverGQL.loading ? (
                                                    <div
                                                        className="text-center align-items-center justify-content-center d-flex"
                                                        style={{ height: '30vh' }}>
                                                        <Spinner animation="border" variant="warning" role="status" />
                                                    </div>
                                                ) : (
                                                    <GeneralSettings
                                                        register={register}
                                                        errors={errors}
                                                        dbServer={dbServer}
                                                        onSubmit={handleSubmit(onSubmit)}
                                                        onDelete={onDelete}
                                                    />
                                                )}
                                            </Tab.Pane>

                                            {/* Panel de Economía */}
                                            <Tab.Pane eventKey="economy">
                                                {channelsGQL.loading ? (
                                                    <div
                                                        className="text-center align-items-center justify-content-center d-flex"
                                                        style={{ height: '30vh' }}>
                                                        <Spinner animation="border" variant="warning" role="status" />
                                                    </div>
                                                ) : (
                                                    <EconomySettings
                                                        register={register}
                                                        errors={errors}
                                                        dbServer={dbServer}
                                                        onDelete={onDelete}
                                                        onSubmit={handleSubmit(onSubmit)}
                                                        chatExclude={chatExclude}
                                                        channels={channelsGQL.data?.getChannelsGuild || []}
                                                        onExcludedChannelsChange={handleExcludedChannelsChange}
                                                    />
                                                )}
                                            </Tab.Pane>

                                            {/* Panel de Tienda */}
                                            <Tab.Pane eventKey="shop">
                                                {shopGQL.loading ? (
                                                    <div
                                                        className="text-center align-items-center justify-content-center d-flex"
                                                        style={{ height: '30vh' }}>
                                                        <Spinner animation="border" variant="warning" role="status" />
                                                    </div>
                                                ) : (
                                                    <ShopManager
                                                        items={items}
                                                        onCreateItem={handleOpenNewItemModal}
                                                        onEditItem={handleOpenEditModal}
                                                        onDeleteItem={onDeleteItem}
                                                    />
                                                )}
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
                                                ).data?.updateServer;
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
