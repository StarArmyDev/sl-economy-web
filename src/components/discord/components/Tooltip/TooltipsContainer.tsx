import styled from "styled-components";
import { Tooltip } from ".";
import React from "react";

const StyledTooltipsContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
`;

const StyledTooltipWrapper = styled.div`
    position: absolute;
    z-index: 999;

    top: ${(props: { position: { x: number; y: number } }) => props.position && props.position.y}px;
    left: ${(props) => props.position && props.position.x}px;

    &.bottom {
        transform: translateX(-50%);
    }

    &.top {
        transform: translate(-50%, -100%);
    }

    &.right {
        transform: translateY(-50%);
    }
`;

export class TooltipsContainer extends React.Component {
    state = { isVisible: false } as { isVisible: boolean; content: string; direction: string; position: { x: number; y: number } };

    static instance: { showTooltip: (arg0: { content: string; direction: string; position: { x: number; y: number } }) => any; hideTooltip: () => any };
    static show(config: { content: string; direction: string; position: { x: number; y: number } }) {
        this.instance && this.instance.showTooltip(config);
    }
    static hide() {
        this.instance && this.instance.hideTooltip();
    }

    showTooltip = ({ content, direction, position }: { content: string; direction: string; position: { x: number; y: number } }) => {
        this.setState({
            isVisible: true,
            direction,
            content,
            position
        });
    };

    hideTooltip = () => {
        this.setState({ isVisible: false });
    };

    render() {
        const { isVisible, direction, content, position } = this.state;

        return (
            <StyledTooltipsContainer>
                {isVisible && (
                    <StyledTooltipWrapper className={direction} position={position}>
                        <Tooltip direction={direction}>{content}</Tooltip>
                    </StyledTooltipWrapper>
                )}
            </StyledTooltipsContainer>
        );
    }
}
