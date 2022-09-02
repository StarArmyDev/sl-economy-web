import type { SelectMenuComponent } from "../../interface";
import styled from "styled-components";
import Select from "react-select";

const StyledSelectMenu = styled.div`
    .container {
        margin-top: 8px;
        width: 120%;
        display: flex;
        -webkit-box-align: center;
        align-items: center;
        padding: 0.125rem 0 0.25rem;
    }

    .select {
        width: 180%;
        max-width: 400px;
    }

    .emoji {
        object-fit: contain;
        width: 1.375em;
        height: 1.375em;
        vertical-align: bottom;
    }

    .placeholder {
        color: #a3a6aa;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;

        line-height: 18px;
    }
`;

export const SelectMenu = ({ data }: { data: SelectMenuComponent }) => {
    return (
        <StyledSelectMenu>
            <div className="container">
                <Select
                    className="select"
                    isDisabled
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
                            backgroundColor: "#202225",
                            color: "#fff",
                            border: "none"
                        }),
                        option: (base) => ({
                            ...base,
                            borderBottom: "1px dotted pink",
                            padding: 10,
                            ":active": {
                                ...base[":active"],
                                backgroundColor: "#202225"
                            },
                            ":hover": {
                                ...base[":hover"],
                                backgroundColor: "#777"
                            },
                            ":before": {
                                ...base[":before"],
                                backgroundColor: "#777"
                            }
                        }),
                        indicatorsContainer: () => ({}),
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
                    placeholder={data.placeholder}
                    options={data.options.map((option) => ({
                        value: option.value,
                        label: `${option.emoji || ""} ${option.label}`
                    }))}
                />
            </div>
        </StyledSelectMenu>
    );
};
