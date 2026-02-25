import { Col, Form, InputGroup, Button } from 'react-bootstrap';
import type { UseFormRegisterReturn } from 'react-hook-form';
import React from 'react';

export interface SettingsFieldProps {
    /** Label shown on the left side of the input */
    label: string;
    /** Placeholder text when value is not set */
    placeholder: string;
    /** react-hook-form register return object */
    register: UseFormRegisterReturn;
    /** Current value from server (to determine if delete button shows) */
    currentValue?: any;
    /** Callback when delete button is clicked */
    onDelete?: () => void;
    /** Helper text shown above the input */
    helpText?: string;
    /** Input type (text, number, select) */
    type?: 'text' | 'number' | 'select';
    /** Options for select type */
    selectOptions?: { value: string; label: string }[];
    /** Error message from form validation */
    error?: string;
    /** Column size (default 12) */
    colSize?: number;
    /** Whether the field is disabled */
    disabled?: boolean;
}

/**
 * SettingsField Component
 * A reusable field component for the Dashboard settings forms.
 * Encapsulates the common pattern of InputGroup with label, control, and delete button.
 */
export const SettingsField: React.FC<SettingsFieldProps> = ({
    label,
    placeholder,
    register,
    currentValue,
    onDelete,
    helpText,
    type = 'text',
    selectOptions,
    error,
    colSize = 12,
    disabled = false,
}) => {
    return (
        <Col sm={colSize} className="pt-3">
            {helpText && <Form.Text className="text-muted d-block mb-1">{helpText}</Form.Text>}
            <InputGroup className="mb-2">
                <InputGroup.Text>{label}</InputGroup.Text>
                {type === 'select' && selectOptions ? (
                    <Form.Control {...register} as="select" disabled={disabled} defaultValue={currentValue || selectOptions[0]?.value}>
                        {selectOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </Form.Control>
                ) : (
                    <Form.Control {...register} type={type} placeholder={placeholder} disabled={disabled} />
                )}
                {currentValue != null && onDelete && (
                    <Button variant="outline-danger" onClick={onDelete}>
                        Eliminar
                    </Button>
                )}
            </InputGroup>
            {error && <span className="text-danger text-small d-block mb-2">{error}</span>}
        </Col>
    );
};

export default SettingsField;
