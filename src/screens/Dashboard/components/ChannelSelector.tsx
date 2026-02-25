import Select, { GroupBase, StylesConfig } from 'react-select';
import React, { useMemo } from 'react';
import type { ChannelGuildModel } from '@app/models';

interface ChannelOption {
    value: string;
    label: string;
    isCategory?: boolean;
}

interface ChannelSelectorProps {
    channels: ChannelGuildModel[];
    selectedChannels: string[];
    onChange: (selectedIds: string[]) => void;
    placeholder?: string;
}

// Estilos oscuros para react-select
const darkStyles: StylesConfig<ChannelOption, true, GroupBase<ChannelOption>> = {
    control: base => ({
        ...base,
        backgroundColor: '#2b2f33',
        borderColor: '#444',
        '&:hover': { borderColor: '#555' },
    }),
    menu: base => ({
        ...base,
        backgroundColor: '#2b2f33',
        zIndex: 9999,
    }),
    menuPortal: base => ({
        ...base,
        zIndex: 9999,
    }),
    option: (base, state) => ({
        ...base,
        backgroundColor: state.isFocused ? '#3a3f44' : state.isSelected ? '#edbf10' : '#2b2f33',
        color: state.isSelected ? '#000' : '#fff',
        cursor: 'pointer',
        paddingLeft: state.data.isCategory ? 8 : 24,
        fontWeight: state.data.isCategory ? 'bold' : 'normal',
    }),
    multiValue: base => ({
        ...base,
        backgroundColor: '#3a3f44',
    }),
    multiValueLabel: base => ({
        ...base,
        color: '#fff',
    }),
    multiValueRemove: base => ({
        ...base,
        color: '#fff',
        ':hover': {
            backgroundColor: '#dc3545',
            color: '#fff',
        },
    }),
    input: base => ({
        ...base,
        color: '#fff',
    }),
    placeholder: base => ({
        ...base,
        color: '#888',
    }),
    singleValue: base => ({
        ...base,
        color: '#fff',
    }),
};

export const ChannelSelector: React.FC<ChannelSelectorProps> = ({
    channels,
    selectedChannels,
    onChange,
    placeholder = 'Selecciona canales...',
}) => {
    // Organizar canales por categoría (parent_id)
    const groupedOptions = useMemo(() => {
        // Separar categorías y canales
        const categories = channels.filter(ch => !ch.parent_id);
        const textChannels = channels.filter(ch => ch.parent_id);

        // Agrupar canales por categoría
        const groups: GroupBase<ChannelOption>[] = [];

        // Canales sin categoría
        const noCategory = textChannels.filter(ch => !categories.find(cat => cat.id === ch.parent_id));
        if (noCategory.length > 0) {
            groups.push({
                label: '📁 Sin Categoría',
                options: noCategory
                    .sort((a, b) => a.position - b.position)
                    .map(ch => ({
                        value: ch.id,
                        label: `# ${ch.name}`,
                    })),
            });
        }

        // Canales organizados por categoría
        categories
            .sort((a, b) => a.position - b.position)
            .forEach(category => {
                const categoryChannels = textChannels.filter(ch => ch.parent_id === category.id).sort((a, b) => a.position - b.position);

                if (categoryChannels.length > 0) {
                    groups.push({
                        label: `📁 ${category.name.toUpperCase()}`,
                        options: categoryChannels.map(ch => ({
                            value: ch.id,
                            label: `# ${ch.name}`,
                        })),
                    });
                }
            });

        return groups;
    }, [channels]);

    // Convertir IDs seleccionados a opciones
    const selectedOptions = useMemo(() => {
        return selectedChannels
            .map(id => {
                const channel = channels.find(ch => ch.id === id);
                return channel ? { value: id, label: `# ${channel.name}` } : null;
            })
            .filter(Boolean) as ChannelOption[];
    }, [selectedChannels, channels]);

    const handleChange = (newValue: readonly ChannelOption[]) => {
        onChange(newValue.map(opt => opt.value));
    };

    return (
        <Select<ChannelOption, true, GroupBase<ChannelOption>>
            isMulti
            options={groupedOptions}
            value={selectedOptions}
            onChange={handleChange}
            placeholder={placeholder}
            styles={darkStyles}
            noOptionsMessage={() => 'No hay canales disponibles'}
            closeMenuOnSelect={false}
            menuPortalTarget={document.body}
            menuPosition="fixed"
        />
    );
};
