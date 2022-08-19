import { AttachButtonPlusIcon } from "../../icons";
import styled from "styled-components";
import { colors } from "../../utils";

const StyledAttachButton = styled.caption`
    background: 0;
    padding: 0;
    margin: 0;
    border: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    flex: 0 0 auto;

    > div {
        width: 24px;
        height: 24px;
        color: ${colors.icon};
        transition: all 0.2s ease;
    }

    :hover > div {
        color: ${colors.iconHover};
        width: 26px;
        height: 26px;
    }

    svg {
        width: 100%;
        height: 100%;
    }
`;

export const AttachButton = () => (
    <StyledAttachButton>
        <div>
            <AttachButtonPlusIcon />
        </div>
    </StyledAttachButton>
);
