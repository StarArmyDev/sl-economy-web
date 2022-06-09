import { WelcomeChannelMessage, ScrollableArea, MemberCardPopup, MemberMessage, MemberMessageGroup } from "../";
import { User, Message, Component } from "../../interface";
import { useLayoutEffect, useRef } from "react";
import { MessagesEmbed } from "./MessageEmbed";
import { Col, Row } from "react-bootstrap";
import { SelectMenu } from "./SelectMenu";
import styled from "styled-components";
import { parseMarkdown } from "libs";

const StyledMessagesWrapper = styled.div`
    flex: 1 1 auto;
    position: relative;
`;

const createMessageGroup = (groupId: string, member: User, time: Date, onMemberClick: Function, messages: JSX.Element[]) => (
    <MemberMessageGroup key={groupId} member={member} time={time} onMemberClick={onMemberClick}>
        {messages}
    </MemberMessageGroup>
);
const createComponents = (components: Component[]) => {
    const componentsElements: JSX.Element[] = [];

    for (const component of components) {
        if (component.type === "SelectMenu") componentsElements.push(<SelectMenu data={component} />);
    }

    return componentsElements;
};

export const MessagesWrapper = ({ channelName, messages, isWelcomeMessage }: { channelName: string; messages: Message[]; isWelcomeMessage?: boolean }) => {
    const bottomElement = useRef(null);

    useLayoutEffect(() => {
        (bottomElement.current as any).scrollIntoView({ behavior: "instant" });
    });

    const handleMemberClick = (element: any, member: User) => {
        const { target } = element;
        const targetRect = target.getBoundingClientRect();

        MemberCardPopup.show({
            direction: "left",
            position: { x: targetRect.left + targetRect.width + 10, y: targetRect.top },
            member
        });
    };

    let lastUserId = "";
    const groupsComponents: JSX.Element[] = [];
    let messagesComponents: JSX.Element[] = [];
    let headingGroupMessage: Message | null = null;

    const closeMessageGroupAndClearMessages = () => {
        const userId = headingGroupMessage!.user.id || "";
        const guildMembers = messages.map((m) => m.user);
        const member = guildMembers.find((m) => m.id === userId);

        const currentGroupId = headingGroupMessage!.user.id || "";
        groupsComponents.push(createMessageGroup(currentGroupId, member!, headingGroupMessage!.time, handleMemberClick, messagesComponents));
        messagesComponents = [];
    };

    messages.forEach((message, index) => {
        const comonentsElements: JSX.Element[] = [];

        if (message.components) comonentsElements.push(...createComponents(message.components));
        if (message.user.id !== lastUserId && messagesComponents.length > 0) {
            closeMessageGroupAndClearMessages();
        }

        if (messagesComponents.length === 0) {
            headingGroupMessage = message;
        }
        messagesComponents.push(
            <MemberMessage user={message.user} time={message.time} key={message.id} onMemberClick={handleMemberClick}>
                <Col>
                    <Row sm={12} className="ps-3">
                        {parseMarkdown(message.content || "")}
                    </Row>
                    {message.embeds && (
                        <Row>
                            <MessagesEmbed embeds={message.embeds} />
                        </Row>
                    )}
                    {message.components && comonentsElements}
                </Col>
            </MemberMessage>
        );
        lastUserId = message.user.id;

        if (index + 1 === messages.length) {
            closeMessageGroupAndClearMessages();
        }
    });

    return (
        <StyledMessagesWrapper>
            <ScrollableArea>
                {isWelcomeMessage && <WelcomeChannelMessage channelName={channelName} />}
                {groupsComponents}
                <div ref={bottomElement} />
            </ScrollableArea>
        </StyledMessagesWrapper>
    );
};
