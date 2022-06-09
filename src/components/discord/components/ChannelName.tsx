import { AtIcon, HashtagIcon } from "../icons";
import styled from "styled-components";

const StyledChannelName = styled.div`
    display: flex;
    align-items: center;

    svg {
        color: #8a8e94;
        margin-right: 3px;
    }

    span {
        margin-top: 3px;
        font-weight: ${(props: { isHeader?: boolean; textColor?: string }) => (props.isHeader ? 600 : 500)};
        font-size: ${(props) => (props.isHeader ? "1.1em" : "1em")};
        color: ${(props) => props.textColor || "#72767d"};
    }
`;

export const ChannelName = ({ name, textColor, isHeader, isUser }: { name: string; textColor?: string; isHeader?: boolean; isUser?: boolean }) => (
    <StyledChannelName isHeader={isHeader} textColor={textColor}>
        {isUser ? <AtIcon /> : <HashtagIcon />}
        <span>{name}</span>
    </StyledChannelName>
);
