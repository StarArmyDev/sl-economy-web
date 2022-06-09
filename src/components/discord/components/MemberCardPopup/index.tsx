import { MemberCardPopupWrapper } from ".";
import { User } from "../../interface";
import styled from "styled-components";
import React from "react";

const StyledMemberCardPopup = styled.div`
    position: absolute;
    top: 0;
    left: 0;
`;

export class MemberCardPopup extends React.Component {
    state = { isPopupVisible: false } as { isPopupVisible: boolean; direction: string; position: { x: number; y: number }; member: User };

    static instance: { showPopup: (arg0: { direction: string; position: { x: number; y: number }; member: User }) => void };
    static show(config: { direction: string; position: { x: number; y: number }; member: User }) {
        this.instance && this.instance.showPopup(config);
    }

    showPopup = ({ direction, position, member }: { direction: string; position: { x: number; y: number }; member: User }) => {
        this.setState({
            isPopupVisible: true,
            direction,
            position,
            member
        });
    };

    closePopup = () => {
        this.setState({ isPopupVisible: false });
    };

    render() {
        const { isPopupVisible, direction, position, member } = this.state;

        return (
            <StyledMemberCardPopup>
                {isPopupVisible && <MemberCardPopupWrapper direction={direction} position={position} member={member} onClose={this.closePopup} />}
            </StyledMemberCardPopup>
        );
    }
}

export * from "./MemberCard";
export * from "./MemberCardPopupWrapper";
export * from "./MemberRolesList";
