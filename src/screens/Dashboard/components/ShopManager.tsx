import React from 'react';
import { Row, Col, Button, Form } from 'react-bootstrap';
import type { Item } from '@app/models';

export interface ShopManagerProps {
    items: Item[];
    onCreateItem: () => void;
    onEditItem: (itemId: string | number) => void;
    onDeleteItem: (itemId: string | number) => void;
}

/**
 * ShopManager Component
 * Manages the shop items list with create, edit, and delete functionality.
 */
export const ShopManager: React.FC<ShopManagerProps> = ({ items, onCreateItem, onEditItem, onDeleteItem }) => {
    return (
        <Row className="align-items-center text-center">
            <Col sm={12}>
                <h3>Tienda</h3>
            </Col>
            <Col sm={12}>
                <Row className="align-items-center">
                    {/* Crear Item Button */}
                    <Button variant="outline-success" type="button" onClick={onCreateItem}>
                        Crear Item
                    </Button>

                    {/* Items List */}
                    <Col sm={12} className="pb-3 pt-3">
                        <Form.Label>Artículos en Tienda ({items.length})</Form.Label>
                        {items.length === 0 ? (
                            <p className="text-muted">No hay artículos en la tienda. ¡Crea el primero!</p>
                        ) : (
                            <ul className="channelUl">
                                {items.map((item: Item) => (
                                    <li
                                        className="channelCard discord-item-card"
                                        style={{ cursor: 'pointer' }}
                                        key={`item_${item._id}`}
                                        onClick={() => onEditItem(item._id)}>
                                        <span className="discord-item-info">
                                            {/* Emoji display - only if not a Discord custom emoji */}
                                            {item.emoji && !item.emoji.match(/:/g) && (
                                                <span className="discord-item-emoji">{item.emoji}</span>
                                            )}
                                            <span className="discord-item-name">{item.nombre}</span>
                                            {!!item.stock && <small className="discord-item-stock ms-2">(Stock: {item.stock})</small>}
                                            {!item.disponible && <small className="text-warning ms-2">(No disponible)</small>}
                                        </span>
                                        <div className="discord-item-actions">
                                            <button
                                                type="button"
                                                aria-label="Eliminar item"
                                                onClick={() => onDeleteItem(item._id)}
                                                className="btn btn-sm btn-outline-danger border-0"
                                                title="Eliminar item">
                                                <i className="material-icons channelButtonIcon">delete</i>
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

export default ShopManager;
