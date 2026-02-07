import { Modal, Button, Form, Row, Col, InputGroup } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import type { Item } from '@app/models';

interface ItemFormModalProps {
    show: boolean;
    onHide: () => void;
    onSubmit: (data: Item) => Promise<void>;
    item?: Item | null;
    isLoading?: boolean;
}

const defaultValues: Partial<Item> = {
    nombre: '',
    descripcion: '',
    precio: { compra: 0, venta: 0 },
    emoji: '',
    disponible: true,
    transferible: true,
    basura: false,
    compraunica: false,
    stock: undefined,
    mensaje: '',
    evento: '',
    expiracion: undefined,
};

export const ItemFormModal: React.FC<ItemFormModalProps> = ({ show, onHide, onSubmit, item, isLoading = false }) => {
    const isEditing = !!item;
    const formId = isEditing ? 'editItemForm' : 'newItemForm';

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Item>({
        defaultValues: item || defaultValues,
    });

    useEffect(() => {
        if (show) {
            reset(item || defaultValues);
        }
    }, [show, item, reset]);

    const handleFormSubmit = async (data: Item) => {
        await onSubmit(data);
    };

    const handleClose = () => {
        reset(defaultValues);
        onHide();
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{isEditing ? 'Editar Item' : 'Nuevo Item'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form id={formId} className="g-3 needs-validation" onSubmit={handleSubmit(handleFormSubmit)}>
                    <Row>
                        {/* Nombre */}
                        <Col md={6}>
                            <Form.Label>Nombre *</Form.Label>
                            <InputGroup className="mb-2">
                                <Form.Control
                                    {...register('nombre', { required: 'El nombre es requerido' })}
                                    placeholder="Nombre del artículo"
                                    isInvalid={!!errors.nombre}
                                />
                                <Form.Control.Feedback type="invalid">{errors.nombre?.message}</Form.Control.Feedback>
                            </InputGroup>
                        </Col>

                        {/* Emoji */}
                        <Col md={6}>
                            <Form.Label>Emoji</Form.Label>
                            <InputGroup className="mb-2">
                                <Form.Control {...register('emoji')} placeholder="Usa emojis estándar o personalizados :emoji:" />
                            </InputGroup>
                        </Col>

                        {/* Descripción */}
                        <Col md={12}>
                            <Form.Label>Descripción</Form.Label>
                            <InputGroup className="mb-2">
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    {...register('descripcion')}
                                    placeholder="Descripción detallada del artículo"
                                />
                            </InputGroup>
                        </Col>

                        {/* Precios */}
                        <Col md={6}>
                            <Form.Label>Precio de Compra</Form.Label>
                            <InputGroup className="mb-2">
                                <InputGroup.Text>💰</InputGroup.Text>
                                <Form.Control
                                    type="number"
                                    {...register('precio.compra', { valueAsNumber: true })}
                                    placeholder="Ingresa el precio"
                                    min={0}
                                />
                            </InputGroup>
                        </Col>
                        <Col md={6}>
                            <Form.Label>Precio de Venta</Form.Label>
                            <InputGroup className="mb-2">
                                <InputGroup.Text>💵</InputGroup.Text>
                                <Form.Control
                                    type="number"
                                    {...register('precio.venta', { valueAsNumber: true })}
                                    placeholder="Ingresa el precio"
                                    min={0}
                                />
                            </InputGroup>
                        </Col>

                        {/* Opciones booleanas */}
                        <Col xs={6} sm={3}>
                            <Form.Check
                                type="switch"
                                id="disponible-switch"
                                label="Disponible"
                                {...register('disponible')}
                                className="mb-2"
                            />
                        </Col>
                        <Col xs={6} sm={3}>
                            <Form.Check
                                type="switch"
                                id="transferible-switch"
                                label="Transferible"
                                {...register('transferible')}
                                className="mb-2"
                            />
                        </Col>
                        <Col xs={6} sm={3}>
                            <Form.Check type="switch" id="basura-switch" label="Looteable" {...register('basura')} className="mb-2" />
                        </Col>
                        <Col xs={6} sm={3}>
                            <Form.Check
                                type="switch"
                                id="compraunica-switch"
                                label="Compra Única"
                                {...register('compraunica')}
                                className="mb-2"
                            />
                        </Col>

                        {/* Stock */}
                        <Col md={6}>
                            <Form.Label>Stock (dejar vacío para ilimitado)</Form.Label>
                            <InputGroup className="mb-2">
                                <InputGroup.Text>📦</InputGroup.Text>
                                <Form.Control
                                    type="number"
                                    {...register('stock', { valueAsNumber: true })}
                                    placeholder="Ilimitado"
                                    min={0}
                                />
                            </InputGroup>
                        </Col>

                        {/* Mensaje */}
                        <Col md={6}>
                            <Form.Label>Mensaje al usar (opcional)</Form.Label>
                            <InputGroup className="mb-2">
                                <Form.Control {...register('mensaje')} placeholder="Escribe el mensaje que se mostrará al usar el item" />
                            </InputGroup>
                        </Col>

                        {/* Evento */}
                        <Col md={6}>
                            <Form.Label>Evento temático (opcional)</Form.Label>
                            <InputGroup className="mb-2">
                                <InputGroup.Text>🎉</InputGroup.Text>
                                <Form.Control {...register('evento')} placeholder="Nombre del evento" />
                            </InputGroup>
                        </Col>

                        {/* Fecha de Expiración */}
                        <Col md={6}>
                            <Form.Label>Fecha de Expiración (opcional)</Form.Label>
                            <InputGroup className="mb-2">
                                <InputGroup.Text>⏰</InputGroup.Text>
                                <Form.Control type="date" {...register('expiracion')} />
                            </InputGroup>
                            <Form.Text className="text-muted">Deja vacío para que nunca expire</Form.Text>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
                    Cancelar
                </Button>
                <Button variant="primary" type="submit" form={formId} disabled={isLoading}>
                    {isLoading ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Crear Item'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
