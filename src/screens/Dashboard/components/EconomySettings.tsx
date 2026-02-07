import { Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import React from 'react';

import { ConvertString, ConvertorTime } from '@app/helpers';
import type { ServerSystem } from '@app/models';

export interface EconomySettingsProps {
    /** React Hook Form register function */
    register: UseFormRegister<any>;
    /** React Hook Form errors */
    errors: FieldErrors<any>;
    /** Server data for placeholders */
    dbServer?: ServerSystem | null;
    /** Callback to delete a field value */
    onDelete: (fieldPath: string) => void;
    /** Form submit handler */
    onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
    /** Channels excluded from economy */
    chatExclude: Array<{ id: string; name: string }>;
}

export const EconomySettings: React.FC<EconomySettingsProps> = ({ register, errors, dbServer, onDelete, onSubmit, chatExclude }) => {
    return (
        <>
            <Col sm={12}>
                <h3>Economía</h3>
            </Col>

            <Col sm={12}>
                <Form className="g-3 needs-validation" onSubmit={onSubmit} name="economyForm">
                    <Row className="align-items-center">
                        {/**
                         * Currency
                         */}
                        <Col sm={12} className="pt-4">
                            <Form.Text className="text-muted">Coloca sólo emojis normales</Form.Text>
                            <InputGroup className="mb-2">
                                <InputGroup.Text>Moneda</InputGroup.Text>
                                <Form.Control
                                    {...register('currency.name')}
                                    placeholder={dbServer?.currency?.name ? dbServer.currency.name : 'Por Defecto: 🔶'}
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
                                                dbServer?.cooldown?.messages ? ConvertorTime(dbServer.cooldown.messages) : 'Por Defecto: 1m'
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
                                                            ? ConvertString(dbServer.payment.crime.min)
                                                            : 'No Configurado'
                                                    }
                                                />
                                                {dbServer?.payment?.crime?.min != null ? (
                                                    <Button
                                                        variant="outline-danger"
                                                        name="deleteCooldownMensajes"
                                                        onClick={() => onDelete('payment.crime.min')}>
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
                                                            ? ConvertString(dbServer.payment.crime.max)
                                                            : 'No Configurado'
                                                    }
                                                />
                                                {dbServer?.payment?.crime?.max != null ? (
                                                    <Button
                                                        variant="outline-danger"
                                                        name="deleteCooldownMensajes"
                                                        onClick={() => onDelete('payment.crime.max')}>
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
                                                            ? ConvertString(dbServer.fineAmount.crime.min)
                                                            : 'No Configurado'
                                                    }
                                                />
                                                {dbServer?.fineAmount?.crime?.min != null ? (
                                                    <Button
                                                        variant="outline-danger"
                                                        name="deleteCooldownMensajes"
                                                        onClick={() => onDelete('fineAmount.crime.min')}>
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
                                                            ? ConvertString(dbServer.fineAmount.crime.max)
                                                            : 'No Configurado'
                                                    }
                                                />
                                                {dbServer?.fineAmount?.crime?.max != null ? (
                                                    <Button
                                                        variant="outline-danger"
                                                        name="deleteCooldownMensajes"
                                                        onClick={() => onDelete('fineAmount.crime.max')}>
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
                                                dbServer?.payment?.daily ? ConvertString(dbServer.payment.daily) : 'No Configurado'
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
                                                dbServer?.cooldown?.daily ? ConvertorTime(dbServer.cooldown.daily) : 'No Configurado'
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
                                                            ? ConvertString(dbServer.payment.dice.min)
                                                            : 'No Configurado'
                                                    }
                                                />
                                                {dbServer?.payment?.dice?.min != null ? (
                                                    <Button
                                                        variant="outline-danger"
                                                        name="deleteCooldownMensajes"
                                                        onClick={() => onDelete('payment.dice.min')}>
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
                                                            ? ConvertString(dbServer.payment.dice.max)
                                                            : 'No Configurado'
                                                    }
                                                />
                                                {dbServer?.payment?.dice?.max != null ? (
                                                    <Button
                                                        variant="outline-danger"
                                                        name="deleteCooldownMensajes"
                                                        onClick={() => onDelete('payment.dice.max')}>
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
                                                            ? ConvertString(dbServer.fineAmount.dice.min)
                                                            : 'No Configurado'
                                                    }
                                                />
                                                {dbServer?.fineAmount?.dice?.min != null ? (
                                                    <Button
                                                        variant="outline-danger"
                                                        name="deleteCooldownMensajes"
                                                        onClick={() => onDelete('fineAmount.dice.min')}>
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
                                                            ? ConvertString(dbServer.fineAmount.dice.max)
                                                            : 'No Configurado'
                                                    }
                                                />
                                                {dbServer?.fineAmount?.dice?.max != null ? (
                                                    <Button
                                                        variant="outline-danger"
                                                        name="deleteCooldownMensajes"
                                                        onClick={() => onDelete('fineAmount.dice.max')}>
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
                                                        dbServer?.cooldown?.dice ? ConvertorTime(dbServer.cooldown.dice) : 'No Configurado'
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
                                                    ? ConvertString(dbServer.fineAmount.flipcoin.min)
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
                                                    ? ConvertString(dbServer.fineAmount.flipcoin.max)
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
                                                dbServer?.cooldown?.flipcoin ? ConvertorTime(dbServer.cooldown.flipcoin) : 'No Configurado'
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
                                        <Form.Control disabled {...register('payment.loot.min')} placeholder={'No Configurado'} />
                                    </InputGroup>
                                </Col>
                                <Col sm>
                                    <Form.Label>Items Máximos Ganados</Form.Label>
                                    <InputGroup className="mb-2">
                                        <Form.Control disabled {...register('payment.loot.max')} placeholder={'No Configurado'} />
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
                                            placeholder={dbServer?.cooldown?.rob ? ConvertorTime(dbServer.cooldown.rob) : 'No Configurado'}
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
                                        <Form.Control disabled {...register('payment.roulette.min')} placeholder={'No Configurado'} />
                                    </InputGroup>
                                </Col>
                                <Col sm>
                                    <Form.Label>Apuesta Máxima</Form.Label>
                                    <InputGroup className="mb-2">
                                        <Form.Control disabled {...register('payment.roulette.max')} placeholder={'No Configurado'} />
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
                                                dbServer?.cooldown?.roulette ? ConvertorTime(dbServer.cooldown.roulette) : 'No Configurado'
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
                                                            ? ConvertString(dbServer.payment.slotmachine.min)
                                                            : 'No Configurado'
                                                    }
                                                />
                                                {dbServer?.payment?.slotmachine?.min != null ? (
                                                    <Button
                                                        variant="outline-danger"
                                                        name="deleteCooldownMensajes"
                                                        onClick={() => onDelete('payment.slotmachine.min')}>
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
                                                            ? ConvertString(dbServer.payment.slotmachine.max)
                                                            : 'No Configurado'
                                                    }
                                                />
                                                {dbServer?.payment?.slotmachine?.max != null ? (
                                                    <Button
                                                        variant="outline-danger"
                                                        name="deleteCooldownMensajes"
                                                        onClick={() => onDelete('payment.slotmachine.max')}>
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
                                                            ? ConvertString(dbServer.fineAmount.slotmachine.min)
                                                            : 'No Configurado'
                                                    }
                                                />
                                                {dbServer?.fineAmount?.slotmachine?.min != null ? (
                                                    <Button
                                                        variant="outline-danger"
                                                        name="deleteCooldownMensajes"
                                                        onClick={() => onDelete('fineAmount.slotmachine.min')}>
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
                                                            ? ConvertString(dbServer.fineAmount.slotmachine.max)
                                                            : 'No Configurado'
                                                    }
                                                />
                                                {dbServer?.fineAmount?.slotmachine?.max != null ? (
                                                    <Button
                                                        variant="outline-danger"
                                                        name="deleteCooldownMensajes"
                                                        onClick={() => onDelete('fineAmount.slotmachine.max')}>
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
                                                            ? ConvertString(dbServer.payment.trade.min)
                                                            : 'No Configurado'
                                                    }
                                                />
                                                {dbServer?.payment?.trade?.min != null ? (
                                                    <Button
                                                        variant="outline-danger"
                                                        name="deleteCooldownMensajes"
                                                        onClick={() => onDelete('payment.trade.min')}>
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
                                                            ? ConvertString(dbServer.payment.trade.max)
                                                            : 'No Configurado'
                                                    }
                                                />
                                                {dbServer?.payment?.trade?.max != null ? (
                                                    <Button
                                                        variant="outline-danger"
                                                        name="deleteCooldownMensajes"
                                                        onClick={() => onDelete('payment.trade.max')}>
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
                                                            ? ConvertString(dbServer.fineAmount.trade.min)
                                                            : 'No Configurado'
                                                    }
                                                />
                                                {dbServer?.fineAmount?.trade?.min != null ? (
                                                    <Button
                                                        variant="outline-danger"
                                                        name="deleteCooldownMensajes"
                                                        onClick={() => onDelete('fineAmount.trade.min')}>
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
                                                            ? ConvertString(dbServer.fineAmount.trade.max)
                                                            : 'No Configurado'
                                                    }
                                                />
                                                {dbServer?.fineAmount?.trade?.max != null ? (
                                                    <Button
                                                        variant="outline-danger"
                                                        name="deleteCooldownMensajes"
                                                        onClick={() => onDelete('fineAmount.trade.max')}>
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
                                                dbServer?.payment?.work?.min ? ConvertString(dbServer.payment.work.min) : 'No Configurado'
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
                                                dbServer?.payment?.work?.max ? ConvertString(dbServer.payment.work.max) : 'No Configurado'
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
                                                dbServer?.cooldown?.work ? ConvertorTime(dbServer.cooldown.work) : 'No Configurado'
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
        </>
    );
};
