import { WelcomeChannelMessage, ScrollableArea, MemberMessage, MemberMessageGroup, ButtonCmp, SelectMenu, MessagesEmbed } from "../";
import { User, Message, Component } from "../../interface";
import { useLayoutEffect, useRef } from "react";
import { Col, Row } from "react-bootstrap";
import styled from "styled-components";
import { parseMarkdown } from "libs";

const StyledMessagesWrapper = styled.div`
    .containerDiscord {
        flex-direction: column;
    }

    .children {
        margin: 4px 8px 4px 0;
        flex-wrap: wrap;
        display: flex;
    }
`;

const createMessageGroup = (groupId: string, member: User, time: Date, messages: JSX.Element[]) => (
    <MemberMessageGroup key={groupId} member={member} time={time}>
        {messages}
    </MemberMessageGroup>
);
const createComponents = (components: Component[]) => {
    const rowOneComponents: JSX.Element[] = [];
    const rowTwoComponents: JSX.Element[] = [];

    for (const component of components) {
        if (component.type === "SelectMenu") rowOneComponents.push(<SelectMenu data={component} />);
        if (component.type === "Button") rowTwoComponents.push(<ButtonCmp data={component} />);
    }

    return { rowOneComponents, rowTwoComponents };
};

export const MessagesWrapper = ({ channelName, messages, isWelcomeMessage }: { channelName: string; messages: Message[]; isWelcomeMessage?: boolean }) => {
    const bottomElement = useRef(null);

    useLayoutEffect(() => {
        (bottomElement.current as any).scrollIntoView({ behavior: "instant" });
    });

    let lastUserId = "";
    const groupsComponents: JSX.Element[] = [];
    let messagesComponents: JSX.Element[] = [];
    let headingGroupMessage: Message | null = null;

    const closeMessageGroupAndClearMessages = () => {
        const userId = headingGroupMessage!.user.id || "";
        const guildMembers = messages.map((m) => m.user);
        const member = guildMembers.find((m) => m.id === userId);

        const currentGroupId = headingGroupMessage!.user.id || "";
        groupsComponents.push(createMessageGroup(currentGroupId, member!, headingGroupMessage!.time, messagesComponents));
        messagesComponents = [];
    };

    messages.forEach((message, index) => {
        const rowOneComponents: JSX.Element[] = [];
        const rowTwoComponents: JSX.Element[] = [];

        if (message.components) {
            const createCom = createComponents(message.components);
            rowOneComponents.push(...createCom.rowOneComponents);
            rowTwoComponents.push(...createCom.rowTwoComponents);
        }
        if (message.user.id !== lastUserId && messagesComponents.length > 0) {
            closeMessageGroupAndClearMessages();
        }

        if (messagesComponents.length === 0) {
            headingGroupMessage = message;
        }
        messagesComponents.push(
            <MemberMessage reply={message.reply} user={message.user} time={message.time} key={message.id}>
                <Col>
                    <Row sm={12} className="ps-3">
                        {parseMarkdown(message.content || "")}
                    </Row>
                    {message.embeds && (
                        <Row>
                            <MessagesEmbed embeds={message.embeds} />
                        </Row>
                    )}
                    <div className="containerDiscord">
                        <div className="children">{rowOneComponents}</div>
                        <div className="children">{rowTwoComponents}</div>
                    </div>
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
