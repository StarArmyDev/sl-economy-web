import React from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import { SettingsField } from './SettingsField';

export interface GeneralSettingsProps {
    /** react-hook-form register function */
    register: UseFormRegister<any>;
    /** Form errors object */
    errors: FieldErrors;
    /** Current server data */
    dbServer: any;
    /** Form submit handler */
    onSubmit: (e: React.FormEvent) => void;
    /** Callback to delete a setting */
    onDelete: (name: string) => void;
}

const LANGUAGE_OPTIONS = [
    { value: 'es-MX', label: 'Español (México)' },
    { value: 'es-ES', label: 'Español (España)' },
    { value: 'en-US', label: 'Inglés' },
    { value: 'pt-BR', label: 'Portugués' },
];

/**
 * GeneralSettings Component
 * Renders the general settings panel for bot configuration (language, etc.)
 */
export const GeneralSettings: React.FC<GeneralSettingsProps> = ({ register, errors, dbServer, onSubmit, onDelete }) => {
    return (
        <Row className="align-items-center text-center">
            <Col sm={12}>
                <h3>Configuraciones Generales</h3>
            </Col>
            <Col sm={12}>
                <Form className="g-3 needs-validation" onSubmit={onSubmit}>
                    <Row className="align-items-center">
                        {/* Idioma */}
                        <SettingsField
                            label="Idioma"
                            placeholder="Selecciona un idioma"
                            register={register('language.server')}
                            currentValue={dbServer?.language?.server}
                            onDelete={() => onDelete('language.server')}
                            type="select"
                            selectOptions={LANGUAGE_OPTIONS}
                            error={errors.language?.message?.toString()}
                        />

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
    );
};

export default GeneralSettings;
